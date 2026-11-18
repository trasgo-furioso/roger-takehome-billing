# Home Health Billing Manager — Deliverable

## Links

- **Live Prototype**: [https://courageous-elf-4594bb.netlify.app/](https://courageous-elf-4594bb.netlify.app/)
- **Video Walkthrough**: [https://www.loom.com/share/69c0df637e494b29b3de85aa7614a7dc](https://www.loom.com/share/69c0df637e494b29b3de85aa7614a7dc)
- **Process Walkthrough**: [https://www.loom.com/share/69c0df637e494b29b3de85aa7614a7dc](https://www.loom.com/share/69c0df637e494b29b3de85aa7614a7dc)
- **Source Code**: [https://github.com/trasgo-furioso/roger-takehome-billing](https://github.com/trasgo-furioso/roger-takehome-billing)

---

## What I Built

A fully interactive billing manager for Medicare home health claims. Billing staff can see all claims at a glance on a kanban board, drill into any claim to review its full UB-04 detail, and take every action in the claim lifecycle — from readiness review through submission, payment posting, rejection correction, and denial management.

### Core Flows

1. **Kanban Board** — Full-page board at `/` with claims grouped by lifecycle status (Ready for Review, Submitted, Rejected, Denied, Paid, Written Off). Column headers show counts and dollar totals. Cards ordered oldest-first to surface items needing attention.

2. **Filtering & Search** — Date range selector filters by service period; patient name search filters across all columns. Filters combine and clear independently. Reset button clears everything.

3. **Claim Detail** — Click any card to open a detailed view organized by UB-04 sections: Provider, Patient, Condition Codes, Diagnoses (ICD-10 with plain-language descriptions), Service Lines (revenue codes, HIPPS, charges), Payer, and Timeline. Desktop-optimized multi-column layout. All fields are editable with auto-save.

4. **Readiness Verification & Submission** — Claims in "Ready for Review" show a readiness checklist (OASIS accepted, Plan of Care signed, visits documented, physician NPI, diagnoses coded, HIPPS code, revenue codes valid). All items passing unlocks the Submit action. Zero incomplete claims can be submitted.

5. **Rejection Handling** — Rejected claims display the rejection reason in plain language alongside the original code. "Fix" navigates to the detail page to correct and resubmit.

6. **Payment Posting** — Submitted claims can receive payment with amount and adjustment fields (contractual, deductible). Confirm posts the payment and closes the claim.

7. **Denial Management** — Denied claims show CARC/RARC codes translated to plain language, dollar amount at risk, and days since denial. Actions: Appeal (correct and resubmit) or Write Off (remove from AR).

8. **Audit Timeline** — Every state transition is recorded as a timestamped entry on the detail page, including contextual details (rejection reasons, payment amounts, adjustment breakdowns).

### Tech Stack

- **React + TypeScript** — strict mode, Vite build
- **Mantine v7** — component library (cards, grids, badges, date pickers, notifications)
- **Zustand** — state management with localStorage persistence
- **TanStack Router** — typed routing with filter params in URLs
- **Deployed on Netlify** — static SPA

---

## How I Built It

### Phase 1: Domain Research

Before writing any specs or code, I invested in understanding the domain deeply. The prompt provided two dense CMS reference manuals (Claims Processing Manual chapters 10 and 25). I researched:

- **Home health billing structure** — 60-day certification periods, 30-day billing units, Early/Late timing, the relationship between episodes and claims
- **PDGM payment model** — the 5 dimensions (admission source, timing, clinical grouping, comorbidity, functional impairment) that determine the 432 possible case-mix groups and payment amounts
- **UB-04 / 837I claim format** — form locators, Type of Bill codes (`032X`), revenue codes, HIPPS codes on line 0023, diagnosis coding requirements
- **OASIS assessments** — their role as a prerequisite for billing (must be submitted and accepted before claim submission)
- **Existing billing UIs** — studied Axxess Billing Center, athenahealth, and OpenEMR to understand industry patterns and common workflows

This research is documented in `docs/research/` (6 research documents covering EHR context, billing workflows, OASIS, UB-04 format, UI inspiration, and Axxess flow analysis).

### Phase 2: Structured Specification (Speckit)

I used a spec-driven workflow to go from research to implementation systematically:

```
/speckit-specify  →  Feature specification with user stories, acceptance scenarios, requirements
/speckit-clarify  →  Identified underspecified areas, encoded answers back into the spec
/speckit-plan     →  Implementation plan with architecture, data model, component contracts
/speckit-tasks    →  Dependency-ordered task breakdown
/speckit-implement → Executed tasks sequentially with validation
```

Three spec iterations were produced:

| Spec | Focus | User Stories |
|------|-------|-------------|
| `001-billing-manager` | Core billing CRUD — claim list, detail/edit, readiness, submission, rejection, payment, dashboard, denials, timeline | 9 stories (P1-P3) |
| `002-kanban-claims-board` | Replaced list+sidebar+dashboard with a kanban board — single-page overview with header filtering | 4 stories (P1-P2) |
| `003-claim-detail-ux` | UX fixes — vertical scroll bug, multi-column desktop layout, header spacing | 3 stories (P1) |

Each spec includes acceptance scenarios in Given/When/Then format, functional requirements, key entities, and success criteria.

### Phase 3: Implementation

Built incrementally across 12 phases, each validated before moving on:

1. **Project scaffold** — Vite + React + TypeScript + Mantine + Zustand + TanStack Router
2. **Foundation** — Type definitions, seed data (~30 realistic claims), Zustand store with claim lifecycle state machine, utility functions
3. **Claim List (US1)** — Stacked card layout, combined filtering (status, payer, date range, patient search), filter chips
4. **Claim Detail (US2)** — Full UB-04 sections, editable fields, auto-save with notifications
5. **Readiness Verification (US3)** — Inline checklist expansion, pass/fail indicators, conditional Submit action
6. **Submission (US4)** — Status transition, timestamp recording
7. **Rejection Handling (US5)** — Plain-language reasons, Fix action, correction-and-resubmit flow
8. **Payment Posting (US6)** — Inline payment form, amount + adjustments, Confirm Payment action
9. **Dashboard (US7)** — Summary tiles with counts and dollar amounts, clickable navigation to filtered list
10. **Denial Management (US8)** — CARC/RARC translation, Appeal and Write Off actions
11. **Timeline (US9)** — Append-only audit log, chronological entries with contextual detail
12. **Kanban Redesign** — Replaced list+sidebar with full-page kanban board, header controls, column totals
13. **Detail Page UX** — Multi-column layout, scroll fix, header spacing

---

## Scoping Decisions

### Included (and why)

- **Full claim lifecycle** — The billing team's core job is moving claims from documentation through payment. Every status and transition is modeled.
- **Readiness gating** — Submitting incomplete claims is the #1 source of rejections. The checklist prevents this entirely.
- **Plain-language translations** — Billing codes (CARC, RARC, ICD-10) are meaningless to most staff. Every code is shown alongside a human-readable description.
- **Kanban board** — Gives instant visibility across all statuses without navigating between pages. The column-based layout matches how billing teams think about their work queue.
- **Realistic seed data** — ~30 claims with real ICD-10 codes, revenue codes, HIPPS codes, and plausible patient/provider data. The prototype feels like a real system, not a wireframe.

### Excluded (and why)

- **Backend / database** — Out of scope for a prototype. Zustand + localStorage simulates persistence.
- **Actual 837I generation / clearinghouse submission** — Would require real EDI infrastructure. Submission is simulated.
- **Multi-payer support** — Medicare is the dominant payer in home health. Managed care workflows add complexity without demonstrating core competency.
- **Mobile layout** — Billing teams work on desktop monitors. Mobile would dilute the desktop experience.
- **Clinical documentation** — Visit notes, OASIS completion, and Plan of Care authoring happen elsewhere in the EHR. The billing manager reads from that data.
- **Drag-and-drop on kanban** — Status changes are consequential actions (they affect payment). They should be intentional, not accidental drags.

### With More Time

- **Batch operations** — Select multiple claims for bulk submission or status updates
- **Real-time notifications** — Alert when a claim is rejected or paid
- **AR aging analytics** — Charts and trends for accounts receivable aging
- **Managed care payer workflows** — Different payers have different submission and follow-up requirements
- **Keyboard navigation** — Power-user shortcuts for high-volume billing staff
- **Print/export** — Generate claim summaries or AR reports for management review
