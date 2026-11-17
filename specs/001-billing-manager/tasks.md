# Tasks: Home Health Billing Manager

**Input**: Design documents from `/specs/001-billing-manager/`

**Prerequisites**: plan.md, spec.md, data-model.md, contracts/, research.md, quickstart.md

**Tests**: TDD approach — each task includes test specifications. Tests are written FIRST, must FAIL, then implementation makes them pass. E2E Playwright tests serve as phase exit criteria.

**Organization**: Tasks grouped by user story. Each phase = one user story. Exit criteria = E2E tests passing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Exact file paths included in every task description

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Scaffold the Vite + React + TypeScript project with all dependencies, routing shell, and Mantine theme.

- [x] T001 Initialize Vite project with `react-ts` template, install dependencies (mantine v7, @mantine/hooks, @mantine/dates, @mantine/notifications, @mantine/modals, zustand, @tanstack/react-router, zod, dayjs, @tabler/icons-react), configure tsconfig strict mode in `./`
- [x] T002 Configure Mantine provider and theme in `src/theme/index.ts` — healthcare color palette, status-to-color mapping (Ready for Review=blue, Submitted=cyan, Rejected=orange, Denied=red, Paid=green, Written Off=gray), Card/Badge/Timeline component defaults
- [x] T003 [P] Configure Vitest in `vitest.config.ts` with React Testing Library (`@testing-library/react`, `@testing-library/jest-dom`), path aliases matching tsconfig
- [x] T004 [P] Configure Playwright in `playwright.config.ts` — base URL `http://localhost:5173`, single Chromium project, `webServer` auto-start via `npm run dev`
- [x] T005 Setup TanStack Router file-based route tree in `src/routes/` — create `__root.tsx` (wraps `MantineProvider` + `Notifications position="top-right"` + `ModalsProvider` + `AppLayout`), `index.tsx` (placeholder Dashboard), `claims/index.tsx` (placeholder Claims), `claims/$claimId.tsx` (placeholder Detail). Import `@mantine/notifications/styles.css` after core styles. Generate `routeTree.gen.ts`. Wire `main.tsx` entry point.
- [x] T006 [P] Create `AppLayout` shell in `src/components/layout/AppLayout.tsx` using Mantine `AppShell` with `navbar={{ width: 250, breakpoint: 'sm' }}`. Render `AppShell.Navbar` (sidebar) + `AppShell.Main` (content area). Create `Sidebar` in `src/components/layout/Sidebar.tsx` with Mantine `NavLink` items: Dashboard (icon: `IconLayoutDashboard`), Claims (icon: `IconFileText`), Reset (icon: `IconRefresh`). Logo placeholder + "Billing Manager" label at top using `Group` + `Text`. Active item highlighted via current route path. Claims stays active on `/claims/*`.
- [x] T007 [P] Create `ContentHeader` in `src/components/layout/ContentHeader.tsx` using Mantine `Group` with `justify="space-between"`. Props: `backTo?: { label: string, href: string }`, `title: string`, `action?: ReactNode`. Back button uses Mantine `Button` with `variant="subtle"` + `IconArrowLeft`. Title uses `Title` order 2.

**Checkpoint**: App renders with sidebar navigation, three placeholder routes, and content header pattern. `npm run dev` works.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Type system, seed data, Zustand stores, state machine logic, and reference lookups. All user stories depend on these.

**CRITICAL**: No user story work can begin until this phase is complete.

### Tests (write first, must fail)

- [x] T008 [P] Unit test: claim status transitions in `tests/utils/state-machine.test.ts`
  - **Spec**: Test every valid transition from data-model.md State Transitions section
  - `canTransition('Ready for Review', 'Submitted')` returns `true` when `allPassing=true`
  - `canTransition('Ready for Review', 'Submitted')` returns `false` when `allPassing=false`
  - `canTransition('Submitted', 'Paid')` returns `true`
  - `canTransition('Submitted', 'Rejected')` returns `true`
  - `canTransition('Submitted', 'Denied')` returns `true`
  - `canTransition('Rejected', 'Submitted')` returns `true` when `allPassing=true`
  - `canTransition('Denied', 'Submitted')` returns `true` when `allPassing=true`
  - `canTransition('Denied', 'Written Off')` returns `true` (always)
  - `canTransition('Paid', 'Submitted')` returns `false` (terminal)
  - `canTransition('Written Off', 'Submitted')` returns `false` (terminal)
  - Every other combination returns `false`

- [x] T009 [P] Unit test: action resolution in `tests/utils/state-machine.test.ts`
  - **Spec**: Test `resolveAction(status, allPassing)` returns correct action descriptor per routes.md state machine table
  - `Ready for Review` + passing → `{ label: 'Submit Claim', action: 'submit' }`
  - `Ready for Review` + not passing → `null`
  - `Submitted` → `{ label: 'Post Payment', action: 'payment' }`
  - `Rejected` + passing → `{ label: 'Resubmit Claim', action: 'submit' }`
  - `Rejected` + not passing → `null`
  - `Denied` + passing → `{ label: 'Resubmit Appeal', action: 'submit', secondary: { label: 'Write Off', action: 'writeOff' } }`
  - `Denied` + not passing → `{ label: 'Write Off', action: 'writeOff' }`
  - `Paid` → `null`
  - `Written Off` → `null`

