import { Badge, Group } from '@mantine/core'
import { IconX } from '@tabler/icons-react'
import type { ClaimSearchParams } from './FilterPanel'

interface FilterChipsProps {
  searchParams: ClaimSearchParams
  onRemove: (key: string) => void
}

const labels: Record<string, string> = {
  status: 'Status',
  payer: 'Payer',
  dateFrom: 'From',
  dateTo: 'To',
  patient: 'Patient',
  aging: 'Aging',
}

export function FilterChips({ searchParams, onRemove }: FilterChipsProps) {
  const activeFilters = Object.entries(searchParams).filter(
    ([, v]) => v !== undefined && v !== '',
  )

  if (activeFilters.length === 0) return null

  return (
    <Group gap="xs" mb="sm">
      {activeFilters.map(([key, value]) => (
        <Badge
          key={key}
          data-testid="filter-chip"
          variant="light"
          rightSection={<IconX size={14} />}
          style={{ cursor: 'pointer' }}
          onClick={() => onRemove(key)}
        >
          {labels[key] ?? key}: {value}
        </Badge>
      ))}
    </Group>
  )
}
