# Research: Home Health Billing Manager

**Feature**: 001-billing-manager | **Date**: 2026-11-17

## Technology Decisions

### 1. Build Tool & Scaffolding

**Decision**: Vite with `react-ts` template

**Rationale**: Vite is the standard for client-only React SPAs since CRA's deprecation (Feb 2025). Zero config, fastest HMR via native ESM, one-command setup. No SSR concepts to work around — ideal for a localStorage-only prototype.

**Alternatives considered**:
- **Next.js (static export)**: Adds App Router complexity, requires guarding `localStorage` against SSR prerendering. Overkill for no-backend prototype.
- **Parcel**: Genuine zero-config but smaller ecosystem and fewer templates.
- **Rsbuild**: Fast Rspack-based alternative but less community adoption than Vite.

**Setup**: `npm create vite@latest billing-manager -- --template react-ts`

---

### 2. Design System / Component Library

**Decision**: Mantine v7

**Rationale**: The UI is card-based (not table-based) with inline expansion, status badges, forms, and a timeline view. Mantine provides:
- **Card** component with composable `Card.Section` — fits stacked claim card layout
- **Badge** — color-coded status badges (Ready for Review, Submitted, Rejected, etc.)
- **Timeline** — built-in component that directly maps to claim lifecycle timeline (US9)
- **Collapse / Accordion** — inline card expansion for readiness checklist (US3) and payment fields (US6)
- **Form components** — TextInput, Select, DatePickerInput, NumberInput, Checkbox with built-in validation
- **Notification** — auto-save success toasts
- **Grid / Stack / Group** — responsive layout primitives for card lists and dashboard tiles
- **@mantine/hooks** — `useLocalStorage`, `useDebouncedValue` (search), `useDisclosure` (card expand/collapse)
- Modern, clean aesthetic — approachable for non-tech-savvy billing staff
- Excellent TypeScript support and theming via CSS modules + tokens

**Alternatives considered**:
- **Ant Design v5/v6**: Strongest built-in Table, but the UI is card-based so that advantage is irrelevant. Dense enterprise aesthetic is less approachable for billing staff. Larger bundle.
- **shadcn/ui (Radix + Tailwind)**: Maximum control but requires assembling everything — React Hook Form, custom card patterns, no built-in Timeline. Too much assembly for a time-constrained prototype.
- **MUI**: Recognizable Material Design look takes effort to customize for a healthcare context. Core Table is basic; premium features are commercially licensed.
- **Chakra UI**: Composable and accessible but least "enterprise" feel. No built-in Timeline. More assembly required for dense billing screens.

---

### 3. State Management

**Decision**: Zustand with `persist` middleware

**Rationale**: Provides the simplest model for localStorage-backed CRUD with status transitions:
- Single store with named actions (`submitClaim`, `postPayment`, `transitionStatus`)
- Built-in `persist` middleware handles localStorage serialization/deserialization automatically
- Supports selective persistence (exclude UI state like expanded cards)
- Schema versioning with `migrate` function for data shape changes during development
- ~1KB library, minimal API surface

**Store design**:
- **Claims store** (persisted): All claim data, status transitions, payment records, timeline events
- **UI store** (not persisted): Active filters, expanded card IDs, notification queue
- **Seed data**: Loaded on first visit when localStorage is empty

**Alternatives considered**:
- **Jotai + atomWithStorage**: Strong for atomic state but coordinating claim-wide status transitions across atoms requires more design work.
- **React Context + useReducer**: No dependencies but requires manual localStorage sync, error handling, and migration logic. Context re-renders all consumers on any state change.
- **TanStack Query**: Designed for server data fetching/caching. Using it as a localStorage CRUD backend fights the abstraction.

---

### 4. Routing

**Decision**: TanStack Router

**Rationale**: The dashboard-tiles-to-filtered-list pattern (US7 FR-015) requires typed search params in URLs. TanStack Router provides:
- Route-level `validateSearch` with Zod — typed, validated search params
- `<Link to="/claims" search={{ status: 'rejected' }}>` from dashboard tiles
- `Route.useSearch()` in the claims list with full type safety
- Invalid/missing params get defaults via Zod `.default()` / `.catch()`
- File-based route generation for fast route additions

**Alternatives considered**:
- **React Router v7**: Works but `useSearchParams` returns raw `URLSearchParams` — manual parsing/validation/typing needed. Would require `nuqs` as an additional dependency to match TanStack Router's native search param support.

---

### 5. Language

**Decision**: TypeScript (strict mode)

**Rationale**: Free with Vite's `react-ts` template. Claim models have many enums (statuses, revenue codes, CARC/RARC codes), structured relationships (claim → service lines → diagnoses), and state machine transitions where types catch bugs fast. TanStack Router and Zustand both benefit from TypeScript for their best DX.

---

### 6. Testing

**Decision**: Vitest + React Testing Library (lightweight) + Playwright (E2E smoke)

**Rationale**: For a take-home prototype, focus testing on correctness of business logic rather than comprehensive coverage:
- **Vitest**: Natural pairing with Vite (shared config, same transform pipeline), Jest-compatible API
- **React Testing Library**: Test user-visible behavior, not implementation details
- **Playwright**: Already configured in `.mcp.json`; use for 1-2 E2E smoke tests of critical flows

**Test focus areas**:
1. Claim status transition logic (unit tests for Zustand store)
2. Filter/search param round-tripping (integration)
3. Skip testing pure presentation components

**Alternatives considered**:
- **Jest**: Requires separate configuration from Vite. No advantage over Vitest for new projects.

---

### 7. Seed Data Strategy

**Decision**: JSON seed data loaded into Zustand on first visit

**Rationale**: The prototype needs realistic mock data to demonstrate all claim statuses, aging buckets, readiness states, and denial/rejection scenarios. A seed data module will:
- Provide 15-20 claims across all statuses (Ready for Review, Submitted, Rejected, Denied, Paid, Written Off)
- Include varied aging (0-30, 31-60, 61-90, 90+ days)
- Include claims with passing and failing readiness checks
- Include realistic ICD-10 codes, HIPPS codes, revenue codes with plain-language descriptions
- Load automatically when localStorage is empty
- Include a "Reset Data" action for demo/review purposes

---

### 8. CSS Strategy

**Decision**: Mantine's built-in CSS modules + PostCSS preset

**Rationale**: Mantine v7 uses CSS modules natively with a PostCSS preset for responsive mixins and theme variable access. No additional CSS framework needed. This avoids:
- Tailwind configuration overhead and potential conflicts with Mantine
- CSS-in-JS runtime cost (Mantine moved away from Emotion in v7)
- Global CSS specificity battles

---

## Summary: Locked-In Stack

| Category | Choice | Version |
|---|---|---|
| Build tool | Vite | latest |
| UI framework | React | 18+ |
| Component library | Mantine | v7 |
| State management | Zustand | v5 |
| Routing | TanStack Router | latest |
| Language | TypeScript | strict |
| Testing | Vitest + RTL + Playwright | latest |
| CSS | Mantine CSS modules + PostCSS | - |
| Persistence | Browser localStorage via Zustand persist | - |
