# UI Component Contracts: Kanban Claims Board

## Component: KanbanBoard

**Location**: `src/components/kanban/KanbanBoard.tsx`

**Props**: None (reads from store directly)

**Renders**: Page header with filters + horizontal scrollable container of `KanbanColumn` components (one per status). Groups claims by status, applies active filters, passes grouped/sorted claims to columns.

**Mantine components**: `Group`, `TextInput`, `DatePickerInput`, `ActionIcon`, `Button`

---

## Component: KanbanColumn

**Location**: `src/components/kanban/KanbanColumn.tsx`

**Props**:
| Prop   | Type                       | Description                              |
|--------|----------------------------|------------------------------------------|
| status | `ClaimStatus`              | Column status (determines color/title)   |
| claims | `Claim[]`                  | Pre-sorted claims for this column        |
| count  | `number`                   | Number of claims (for badge)             |

**Renders**: `Paper` surface with colored top border, header row (`Text` title + `Badge` count pill), `ScrollArea` body containing stacked `KanbanClaimCard` components.

**Mantine components**: `Paper`, `Text`, `Badge`, `ScrollArea`, `Stack`

---

## Component: KanbanClaimCard

**Location**: `src/components/kanban/KanbanClaimCard.tsx`

**Props**:
| Prop    | Type      | Description                        |
|---------|-----------|------------------------------------|
| claim   | `Claim`   | Claim data                         |
| patient | `Patient` | Patient data for name display      |

**Renders**: Display-only `Card` with click-to-navigate. Shows:
- Line 1: Claim ID (lighter font) + Patient name (bold)
- Line 2: Period dates, payer
- Line 3: Amount, days in current status

No status badge, no action buttons, no inline expansion.

**Mantine components**: `Card`, `Text`, `Group`

---

## Component: AppLayout (modified)

**Location**: `src/components/layout/AppLayout.tsx`

**Change**: Remove `AppShell` with navbar. Replace with simple full-viewport flex container (no sidebar).

---

## Route: Root (`/`)

**Location**: `src/routes/index.tsx`

**Change**: Replace `DashboardPage` with `KanbanBoard`. Remove `ContentHeader` (the board has its own header).

---

## Removed Components

| Component      | Reason                                              |
|----------------|-----------------------------------------------------|
| `Sidebar`      | No sidebar in kanban layout                         |
| `FilterPanel`  | Replaced by inline header filters on kanban board   |
| `FilterChips`  | No filter chips — header controls replace them      |
| `DashboardPage`| Board column headers replace dashboard summary tiles|
| `SummaryTile`  | No longer needed                                    |
| `ClaimList`    | Replaced by kanban board                            |

**Note**: `ClaimCard` is kept for now (may still be used in claim detail context) but is replaced by `KanbanClaimCard` on the board.