- [x] T010 [P] Unit test: readiness computation in `tests/utils/readiness.test.ts`
  - **Spec**: Test `computeReadiness(claim, episode)` returns correct ReadinessCheck
  - Claim with OASIS status 'Accepted' → `oasisAccepted: true`
  - Claim with OASIS status 'Pending' → `oasisAccepted: false`
  - Episode with `planOfCareSigned: true` → `planOfCareSigned: true`
  - Claim with non-empty NPI → `attendingPhysicianNpi: true`
  - Claim with at least one diagnosis → `diagnosesCoded: true`
  - Claim with HIPPS code on rev 0023 line → `hippsCodeGenerated: true`
  - Claim with all revenue codes in lookup → `revenueCodesValid: true`
  - `allPassing` is `true` only when all 7 booleans are `true`

- [x] T011 [P] Unit test: claims store actions in `tests/stores/claims-store.test.ts`
  - **Spec**: Test Zustand store mutations with seed data loaded
  - `submitClaim(id)` on ready claim → status='Submitted', submissionDate set, timeline has 'Submitted' event
  - `submitClaim(id)` on claim with failing readiness → throws error
  - `submitClaim(id)` on previously rejected claim → timeline has 'Resubmitted' event (not 'Submitted')
  - `postPayment(id, remittance)` on Submitted claim → status='Paid', remittance stored, timeline has 'Paid' event with amount
  - `postPayment(id, remittance)` on non-Submitted claim → throws error
  - `writeOffClaim(id)` on Denied claim → status='Written Off', timeline has 'Written Off' event
  - `writeOffClaim(id)` on non-Denied claim → throws error
  - `updateClaimField(id, field, value)` → field updated, timeline has 'Edited' event
  - `resetToSeedData()` → state matches initial seed data exactly

- [x] T012 [P] Unit test: utility formatters in `tests/utils/formatters.test.ts`
  - **Spec**: Test `formatCurrency(3842)` → `'$3,842.00'`; `formatDate('2026-10-01')` → readable format; `daysInStatus('2026-11-01')` → computed days from today; `arAgingBucket(15)` → `'0-30'`, `arAgingBucket(45)` → `'31-60'`, `arAgingBucket(75)` → `'61-90'`, `arAgingBucket(100)` → `'90+'`

### Implementation

- [x] T013 [P] Define TypeScript types in `src/models/claim.ts` — `Claim`, `ClaimStatus`, `ServiceLine`, `Diagnosis`, `ReadinessCheck`, `OasisAssessment` per data-model.md
- [x] T014 [P] Define TypeScript types in `src/models/patient.ts` — `Patient`, `Address`
- [x] T015 [P] Define TypeScript types in `src/models/episode.ts` — `Episode`, `BillingPeriod`
- [x] T016 [P] Define TypeScript types in `src/models/remittance.ts` — `Remittance`, `RejectionReason`, `DenialReason`
- [x] T017 [P] Define TypeScript types in `src/models/timeline.ts` — `TimelineEvent`, `TimelineEventType`
- [x] T018 Create barrel export in `src/models/index.ts`
- [x] T019 [P] Create reference lookup: HHA revenue codes in `src/data/revenue-codes.ts` — `Record<string, string>` mapping code → description per data-model.md table
- [x] T020 [P] Create reference lookup: ICD-10 subset in `src/data/icd10-codes.ts` — 10-15 common home health codes (I10 Hypertension, E11.9 Type 2 Diabetes, I50.9 Heart Failure, M79.3 Panniculitis, Z96.641 Hip replacement, etc.) with plain-language descriptions
- [x] T021 [P] Create reference lookup: CARC/RARC subset in `src/data/carc-rarc-codes.ts` — 5-8 common denial/rejection codes (CO-4 Modifier, CO-16 Missing info, CO-27 Expenses after coverage, PR-1 Deductible, etc.) with plain-language translations
- [x] T022 Implement state machine in `src/utils/state-machine.ts` — `canTransition(from, to, allPassing?)`, `resolveAction(status, allPassing)` returning `ActionDescriptor | null`. Use a typed adjacency map. Make T008 and T009 tests pass.
- [x] T023 Implement readiness computation in `src/utils/readiness.ts` — `computeReadiness(claim, episode): ReadinessCheck`. Pure function deriving each boolean from entity data. Computed `allPassing` getter. Make T010 tests pass.
- [x] T024 Implement formatters in `src/utils/formatters.ts` — `formatCurrency()`, `formatDate()`, `daysInStatus()`, `arAgingBucket()`. Make T012 tests pass.
- [x] T025 [P] Implement status colors in `src/utils/status-colors.ts` — `statusColor(status: ClaimStatus): MantineColor` mapping per theme config
- [x] T026 Create seed data in `src/data/seed.ts` — 18 claims across all statuses: 3 Ready for Review (2 all-passing, 1 failing), 4 Submitted (various ages: 5d, 25d, 50d, 95d), 3 Rejected (different rejection codes), 2 Denied (different CARC/RARC codes, one >90 days), 4 Paid, 2 Written Off. Each with realistic patient, episode, billing period, diagnoses, service lines (using reference lookup codes), and timeline events. 6 patients total.
- [x] T027 Implement claims store in `src/stores/claims-store.ts` — Zustand store with `persist` middleware (key `'billing-claims'`, version 1). State: `claims`, `patients`, `episodes`, `billingPeriods`. Actions: `getClaimById`, `getPatientById`, `getClaimsFiltered`, `updateClaimField`, `submitClaim`, `postPayment`, `writeOffClaim`, `resetToSeedData`. Seed data loads when localStorage empty. Make T011 tests pass.
- [x] T028 Implement UI store in `src/stores/ui-store.ts` — Zustand store (no persist). State: `expandedCardId`, `expandedCardMode`. Actions: `expandCard`, `collapseCard`. Notifications use `@mantine/notifications` imperative API (`notifications.show()`) directly — no notification state in this store.
- [x] T029 Create barrel exports in `src/data/index.ts`, `src/utils/index.ts`, `src/stores/index.ts`

