import { Card, Stack, Text } from '@mantine/core'
import { Link } from '@tanstack/react-router'
import { formatCurrency } from '@/utils'

interface SummaryTileProps {
  label: string
  count: number
  total: number
  color: string
  linkSearch: Record<string, string>
}

export function SummaryTile({ label, count, total, color, linkSearch }: SummaryTileProps) {
  return (
    <Card
      data-testid="summary-tile"
      component={Link}
      to="/claims"
      search={linkSearch}
      padding="md"
      style={{ cursor: 'pointer', textDecoration: 'none', borderLeft: `4px solid var(--mantine-color-${color}-6)` }}
    >
      <Stack gap="xs" align="center">
        <Text fz="xl" fw={700} data-testid="tile-count">{count}</Text>
        <Text fz="sm" c="dimmed" data-testid="tile-total">{formatCurrency(total)}</Text>
        <Text fw={500} fz="sm">{label}</Text>
      </Stack>
    </Card>
  )
}
