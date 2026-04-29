"""
User Study — parallel 5-model comparison
POST /api/user-study        : submit question → parallel responses from all 5 models
POST /api/user-study/vote   : record user preference
GET  /api/user-study/results: aggregate voting statistics
GET  /api/user-study/questions: categorized question summaries (text only, no images)
"""
from __future__ import annotations

import asyncio
import base64
import json
import os
import threading
import time
import uuid
from collections import defaultdict
from datetime import datetime
from pathlib import Path
from typing import Optional

import httpx
from fastapi import APIRouter, File, Form, HTTPException, Request, UploadFile
from pydantic import BaseModel

router = APIRouter()

# DATA_DIR: configurable via env var for persistent disk mounts (Render Disks, etc.)
# On Render standard plan, files are wiped on redeploy — set DATA_DIR to a persistent disk path,
# or configure Supabase for true cross-deploy persistence.
_data_dir_env = os.environ.get("DATA_DIR", "")
if _data_dir_env:
    DATA_DIR = Path(_data_dir_env)
else:
    DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)
RESULTS_PATH    = DATA_DIR / "user_study_results.json"
QUESTIONS_PATH  = DATA_DIR / "question_summaries.json"
VOTE_MEMORY_PATH = DATA_DIR / "vote_memory.json"
USERS_PATH      = DATA_DIR / "unique_users.json"

# ── Supabase config (optional — set env vars for persistent storage) ──────────
# Create a free project at supabase.com, then set:
#   SUPABASE_URL=https://xxxx.supabase.co
#   SUPABASE_KEY=your-anon-key
# SQL to create table:
#   CREATE TABLE votes (id BIGSERIAL PRIMARY KEY, data JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
#   CREATE TABLE questions (id BIGSERIAL PRIMARY KEY, data JSONB NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
SUPABASE_URL = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "")
USE_SUPABASE = bool(SUPABASE_URL and SUPABASE_KEY)


async def _supabase_insert(table: str, record: dict) -> None:
    """Insert one JSON record into a Supabase table."""
    if not USE_SUPABASE:
        return
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            await client.post(
                f"{SUPABASE_URL}/rest/v1/{table}",
                headers={
                    "apikey": SUPABASE_KEY,
                    "Authorization": f"Bearer {SUPABASE_KEY}",
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal",
                },
                json={"data": record},
            )
    except Exception:
        pass


async def _supabase_fetch_all(table: str) -> list[dict]:
    """Fetch all records from a Supabase table, ordered by id."""
    if not USE_SUPABASE:
        return []
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(
                f"{SUPABASE_URL}/rest/v1/{table}",
                headers={
                    "apikey": SUPABASE_KEY,
                    "Authorization": f"Bearer {SUPABASE_KEY}",
                },
                params={"select": "data", "order": "id.asc"},
            )
            r.raise_for_status()
            rows = r.json()
            return [row["data"] for row in rows if isinstance(row.get("data"), dict)]
    except Exception:
        return []


# ── Shared in-memory vote store (survives request lifetime, seeded from disk/Supabase) ──
_votes: list[dict] = []
_votes_loaded: bool = False
_votes_lock = threading.Lock()

_questions: list[dict] = []
_questions_loaded: bool = False
_questions_lock = threading.Lock()

# ── Unique user tracking (by IP) ─────────────────────────────────────────────
_unique_users: set[str] = set()
_users_lock = threading.Lock()

def _track_user(ip: str) -> int:
    """Record IP as a unique user. Returns total unique user count."""
    with _users_lock:
        _unique_users.add(ip)
        count = len(_unique_users)
    # Persist asynchronously (fire-and-forget, errors silently ignored)
    try:
        USERS_PATH.write_text(json.dumps(list(_unique_users)))
    except Exception:
        pass
    return count

def _load_users() -> None:
    global _unique_users
    with _users_lock:
        if USERS_PATH.exists():
            try:
                data = json.loads(USERS_PATH.read_text())
                _unique_users = set(data) if isinstance(data, list) else set()
            except Exception:
                _unique_users = set()

# Load unique users on module import
_load_users()

# ── Concurrency limiter — max 5 parallel model-query requests ─────────────────
_query_semaphore: asyncio.Semaphore | None = None

