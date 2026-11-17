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
├── models/                    # TypeScript types and enums
│   ├── claim.ts               # Claim, ClaimStatus, ServiceLine, Diagnosis, ReadinessCheck
│   ├── patient.ts             # Patient, Address
│   ├── episode.ts             # Episode, BillingPeriod
│   ├── remittance.ts          # Remittance, RejectionReason, DenialReason
│   ├── timeline.ts            # TimelineEvent, TimelineEventType
│   └── index.ts
├── data/                      # Seed data and reference lookups
│   ├── seed.ts                # Mock patients, episodes, billing periods, claims
│   ├── revenue-codes.ts       # HHA revenue code → description map
│   ├── icd10-codes.ts         # ICD-10 subset → description map
│   ├── carc-rarc-codes.ts     # CARC/RARC subset → description map
│   └── index.ts
├── stores/                    # Zustand stores
│   ├── claims-store.ts        # Persistent claims + entities state, CRUD actions
│   ├── ui-store.ts            # Ephemeral UI state (expanded cards, notifications)
│   └── index.ts
├── utils/                     # Pure functions
│   ├── state-machine.ts       # Status transitions, guards, action resolution
│   ├── readiness.ts           # Compute ReadinessCheck from entity data
│   ├── formatters.ts          # Currency, date, daysInStatus, arAgingBucket
│   ├── status-colors.ts       # ClaimStatus → Mantine color mapping
│   └── index.ts
├── theme/                     # Mantine theme configuration
│   └── index.ts
├── routes/                    # TanStack Router file-based routes
│   ├── __root.tsx             # Root layout (AppLayout wrapper)
│   ├── index.tsx              # / → DashboardPage
│   ├── claims/
│   │   ├── index.tsx          # /claims → ClaimListPage
│   │   └── $claimId.tsx       # /claims/$claimId → ClaimDetailPage
│   └── routeTree.gen.ts       # Auto-generated
├── components/
│   ├── layout/                # App shell
│   │   ├── AppLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── ContentHeader.tsx
│   ├── claims/                # Claim list page components
│   │   ├── ClaimCard.tsx
│   │   ├── ClaimList.tsx
│   │   ├── ReadinessChecklist.tsx
│   │   ├── PaymentForm.tsx
│   │   ├── FilterPanel.tsx
│   │   └── FilterChips.tsx
│   ├── detail/                # Claim detail page components
│   │   ├── ClaimDetailPage.tsx
│   │   ├── PatientSection.tsx
│   │   ├── DiagnosesSection.tsx
│   │   ├── ServiceLinesSection.tsx
│   │   ├── PayerSection.tsx
│   │   ├── TimelineSection.tsx
│   │   └── useAutoSave.ts
│   └── dashboard/             # Dashboard page components
│       ├── DashboardPage.tsx
│       └── SummaryTile.tsx
└── main.tsx                   # App entry point

tests/
├── stores/
│   └── claims-store.test.ts   # State transitions, CRUD, persistence
├── utils/
│   ├── state-machine.test.ts  # Transition guards, action resolution
│   └── readiness.test.ts      # Readiness computation
└── integration/
    └── claim-flow.test.tsx    # Card → detail → submit round-trip