**Checkpoint**: All unit tests pass. Types, seed data, stores, state machine, and utilities are ready. `npm run test` green.

---

## Phase 3: User Story 1 — Browse and Filter Claim List (Priority: P1)

**Goal**: Billing staff can browse claims as stacked cards and filter by status, payer, date range, and patient name.

**Independent Test**: Load `/claims`, verify cards render with correct data, apply/clear filters, check URL params update.

**Exit Criteria**: E2E tests in `tests/e2e/us1-claim-list.spec.ts` pass.

### E2E Tests (write first, must fail)

- [x] T030 [US1] Playwright E2E test in `tests/e2e/us1-claim-list.spec.ts`
  - **Spec** (maps to spec.md US1 acceptance scenarios):
  - **Test 1 — Cards render**: Navigate to `/claims`. Assert: page shows multiple Mantine `Card` components. Each card contains: patient name text (prominent, `fw={700}` or `fz="lg"`), period date range, payer text, a `Badge` with status text, dollar amount, and "X days" in status text.
  - **Test 2 — Filter by status**: On `/claims`, click "Filter" button in content header. Select "Ready for Review" from status `Select`. Assert: URL contains `?status=Ready+for+Review`. Only cards with "Ready for Review" badge are visible. Filter chip shows "Ready for Review" label.
  - **Test 3 — Multiple filters**: Apply status="Submitted" AND type patient name "Garcia" in search input. Assert: URL contains both params. Only cards matching both conditions are shown.
  - **Test 4 — Patient name search**: Type "Thompson" in patient search field. Assert: only cards for patients with "Thompson" in name are shown, combined with any other active filters.
  - **Test 5 — Clear one filter**: With status and patient filters active, click dismiss (X) on the status filter chip. Assert: status param removed from URL, patient filter still active, list updates to show all statuses matching patient name.
  - **Test 6 — Clear all filters**: With multiple filters active, click "Filter" to open panel, click "Clear All". Assert: URL has no search params, full unfiltered list is restored.

### Implementation

- [x] T031 [P] [US1] Create `ClaimCard` component in `src/components/claims/ClaimCard.tsx`
  - **Design**: Mantine `Card` with `shadow="sm"` + `padding="lg"` + `radius="md"` + `withBorder`. Internal layout:
    - Top row: `Group justify="space-between"` — left: `Text fz="lg" fw={700}` for patient name; right: `Badge` with `statusColor()` variant for claim status
    - Middle row: `Group` — `Text c="dimmed" fz="sm"` for period dates (formatted) | payer name | `Text fw={500}` for formatted currency amount
    - Bottom row: `Group justify="space-between"` — left: `Text c="dimmed" fz="xs"` for "X days in [status]"; right: action button (varies by status, see US3/US4/US5/US6/US8)
  - Props: `claim: Claim`, `patient: Patient`, `onCardClick: () => void`, `actionSlot?: ReactNode`
  - Clicking the card body navigates to `/claims/$claimId` via TanStack Router `useNavigate`

- [x] T032 [P] [US1] Create `FilterPanel` in `src/components/claims/FilterPanel.tsx`
  - **Design**: Mantine `Collapse` wrapping a `Stack` of filter controls:
    - `Select` for claim status (options from `ClaimStatus` enum, clearable)
    - `Select` for payer (options from unique payers in claims, clearable)
    - `DatePickerInput` range for date from/to (from `@mantine/dates`, clearable)
    - `TextInput` with `IconSearch` left section for patient name search
    - `Button variant="subtle"` for "Clear All"
  - Each control's `onChange` immediately writes to URL search params via TanStack Router `useNavigate({ search: ... })`
  - Props: `expanded: boolean`, `searchParams: ClaimSearchParams`
  - Note: Mantine v7 `Collapse` uses `expanded` prop (not `in` or `opened`)

- [x] T033 [P] [US1] Create `FilterChips` in `src/components/claims/FilterChips.tsx`
  - **Design**: Mantine `Group` of `Badge` components with `rightSection={<IconX size={14} />}` and `onClick` to dismiss. One chip per active filter. Renders only when there are active filters AND filter panel is collapsed.
  - Props: `searchParams: ClaimSearchParams`, `onRemove: (key: string) => void`

- [x] T034 [US1] Create `ClaimList` component in `src/components/claims/ClaimList.tsx`
  - **Design**: Mantine `Stack gap="md"` rendering `ClaimCard` for each filtered claim. Uses `useClaimsStore().getClaimsFiltered(searchParams)` with search params from route. Empty state: `Center` with `Text c="dimmed"` saying "No claims match your filters".
  - Reads search params from `Route.useSearch()` (TanStack Router typed search)

- [x] T035 [US1] Wire ClaimListPage route in `src/routes/claims/index.tsx`
  - **Design**: Route component that:
    - Validates search params with Zod schema (`ClaimSearchParams` — all optional, with `.catch()` defaults)
    - Renders `ContentHeader` with title="Claims", action=`Button` "Filter" with `IconFilter` toggling filter panel
    - Renders `FilterChips` below header when collapsed + active filters
    - Renders `FilterPanel` (collapsible)
    - Renders `ClaimList` with validated search params
  - Uses `useDisclosure` from `@mantine/hooks` for filter panel toggle

- [x] T036 [US1] Make E2E tests pass — verify `tests/e2e/us1-claim-list.spec.ts` passes. Fix any issues with selectors, data, or rendering.