def _get_semaphore() -> asyncio.Semaphore:
    global _query_semaphore
    if _query_semaphore is None:
        _query_semaphore = asyncio.Semaphore(5)
    return _query_semaphore


def _ensure_loaded() -> None:
    global _votes, _votes_loaded
    with _votes_lock:
        if _votes_loaded:
            return
        if RESULTS_PATH.exists():
            try:
                _votes = json.loads(RESULTS_PATH.read_text())
            except Exception:
                _votes = []
        _votes_loaded = True


def _ensure_questions_loaded() -> None:
    global _questions, _questions_loaded
    with _questions_lock:
        if _questions_loaded:
            return
        if QUESTIONS_PATH.exists():
            try:
                _questions = json.loads(QUESTIONS_PATH.read_text())
            except Exception:
                _questions = []
        _questions_loaded = True


# ── Task category classifier — keyword-based ─────────────────────────────────
_CATEGORY_KEYWORDS: dict[str, list[str]] = {
    "BETA_BINOM":    ["beta-binomial", "beta binomial", "beta(", "binomial likelihood"],
    "GAMMA_POISSON": ["gamma-poisson", "gamma poisson", "poisson likelihood", "gamma prior"],
    "BINOM_FLAT":    ["flat prior", "uniform prior", "beta(1,1)", "laplace smoothing"],
    "DIRICHLET":     ["dirichlet", "multinomial", "categorical"],
    "NORMAL_GAMMA":  ["normal-gamma", "normal gamma", "conjugate normal"],
    "JEFFREYS":      ["jeffreys prior", "jeffreys", "invariant prior"],
    "FISHER_INFO":   ["fisher information", "expected information", "observed information"],
    "MARKOV":        ["markov chain", "transition matrix", "transition probability"],
    "STATIONARY":    ["stationary distribution", "limiting distribution", "ergodic"],
    "HPD":           ["hpd", "highest posterior density", "credible interval"],
    "BAYES_FACTOR":  ["bayes factor", "marginal likelihood ratio", "model comparison"],
    "BAYES_RISK":    ["bayes risk", "expected loss", "decision theory"],
    "BAYES_REG":     ["bayesian regression", "normal-inverse-gamma", "bayesian linear"],
    "MLE_MAP":       ["mle", "map estimate", "posterior mode", "maximum likelihood"],
    "CI_CREDIBLE":   ["confidence interval", "credible interval", "frequentist"],
    "BIAS_VAR":      ["bias-variance", "bias variance", "mse decomposition"],
    "RC_BOUND":      ["rao-cramer", "cramer-rao", "lower bound"],
    "MINIMAX":       ["minimax", "worst-case risk"],
    "PPC":           ["posterior predictive check", "predictive distribution", "ppc"],
    "CONCEPTUAL":    ["interpret", "explain", "what is", "why does", "compare"],
    "GIBBS":         ["gibbs sampling", "gibbs sampler"],
    "MH":            ["metropolis-hastings", "metropolis hastings", "mh algorithm"],
    "HMC":           ["hamiltonian monte carlo", "hmc", "leapfrog"],
    "RJMCMC":        ["reversible jump", "rjmcmc", "transdimensional"],
    "VB":            ["variational bayes", "variational inference", "elbo", "cavi"],
    "ABC":           ["approximate bayesian computation", "abc", "likelihood-free"],
    "HIERARCHICAL":  ["hierarchical", "multilevel", "hyperprior", "shrinkage"],
    "LOG_ML":        ["log marginal likelihood", "log evidence", "model evidence"],
    "ORDER_STAT":    ["order statistic", "k-th order"],
    "REGRESSION":    ["ordinary least squares", "ols", "linear regression"],
    "GAMBLER":       ["gambler's ruin", "ruin probability"],
}

def _classify_question(text: str) -> str:
    lower = text.lower()
    for category, keywords in _CATEGORY_KEYWORDS.items():
        for kw in keywords:
            if kw in lower:
                return category
    # fallback: check for generic Bayesian terms
    if any(w in lower for w in ["posterior", "prior", "bayes", "bayesian"]):
        return "BAYESIAN_GENERAL"
    if any(w in lower for w in ["probability", "distribution", "inference"]):
        return "PROBABILITY_GENERAL"
    return "UNCATEGORIZED"


