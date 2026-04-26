---
tags: [decision, vault, obsidian, workflow, knowledge-management]
date: 2026-04-26
---

# Obsidian Vault Is Persistent Session Memory

## Decision
Use an Obsidian knowledge vault at `llm-stats-vault/` as the primary persistent knowledge store across Claude Code sessions — supplementing (not replacing) CLAUDE.md.

## Why
- CLAUDE.md is ground-truth for code state but grows unwieldy as a session memory tool
- Claude Code sessions start cold each time — vault gives structured context without reading the entire codebase
- Obsidian's wiki links (`[[note name]]`) enable fast navigation between related concepts
- Statement-as-filename convention (e.g., `gemini-daily-quota-exhausted-on-2026-04-24.md`) makes the knowledge instantly scannable
- Separate folders for decisions/debugging/patterns/business keeps signal-to-noise high

## Division of Responsibility

| Source | Covers |
|--------|--------|
| `CLAUDE.md` | Authoritative code state: file paths, exact APIs, current weights, task counts |
| `llm-stats-vault/` | Why things are the way they are: decisions, bugs, patterns, session continuity |
| Claude memory (`~/.claude/projects/.../memory/`) | Behavioral rules for Claude: how to collaborate, what to do at session start/end |

## Session Protocol
- **Start**: read `00-home/index.md` + `00-home/current-priorities.md`
- **Module work**: read relevant `knowledge/` note before touching code
- **End** (user: "save session"): create session note, update priorities, add decision/debug notes, update index

## Vault Location
`Desktop/capstone-llm-stats/llm-stats-vault/`  
Open in Obsidian: File → Open Folder as Vault.