**Checkpoint**: User Story 1 complete. Claim list renders with cards, filters work via URL params, chips are dismissible. E2E tests green.

---

## Phase 4: User Story 2 — View and Edit Claim Detail (Priority: P1)

**Goal**: Billing staff can click a claim card to view/edit all UB-04 sections with auto-save and contextual notifications.

**Independent Test**: Click a card, verify detail page shows all sections, edit a field, see notification, refresh and confirm persistence.

**Exit Criteria**: E2E tests in `tests/e2e/us2-claim-detail.spec.ts` pass.

### E2E Tests (write first, must fail)

- [x] T037 [US2] Playwright E2E test in `tests/e2e/us2-claim-detail.spec.ts`
  - **Spec** (maps to spec.md US2 acceptance scenarios):
  - **Test 1 — Navigate to detail**: On `/claims`, click first claim card. Assert: URL matches `/claims/<id>`. Page shows `ContentHeader` with back button "Back to Claims" and patient name as title. Sections visible: Patient Info, Period, Diagnoses, Service Lines, Payer & Provider.
  - **Test 2 — Auto-save with notification**: On claim detail, clear and type a new NPI value in attending physician NPI `TextInput`. Wait 600ms (debounce). Assert: a Mantine `Notification` with "Saved" or success icon appears. Reload page. Assert: NPI field shows the new value (persisted to localStorage).
  - **Test 3 — Diagnoses with descriptions**: On claim detail, view Diagnoses section. Assert: each diagnosis row shows the ICD-10 code AND its plain-language description text from the lookup.

### Implementation

- [x] T038 [P] [US2] Create `useAutoSave` hook in `src/components/detail/useAutoSave.ts`
  - **Design**: Custom hook wrapping `useDebouncedValue` from `@mantine/hooks` (500ms delay). On debounced value change, calls `updateClaimField(claimId, field, value)` on claims store, then `notifications.show({ message: 'Saved', color: 'green', autoClose: 2000 })` from `@mantine/notifications`. Returns `{ value, onChange, isSaving }`.

- [x] T039 [P] [US2] Create `PatientSection` in `src/components/detail/PatientSection.tsx`
  - **Design**: Mantine `Card` with `Card.Section` header "Patient Information". Uses `SimpleGrid cols={2}` for field layout. Fields: `TextInput` for first name, last name, MBI; `Select` for sex; `TextInput` for DOB (read-only display); address fields. Each field wired to `useAutoSave`.

- [x] T040 [P] [US2] Create `DiagnosesSection` in `src/components/detail/DiagnosesSection.tsx`
  - **Design**: Mantine `Card` with header "Diagnoses". Renders each diagnosis as a row in a `Stack`: `Group` with `Badge` for ICD-10 code, `Text` for plain-language description (from `icd10Codes` lookup), `Badge variant="light"` for "Principal" on the first. Sequence order.

- [x] T041 [P] [US2] Create `ServiceLinesSection` in `src/components/detail/ServiceLinesSection.tsx`
  - **Design**: Mantine `Card` with header "Service Lines". Each line as a row: `Group` with `Text fw={500}` for revenue code, `Text c="dimmed"` for description (from `revenueCodes` lookup), HCPCS/HIPPS code, date range, units, `Text fw={500}` for formatted charges.

- [x] T042 [P] [US2] Create `PayerSection` in `src/components/detail/PayerSection.tsx`
  - **Design**: Mantine `Card` with header "Payer & Provider". `SimpleGrid cols={2}`: `TextInput` for payer name, payer ID (read-only), `TextInput` for attending physician name, NPI (editable, wired to `useAutoSave`), Type of Bill (read-only `TextInput`).

- [x] T043 [US2] Create `ClaimDetailPage` in `src/components/detail/ClaimDetailPage.tsx`
  - **Design**: Reads `claimId` from route params. Looks up claim via `getClaimById`. If not found: `Center` + `Text` "Claim not found" + `Anchor` back to `/claims`. If found: `Stack gap="lg"` rendering all sections in order: PatientSection, period dates (inline `Group` of read-only `TextInput`), DiagnosesSection, ServiceLinesSection, PayerSection. No Timeline section yet (US9).

- [x] T044 [US2] Wire ClaimDetailPage route in `src/routes/claims/$claimId.tsx`
  - **Design**: Route component that renders `ContentHeader` with `backTo={{ label: 'Back to Claims', href: '/claims' }}`, `title` = patient full name, `action` = state-machine-driven button (placeholder for now — will be wired in US3/US4). Renders `ClaimDetailPage` below header.

- [x] T045 [US2] Make E2E tests pass — verify `tests/e2e/us2-claim-detail.spec.ts` passes.

**Checkpoint**: User Story 2 complete. Detail page renders all UB-04 sections, auto-save works, diagnoses show descriptions. E2E tests green.

---

## Phase 5: User Story 3 — Verify Claim Readiness (Priority: P2)

**Goal**: "Ready for Review" claim cards expand inline to show a readiness checklist with pass/fail indicators. Card action reflects readiness state.

**Independent Test**: View Ready for Review claims, click Review, verify checklist items, verify action changes to Submit when all pass.

**Exit Criteria**: E2E tests in `tests/e2e/us3-readiness.spec.ts` pass.

### E2E Tests (write first, must fail)

