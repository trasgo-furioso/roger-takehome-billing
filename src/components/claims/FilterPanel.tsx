import { Button, Collapse, Group, Select, Stack, TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import type { ClaimStatus } from '@/models'

const statusOptions: ClaimStatus[] = [
  'Ready for Review',
  'Submitted',
  'Rejected',
  'Denied',
  'Paid',
  'Written Off',
]

export interface ClaimSearchParams {
  status?: string
  payer?: string
  dateFrom?: string
  dateTo?: string
  patient?: string
  aging?: string
}

interface FilterPanelProps {
  expanded: boolean
  searchParams: ClaimSearchParams
}

export function FilterPanel({ expanded, searchParams }: FilterPanelProps) {
  const navigate = useNavigate()

  const updateSearch = (updates: Partial<ClaimSearchParams>) => {
    const newParams = { ...searchParams, ...updates }
    // Remove empty/undefined values
    const cleaned = Object.fromEntries(
      Object.entries(newParams).filter(([, v]) => v !== undefined && v !== ''),
    )
    navigate({ to: '/claims', search: cleaned })
  }

  const clearAll = () => {
    navigate({ to: '/claims', search: {} })
  }

  return (
    <Collapse expanded={expanded}>
      <Stack gap="sm" mt="md" mb="md">
        <Group grow>
          <Select
            label="Status"
            placeholder="All statuses"
            data={statusOptions}
            value={searchParams.status ?? null}
            onChange={(value) => updateSearch({ status: value ?? undefined })}
            clearable
          />
          <TextInput
            label="Patient"
            placeholder="Search by name"
            leftSection={<IconSearch size={16} />}
            value={searchParams.patient ?? ''}
            onChange={(e) => updateSearch({ patient: e.currentTarget.value || undefined })}
          />
        </Group>
        <Group>
          <Button variant="subtle" onClick={clearAll}>
            Clear All
          </Button>
        </Group>
      </Stack>
    </Collapse>
  )
}
