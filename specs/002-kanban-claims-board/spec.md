# Feature Specification: Kanban Claims Board

**Feature Branch**: `002-kanban-claims-board`

**Created**: 2026-11-17

**Status**: Draft

**Input**: User description: "Remove the sidebar and have a single page at the root path that shows a kanban board of claims grouped by status. Date range selector in the page header (right side) filters by Service Period. Text input with magnifying glass icon filters by patient name. Replaces the current filtering expandable UX."

## User Scenarios & Testing

### User Story 1 - View Claims as Kanban Board (Priority: P1)

A billing staff member navigates to the application root and sees a full-page kanban board with claims organized into columns by status. Each column header shows the status name and claim count. Claims appear as cards within each column, each showing the claim ID prepended to the patient name (claim ID in a lighter font), billing period dates, payer, amount, and days in current status — with no status badge since the column provides that context. Cards within each column are ordered by days in current status descending (oldest first), surfacing claims that need attention. The columns represent the claim lifecycle statuses: Ready for Review, Submitted, Rejected, Denied, Paid, Written Off. The board fills the viewport with no sidebar navigation — the kanban view is the single primary workspace.

**Why this priority**: The kanban board is the foundational layout change. Without it, no other interactions (filtering, card actions) have a surface to operate on. It replaces both the previous claim list and dashboard as the primary workspace.

**Independent Test**: Can be fully tested by loading the application with sample claims in various statuses and verifying that claims appear in the correct status columns with accurate counts, and that the page renders at the root path with no sidebar.

**Acceptance Scenarios**:

1. **Given** claims exist in various statuses and ages, **When** a billing staff member navigates to the root path, **Then** the system displays a kanban board with columns for each claim status (Ready for Review, Submitted, Rejected, Denied, Paid, Written Off), each showing claim cards belonging to that status.
2. **Given** claims exist in various statuses and ages **And** the kanban board is displayed, **When** the user views a column header, **Then** the header shows the status name and the count of claims in that column.
3. **Given** claims exist in various statuses and ages **And** the kanban board is displayed, **When** the user views a claim card, **Then** the card shows the claim ID prepended to the patient name (claim ID in a lighter font), billing period dates, payer, amount, and days in current status — with no status badge (the column provides the status context).
6. **Given** a status column contains multiple claims with varying ages, **When** the user views the column, **Then** cards are ordered by days in current status descending (oldest first).
4. **Given** claims exist in various statuses and ages **And** the kanban board is displayed, **When** the user views the page layout, **Then** there is no sidebar navigation — the kanban board occupies the full page width.
5. **Given** a status column has more claims than fit in the visible area, **When** the user views that column, **Then** the column is independently scrollable to reveal all claims.

---

### User Story 2 - Filter Claims by Service Period (Priority: P1)

A billing staff member uses a date range selector in the page header (positioned to the right) to filter claims by their service period (billing period dates). Selecting a date range narrows the kanban board to only show claims whose billing period overlaps with the selected range. The column counts update to reflect the filtered results. Clearing the date range restores the full unfiltered board.

**Why this priority**: Date range filtering is the primary mechanism for billing staff to focus on current work periods. Service period filtering is essential because billing teams work in 30-day cycles and need to isolate claims for specific periods.

**Independent Test**: Can be fully tested by setting a date range and verifying that only claims with billing periods overlapping the selected range appear on the board, and that clearing the range restores all claims.

**Acceptance Scenarios**:

1. **Given** claims exist with various billing period dates **And** the kanban board is displayed, **When** the user views the page header, **Then** a date range selector is visible on the right side of the header.
2. **Given** claims exist with various billing period dates **And** the kanban board is displayed, **When** the user selects a date range in the header, **Then** only claims whose billing period overlaps the selected range are shown on the board and column counts update accordingly.
3. **Given** claims exist with various billing period dates **And** the kanban board is displayed **And** a date range filter is active, **When** the user clears the date range, **Then** the full unfiltered board is restored with all claims visible and column counts updated.

---

### User Story 3 - Search Claims by Patient Name (Priority: P1)

A billing staff member types a patient name into a text input with a magnifying glass icon in the page header to filter claims across all columns. The search narrows the kanban board to show only claims for matching patients. The search works in combination with the date range filter — both filters apply simultaneously. Clearing the search text restores claims matching any remaining active filter.

**Why this priority**: Patient name search is the most common lookup action for billing staff handling phone calls, inquiries, or following up on specific cases. It must be immediately accessible and combinable with date filtering.

**Independent Test**: Can be fully tested by typing a patient name and verifying that only matching claims appear across all columns, and that clearing the search restores the full (or date-filtered) view.

**Acceptance Scenarios**:

1. **Given** claims exist for multiple patients **And** the kanban board is displayed, **When** the user views the page header, **Then** a text input with a magnifying glass icon is visible, with a reset button adjacent to it.
2. **Given** claims exist for multiple patients **And** the kanban board is displayed, **When** the user types a patient name in the search input, **Then** only claims for matching patients are shown across all columns and column counts update accordingly.
3. **Given** claims exist for multiple patients **And** the kanban board is displayed **And** a patient name search is active, **When** the user clears the search text, **Then** the board restores all claims (subject to any active date range filter).
4. **Given** claims exist for multiple patients with various billing period dates **And** the kanban board is displayed **And** a date range filter is active, **When** the user types a patient name in the search input, **Then** only claims matching both the patient name and the date range are shown.
5. **Given** claims exist for multiple patients **And** the kanban board is displayed **And** one or more filters are active (patient name search, date range, or both), **When** the user clicks the reset button in the header, **Then** all filters are cleared and the full unfiltered board is restored.