- [x] T046 [US3] Playwright E2E test in `tests/e2e/us3-readiness.spec.ts`
  - **Spec** (maps to spec.md US3 acceptance scenarios):
  - **Test 1 — Expand readiness checklist**: On `/claims`, find a "Ready for Review" card. Click "Review" button. Assert: card expands (Mantine `Collapse` opens) to show 7 checklist items. Each item shows a label and a pass (green `IconCheck`) or fail (red `IconX`) indicator.
  - **Test 2 — All passing shows Submit**: Find a "Ready for Review" card where seed data has all readiness checks passing. Assert: card action button shows "Submit" (not "Review").
  - **Test 3 — Failing shows Review**: Find a "Ready for Review" card where seed data has at least one failing check. Assert: card action button shows "Review" (not "Submit").

### Implementation

- [x] T047 [P] [US3] Create `ReadinessChecklist` in `src/components/claims/ReadinessChecklist.tsx`
  - **Design**: Mantine `Stack gap="xs"` rendered inside a `Collapse` (parent controls `expanded` prop). Each of the 7 readiness items as a `Group`: `ThemeIcon` (green `IconCheck` if passing, red `IconX` if failing, using `color` and `variant="light"` + `radius="xl"`) + `Text fz="sm"` with item label. Labels: "OASIS Accepted", "Plan of Care Signed", "All Visits Documented", "Physician NPI on File", "Diagnoses Coded", "HIPPS Code Generated", "Revenue Codes Valid".
  - Props: `readiness: ReadinessCheck`

- [x] T048 [US3] Update `ClaimCard` in `src/components/claims/ClaimCard.tsx` to support inline expansion
  - **Design**: Add `Collapse expanded={expandedCardId === claim.id}` below card content, controlled by UI store `expandedCardId`. For "Ready for Review" claims: action button is `Button variant="light"` with label from `resolveAction()` — "Review" (opens checklist) or "Submit" (US4). Clicking "Review" calls `expandCard(claimId, 'readiness')`. Renders `ReadinessChecklist` inside the collapse.
  - Uses `useUIStore()` for expand/collapse state. Note: Mantine v7 Collapse uses `expanded` prop (not `in`).

- [x] T049 [US3] Make E2E tests pass — verify `tests/e2e/us3-readiness.spec.ts` passes.

**Checkpoint**: User Story 3 complete. Ready for Review cards expand with checklist, action reflects readiness. E2E tests green.

---

## Phase 6: User Story 4 — Submit Claim to Payer (Priority: P2)

**Goal**: Billing staff can submit a verified claim via the Submit button on the card or detail page, changing status to Submitted.

**Independent Test**: Click Submit on a ready card, verify status change, timestamp, and action removal.

**Exit Criteria**: E2E tests in `tests/e2e/us4-submit.spec.ts` pass.

### E2E Tests (write first, must fail)

- [x] T050 [US4] Playwright E2E test in `tests/e2e/us4-submit.spec.ts`
  - **Spec** (maps to spec.md US4 acceptance scenario):
  - **Test 1 — Submit from card**: On `/claims`, find a "Ready for Review" card with "Submit" action (all passing). Click "Submit". Assert: card's `Badge` changes to "Submitted". Submission date text appears on the card. "Submit" button is no longer present. Reload page — status persists.

### Implementation

- [x] T051 [US4] Wire Submit action in `ClaimCard` in `src/components/claims/ClaimCard.tsx`
  - **Design**: When `resolveAction()` returns `action: 'submit'`, the button calls `submitClaim(claimId)` from claims store. After success, `collapseCard()` on UI store. Card re-renders with new status badge, submission date shown as `Text fz="xs" c="dimmed"` with formatted datetime.

- [x] T052 [US4] Wire Submit action in claim detail header in `src/routes/claims/$claimId.tsx`
  - **Design**: `ContentHeader` action slot now uses `resolveAction(claim.status, readiness.allPassing)`. When action is 'submit': `Button` with label from action descriptor. On click: `submitClaim(claimId)`, then `navigate({ to: '/claims' })`.

- [x] T053 [US4] Make E2E tests pass — verify `tests/e2e/us4-submit.spec.ts` passes.

**Checkpoint**: User Story 4 complete. Submit works from both card and detail page. E2E tests green.

---

## Phase 7: User Story 5 — Handle Rejected Claims (Priority: P2)

**Goal**: Rejected cards show rejection reason + "Fix" action. Fix navigates to detail for correction and resubmission.

**Independent Test**: View rejected card, see reason code + plain language, click Fix, edit, resubmit.

**Exit Criteria**: E2E tests in `tests/e2e/us5-rejected.spec.ts` pass.

### E2E Tests (write first, must fail)

- [x] T054 [US5] Playwright E2E test in `tests/e2e/us5-rejected.spec.ts`
  - **Spec** (maps to spec.md US5 acceptance scenarios):
  - **Test 1 — Rejection reason display**: On `/claims`, find a "Rejected" card. Assert: card shows rejection reason code AND plain-language description text. Card has a "Fix" `Button`.
  - **Test 2 — Fix navigates to detail**: Click "Fix" on rejected card. Assert: URL matches `/claims/<id>`. Claim detail page opens.
  - **Test 3 — Resubmit after correction**: On the rejected claim's detail page, the action button in header should reflect readiness. If all passing: button shows "Resubmit Claim". Click it. Assert: navigates to `/claims`. Find the claim card — status badge now shows "Submitted". Submission date is recorded.

### Implementation

- [x] T055 [P] [US5] Update `ClaimCard` rejection display in `src/components/claims/ClaimCard.tsx`
  - **Design**: When `claim.status === 'Rejected'`: below the standard card content, render a `Alert` with `color="orange"` and `icon={IconAlertTriangle}` showing `claim.rejectionReason.code` in `Badge` + `claim.rejectionReason.description` in `Text`. Action button: `Button variant="light" color="orange"` with "Fix" label. Clicking "Fix" navigates to `/claims/${claim.id}`.

