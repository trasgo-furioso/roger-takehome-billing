# Data Model: Kanban Claims Board

No new entities or data model changes are introduced. This feature is a presentation-layer refactor that reuses existing models.

## Existing Entities (unchanged)

- **Claim** (`src/models/claim.ts`) — central entity; `status` field drives column placement, `statusChangedAt` drives sort order, `fromDate`/`throughDate` drive date range filtering
- **Patient** (`src/models/patient.ts`) — `firstName`/`lastName` drive patient name search
- **ClaimStatus** type — `'Ready for Review' | 'Submitted' | 'Rejected' | 'Denied' | 'Paid' | 'Written Off'` — defines kanban columns

## Derived Data (computed, not stored)

- **Claims grouped by status**: `Map<ClaimStatus, Claim[]>` — derived from `claims` array in store
- **Days in status**: `daysInStatus(claim.statusChangedAt)` — existing utility, used for card sort order (descending)
- **Filtered claims**: existing `getClaimsFiltered()` store method handles patient name and date range filtering; needs minor update to remove status/payer/aging params and work at the board level

## State Changes

### UI Store (`src/stores/ui-store.ts`)

Remove:
- `expandedCardId` / `expandedCardMode` / `expandCard()` / `collapseCard()` — no inline card expansion on the board

Add (or move to URL search params):
- `patientSearch: string` — current patient name filter text
- `dateRange: [string | null, string | null]` — current service period date range filter

### Claims Store (`src/stores/claims-store.ts`)

No changes to claim data or actions. The `getClaimsFiltered` method is reused. A new selector or utility groups filtered claims by status for the kanban columns.
