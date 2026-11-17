# Route Contracts

**Feature**: 001-billing-manager | **Date**: 2026-11-17

## Route Tree

| Path | Component | Description |
|---|---|---|
| `/` | `DashboardPage` | Billing dashboard with summary tiles |
| `/claims` | `ClaimListPage` | Filterable stacked claim cards |
| `/claims/$claimId` | `ClaimDetailPage` | Claim detail/edit view |

### Hierarchy

```
AppLayout (sidebar + content area)
├── / (Dashboard)          ← sidebar item
├── /claims (Claim List)   ← sidebar item
│   └── /claims/$claimId (Claim Detail)  ← child, back button to /claims
```

Dashboard and Claims are **siblings** (both top-level sidebar items). Claim Detail is a **child** of Claims.

### Root Layout — AppLayout

All routes render inside an `AppLayout` with a persistent **sidebar** and a **content area**.

**Sidebar** (always visible, fixed):
- **Logo + App name**: square Logo image at top, "Billing Manager" label next to it
- **Navigation items** (icon + label each):
  1. Dashboard (icon: layout/grid) — links to `/`
  2. Claims (icon: file-text/receipt) — links to `/claims`
  3. Reset (icon: refresh/rotate) — triggers `resetToSeedData()` with confirmation dialog
- Active item is visually highlighted based on current route
- Claims item stays highlighted when viewing `/claims/$claimId`

**Content area**:

Every page has a **content header row** followed by the page body.

**Content header row** (single row, left/right aligned):
- **Left side**: Back button (if child route) + page title
- **Right side**: Page action button (if applicable)

| Route | Back Button | Title | Action Button |
|---|---|---|---|
| `/` | *(none)* | "Dashboard" | *(none)* |
| `/claims` | *(none)* | "Claims" | "Filter" (toggle) |
| `/claims/$claimId` | "Back to Claims" → `/claims` | Patient name | *(state-dependent, see below)* |

**Claims page — Filter toggle**:
- Clicking "Filter" expands the header to reveal the filter UI below the header row
- Filters apply **immediately** on change — no submit button
- Clicking "Filter" again collapses the filter UI
- When collapsed with active filters: applied filters are shown as dismissible chips/badges below the header row
- When no filters are active and collapsed: nothing shown below the header

**Claim Detail page — Action button (state machine)**:

The action button is determined by the claim's current status and readiness state:

| Claim Status | Readiness | Action Button | On Click |
|---|---|---|---|
| `Ready for Review` | All passing | "Submit Claim" | `submitClaim()` → navigate to `/claims` |
| `Ready for Review` | Not all passing | *(none)* | — |
| `Submitted` | — | "Post Payment" | Expands inline payment form in content area |
| `Rejected` | All passing | "Resubmit Claim" | `submitClaim()` → navigate to `/claims` |
| `Rejected` | Not all passing | *(none)* | — |
| `Denied` | All passing | "Resubmit Appeal" | `submitClaim()` → navigate to `/claims` |
| `Denied` | Not all passing | "Write Off" | `writeOffClaim()` → navigate to `/claims` |
| `Paid` | — | *(none)* | — |
| `Written Off` | — | *(none)* | — |

- Only **one** action button is shown at a time — the first matching rule
- For `Denied` claims with passing readiness: "Resubmit Appeal" takes priority; "Write Off" moves to a secondary action (e.g., menu or link below the form)
- "Post Payment" does not navigate away — it expands the payment fields inline, with a "Confirm Payment" button that calls `postPayment()` then navigates to `/claims`

## Search Params

### `/claims` — ClaimListPage

```typescript
// Validated via Zod at the route level
type ClaimSearchParams = {
  status?: ClaimStatus        // Filter by claim status
  payer?: string              // Filter by payer name
  dateFrom?: string           // ISO date — period start >= this
  dateTo?: string             // ISO date — period start <= this
  patient?: string            // Patient name search (case-insensitive substring)
  aging?: '0-30' | '31-60' | '61-90' | '90+'  // AR aging bucket filter
}
```

**Behavior**:
- All params are optional; omitted params = no filter on that dimension
- Multiple params combine with AND logic
- Params persist in the URL for shareability and back-button support
- Dashboard tiles link here with pre-set search params (e.g., `?status=Rejected` or `?aging=31-60`)
- Clearing a filter removes the param from the URL

### `/claims/$claimId` — ClaimDetailPage

```typescript
type ClaimDetailParams = {
  claimId: string  // Path param — claim ID
}
```

**Behavior**:
- If `claimId` does not match any claim, render a "Claim not found" message with link back to claim list
- Detail page reads claim from Zustand store by ID

## Navigation Flows

```
Sidebar "Dashboard"          ──> /
Sidebar "Claims"             ──> /claims
Sidebar "Reset"              ──> confirmation dialog → resetToSeedData()
Dashboard tile (status)      ──> /claims?status=<status>
Dashboard tile (aging)       ──> /claims?aging=<bucket>
Claim card click             ──> /claims/<claimId>
Claim card "Fix" action      ──> /claims/<claimId>
Claim card "Appeal"          ──> /claims/<claimId>
Detail "Back to Claims"      ──> /claims (preserves previous search params via history)
```