- [x] T056 [US5] Make E2E tests pass — verify `tests/e2e/us5-rejected.spec.ts` passes. The resubmit button in detail header was already wired in T052 (action resolution handles 'Rejected' + passing → 'Resubmit Claim').

**Checkpoint**: User Story 5 complete. Rejected claims show reasons, Fix navigates to detail, resubmission works. E2E tests green.

---

## Phase 8: User Story 6 — Post Payment (Priority: P2)

**Goal**: Submitted claim cards show "Pay" action. Expanding shows payment form. Confirm Payment posts and changes status to Paid.

**Independent Test**: Click Pay on submitted card, enter amounts, confirm, verify Paid status with amounts shown.

**Exit Criteria**: E2E tests in `tests/e2e/us6-payment.spec.ts` pass.

### E2E Tests (write first, must fail)

- [x] T057 [US6] Playwright E2E test in `tests/e2e/us6-payment.spec.ts`
  - **Spec** (maps to spec.md US6 acceptance scenarios):
  - **Test 1 — Pay action visible**: On `/claims`, find a "Submitted" card. Assert: card has a "Pay" `Button`.
  - **Test 2 — Payment form expands**: Click "Pay". Assert: card expands showing `NumberInput` fields for payment amount, contractual adjustment, deductible, other adjustment. "Confirm Payment" `Button` visible.
  - **Test 3 — Confirm payment**: Fill payment amount = 3200, contractual adjustment = 642. Click "Confirm Payment". Assert: card status badge changes to "Paid". Card shows billed amount, payment received ($3,200.00), and adjustments ($642.00). Reload — persists.

### Implementation

- [x] T058 [P] [US6] Create `PaymentForm` in `src/components/claims/PaymentForm.tsx`
  - **Design**: Mantine `Stack gap="sm"` rendered inside a `Collapse` (parent controls `expanded` prop). Fields: `NumberInput` with `prefix="$"` and `thousandSeparator` for payment amount, contractual adjustment, deductible amount, other adjustment. `Button color="green"` for "Confirm Payment" at bottom. On confirm: calls `postPayment(claimId, { paymentAmount, contractualAdjustment, deductibleAmount, otherAdjustment, checkEftReference: 'AUTO-' + Date.now(), remittanceDate: today })`, then `collapseCard()`.
  - Props: `claimId: string`, `expectedAmount: number`

- [x] T059 [US6] Update `ClaimCard` for payment in `src/components/claims/ClaimCard.tsx`
  - **Design**: When `claim.status === 'Submitted'`: action button is `Button variant="light" color="cyan"` with "Pay" label. Clicking calls `expandCard(claimId, 'payment')`. Renders `PaymentForm` inside the collapse when `expandedCardMode === 'payment'`. When `claim.status === 'Paid'`: card shows remittance summary below standard content — `Group` of `Text fz="sm"`: "Billed: $X" | "Paid: $X" | "Adj: $X".

- [x] T060 [US6] Wire "Post Payment" action in detail header in `src/routes/claims/$claimId.tsx`
  - **Design**: When `resolveAction()` returns `action: 'payment'`, header button "Post Payment" toggles an inline payment form below the header (uses `useDisclosure`). Renders `PaymentForm` with `claimId` and `expectedAmount`. On confirm, navigates to `/claims`.

- [x] T061 [US6] Make E2E tests pass — verify `tests/e2e/us6-payment.spec.ts` passes.

**Checkpoint**: User Story 6 complete. Payment posting works from card and detail. E2E tests green.

---

## Phase 9: User Story 7 — Billing Dashboard (Priority: P3)

**Goal**: Dashboard shows summary tiles for claim status and AR aging buckets, each linking to filtered claim list.

**Independent Test**: Open `/`, verify tile counts/amounts, click tile, verify navigation to filtered list.

**Exit Criteria**: E2E tests in `tests/e2e/us7-dashboard.spec.ts` pass.

### E2E Tests (write first, must fail)

- [x] T062 [US7] Playwright E2E test in `tests/e2e/us7-dashboard.spec.ts`
  - **Spec** (maps to spec.md US7 acceptance scenarios):
  - **Test 1 — Tiles render**: Navigate to `/`. Assert: status tiles present for Ready for Review, Submitted, Rejected, Denied, Paid. AR aging tiles present for 0-30, 31-60, 61-90, 90+ days. Each tile shows a count number and a dollar amount.
  - **Test 2 — Tile navigation**: Click the "Rejected" status tile. Assert: URL is `/claims?status=Rejected`. Claim list shows only rejected claims. Click back to Dashboard. Click "31-60 days" aging tile. Assert: URL is `/claims?aging=31-60`.

### Implementation

- [x] T063 [P] [US7] Create `SummaryTile` in `src/components/dashboard/SummaryTile.tsx`
  - **Design**: Mantine `Card` with `shadow="sm"` + `padding="md"` + `radius="md"` + `withBorder` + `component={Link}` (TanStack Router `Link`). Internal layout: `Stack gap="xs" align="center"` — `Text fz="xl" fw={700}` for count, `Text fz="sm" c="dimmed"` for formatted dollar total, `Badge` or `Text fw={500}` for label. Card has subtle `bg` color based on status or aging bucket. Hover effect via `style={{ cursor: 'pointer' }}`.
  - Props: `label: string`, `count: number`, `total: number`, `color: MantineColor`, `linkSearch: ClaimSearchParams`

