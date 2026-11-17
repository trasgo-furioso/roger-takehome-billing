import { SimpleGrid, Stack, Title } from '@mantine/core'
import { useClaimsStore } from '@/stores'
import { daysInStatus, arAgingBucket, statusColor } from '@/utils'
import { SummaryTile } from './SummaryTile'
import type { ClaimStatus } from '@/models'

const statusOrder: ClaimStatus[] = ['Ready for Review', 'Submitted', 'Rejected', 'Denied', 'Paid']
const agingBuckets = ['0-30', '31-60', '61-90', '90+'] as const
const agingColors = { '0-30': 'green', '31-60': 'yellow', '61-90': 'orange', '90+': 'red' }

export function DashboardPage() {
  const claims = useClaimsStore((s) => s.claims)

  // Status counts
  const statusData = statusOrder.map((status) => {
    const matching = claims.filter((c) => c.status === status)
    return {
      label: status,
      count: matching.length,
      total: matching.reduce((sum, c) => sum + c.totalCharges, 0),
      color: statusColor(status),
      linkSearch: { status },
    }
  })

  // Aging buckets (non-terminal claims only)
  const activeClaims = claims.filter((c) => c.status !== 'Paid' && c.status !== 'Written Off')
  const agingData = agingBuckets.map((bucket) => {
    const matching = activeClaims.filter((c) => arAgingBucket(daysInStatus(c.statusChangedAt)) === bucket)
    return {
      label: `${bucket} days`,
      count: matching.length,
      total: matching.reduce((sum, c) => sum + c.totalCharges, 0),
      color: agingColors[bucket],
      linkSearch: { aging: bucket },
    }
  })

  return (
    <Stack gap="lg">
      <div>
        <Title order={4} mb="sm">Claims by Status</Title>
        <SimpleGrid cols={5}>
          {statusData.map((d) => (
            <SummaryTile key={d.label} {...d} />
          ))}
        </SimpleGrid>
      </div>

      <div>
        <Title order={4} mb="sm">Accounts Receivable Aging</Title>
        <SimpleGrid cols={4}>
          {agingData.map((d) => (
            <SummaryTile key={d.label} {...d} />
          ))}
        </SimpleGrid>
      </div>
    </Stack>
  )
}
