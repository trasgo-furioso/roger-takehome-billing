# Research: Kanban Claims Board

## Decision 1: Kanban Column Surface Component

**Decision**: Use `Paper` with `shadow="xs"` and a colored left border (or top accent) per status for each column. The column body is a flex container holding the header and a `ScrollArea` for the cards.

**Rationale**: `Paper` is Mantine's general-purpose surface/container component with shadow and radius support. It's lighter than `Card` (which adds section semantics we don't need at the column level). The colored border per status reuses the existing `statusColor()` utility.

**Alternatives considered**:
- `Card` — adds Card.Section overhead, semantically wrong for a column container
- Raw `Box` with custom styles — works but loses Paper's built-in shadow/radius theming

## Decision 2: Column Count Pill

**Decision**: Use `Badge` with `variant="filled"` and the status-specific color from `statusColor()`. Placed inline next to the column title `Text` in a `Group`.

**Rationale**: `Badge` is already used throughout the codebase for status indicators. The "filled" variant with a small size creates a pill appearance. Per-status colors are already defined in `src/utils/status-colors.ts`.

**Alternatives considered**:
- `Pill` component — designed for removable tags, not count indicators
- `Indicator` — positioned at corners, not inline with text

## Decision 3: Horizontal Board Scrolling

**Decision**: Use CSS `display: flex` with `overflow-x: auto` on the board container (a `Group` or raw `div` with `flexWrap: "nowrap"`). Each column has a fixed `minWidth` (e.g., 280px) so columns don't collapse. The board container uses `flex: 1` to fill remaining viewport height below the header.

**Rationale**: Mantine's `Group` with `wrap="nowrap"` provides the horizontal flex layout. Native `overflow-x: auto` is simpler than wrapping in a horizontal `ScrollArea` and gives standard browser scrollbar behavior.

**Alternatives considered**:
- `ScrollArea` with `type="auto"` horizontal — adds custom scrollbar styling but more complexity for the outer container
- CSS Grid with auto-columns — less flexible for the scrolling behavior

## Decision 4: Vertical Column Scrolling

**Decision**: Use `ScrollArea` (from `@mantine/core`) inside each column to wrap the card stack. The column uses `display: flex; flex-direction: column; height: calc(100vh - <header-height>)`. The header area is fixed, and the `ScrollArea` takes `flex: 1` to fill remaining space.

**Rationale**: `ScrollArea` provides custom-styled scrollbars consistent with Mantine theming. Each column scrolls independently. The `type="auto"` prop shows scrollbars only when content overflows.

**Alternatives considered**:
- Native `overflow-y: auto` — works but doesn't match Mantine's scrollbar styling
- Virtualized list — overkill for <=200 claims total across 6 columns

## Decision 5: Date Range Selector

**Decision**: Use `DatePickerInput` from `@mantine/dates` with `type="range"` for a single input that captures both start and end dates. Positioned in the page header on the right side.

**Rationale**: Already a dependency (`@mantine/dates` is in package.json). The `type="range"` mode captures a `[Date, Date]` tuple in a single compact input — better UX than two separate date inputs. The existing `FilterPanel` already uses `DatePickerInput`.

**Alternatives considered**:
- Two separate `DatePickerInput` fields — takes more space in the header, already proved less compact in the existing filter panel

## Decision 6: Patient Search Input

**Decision**: Use `TextInput` from `@mantine/core` with `leftSection={<IconSearch />}` for the magnifying glass icon. Debounce input changes to avoid filtering on every keystroke.

**Rationale**: Matches the existing pattern in `FilterPanel.tsx` line 98-104. `TextInput` with `leftSection` is Mantine's standard pattern for icon-adorned inputs.

## Decision 7: Reset Button

**Decision**: Use `ActionIcon` with `IconX` or a `Button` variant="subtle" with "Reset" label, positioned next to the search input in the header `Group`.

**Rationale**: An `ActionIcon` is more compact for the header. When no filters are active, it can be hidden or disabled.

## Decision 8: Claim Card on Board

**Decision**: Reuse the existing `Card` component from `@mantine/core` but create a simplified `KanbanClaimCard` that is display-only. It shows: claim ID (lighter font via `c="dimmed"` or `fw={400}`) prepended to patient name (`fw={700}`), period dates, payer, amount, days in status. No status badge, no action buttons, no inline expansions.

**Rationale**: The existing `ClaimCard` has too much interactive logic (actions, collapse, payment form). A new lean component avoids prop gymnastics and keeps the board fast.

**Alternatives considered**:
- Refactoring existing `ClaimCard` with a `displayOnly` prop — adds conditional complexity to an already complex component

## Decision 9: Layout Architecture

**Decision**: Replace `AppShell` with navbar/sidebar with a simple full-viewport flex layout. The root layout renders a header bar (app title + filters) and the kanban board below. Remove `Sidebar` component and `AppShell.Navbar`.

**Rationale**: The spec requires removing the sidebar entirely. `AppShell` without a navbar is essentially just padding — simpler to use `Stack` or plain flex for the full-page layout.

## Decision 10: Column Color Differentiation

**Decision**: Use the existing `statusColor()` mapping to apply a colored top border or background tint to each column's `Paper`. The `Badge` count pill uses the same color as `variant="filled"`. Column header text uses default color for readability.

**Colors** (from existing `status-colors.ts`):
- Ready for Review: `blue`
- Submitted: `cyan`
- Rejected: `orange`
- Denied: `red`
- Paid: `green`
- Written Off: `gray`
