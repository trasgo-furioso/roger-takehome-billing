# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A functional prototype of a **Home Health Billing Manager** UI for Roger Healthcare. The tool enables billing teams at Medicare-certified home health agencies to track system-generated claims, verify claim readiness, submit claims to payers, and manage payment/denial follow-up.

This is a take-home exercise deliverable — see `docs/Roger Product Takehome - Billing.md` for the full prompt.

## Domain Context

Home health billing operates on **30-day periods** within **60-day certification periods**. Each 30-day period generates one institutional claim (837I / UB-04) submitted to Medicare. Payment is determined by PDGM (Patient-Driven Groupings Model) with 432 case-mix groups derived from 5 dimensions: admission source, timing, clinical grouping, comorbidity adjustment, and functional impairment (from OASIS assessment).

Key domain research is in `docs/research/`:
- `billing-workflow.md` — Full 8-stage billing pipeline and claim lifecycle statuses
- `oasis-and-billing.md` — OASIS assessments and their link to PDGM payment
- `ub04-claim-format.md` — UB-04 form locators and 837I electronic claim structure
- `billing-ui-inspiration.md` — UI patterns from Axxess, athenahealth, OpenEMR
- `axxess-billing-flow-charts.md` — Axxess billing center flows (Medicare + Managed Care)
- `ehr-overview.md` — General EHR context and home health specifics

CMS reference manuals: `docs/clm104c10.md` (HHA Billing) and `docs/clm104c25.md` (UB-04 Data Set).

## Core Billing Entities

- **Patient** — demographics, MBI (Medicare Beneficiary Identifier), active coverage
- **Episode / Certification Period** — 60-day period with physician-signed Plan of Care (Form 485)
- **30-Day Period** — billing unit; "Early" (1st) or "Late" (2nd) within an episode
- **Claim** — UB-04/837I institutional claim for one 30-day period; Type of Bill `032X`
- **OASIS Assessment** — CMS-mandated patient assessment; must be submitted/accepted before claim
- **HIPPS Code** — 5-character code on revenue line 0023 encoding the PDGM case-mix group
- **Remittance (835/ERA)** — payment response from Medicare MAC

## Claim Lifecycle

```
Documentation Pending → Ready for Review → Claim Generated → Submitted
  → Accepted → Paid → Closed
  → Rejected → Corrected → Resubmitted
  → Denied → Appeal / Correct / Write Off
```

## Acceptance Scenario Convention

All acceptance scenarios in specs MUST use reusable, composable Given/When/Then statements:

- **Given** clauses chain to build up the full precondition state (data → UI state → additional conditions)
- **When** is a single user action
- **Then** is a single observable, testable outcome
- Use `**And**` to chain multiple Given clauses within one scenario
- Reuse the same Given/Then phrasing across scenarios — if two scenarios share a precondition or outcome, use identical wording

Example:
```
1. **Given** claims exist in various statuses and ages **And** the claim list is displayed,
   **When** the user selects a filter, **Then** the system navigates to a new page showing only matching claims.
```

This applies to all speckit commands that produce acceptance scenarios (`/speckit-specify`, `/speckit-clarify`, etc.).

## UI Design Principles

Users are non-tech-savvy billing staff who value simplicity and clarity:
1. Dashboard-first with clickable summary tiles (status + AR aging)
2. Stacked claim cards (not tables) — visual hierarchy via positioning, color, text size for non-tech-savvy users
3. Readiness checklist gates before claim submission (inline card expansion)
4. Plain language over codes; translate CARC/RARC into readable descriptions
5. Minimal text — use icons, status badges, color coding
6. Batch actions for safe operations; individual review for consequential ones

## Speckit Workflow

This project uses [GitHub Speckit](https://github.com/github/spec-kit) for structured specification-to-implementation. The workflow lives in `.specify/` and skills are in `.claude/skills/speckit-*/`.

Workflow sequence: `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`

Supporting skills: `/speckit-clarify`, `/speckit-analyze`, `/speckit-checklist`, `/speckit-converge`, `/speckit-constitution`, `/speckit-taskstoissues`

The constitution template at `.specify/memory/constitution.md` has not been filled in yet.

## Environment

- Python 3.14 venv at `.venv/` (no dependencies installed yet beyond pip)
- Playwright MCP server configured in `.mcp.json` for browser testing
- No source code exists yet — this is a greenfield project
