# Home Health Billing Manager

A functional prototype of a billing manager UI for Medicare-certified home health agencies.

**[Live Demo](https://courageous-elf-4594bb.netlify.app/)** | **[Video Walkthrough](https://www.loom.com/share/69c0df637e494b29b3de85aa7614a7dc)** | **[Full Deliverable](docs/DELIVERY.md)**

---

## What It Does

Billing staff use this tool to manage the full Medicare claim lifecycle for home health 30-day periods:

- **Kanban board** at `/` — claims grouped by status (Ready for Review, Submitted, Rejected, Denied, Paid, Written Off) with date range and patient search filtering
- **Claim detail** — full UB-04 view with editable sections (diagnoses with ICD-10 plain-language descriptions, service lines, payer info, provider), auto-save on edit
- **Readiness checklist** — 7-item verification gate (OASIS, Plan of Care, visits, NPI, diagnoses, HIPPS, revenue codes) before submission is allowed
- **Lifecycle actions** — Submit, Post Payment (with adjustments), Fix Rejection, Appeal Denial, Write Off
- **Audit timeline** — every state transition recorded with timestamps and contextual details

All data is seeded with ~30 realistic claims using real ICD-10, revenue, and HIPPS codes. No backend required — state persists in localStorage.

## Running Locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

Other commands:

```bash
npm run build      # Type-check + production build
npm run preview    # Preview production build
npm run test       # Unit tests (Vitest)
npm run test:e2e   # E2E tests (Playwright)
npm run lint       # Lint (oxlint)
```

## Project Structure

```
src/
  components/
    kanban/          # KanbanBoard, KanbanColumn, KanbanClaimCard, DateRangePicker
    detail/          # ClaimDetailPage, sections (Patient, Diagnoses, ServiceLines, Payer, Timeline, Actions)
    claims/          # ReadinessChecklist, PaymentForm
    layout/          # AppLayout, ContentHeader
  data/              # Seed data, ICD-10 codes, revenue codes, CARC/RARC codes
  models/            # TypeScript types (Claim, Patient, Episode, Remittance, Timeline)
  stores/            # Zustand stores (claims state machine, UI state)
  utils/             # Formatters, readiness checks, status colors, state machine
  routes/            # TanStack Router — / (kanban), /claims/$claimId (detail)
```

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 + TypeScript 7 (strict) |
| UI | Mantine v9, Tabler Icons |
| State | Zustand v5 with localStorage persistence |
| Routing | TanStack Router (typed search params) |
| Build | Vite 8 |
| Testing | Vitest + React Testing Library, Playwright |
| Deploy | Netlify (static SPA) |

## Process & Design Decisions

The full write-up — including domain research, specification process, scoping rationale, and what I'd build next — is in **[docs/DELIVERY.md](docs/DELIVERY.md)**.

Key design decisions:

- **Card-based kanban over data tables** — billing staff are non-tech-savvy; visual hierarchy and color-coded columns are more scannable than spreadsheet grids
- **Readiness gating** — the checklist prevents incomplete claim submission, which is the #1 source of rejections in home health billing
- **Plain language everywhere** — CARC/RARC denial codes, ICD-10 diagnoses, and rejection reasons are always shown with human-readable descriptions
- **No drag-and-drop** — status changes affect payment and must be intentional actions, not accidental drags

## Domain Research

Six research documents in `docs/research/` cover:

- Home health billing workflows (60-day episodes, 30-day billing periods, PDGM)
- UB-04 / 837I claim format and field-level requirements
- OASIS assessments and their relationship to billing
- UI patterns from Axxess, athenahealth, and OpenEMR

## Specs

Three feature specs in `specs/` document every user story, acceptance scenario, and functional requirement:

| Spec | Scope |
|------|-------|
| `001-billing-manager` | 9 user stories — claim list, detail, readiness, submission, rejection, payment, dashboard, denials, timeline |
| `002-kanban-claims-board` | 4 user stories — kanban layout, date/patient filtering, card navigation |
| `003-claim-detail-ux` | 3 user stories — scroll fix, multi-column layout, header spacing |
