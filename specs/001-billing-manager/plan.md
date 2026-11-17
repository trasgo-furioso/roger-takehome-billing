# Implementation Plan: Home Health Billing Manager

**Branch**: `001-billing-manager` | **Date**: 2026-11-17 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-billing-manager/spec.md`

## Summary

Build a React SPA billing manager for home health agencies. Billing staff use it to browse claims as stacked cards, verify readiness via inline checklists, submit claims, handle rejections/denials, post payments, and view a summary dashboard. The app uses Mantine v7 for a clean card-based UI, Zustand with localStorage persistence for state, and TanStack Router for filter-in-URL navigation. No backend — all data lives in the browser.

## Technical Context

**Language/Version**: TypeScript (strict mode), React 18+

**Primary Dependencies**: Mantine v7 (UI components + hooks), Zustand v5 (state + localStorage persist), TanStack Router (typed search params routing), Vite (build tool)

**Storage**: Browser localStorage via Zustand `persist` middleware. Seed data loaded on first visit.

**Testing**: Vitest + React Testing Library (unit/integration), Playwright (E2E smoke tests)

**Target Platform**: Desktop web browser (modern Chrome/Firefox/Edge/Safari)

**Project Type**: Single-page application (client-only, no backend)

**Performance Goals**: Instant interactions (<100ms) for all filtering, card expansion, and status transitions. Seed data set of ~20 claims — no virtualization needed.

**Constraints**: localStorage size limit (~5-10MB) is not a concern for prototype-scale data. Desktop-only, English-only.

**Scale/Scope**: ~20 seed claims, 4 routes (dashboard, claim list, claim detail, 404), 9 user stories across P1-P3.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution template is unfilled — no gates defined. Proceeding without constraints.

**Post-Phase 1 re-check**: No violations (no constitution defined).

## Project Structure

### Documentation (this feature)

```text
specs/001-billing-manager/
├── plan.md              # This file
├── research.md          # Phase 0: Technology decisions
├── data-model.md        # Phase 1: Entity definitions and state machine
├── quickstart.md        # Phase 1: Validation guide
├── contracts/           # Phase 1: Route and store contracts
│   ├── routes.md        # Route definitions with search params
│   └── store.md         # Zustand store API contract
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
src/
├── components/          # Shared UI components
│   ├── claims/          # Claim card, claim list, readiness checklist
│   ├── dashboard/       # Dashboard tiles
│   ├── detail/          # Claim detail/edit sections
│   └── layout/          # App shell, navigation
├── data/                # Seed data and reference lookups (ICD-10, CARC/RARC)
├── models/              # TypeScript types and enums
├── routes/              # TanStack Router route definitions
├── stores/              # Zustand stores (claims, ui)
├── theme/               # Mantine theme configuration
└── utils/               # Helpers (date formatting, status colors, validators)

tests/
├── stores/              # Unit tests for Zustand store actions
└── integration/         # Component integration tests
```

**Structure Decision**: Single-project SPA structure. No backend directory — all logic is client-side. Route definitions live in `src/routes/` using TanStack Router's file-based convention. Components are grouped by feature domain (claims, dashboard, detail) rather than by type (buttons, forms).

## Complexity Tracking

No constitution violations to justify — no complexity tracking needed.
