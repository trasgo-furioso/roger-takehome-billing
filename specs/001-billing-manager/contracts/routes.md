# Route Contracts

**Feature**: 001-billing-manager | **Date**: 2026-11-17

## Route Tree

| Path | Component | Description |
|---|---|---|
| `/` | `DashboardPage` | Billing dashboard with summary tiles |
| `/claims` | `ClaimListPage` | Filterable stacked claim cards |
| `/claims/$claimId` | `ClaimDetailPage` | Claim detail/edit view |

### Root Layout

All routes render inside an `AppLayout` shell with a sidebar or top nav showing:
- App title: "Billing Manager"
- Nav links: Dashboard, Claims

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
Dashboard tile (status)  ──> /claims?status=<status>
Dashboard tile (aging)   ──> /claims?aging=<bucket>
Claim card click         ──> /claims/<claimId>
Claim card "Fix" action  ──> /claims/<claimId>
Claim card "Appeal"      ──> /claims/<claimId>
Detail page back         ──> /claims (preserves previous search params via browser history)
```