SYSTEM_PROMPT = (
    "You are an expert in Bayesian statistics and probability theory. "
    "The user has a question about Bayesian or inferential statistics. "
    "Provide a clear, educational response that: "
    "(1) directly answers the question, "
    "(2) shows the mathematical reasoning with formulas where relevant, "
    "(3) interprets the result in plain language, "
    "(4) states key assumptions and caveats. "
    "Be thorough but accessible to a graduate statistics student."
)

IMAGE_DESCRIBE_PROMPT = (
    "Describe this image in detail for a statistics student. "
    "If it contains mathematical notation, equations, charts, graphs, tables, or statistical output, "
    "transcribe and explain each element accurately. "
    "Focus on all quantitative information visible."
)

MODEL_COLORS = {
    "claude":   "#00CED1",
    "chatgpt":  "#7FFFD4",
    "gemini":   "#FF6B6B",
    "deepseek": "#4A90D9",
    "mistral":  "#A78BFA",
}

TIMEOUT = 60.0


# ── Schemas ───────────────────────────────────────────────────────────────────
class ModelResponse(BaseModel):
    model_id: str
    model_name: str
    response: str
    latency_ms: float
    error: Optional[str] = None
    supports_vision: bool = True
    color: str = "#8BAFC0"


class StudyResponse(BaseModel):
    session_id: str
    question: str
    responses: list[ModelResponse]
    timestamp: str


class VoteRequest(BaseModel):
    session_id: str
    question: str
    voted_model: str
    reason: Optional[str] = None          # reason key (e.g. "mathematical_accuracy")
    reason_label: Optional[str] = None    # human-readable label
    had_image: bool = False
    divergence_verdict: Optional[str] = None
    divergence_data: Optional[dict] = None


# ── Rate limiter (10 req/hr per IP) ───────────────────────────────────────────
_rate_store: dict[str, list[float]] = defaultdict(list)

def _check_rate(ip: str, limit: int = 10, window: int = 3600) -> bool:
    now = time.time()
    _rate_store[ip] = [t for t in _rate_store[ip] if now - t < window]
    if len(_rate_store[ip]) >= limit:
        return False
    _rate_store[ip].append(now)
    return True


# ── Image description via Claude ──────────────────────────────────────────────
async def describe_image(image_b64: str, media_type: str) -> str:
    """Use Claude to generate a text description of an image for text-only models."""
    key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not key:
        return "[Image attached but could not be described: ANTHROPIC_API_KEY not set]"
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            r = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={"x-api-key": key, "anthropic-version": "2023-06-01",
                         "content-type": "application/json"},
                json={
                    "model": "claude-haiku-4-5-20251001",
                    "max_tokens": 512,
                    "messages": [{
                        "role": "user",
                        "content": [
                            {"type": "image", "source": {"type": "base64", "media_type": media_type, "data": image_b64}},
                            {"type": "text", "text": IMAGE_DESCRIBE_PROMPT},
                        ],
                    }],
                },
            )
            r.raise_for_status()
            return r.json()["content"][0]["text"]
    except Exception as e:
        return f"[Image attached but description failed: {str(e)[:100]}]"


# ── Async model callers — httpx REST, no SDK ──────────────────────────────────
async def call_claude(question: str, image_b64: Optional[str], media_type: str) -> ModelResponse:
    start = time.time()
    key = os.environ.get("ANTHROPIC_API_KEY", "")
    if not key:
        return ModelResponse(model_id="claude", model_name="Claude Sonnet 4.6",
                             response="", latency_ms=0, error="ANTHROPIC_API_KEY not set",
                             color=MODEL_COLORS["claude"])
    content: list = []
    if image_b64:
        content.append({
            "type": "image",
            "source": {"type": "base64", "media_type": media_type, "data": image_b64},
        })
    content.append({"type": "text", "text": question})
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            r = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={"x-api-key": key, "anthropic-version": "2023-06-01",
                         "content-type": "application/json"},
                json={"model": "claude-sonnet-4-6", "max_tokens": 2048,
                      "system": SYSTEM_PROMPT,
                      "messages": [{"role": "user", "content": content}]},
            )
            r.raise_for_status()
            text = r.json()["content"][0]["text"]
        return ModelResponse(model_id="claude", model_name="Claude Sonnet 4.6", response=text,
                             latency_ms=round((time.time() - start) * 1000, 1),
                             color=MODEL_COLORS["claude"])
    except Exception as e:
        return ModelResponse(model_id="claude", model_name="Claude Sonnet 4.6",
                             response="", latency_ms=round((time.time() - start) * 1000, 1),
                             error=str(e)[:200], color=MODEL_COLORS["claude"])