---

### User Story 4 - Navigate to Claim Detail from Board (Priority: P2)

A billing staff member clicks on any claim card on the kanban board to navigate to the claim detail page. Cards on the board are display-only — they show no action buttons, no inline expansions, and no interactive controls beyond the click-to-navigate behavior. All claim actions (review readiness, submit, post payment, fix rejection, appeal/write off denial) are performed exclusively on the claim detail page. When the user completes an action on the detail page and returns to the board, the card appears in its updated status column.

**Why this priority**: Navigation from board to detail is the bridge between the overview (kanban) and the action workspace (detail page). It depends on the kanban board being in place (US1) and keeps the board simple and scannable.

**Independent Test**: Can be fully tested by clicking a claim card on the board, verifying navigation to the correct claim detail page, performing a status-changing action on the detail page, navigating back to the board, and confirming the card has moved to the correct column.

**Acceptance Scenarios**:

1. **Given** claims exist in various statuses **And** the kanban board is displayed, **When** the user clicks on a claim card, **Then** the system navigates to the claim detail page for that claim.
2. **Given** claims exist in various statuses **And** the kanban board is displayed, **When** the user views a claim card, **Then** the card shows no action buttons or interactive controls — it is display-only.
3. **Given** the user is on the claim detail page **And** the user performs an action that changes the claim status (e.g., Submit, Pay, Write Off), **When** the user navigates back to the kanban board, **Then** the card appears in the column matching its new status and both column counts are updated.

---

### Edge Cases

- What happens when a status column has zero claims after filtering? The column remains visible with a zero count and an empty state indicator.
- What happens when the search input matches no patients? All columns show zero claims with an empty state message.
- What happens when the user resizes the browser window? The kanban columns adapt — columns may become horizontally scrollable on narrow viewports.
- What happens when the user changes a claim's status on the detail page and navigates back? The board reflects the updated status — the card appears in its new column.

## Requirements

### Functional Requirements

**Kanban Board Layout (US1)**
- **FR-001**: System MUST display claims as a kanban board at the root path (`/`) with columns for each claim lifecycle status: Ready for Review, Submitted, Rejected, Denied, Paid, Written Off. Cards within each column MUST be ordered by days in current status descending (oldest first).
- **FR-002**: Each column MUST display a header with the status name and the count of claims currently in that column.
- **FR-003**: Each column MUST be independently scrollable when claims exceed the visible area.
- **FR-004**: The application MUST NOT display a sidebar — the kanban board occupies the full page width.

**Filtering (US2, US3)**
- **FR-005**: The page header MUST contain a date range selector positioned on the right side that filters claims by billing period (service period) overlap.
- **FR-006**: The page header MUST contain a text input with a magnifying glass icon for filtering claims by patient name.
- **FR-007**: Date range and patient name filters MUST be combinable — both apply simultaneously when active.
- **FR-008**: The page header MUST contain a reset button positioned next to the search input that clears all active filters (patient name and date range) in one action.
- **FR-008a**: Clearing any individual filter MUST immediately update the board to reflect remaining active filters.
- **FR-009**: Column counts MUST update dynamically when filters are applied or cleared.

**Card Navigation (US4)**
- **FR-010**: Claim cards on the kanban board MUST be display-only — no action buttons, no inline expansions, no interactive controls, no status badge (the column provides status context).
- **FR-010a**: Each claim card MUST display the claim ID prepended to the patient name, with the claim ID in a lighter font weight than the patient name.
- **FR-011**: Clicking a claim card MUST navigate to the claim detail page for that claim.
- **FR-012**: All claim actions (review, submit, pay, fix, appeal, write off) MUST be performed exclusively on the claim detail page.
- **FR-013**: When the user returns to the kanban board after a status change on the detail page, the board MUST reflect the updated status with the card in the correct column and counts updated.

### Key Entities

Existing entities from the billing manager remain unchanged. No new entities are introduced — this feature changes the presentation and navigation model only.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Billing staff can see claims across all statuses in a single view without navigating between pages or expanding filter panels.
- **SC-002**: Billing staff can filter to a specific patient's claims within 10 seconds using the search input.
- **SC-003**: Billing staff can isolate claims for a specific service period within 15 seconds using the date range selector.
- **SC-004**: After a status change on the detail page, returning to the board shows the card in its new column without manual refresh.
- **SC-005**: The kanban board loads and displays all claims within 2 seconds for a typical workload (up to 200 claims).

## Assumptions

- This feature replaces the existing claim list page, sidebar navigation, dashboard page, and expandable filter panel — all existing claim card and detail page functionality is preserved.
- The kanban board does not support drag-and-drop for moving claims between columns — status changes only occur through actions on the claim detail page.
- Claim cards on the board are display-only with no action buttons or inline expansions — the board is a read-only overview; all actions happen on the detail page.
- The existing claim detail page remains accessible via card click and continues to function as designed (auto-save, readiness checks, timeline, etc.).
- The date range selector uses a standard date picker component; exact styling defers to implementation.
- Column order on the board follows the claim lifecycle: Ready for Review, Submitted, Rejected, Denied, Paid, Written Off.
- The "Written Off" status column is included since it is a terminal state in the existing claim lifecycle.
- The board replaces the dashboard summary tiles — the column headers with counts serve a similar at-a-glance purpose.
