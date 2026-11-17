# Tasks: Kanban Claims Board

**Input**: Design documents from `specs/002-kanban-claims-board/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/ui-components.md

**Tests**: Not explicitly requested — test tasks omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Create the new kanban component directory and prepare the codebase for the layout change.

- [x] T001 Create kanban component directory at src/components/kanban/

---

## Phase 2: Foundational (Layout Refactor)

**Purpose**: Remove sidebar, simplify layout, and update routing — MUST complete before kanban board work.

- [x] T002 Modify src/components/layout/AppLayout.tsx — remove AppShell with navbar, replace with a simple full-viewport flex container (no sidebar). Remove import of Sidebar component.
- [x] T003 Remove src/components/layout/Sidebar.tsx
- [x] T004 Remove src/components/dashboard/DashboardPage.tsx and src/components/dashboard/SummaryTile.tsx
- [x] T005 Remove src/components/claims/ClaimList.tsx, src/components/claims/FilterPanel.tsx, and src/components/claims/FilterChips.tsx
- [x] T006 Remove src/routes/claims/index.tsx (claim list route — detail route at src/routes/claims/$claimId.tsx is kept)
- [x] T007 Update src/stores/ui-store.ts — remove expandedCardId/expandedCardMode/expandCard/collapseCard state. Add patientSearch (string) and dateRange ([string | null, string | null]) filter state with setter/clear actions.
- [x] T008 Add a groupByStatus selector to src/stores/claims-store.ts that returns a Map<ClaimStatus, Claim[]> from the filtered claims, with claims sorted by statusChangedAt ascending (oldest first) within each group.

**Checkpoint**: Layout is sidebar-free, old list/dashboard/filter components removed, store ready for kanban.

---

## Phase 3: User Story 1 — View Claims as Kanban Board (Priority: P1) MVP

**Goal**: Full-page kanban board at root path with claims grouped into color-coded status columns.

**Independent Test**: Navigate to `/`, see 6 columns with correct claim cards, no sidebar, columns scroll vertically, board scrolls horizontally.

### Implementation for User Story 1

- [x] T009 [P] [US1] Create src/components/kanban/KanbanClaimCard.tsx — display-only Card component. Shows claim ID (Text span, c="dimmed", fw={400}) prepended to patient name (Text span, fw={700}). Below: period dates, payer, amount, days in status. No status badge, no action buttons. Whole card is clickable (cursor pointer) and calls useNavigate to /claims/$claimId.
- [x] T010 [P] [US1] Create src/components/kanban/KanbanColumn.tsx — receives status (ClaimStatus), claims (Claim[]), and patients (Patient[]) as props. Renders a Paper with shadow="xs", radius="md", colored top border (4px solid, color from statusColor()). Header row: Group with Text (status name, fw={600}) and Badge (variant="filled", size="sm", color from statusColor(), showing claim count). Body: ScrollArea (type="auto", flex: 1, offsetScrollbars) containing a Stack (gap="xs") of KanbanClaimCard components. Column uses flex layout to expand vertically to fill available height.
- [x] T011 [US1] Create src/components/kanban/KanbanBoard.tsx — reads claims and patients from useClaimsStore. Calls groupByStatus to get claims per column. Renders a header area (placeholder for now — title only) and a board container (div/Group with display flex, flexWrap nowrap, overflowX auto, gap md). Maps over the 6 statuses in lifecycle order (Ready for Review, Submitted, Rejected, Denied, Paid, Written Off) rendering a KanbanColumn for each. Each column has minWidth 280px. Board container uses flex: 1 to fill viewport height below header.
- [x] T012 [US1] Update src/routes/index.tsx — replace DashboardPage import and rendering with KanbanBoard. Remove ContentHeader usage (the board has its own header).
- [x] T013 [US1] Update src/routeTree.gen.ts if needed — ensure /claims/index route removal is reflected (run TanStack Router codegen if applicable, or manually update the route tree).

**Checkpoint**: Kanban board visible at `/` with 6 colored columns, cards sorted oldest-first, vertical scroll per column, horizontal scroll for the board. No sidebar.

---

## Phase 4: User Story 2 — Filter Claims by Service Period (Priority: P1)

**Goal**: Date range selector in page header filters claims by billing period overlap.

**Independent Test**: Select a date range, only overlapping claims shown; clear it, all claims restored.

### Implementation for User Story 2

- [x] T014 [US2] Add date range filter to KanbanBoard header in src/components/kanban/KanbanBoard.tsx — add a DatePickerInput (type="range", clearable, placeholder="Service period") positioned on the right side of the header Group (justify="space-between"). Bind value to dateRange from ui-store. On change, update the store's dateRange state.
- [x] T015 [US2] Update the groupByStatus selector or add filtering logic in src/components/kanban/KanbanBoard.tsx — before grouping, filter claims whose billing period (fromDate/throughDate) overlaps the selected date range. A claim overlaps if claim.fromDate <= rangeEnd AND claim.throughDate >= rangeStart. Column counts reflect filtered results.

**Checkpoint**: Date range filter works in header; columns update dynamically.

---

## Phase 5: User Story 3 — Search Claims by Patient Name (Priority: P1)

**Goal**: Text input with magnifying glass icon filters claims by patient name. Reset button clears all filters.

**Independent Test**: Type a name, only matching claims shown. Click reset, all filters cleared.

### Implementation for User Story 3

- [x] T016 [US3] Add patient search input to KanbanBoard header in src/components/kanban/KanbanBoard.tsx — add a TextInput with leftSection={<IconSearch />} and placeholder="Search patient". Bind value to patientSearch from ui-store. On change, update the store. Filter claims by matching patient firstName or lastName (case-insensitive contains).
- [x] T017 [US3] Add reset button next to search input in src/components/kanban/KanbanBoard.tsx — add an ActionIcon (variant="subtle") with IconX icon, positioned adjacent to the search input. On click, call the ui-store clearFilters action to reset both patientSearch and dateRange. Disable or hide the button when no filters are active.
- [x] T018 [US3] Ensure combined filtering works in src/components/kanban/KanbanBoard.tsx — both patient name and date range filters apply simultaneously. When either is active, claims are filtered by both criteria. Column counts update for all filter combinations.

**Checkpoint**: Patient search and date range filters work independently and in combination. Reset clears all.

---

## Phase 6: User Story 4 — Navigate to Claim Detail from Board (Priority: P2)

**Goal**: Clicking a card navigates to claim detail; returning reflects status changes.

**Independent Test**: Click card, land on detail page, change status, go back, card in correct column.

### Implementation for User Story 4

- [x] T019 [US4] Verify click-to-navigate works in src/components/kanban/KanbanClaimCard.tsx — ensure the card's onClick navigates to /claims/$claimId using useNavigate. Confirm the detail page (src/routes/claims/$claimId.tsx) still works correctly with existing actions (submit, pay, fix, appeal, write off). No changes needed to the detail page itself.
- [x] T020 [US4] Ensure board reflects status changes on return — verify that because KanbanBoard reads from the Zustand store (which is mutated by detail page actions), returning to the board automatically shows updated claim positions. If the store uses persist middleware, confirm state is in sync. Add a back navigation link or breadcrumb on the detail page if not already present (check src/components/detail/ClaimDetailPage.tsx).

**Checkpoint**: Full round-trip: board → detail → action → back to board with card in new column.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Clean up, empty states, responsive behavior, and final validation.

- [x] T021 [P] Add empty state rendering to KanbanColumn in src/components/kanban/KanbanColumn.tsx — when a column has zero claims (after filtering), show a subtle "No claims" text centered in the column body.
- [x] T022 [P] Add empty state for no search results in src/components/kanban/KanbanBoard.tsx — when all columns are empty after filtering, show a centered message like "No claims match your filters" with a link/button to reset.
- [x] T023 Clean up unused imports and dead code — remove any remaining references to Sidebar, DashboardPage, SummaryTile, FilterPanel, FilterChips, ClaimList across the codebase (imports, route tree, store references).
- [x] T024 Update src/stores/claims-store.ts test file at tests/stores/claims-store.test.ts — update or remove tests that reference removed filtering params (status, payer, aging) or removed UI behavior. Add a test for the groupByStatus selector.
- [x] T025 Run quickstart.md validation scenarios — manually verify all 11 scenarios from specs/002-kanban-claims-board/quickstart.md pass.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS all user stories
- **Phase 3 (US1)**: Depends on Phase 2 — board layout must exist first
- **Phase 4 (US2)**: Depends on Phase 3 (T011) — needs KanbanBoard header to exist
- **Phase 5 (US3)**: Depends on Phase 3 (T011) — needs KanbanBoard header to exist. Can run in parallel with Phase 4.
- **Phase 6 (US4)**: Depends on Phase 3 — needs cards to be clickable
- **Phase 7 (Polish)**: Depends on all previous phases

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2 — no dependencies on other stories
- **US2 (P1)**: Depends on US1 (needs board header to add date picker)
- **US3 (P1)**: Depends on US1 (needs board header to add search). Can run in parallel with US2.
- **US4 (P2)**: Depends on US1 (needs clickable cards on board)

### Parallel Opportunities

- T009 and T010 can run in parallel (different files, no dependencies)
- T014 (US2) and T016 (US3) can run in parallel after T011 (both add controls to the header)
- T021 and T022 can run in parallel (different components)
- Phase 2 removals (T003, T004, T005) can run in parallel

---

## Parallel Example: User Story 1

```
# Launch card and column components in parallel:
Task T009: "Create KanbanClaimCard in src/components/kanban/KanbanClaimCard.tsx"
Task T010: "Create KanbanColumn in src/components/kanban/KanbanColumn.tsx"

# Then sequentially:
Task T011: "Create KanbanBoard (depends on T009, T010)"
Task T012: "Update route (depends on T011)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (1 task)
2. Complete Phase 2: Foundational layout refactor (7 tasks)
3. Complete Phase 3: US1 — Kanban Board (5 tasks)
4. **STOP and VALIDATE**: Board renders at `/` with 6 columns, cards sorted, scrollable
5. Demo-ready with core kanban view

### Incremental Delivery

1. Setup + Foundational → Layout ready (no sidebar)
2. Add US1 → Kanban board visible (MVP!)
3. Add US2 → Date range filtering works
4. Add US3 → Patient search + reset works
5. Add US4 → Full navigation round-trip works
6. Polish → Empty states, cleanup, test updates

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- The existing ClaimCard component is kept (used in detail page context) — only the board uses the new KanbanClaimCard
- Detail page (src/components/detail/*) and its route are completely untouched
- Zustand store mutations from detail page actions automatically reflect on the board when navigating back