async def call_gpt4(question: str, image_b64: Optional[str], media_type: str) -> ModelResponse:
    start = time.time()
    key = os.environ.get("OPENAI_API_KEY", "")
    if not key:
        return ModelResponse(model_id="chatgpt", model_name="GPT-4.1",
                             response="", latency_ms=0, error="OPENAI_API_KEY not set",
                             color=MODEL_COLORS["chatgpt"])
    content: list = []
    if image_b64:
        content.append({
            "type": "image_url",
            "image_url": {"url": f"data:{media_type};base64,{image_b64}"},
        })
    content.append({"type": "text", "text": question})
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            r = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
                json={"model": "gpt-4.1", "max_tokens": 2048,
                      "messages": [{"role": "system", "content": SYSTEM_PROMPT},
                                   {"role": "user", "content": content}]},
            )
            r.raise_for_status()
            text = r.json()["choices"][0]["message"]["content"]
        return ModelResponse(model_id="chatgpt", model_name="GPT-4.1", response=text,
                             latency_ms=round((time.time() - start) * 1000, 1),
                             color=MODEL_COLORS["chatgpt"])
    except Exception as e:
        return ModelResponse(model_id="chatgpt", model_name="GPT-4.1",
                             response="", latency_ms=round((time.time() - start) * 1000, 1),
                             error=str(e)[:200], color=MODEL_COLORS["chatgpt"])


async def call_gemini(question: str, image_b64: Optional[str], media_type: str) -> ModelResponse:
    start = time.time()
    key = os.environ.get("GEMINI_API_KEY", "")
    if not key:
        return ModelResponse(model_id="gemini", model_name="Gemini 2.5 Flash",
                             response="", latency_ms=0, error="GEMINI_API_KEY not set",
                             color=MODEL_COLORS["gemini"])
    parts: list = []
    if image_b64:
        parts.append({"inline_data": {"mime_type": media_type, "data": image_b64}})
    parts.append({"text": question})
    url = (f"https://generativelanguage.googleapis.com/v1beta/"
           f"models/gemini-2.5-flash:generateContent?key={key}")
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            r = await client.post(url, json={
                "contents": [{"parts": parts}],
                "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
                "generationConfig": {"maxOutputTokens": 4096},
            })
            r.raise_for_status()
            text = r.json()["candidates"][0]["content"]["parts"][0]["text"]
        return ModelResponse(model_id="gemini", model_name="Gemini 2.5 Flash", response=text,
                             latency_ms=round((time.time() - start) * 1000, 1),
                             color=MODEL_COLORS["gemini"])
    except Exception as e:
        return ModelResponse(model_id="gemini", model_name="Gemini 2.5 Flash",
                             response="", latency_ms=round((time.time() - start) * 1000, 1),
                             error=str(e)[:200], color=MODEL_COLORS["gemini"])