```

**Structure Decision**: Single-project SPA. Components grouped by feature domain (claims, detail, dashboard, layout) not by type. Routes use TanStack Router's file-based convention. Business logic (state machine, readiness) lives in `utils/` as pure functions tested independently of UI.

## RPG Decomposition

### Functional Decomposition — Capability Tree

#### Capability: Data Management

Seed data, localStorage persistence, reference lookups, and CRUD operations on billing entities.

##### Feature: Seed Data & Reference Lookups
- **Description**: Provide realistic mock data for all entities and static lookup tables (revenue codes, ICD-10, CARC/RARC)
- **Inputs**: None (static)
- **Outputs**: Typed seed data arrays for patients, episodes, billing periods, claims; lookup maps for codes → descriptions
- **Behavior**: Export typed constants. Seed data covers all claim statuses, aging buckets, mixed readiness states. Lookups are keyed by code string.
- **Supports**: US1, US2, US3, US5, US7, US8, US9

##### Feature: Claims Store (Zustand + persist)
- **Description**: Centralized state for all billing entities with localStorage persistence and CRUD actions
- **Inputs**: User actions (submit, pay, write off, edit field), seed data on first load
- **Outputs**: Current state, filtered claim lists, individual claim lookups
- **Behavior**: Zustand store with `persist` middleware. Actions enforce state transition rules. Each mutation appends a timeline event. `resetToSeedData()` replaces all state.
- **Supports**: US1, US2, US3, US4, US5, US6, US7, US8, US9

##### Feature: UI Store (ephemeral)
- **Description**: Track transient UI state — expanded cards, notification queue
- **Inputs**: UI interactions (expand card, dismiss notification)
- **Outputs**: Current expanded card ID/mode, active notifications
- **Behavior**: Not persisted. Only one card expanded at a time. Notifications auto-dismiss after timeout.
- **Supports**: US3, US5, US6

---

#### Capability: Claim State Machine

Status transition logic, readiness validation, and action resolution.

##### Feature: Status Transitions
- **Description**: Enforce valid claim status transitions with precondition checks
- **Inputs**: Current claim status, target action, readiness state
- **Outputs**: New status or error
- **Behavior**: Validates transition is allowed per state machine (data-model.md). Guards: submit requires allPassing, pay requires Submitted status, write-off requires Denied status.
- **Supports**: US3, US4, US5, US6, US8

##### Feature: Readiness Evaluation
- **Description**: Compute the readiness checklist from claim and related entity data
- **Inputs**: Claim with its OASIS assessment, episode, service lines, diagnoses
- **Outputs**: ReadinessCheck object with 7 booleans + computed `allPassing`
- **Behavior**: Each check derives from entity data (e.g., `oasisAccepted` = assessment.status === 'Accepted'). Pure function, no side effects.
- **Supports**: US3, US4, US5, US8

##### Feature: Action Resolution
- **Description**: Determine which action button to show on the claim detail page based on status + readiness
- **Inputs**: Claim status, readiness.allPassing
- **Outputs**: Action descriptor (label, handler, variant) or null
- **Behavior**: State machine lookup table per routes.md contract. Returns at most one primary action and optionally one secondary action (Write Off for Denied + passing).
- **Supports**: US2, US3, US4, US5, US6, US8

---

#### Capability: Presentation — Layout & Navigation

App shell, sidebar, routing, content header pattern.

##### Feature: App Layout (Sidebar + Content Area)
- **Description**: Persistent sidebar with logo, nav items, and a content area that renders the active route
- **Inputs**: Current route path
- **Outputs**: Rendered shell with highlighted active nav item
- **Behavior**: Sidebar has 3 items (Dashboard, Claims, Reset). Claims stays highlighted on detail page. Reset triggers confirmation dialog then `resetToSeedData()`.
- **Supports**: US1, US7

##### Feature: Content Header
- **Description**: Reusable header row with optional back button, page title, and action button slot
- **Inputs**: Back link (optional), title string, action button config (optional)
- **Outputs**: Rendered header row
- **Behavior**: Back button shown only for child routes. Action button is page-specific (Filter toggle on claims, state-machine-driven on detail).
- **Supports**: US1, US2, US3, US4, US5, US6, US7, US8

##### Feature: Routing (TanStack Router)
- **Description**: Route tree with typed search params and file-based route generation
- **Inputs**: URL path + search params
- **Outputs**: Matched route component with validated params
- **Behavior**: 3 routes: `/` (Dashboard), `/claims` (list with ClaimSearchParams), `/claims/$claimId` (detail). Zod validation on search params with defaults.
- **Supports**: US1, US2, US7

---

#### Capability: Presentation — Claims

Claim card list, card component, inline expansions, filter UI.

##### Feature: Claim Card
- **Description**: Card component displaying one claim's summary with status badge and contextual action
- **Inputs**: Claim data, patient name, expanded state
- **Outputs**: Rendered card with visual hierarchy — patient name prominent, period dates, payer, status badge, amount, days in status
- **Behavior**: Color-coded status badge. Action button varies by status (Review, Submit, Fix, Pay, Appeal, Write Off). Click navigates to detail. Expandable for readiness checklist or payment form.
- **Supports**: US1, US3, US4, US5, US6, US8

##### Feature: Readiness Checklist (inline expansion)
- **Description**: Expandable checklist inside a claim card showing pass/fail for each readiness item
- **Inputs**: Claim's ReadinessCheck object
- **Outputs**: 7 checklist rows with pass/fail icons
- **Behavior**: Expands when "Review" clicked. If all passing, card action changes to "Submit".
- **Supports**: US3

##### Feature: Payment Form (inline expansion)
- **Description**: Expandable form inside a claim card or detail page for posting payment
- **Inputs**: Claim ID, expected amount
- **Outputs**: Form fields (payment amount, contractual adjustment, deductible, other adjustment) + "Confirm Payment" button
- **Behavior**: On confirm, calls `postPayment()` with form values. Navigates to `/claims` after success.
- **Supports**: US6

##### Feature: Filter UI
- **Description**: Collapsible filter panel with immediate-apply controls and active filter chips
- **Inputs**: Current search params from URL
- **Outputs**: Updated search params written to URL; dismissible chips when collapsed
- **Behavior**: Toggle via "Filter" button in content header. Controls: status select, payer select, date range, patient search. Changes update URL params immediately. Chips shown when collapsed with active filters; clicking chip removes that filter.
- **Supports**: US1, US7

##### Feature: Claim List
- **Description**: Scrollable stacked list of claim cards, filtered by URL search params
- **Inputs**: Claims from store, search params from route
- **Outputs**: Filtered, rendered list of ClaimCard components
- **Behavior**: Reads search params, calls `getClaimsFiltered()`, renders cards. Empty state message when no matches.
- **Supports**: US1

---

#### Capability: Presentation — Claim Detail

Detail/edit view, section rendering, auto-save, timeline.

##### Feature: Claim Detail Page
- **Description**: Full CRUD view for a single claim organized by UB-04 sections
- **Inputs**: Claim ID from route params
- **Outputs**: Editable sections: patient info, period dates, Type of Bill, diagnoses, service lines, payer, provider, timeline
- **Behavior**: Reads claim from store by ID. Sections are editable. Action button in header determined by state machine. 404 handling for invalid claim ID.
- **Supports**: US2, US5, US8, US9

##### Feature: Auto-Save
- **Description**: Save field changes automatically with contextual success notification
- **Inputs**: Field change event (claim ID, field path, new value)
- **Outputs**: Updated store + notification near the field
- **Behavior**: Debounced — saves after user stops typing (~500ms). Calls `updateClaimField()`. Shows success notification via UI store. Appends "Edited" timeline event.
- **Supports**: US2, US5

##### Feature: Timeline Section
- **Description**: Chronological audit log of claim state transitions on the detail page
- **Inputs**: Claim's timeline events array
- **Outputs**: Mantine Timeline component with event entries (newest first)
- **Behavior**: Each entry shows event type icon, timestamp, and contextual details (rejection reason, payment amount, etc.). Uses Mantine's built-in Timeline component.
- **Supports**: US9

---

#### Capability: Presentation — Dashboard

Summary tiles and navigation to filtered claim list.

##### Feature: Dashboard Tiles
- **Description**: Summary tiles showing claim counts and dollar totals by status and AR aging
- **Inputs**: All claims from store
- **Outputs**: Two tile groups: status tiles (Ready for Review, Submitted, Rejected, Denied, Paid) and aging tiles (0-30, 31-60, 61-90, 90+ days)
- **Behavior**: Computed from claims array. Each tile shows count + formatted dollar total. Clicking navigates to `/claims` with corresponding search param.
- **Supports**: US7

---

#### Capability: Theming & Utilities

Mantine theme, formatters, status color mapping.

##### Feature: Theme Configuration
- **Description**: Mantine theme with healthcare-appropriate color palette and component defaults
- **Inputs**: None (static config)
- **Outputs**: MantineProvider theme object
- **Behavior**: Custom primary color, status-to-color mapping for badges, card defaults, font sizing.
- **Supports**: US1, US2, US7

##### Feature: Utility Functions
- **Description**: Shared helpers for formatting and display logic
- **Inputs**: Raw values (dates, currency, status strings)
- **Outputs**: Formatted strings, color tokens, computed values
- **Behavior**: `formatCurrency()`, `formatDate()`, `statusColor()`, `daysInStatus()`, `arAgingBucket()`. Pure functions.
- **Supports**: US1, US2, US7, US8

---

### Journey Contracts

#### US1: Browse and Filter Claim List
- **Tier**: Playwright
- **Setup**: Seed data loaded with claims in various statuses and ages
- **Action**: Navigate to `/claims`; apply status filter "Ready for Review"; add patient name search; clear one filter; clear all filters
- **Assert**: Cards render with correct fields (patient name prominent, status badge, amount, days); filtered view shows only matching claims; filter chips visible; clearing restores full list

#### US2: View and Edit Claim Detail
- **Tier**: Playwright
- **Setup**: Seed data loaded; navigate to `/claims`
- **Action**: Click a claim card; edit attending physician NPI; view diagnoses section
- **Assert**: Detail page shows all UB-04 sections with correct data; after edit, success notification appears; ICD-10 codes show plain-language descriptions; refresh preserves edit (localStorage)

#### US3: Verify Claim Readiness
- **Tier**: Playwright
- **Setup**: Seed data includes "Ready for Review" claims with mixed readiness (some all-passing, some failing)
- **Action**: Click "Review" on a claim card
- **Assert**: Card expands with 7 checklist items showing pass/fail; all-passing card shows "Submit" action; failing card shows "Review" action

#### US4: Submit Claim to Payer
- **Tier**: Vitest (store unit test) + Playwright
- **Setup**: Claim in "Ready for Review" with all readiness passing
- **Action**: Call `submitClaim(id)` / click "Submit" on card
- **Assert**: Status changes to "Submitted"; `submissionDate` is set; "Submit" action no longer shown; timeline has "Submitted" entry

#### US5: Handle Rejected Claims
- **Tier**: Playwright
- **Setup**: Seed data includes "Rejected" claim with rejection reason
- **Action**: View rejected card; click "Fix"; edit field in detail view; click "Resubmit Claim"
- **Assert**: Card shows rejection reason (code + plain language) and "Fix" action; "Fix" navigates to detail; after correction + submit, status returns to "Submitted"

#### US6: Post Payment
- **Tier**: Playwright
- **Setup**: Seed data includes "Submitted" claim
- **Action**: Click "Pay" on card; enter payment amount and adjustments; click "Confirm Payment"
- **Assert**: Card expands with payment fields; after confirm, status changes to "Paid"; card shows billed amount, payment received, adjustments

#### US7: Billing Dashboard
- **Tier**: Playwright
- **Setup**: Seed data loaded with varied statuses and ages
- **Action**: Navigate to `/`; click a status tile; click an aging tile
- **Assert**: Tiles show correct counts and dollar amounts per status and aging bucket; clicking tile navigates to `/claims?status=X` or `/claims?aging=X` with correct filter

#### US8: Manage Denied Claims
- **Tier**: Playwright
- **Setup**: Seed data includes "Denied" claims with CARC/RARC codes
- **Action**: View denied card; click "Appeal"; click "Write Off" on another denied card
- **Assert**: Card shows denial reason (CARC/RARC + plain language), amount at risk, days since denial, "Appeal" and "Write Off" actions; Appeal navigates to detail; Write Off changes status to "Written Off"

#### US9: Claim Lifecycle Timeline
- **Tier**: Playwright
- **Setup**: Seed data includes claim with multiple timeline events (created → submitted → rejected → resubmitted)
- **Action**: Navigate to claim detail; scroll to timeline section
- **Assert**: Timeline entries in newest-first order; each entry has event type, timestamp; rejection entry includes reason; payment entry includes amount; resubmission shows as separate entry from original submission

---

### Structural Decomposition

#### Module: `src/models/`
- **Maps to capability**: Data Management (types only)
- **Responsibility**: TypeScript type definitions, enums, and type guards for all entities
- **File structure**:
  ```
  models/
  ├── claim.ts            # Claim, ClaimStatus, ServiceLine, Diagnosis, ReadinessCheck, etc.
  ├── patient.ts          # Patient, Address
  ├── episode.ts          # Episode, BillingPeriod
  ├── remittance.ts       # Remittance, RejectionReason, DenialReason
  ├── timeline.ts         # TimelineEvent, TimelineEventType
  └── index.ts            # Re-exports all types
  ```
- **Exports**: All entity types, enums, and type guards

#### Module: `src/data/`
- **Maps to capability**: Data Management — Seed Data & Reference Lookups
- **Responsibility**: Static seed data and code lookup tables
- **File structure**:
  ```
  data/
  ├── seed.ts             # Seed patients, episodes, billing periods, claims
  ├── revenue-codes.ts    # HHA revenue code → description map
  ├── icd10-codes.ts      # ICD-10 code → description map (subset)
  ├── carc-rarc-codes.ts  # CARC/RARC code → description map (subset)
  └── index.ts
  ```
- **Exports**: `seedData`, `revenueCodes`, `icd10Codes`, `carcCodes`, `rarcCodes`

#### Module: `src/stores/`
- **Maps to capability**: Data Management — Claims Store + UI Store
- **Responsibility**: Zustand stores for persistent claims data and ephemeral UI state
- **File structure**:
  ```
  stores/
  ├── claims-store.ts     # Claims + entities state, CRUD actions, persist middleware
  ├── ui-store.ts         # Expanded card, notifications
  └── index.ts
  ```
- **Exports**: `useClaimsStore`, `useUIStore`

#### Module: `src/utils/`
- **Maps to capability**: Claim State Machine + Theming & Utilities
- **Responsibility**: Pure functions for status transitions, readiness, action resolution, formatting
- **File structure**:
  ```
  utils/
  ├── state-machine.ts    # Status transitions, transition guards, action resolution
  ├── readiness.ts        # Compute ReadinessCheck from entity data
  ├── formatters.ts       # formatCurrency, formatDate, daysInStatus, arAgingBucket
  ├── status-colors.ts    # ClaimStatus → Mantine color mapping
  └── index.ts
  ```
- **Exports**: `canTransition()`, `resolveAction()`, `computeReadiness()`, `formatCurrency()`, `formatDate()`, `daysInStatus()`, `arAgingBucket()`, `statusColor()`

#### Module: `src/theme/`
- **Maps to capability**: Theming & Utilities — Theme Configuration
- **Responsibility**: Mantine theme object and global style defaults
- **File structure**:
  ```
  theme/
  └── index.ts            # MantineProvider theme config
  ```
- **Exports**: `theme`

#### Module: `src/routes/`
- **Maps to capability**: Presentation — Layout & Navigation — Routing
- **Responsibility**: TanStack Router route tree with typed search params
- **File structure**:
  ```
  routes/
  ├── __root.tsx          # Root layout (AppLayout wrapper)
  ├── index.tsx           # / → DashboardPage
  ├── claims/
  │   ├── index.tsx       # /claims → ClaimListPage (with search param validation)
  │   └── $claimId.tsx    # /claims/$claimId → ClaimDetailPage
  └── routeTree.gen.ts    # Auto-generated route tree
  ```
- **Exports**: Route tree (auto-generated by TanStack Router)

#### Module: `src/components/layout/`
- **Maps to capability**: Presentation — Layout & Navigation
- **Responsibility**: App shell, sidebar, content header
- **File structure**:
  ```
  layout/
  ├── AppLayout.tsx        # Sidebar + content area shell
  ├── Sidebar.tsx          # Logo, nav items, reset action
  ├── ContentHeader.tsx    # Back button + title + action button row
  └── index.ts
  ```
- **Exports**: `AppLayout`, `Sidebar`, `ContentHeader`

#### Module: `src/components/claims/`
- **Maps to capability**: Presentation — Claims
- **Responsibility**: Claim card, claim list, readiness checklist, payment form, filter UI
- **File structure**:
  ```
  claims/
  ├── ClaimCard.tsx           # Single claim card with status badge, action, expandable
  ├── ClaimList.tsx           # Scrollable stacked card list with filtering
  ├── ReadinessChecklist.tsx  # Inline expandable checklist (7 items)
  ├── PaymentForm.tsx         # Inline expandable payment fields
  ├── FilterPanel.tsx         # Collapsible filter controls
  ├── FilterChips.tsx         # Dismissible active filter badges
  └── index.ts
  ```
- **Exports**: `ClaimCard`, `ClaimList`, `ReadinessChecklist`, `PaymentForm`, `FilterPanel`, `FilterChips`

#### Module: `src/components/detail/`
- **Maps to capability**: Presentation — Claim Detail
- **Responsibility**: Claim detail page sections, auto-save, timeline
- **File structure**:
  ```
  detail/
  ├── ClaimDetailPage.tsx     # Full detail view with editable sections
  ├── PatientSection.tsx      # Patient demographics section
  ├── DiagnosesSection.tsx    # Diagnoses with ICD-10 descriptions
  ├── ServiceLinesSection.tsx # Revenue code line items
  ├── PayerSection.tsx        # Payer and provider info
  ├── TimelineSection.tsx     # Mantine Timeline with event entries
  ├── useAutoSave.ts          # Hook: debounced save + notification
  └── index.ts
  ```
- **Exports**: `ClaimDetailPage`, section components, `useAutoSave`

#### Module: `src/components/dashboard/`
- **Maps to capability**: Presentation — Dashboard
- **Responsibility**: Dashboard tiles
- **File structure**:
  ```
  dashboard/
  ├── DashboardPage.tsx    # Tile grid layout
  ├── SummaryTile.tsx      # Single tile (count + dollar amount + link)
  └── index.ts
  ```
- **Exports**: `DashboardPage`, `SummaryTile`

#### Module: `tests/`
- **Maps to capability**: All (validation)
- **Responsibility**: Unit tests for store/utils, integration tests for components
- **File structure**:
  ```
  tests/
  ├── stores/
  │   └── claims-store.test.ts   # State transitions, CRUD, persistence
  ├── utils/
  │   ├── state-machine.test.ts  # Transition guards, action resolution
  │   └── readiness.test.ts      # Readiness computation
  └── integration/
      └── claim-flow.test.tsx    # Card → detail → submit round-trip
  ```

## Complexity Tracking

No constitution violations to justify — no complexity tracking needed.
