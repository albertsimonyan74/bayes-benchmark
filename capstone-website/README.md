# Bayes Benchmark — Capstone Website

DS 299 Capstone · Albert Simonyan · American University of Armenia · 2026.

Two apps:

| Path                      | App                          | Deploy             |
|---------------------------|------------------------------|--------------------|
| `frontend/`               | Vite 8 + React 19 SPA        | Vercel             |
| `backend/`                | FastAPI + httpx (Python 3.11)| Render (Docker)    |
| `nginx/`                  | Optional reverse proxy       | unused on Vercel/Render |

Public site: `capstone-llm-stats.vercel.app` · Backend: `bayes-benchmark.onrender.com`.

## Frontend section list (post Day 3 overhaul)

The SPA scrolls through 9 nav sections plus 1 sub-section (User Study) and ships
a separate poster-companion route.

| # | Anchor / route       | What                                                   |
|---|----------------------|--------------------------------------------------------|
| 1 | `#overview`          | Hero · Bayes 1763 quote · live Key Findings cards (`/api/v2/headline_numbers`) · CTAs |
| 2 | `#about`             | RQ1 PRIMARY (40%) full-width + RQ2-5 SUPPORTING (15% each) grid · 5 CountUp stats · Key Findings + multi-model radar |
| 3 | `#methodology`       | Continuity statement · N·M·A·C·R rubric · External Llama judge · Statistical validation · Literature comparison table |
| 4 | `#benchmark`         | "How It Works" — 6-step circular pipeline + 4 inner-ring extras |
| 5 | `#models`            | Five-model neural-network selector → expanded card |
| 6 | `#tasks`             | Filterable 171-task gallery · tier checkboxes · category filter · search |
| 7 | `#visualizations`    | 15 v2 figures organised in 6 categories (Three Rankings · Judge Validation · Robustness · Error Taxonomy · Calibration · Task Breakdown) |
| 8 | `#user-study`        | Live 5-model query · vote panel (sub-section, not in nav) |
| 9 | `#limitations`       | Five honest disclosures (HALLUCINATION empties, calibration buckets, separability, single-judge, B3 stratification) |
| 10 | `#references`       | 15 papers (3 groups) + 7 textbooks · fetched from `/api/v2/literature` |
| —  | `/poster`           | Mobile-first companion · Three Rankings figure + 4 headline cards + quick links |

## Frontend dev

```bash
cd frontend
npm install
npm run dev      # → http://localhost:3000
npm run build    # → dist/
```

`vercel.json` proxies `/api/*` to the Render backend; SPA fallback rewrites all
other routes to `/index.html` (so `/poster` works on hard refresh).

## Backend dev

```bash
cd backend
uvicorn main:app --reload --port 8000
```

v2 routes (Day 3): `/api/v2/health`, `/api/v2/headline_numbers`, `/api/v2/rankings`,
`/api/v2/error_taxonomy`, `/api/v2/robustness`, `/api/v2/agreement`,
`/api/v2/calibration`, `/api/v2/literature`. Defined in `backend/v2_routes.py`,
mounted in `backend/main.py`.

## Figure paths

- `frontend/public/visualizations/png/v2/` — current 15 v2 figures (rendered).
- `frontend/public/visualizations/png/v1/` — archived legacy figures (not rendered).