async def call_deepseek(question: str, image_b64: Optional[str], media_type: str) -> ModelResponse:
    start = time.time()
    key = os.environ.get("DEEPSEEK_API_KEY", "")
    if not key:
        return ModelResponse(model_id="deepseek", model_name="DeepSeek V4 Flash",
                             response="", latency_ms=0, error="DEEPSEEK_API_KEY not set",
                             supports_vision=True, color=MODEL_COLORS["deepseek"])

    # For image inputs: get AI description first, prepend as context
    text_question = question
    if image_b64:
        img_desc = await describe_image(image_b64, media_type)
        text_question = f"[Image context: {img_desc}]\n\n{question}"

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            r = await client.post(
                "https://api.deepseek.com/chat/completions",
                headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
                json={"model": "deepseek-chat", "max_tokens": 2048,
                      "messages": [{"role": "system", "content": SYSTEM_PROMPT},
                                   {"role": "user", "content": text_question}]},
            )
            r.raise_for_status()
            text = r.json()["choices"][0]["message"]["content"]
        return ModelResponse(model_id="deepseek", model_name="DeepSeek V4 Flash", response=text,
                             latency_ms=round((time.time() - start) * 1000, 1),
                             supports_vision=True, color=MODEL_COLORS["deepseek"])
    except Exception as e:
        return ModelResponse(model_id="deepseek", model_name="DeepSeek V4 Flash",
                             response="", latency_ms=round((time.time() - start) * 1000, 1),
                             error=str(e)[:200], supports_vision=True, color=MODEL_COLORS["deepseek"])


async def call_mistral(question: str, image_b64: Optional[str], media_type: str) -> ModelResponse:
    start = time.time()
    key = os.environ.get("MISTRAL_API_KEY", "")
    if not key:
        return ModelResponse(model_id="mistral", model_name="Mistral Large",
                             response="", latency_ms=0, error="MISTRAL_API_KEY not set",
                             supports_vision=True, color=MODEL_COLORS["mistral"])

    # For image inputs: get AI description first, prepend as context
    text_question = question
    if image_b64:
        img_desc = await describe_image(image_b64, media_type)
        text_question = f"[Image context: {img_desc}]\n\n{question}"

    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            r = await client.post(
                "https://api.mistral.ai/v1/chat/completions",
                headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
                json={"model": "mistral-large-latest", "max_tokens": 2048,
                      "messages": [{"role": "system", "content": SYSTEM_PROMPT},
                                   {"role": "user", "content": text_question}]},
            )
            r.raise_for_status()
            text = r.json()["choices"][0]["message"]["content"]
        return ModelResponse(model_id="mistral", model_name="Mistral Large", response=text,
                             latency_ms=round((time.time() - start) * 1000, 1),
                             supports_vision=True, color=MODEL_COLORS["mistral"])
    except Exception as e:
        return ModelResponse(model_id="mistral", model_name="Mistral Large",
                             response="", latency_ms=round((time.time() - start) * 1000, 1),
                             error=str(e)[:200], supports_vision=True, color=MODEL_COLORS["mistral"])


# ── Endpoints ──────────────────────────────────────────────────────────────────
@router.post("/api/user-study", response_model=StudyResponse)
async def submit_question(
    request: Request,
    question: str = Form(...),
    image: Optional[UploadFile] = File(None),
):
    ip = request.client.host if request.client else "unknown"
    if not _check_rate(ip):
        raise HTTPException(status_code=429, detail="Rate limit: 10 requests/hour per IP")

    q = question.strip()
    if len(q) < 5:
        raise HTTPException(status_code=400, detail="Question too short (min 5 chars)")
    if len(q) > 2000:
        raise HTTPException(status_code=400, detail="Question too long (max 2000 chars)")

    image_b64: Optional[str] = None
    media_type = "image/jpeg"
    if image and image.filename:
        img_bytes = await image.read()
        if len(img_bytes) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Image too large (max 5 MB)")
        ct = image.content_type or "image/jpeg"
        if ct not in ("image/jpeg", "image/png", "image/gif", "image/webp"):
            raise HTTPException(status_code=400, detail=f"Unsupported image type: {ct}")
        media_type = ct
        image_b64 = base64.b64encode(img_bytes).decode()

    # Track unique user and enforce concurrency limit
    _track_user(ip)
    sem = _get_semaphore()
    async with sem:
        results = await asyncio.gather(
            call_claude(q, image_b64, media_type),
            call_gpt4(q, image_b64, media_type),
            call_gemini(q, image_b64, media_type),
            call_deepseek(q, image_b64, media_type),
            call_mistral(q, image_b64, media_type),
            return_exceptions=False,
        )

    return StudyResponse(
        session_id=str(uuid.uuid4())[:8],
        question=q,
        responses=list(results),
        timestamp=datetime.utcnow().isoformat(),
    )