- [x] T064 [US7] Create `DashboardPage` in `src/components/dashboard/DashboardPage.tsx`
  - **Design**: Reads all claims from `useClaimsStore()`. Computes status counts/totals and aging bucket counts/totals using `arAgingBucket()`. Renders two `SimpleGrid cols={5}` (status tiles) and `SimpleGrid cols={4}` (aging tiles) groups with `Title order={4}` headers "Claims by Status" and "Accounts Receivable Aging". Each cell is a `SummaryTile`.

- [x] T065 [US7] Wire DashboardPage route in `src/routes/index.tsx`
  - **Design**: Route renders `ContentHeader` with title="Dashboard" (no back button, no action). Renders `DashboardPage` below.

- [x] T066 [US7] Make E2E tests pass — verify `tests/e2e/us7-dashboard.spec.ts` passes.

**Checkpoint**: User Story 7 complete. Dashboard tiles show counts/amounts, clicking navigates to filtered list. E2E tests green.

---

## Phase 10: User Story 8 — Manage Denied Claims (Priority: P3)

**Goal**: Denied cards show CARC/RARC reason, amount at risk, days since denial, with Appeal and Write Off actions.

**Independent Test**: View denied card, verify denial info, click Appeal (navigates to detail), click Write Off (status changes).

**Exit Criteria**: E2E tests in `tests/e2e/us8-denied.spec.ts` pass.

### E2E Tests (write first, must fail)

- [x] T067 [US8] Playwright E2E test in `tests/e2e/us8-denied.spec.ts`
  - **Spec** (maps to spec.md US8 acceptance scenarios):
  - **Test 1 — Denial info display**: On `/claims`, find a "Denied" card. Assert: card shows CARC code + plain-language translation, dollar amount at risk, "X days since denial" text. Two action buttons visible: "Appeal" and "Write Off".
  - **Test 2 — Appeal navigates**: Click "Appeal" on denied card. Assert: URL matches `/claims/<id>`. Detail page opens.
  - **Test 3 — Write Off**: Click "Write Off" on another denied card. Assert: status badge changes to "Written Off". The amount is no longer in outstanding AR (dashboard tile for Denied decreases if checked). Reload — persists.

### Implementation

- [x] T068 [US8] Update `ClaimCard` denial display in `src/components/claims/ClaimCard.tsx`
  - **Design**: When `claim.status === 'Denied'`: below standard content, render `Alert` with `color="red"` + `icon={IconAlertOctagon}` showing: `Badge` for CARC code, `Text` for plain-language description, `Text fw={500}` for amount at risk (formatted), `Text fz="xs" c="dimmed"` for "X days since denial" (computed from `claim.denialReason.denialDate`). Action area: `Group` with two buttons — `Button variant="light"` "Appeal" (navigates to detail) and `Button variant="subtle" color="gray"` "Write Off" (calls `writeOffClaim(claimId)`). If RARC code exists, show it below CARC.

- [x] T069 [US8] Wire detail header for denied claims in `src/routes/claims/$claimId.tsx`
  - **Design**: `resolveAction()` for Denied + passing returns primary "Resubmit Appeal" and secondary "Write Off". Header shows primary as `Button`, secondary as `Button variant="subtle"` next to it. Already partially wired from T052 — extend to render secondary action.

- [x] T070 [US8] Make E2E tests pass — verify `tests/e2e/us8-denied.spec.ts` passes.

**Checkpoint**: User Story 8 complete. Denied claims show full denial info, Appeal and Write Off work. E2E tests green.

---

## Phase 11: User Story 9 — Claim Lifecycle Timeline (Priority: P3)

**Goal**: Claim detail page shows an audit log timeline of all state transitions with event details.

**Independent Test**: View a claim that has been through multiple transitions, verify timeline entries appear newest-first with correct details.

**Exit Criteria**: E2E tests in `tests/e2e/us9-timeline.spec.ts` pass.

### E2E Tests (write first, must fail)

- [x] T071 [US9] Playwright E2E test in `tests/e2e/us9-timeline.spec.ts`
  - **Spec** (maps to spec.md US9 acceptance scenarios):
  - **Test 1 — Timeline renders**: Navigate to a claim detail page. Assert: a "Timeline" section is visible using Mantine `Timeline` component. Entries are in newest-first order (first entry has latest timestamp).
  - **Test 2 — Submitted entry**: Find a claim that was submitted (seed data). View timeline. Assert: an entry with "Submitted" event type and submission date/time exists.
  - **Test 3 — Rejected entry with reason**: Find a rejected claim (seed data). View timeline. Assert: "Rejected" entry includes the rejection reason in plain language alongside the code.
  - **Test 4 — Paid entry with amount**: Find a paid claim (seed data). View timeline. Assert: "Paid" entry includes payment amount formatted as currency.
  - **Test 5 — Resubmission after rejection**: Find a claim that was rejected then resubmitted (seed data). View timeline. Assert: both "Rejected" and "Resubmitted" appear as separate entries in chronological order.

### Implementation

- [x] T072 [US9] Create `TimelineSection` in `src/components/detail/TimelineSection.tsx`
  - **Design**: Mantine `Card` with header "Claim Timeline". Renders Mantine `Timeline` with `active={events.length - 1}` (all items complete). Sort events by timestamp descending (newest first). Each `Timeline.Item`:
    - `title`: event type string (e.g., "Submitted", "Rejected", "Paid")
    - `bullet`: `ThemeIcon` with event-type-specific icon — Created=`IconPlus`, Submitted=`IconSend`, Rejected=`IconX`, Denied=`IconBan`, Resubmitted=`IconRefresh`, Paid=`IconCheck`, Written Off=`IconTrash`, Edited=`IconPencil`
    - `color`: event-type-specific color from theme
    - Body: `Text fz="xs" c="dimmed"` for formatted timestamp. If event has details: `Text fz="sm"` for details text (rejection reason, payment amount, etc.)
  - Props: `events: TimelineEvent[]`
  - Note: `Timeline.Item` must be a direct child of `Timeline` — do not wrap in HOC or fragment.

