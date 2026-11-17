# Feature Specification: Claim Detail Page UX Fixes

**Feature Branch**: `003-claim-detail-ux`

**Created**: 2026-11-17

**Status**: Draft

**Input**: User description: "The claim details page has design and UX issues. First a bug: can't scroll vertically. Second, there's too much white space — this app is for desktop mainly, we should be using columns for the sections. The header needs top margin."

## User Scenarios & Testing

### User Story 1 - Scroll Through Full Claim Detail (Priority: P1)

A billing staff member opens a claim detail page containing all UB-04 sections (Provider, Patient, Condition, Diagnoses, Service Lines, Payer, Timeline). The page content extends beyond the viewport. The user scrolls vertically to reach all sections from top to bottom without any content being clipped or inaccessible.

**Why this priority**: This is a blocking bug. Users literally cannot access sections that render below the viewport fold, making the detail page unusable for reviewing or editing claims.

**Independent Test**: Can be fully tested by opening any claim detail page and scrolling from the top header through the bottom timeline section, confirming all content is reachable.

**Acceptance Scenarios**:

1. **Given** the claim detail page is displayed with content exceeding the viewport height, **When** the user scrolls down, **Then** all sections are reachable via vertical scrolling without any content clipped or hidden.
2. **Given** the claim detail page is displayed, **When** the user scrolls to the bottom, **Then** the Timeline section (last section) is fully visible including its last entry.
3. **Given** the claim detail page is displayed, **When** the user scrolls down and then back up, **Then** the header with back button, patient name, and action buttons remains accessible at the top.

---

### User Story 2 - Desktop-Optimized Multi-Column Layout (Priority: P1)

A billing staff member opens a claim detail page on a desktop browser. The UB-04 sections are arranged in a multi-column layout that uses the available horizontal space efficiently, reducing the amount of vertical scrolling needed. Related sections appear side-by-side so the user can see more claim information at a glance without excessive whitespace between sections.

**Why this priority**: The current single-column layout wastes horizontal space on wide desktop screens and forces unnecessary vertical scrolling. Billing staff work on desktop monitors and need to see as much claim data as possible in one view to work efficiently.

**Independent Test**: Can be fully tested by opening a claim detail page on a standard desktop viewport (1280px+ wide) and verifying that sections are arranged in columns, reducing vertical page length and whitespace.

**Acceptance Scenarios**:

1. **Given** the claim detail page is displayed on a desktop viewport (1280px or wider), **When** the user views the page, **Then** claim sections are arranged in a multi-column layout that uses horizontal space efficiently.
2. **Given** the claim detail page is displayed in a multi-column layout, **When** the user views the page, **Then** the vertical page length is visibly shorter than a single-column layout would produce.
3. **Given** the claim detail page is displayed on a viewport narrower than the column breakpoint, **When** the user views the page, **Then** sections gracefully stack into a single column without horizontal overflow.

---

### User Story 3 - Header Spacing (Priority: P1)

A billing staff member opens a claim detail page. The page header (containing the back button, patient name, and action buttons) has proper top margin so it does not appear flush against the top edge of the content area.

**Why this priority**: The header looking cramped against the top edge makes the page feel unpolished and reduces visual hierarchy. This is a quick fix with high visual impact.

**Independent Test**: Can be fully tested by opening any claim detail page and verifying the header has visible top spacing separating it from the top edge of the content area.

**Acceptance Scenarios**:

1. **Given** the claim detail page is displayed, **When** the user views the header area, **Then** there is visible top margin between the top edge of the content area and the header row.

---

### Edge Cases

- What happens when the claim detail page has a rejection fix banner at the top? The banner should be visible and scrollable along with the rest of the content.
- How does the multi-column layout handle sections with variable heights (e.g., a claim with many diagnoses vs. few)?
- What happens when a payment form overlay is displayed on top of the multi-column layout?

## Requirements

### Functional Requirements

**Vertical Scrolling (US1)**
- **FR-001**: The claim detail page MUST be vertically scrollable when content exceeds the viewport height.
- **FR-002**: All claim sections (Provider, Patient, Condition, Diagnoses, Service Lines, Payer, Timeline) MUST be reachable by scrolling.

**Multi-Column Layout (US2)**
- **FR-003**: On desktop viewports (1280px or wider), claim sections MUST be arranged in a multi-column layout to reduce whitespace and vertical page length.
- **FR-004**: The multi-column layout MUST gracefully collapse to a single column on narrower viewports.
- **FR-005**: Sections that benefit from full width (such as Service Lines with tabular data, or Timeline) MAY span the full page width.

**Header Spacing (US3)**
- **FR-006**: The content header (back button, title, action buttons) MUST have top margin providing visual separation from the top edge of the content area.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can scroll to reach 100% of claim detail content on any claim, regardless of content length.
- **SC-002**: On a 1440px-wide viewport, the claim detail page uses at least 70% of horizontal space for content (vs. single-column center).
- **SC-003**: On a 1440px-wide viewport, the vertical page length is reduced compared to the current single-column layout.
- **SC-004**: The header has visible top spacing distinguishing it from the top edge of the viewport/content area.

## Assumptions

- Desktop is the primary target; standard viewport widths of 1280px+ are assumed.
- The app uses Mantine UI components; layout changes will use Mantine's Grid/SimpleGrid/Group primitives.
- The vertical scroll bug is caused by the root AppLayout using `overflow: hidden` with `height: 100vh`, which prevents content overflow.
- Sections inside cards already use 2-column SimpleGrid for their fields; this spec addresses the page-level section layout (arranging the cards themselves in columns).
- The existing header component (ContentHeader) is shared across pages; top margin should be added in a way that benefits all pages using it.