@router.post("/api/user-study/vote")
async def submit_vote(vote: VoteRequest):
    _ensure_loaded()
    _ensure_questions_loaded()

    task_category = _classify_question(vote.question)

    record = {
        "session_id":          vote.session_id,
        "timestamp":           datetime.utcnow().isoformat(),
        "question":            vote.question[:2000],
        "voted_model":         vote.voted_model,
        "reason":              vote.reason or "",
        "reason_label":        vote.reason_label or "",
        "had_image":           vote.had_image,
        "task_category":       task_category,
        "divergence_verdict":  vote.divergence_verdict or "",
        "divergence_data":     vote.divergence_data or {},
    }

    # Save question summary (text only, no image data)
    q_record = {
        "session_id":    vote.session_id,
        "timestamp":     datetime.utcnow().isoformat(),
        "question_text": vote.question[:2000],
        "task_category": task_category,
        "had_image":     vote.had_image,
        "voted_model":   vote.voted_model,
    }

    with _votes_lock:
        _votes.append(record)
        votes_snapshot = list(_votes)

    with _questions_lock:
        _questions.append(q_record)
        questions_snapshot = list(_questions)

    # Persist to Supabase if configured (survives redeploys), else write to disk
    if USE_SUPABASE:
        await asyncio.gather(
            _supabase_insert("votes", record),
            _supabase_insert("questions", q_record),
            return_exceptions=True,
        )
    else:
        try:
            RESULTS_PATH.write_text(json.dumps(votes_snapshot, indent=2))
        except Exception:
            pass
        try:
            QUESTIONS_PATH.write_text(json.dumps(questions_snapshot, indent=2))
        except Exception:
            pass

    # Update aggregated vote_memory.json (research paper reference)
    try:
        dist: dict[str, int] = defaultdict(int)
        reason_dist: dict[str, int] = defaultdict(int)
        divergence_counts: dict[str, int] = defaultdict(int)
        for r in votes_snapshot:
            dist[r.get("voted_model", "?")] += 1
            rk = r.get("reason", "")
            if rk:
                reason_dist[rk] += 1
            dv = r.get("divergence_verdict", "")
            if dv:
                divergence_counts[dv] += 1
        memory = {
            "total_votes": len(votes_snapshot),
            "vote_distribution": dict(sorted(dist.items(), key=lambda x: -x[1])),
            "reason_distribution": dict(sorted(reason_dist.items(), key=lambda x: -x[1])),
            "divergence_verdict_distribution": dict(divergence_counts),
            "last_updated": datetime.utcnow().isoformat(),
        }
        VOTE_MEMORY_PATH.write_text(json.dumps(memory, indent=2))
    except Exception:
        pass

    return {"status": "recorded", "session_id": vote.session_id, "task_category": task_category}


@router.get("/api/user-study/results")
async def get_study_results():
    # If Supabase configured: fetch live from DB (always current, survives redeploys)
    if USE_SUPABASE:
        records = await _supabase_fetch_all("votes")
    else:
        _ensure_loaded()
        with _votes_lock:
            records = list(_votes)
    dist: dict[str, int] = defaultdict(int)
    for r in records:
        dist[r.get("voted_model", "?")] += 1
    with _users_lock:
        unique_users = len(_unique_users)
    return {
        "total_votes": len(records),
        "unique_users": unique_users,
        "vote_distribution": dict(sorted(dist.items(), key=lambda x: -x[1])),
    }


@router.get("/api/user-study/questions")
async def get_question_summaries():
    """Returns categorized question summaries for research use. No image data included."""
    _ensure_questions_loaded()
    with _questions_lock:
        records = list(_questions)

    # Group by task_category
    by_category: dict[str, list] = defaultdict(list)
    for r in records:
        cat = r.get("task_category", "UNCATEGORIZED")
        by_category[cat].append({
            "session_id":  r.get("session_id"),
            "timestamp":   r.get("timestamp"),
            "question":    r.get("question_text", ""),
            "had_image":   r.get("had_image", False),
            "voted_model": r.get("voted_model", ""),
        })

    return {
        "total_questions": len(records),
        "by_category": dict(sorted(by_category.items())),
    }