- [x] T073 [US9] Add TimelineSection to ClaimDetailPage in `src/components/detail/ClaimDetailPage.tsx`
  - **Design**: Append `TimelineSection` as the last section in the detail page `Stack`, passing `claim.timeline`.

- [x] T074 [US9] Make E2E tests pass — verify `tests/e2e/us9-timeline.spec.ts` passes.

**Checkpoint**: User Story 9 complete. Timeline shows all state transitions with details. E2E tests green.

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup, cross-story integration testing, and quickstart validation.

- [ ] T075 [P] Seed data review — ensure the 18 claims in `src/data/seed.ts` cover all E2E test scenarios: at least 1 claim with multi-step timeline (created → submitted → rejected → resubmitted), 1 paid claim with remittance, 1 denied claim >90 days, claims in each aging bucket
- [ ] T076 [P] Reset confirmation dialog — update Sidebar "Reset" item in `src/components/layout/Sidebar.tsx` to use `modals.openConfirmModal({ title: 'Reset Data', children: 'Reset all data to defaults? This cannot be undone.', labels: { confirm: 'Reset', cancel: 'Cancel' }, confirmProps: { color: 'red' }, onConfirm: () => resetToSeedData() })` from `@mantine/modals`
- [ ] T077 [P] Responsive sidebar — ensure `AppShell.Navbar` collapses gracefully on smaller desktop windows (Mantine `AppShell` breakpoint handling)
- [ ] T078 Run full Playwright suite — `npx playwright test` — all E2E tests from US1-US9 pass
- [ ] T079 Run quickstart.md validation scenarios manually — confirm all 10 scenarios pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2
- **US2 (Phase 4)**: Depends on Phase 2. Can run in parallel with US1 (different components/routes)
- **US3 (Phase 5)**: Depends on US1 (extends ClaimCard with expandable readiness)
- **US4 (Phase 6)**: Depends on US3 (Submit button appears after readiness check) and US2 (Submit on detail page)
- **US5 (Phase 7)**: Depends on US2 (Fix navigates to detail) and US4 (resubmit uses submit flow)
- **US6 (Phase 8)**: Depends on US1 (card expansion pattern from US3) and US2 (detail page payment)
- **US7 (Phase 9)**: Depends on US1 (links to filtered claim list). Can run in parallel with US3-US6.
- **US8 (Phase 10)**: Depends on US1 (card display) and US2 (Appeal navigates to detail)
- **US9 (Phase 11)**: Depends on US2 (detail page). Can start after Phase 4.
- **Polish (Phase 12)**: Depends on all user stories complete

### User Story Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundation) → ┬─ US1 (Phase 3) → US3 (Phase 5) → US4 (Phase 6) → US5 (Phase 7)
                                          ├─ US2 (Phase 4) ──────────────────────────────────→ US6 (Phase 8)
                                          ├─ US7 (Phase 9) [after US1]
                                          ├─ US8 (Phase 10) [after US1 + US2]
                                          └─ US9 (Phase 11) [after US2]
```

### Within Each User Story

1. E2E tests written FIRST — must FAIL
2. Component implementation
3. Route wiring
4. E2E tests must PASS

### Parallel Opportunities

- **Phase 1**: T003, T004, T006, T007 can all run in parallel
- **Phase 2**: All test tasks (T008-T012) in parallel. All type definitions (T013-T017) in parallel. All lookups (T019-T021) in parallel.
- **Phase 3+**: US1 and US2 can start in parallel after Phase 2. US7 and US9 can start once their dependencies are met.

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Wave 1 — All tests + types in parallel:
T008: state-machine tests    T013: claim types      T019: revenue codes lookup
T009: action resolution tests T014: patient types    T020: icd10 codes lookup
T010: readiness tests         T015: episode types    T021: carc/rarc codes lookup
T011: store tests             T016: remittance types
T012: formatter tests         T017: timeline types

# Wave 2 — Implementation (makes tests pass):
T022: state-machine.ts    T024: formatters.ts    T026: seed data
T023: readiness.ts        T025: status-colors.ts

# Wave 3 — Stores (depend on types + utils):
T027: claims-store.ts     T028: ui-store.ts
```

---

## Implementation Strategy

### MVP First (US1 + US2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: US1 — Browse and Filter Claim List
4. Complete Phase 4: US2 — View and Edit Claim Detail
5. **STOP and VALIDATE**: Both P1 stories functional, E2E green
6. Demo: browsable, filterable claim list + editable detail view

### Incremental Delivery

1. Setup + Foundation → framework ready
2. US1 + US2 → MVP: core browse + edit (P1 stories)
3. US3 + US4 → Readiness + Submit pipeline (P2 core)
4. US5 + US6 → Rejection fix + Payment posting (P2 completion)
5. US7 → Dashboard overview (P3 quick win)
6. US8 + US9 → Denial management + Timeline (P3 completion)
7. Polish → Final cleanup and full validation

---

## Notes

- [P] tasks = different files, no dependencies within the wave
- [Story] label maps task to specific user story for traceability
- Each user story is independently testable via its E2E test file
- E2E tests are the exit gate — a phase is not done until its tests pass
- Commit after each task or logical group
- TDD cycle: write test → see it fail → implement → see it pass
