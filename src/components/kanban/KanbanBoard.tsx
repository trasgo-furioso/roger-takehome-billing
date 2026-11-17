import { ActionIcon, Group, Text, TextInput, Title } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { IconSearch, IconX } from '@tabler/icons-react'
import { modals } from '@mantine/modals'
import { useClaimsStore, useUIStore } from '@/stores'
import { KanbanColumn } from './KanbanColumn'
import type { ClaimStatus } from '@/models'
import dayjs from 'dayjs'

const STATUSES: ClaimStatus[] = [
  'Ready for Review',
  'Submitted',
  'Rejected',
  'Denied',
  'Paid',
  'Written Off',
]

export function KanbanBoard() {
  const { groupByStatus, patients, resetToSeedData } = useClaimsStore()
  const { patientSearch, dateRange, setPatientSearch, setDateRange, clearFilters, hasActiveFilters } = useUIStore()

  // Build filter params for the store
  const filterParams: { patient?: string; dateFrom?: string; dateTo?: string } = {}
  if (patientSearch) filterParams.patient = patientSearch
  if (dateRange[0]) filterParams.dateFrom = dateRange[0]
  if (dateRange[1]) filterParams.dateTo = dateRange[1]

  const grouped = groupByStatus(filterParams)

  // Date range as Date objects for the picker
  const dateValue: [Date | null, Date | null] = [
    dateRange[0] ? dayjs(dateRange[0]).toDate() : null,
    dateRange[1] ? dayjs(dateRange[1]).toDate() : null,
  ]

  const handleDateChange = (value: [Date | null, Date | null]) => {
    setDateRange([
      value[0] ? dayjs(value[0]).format('YYYY-MM-DD') : null,
      value[1] ? dayjs(value[1]).format('YYYY-MM-DD') : null,
    ])
  }

  const handleReset = () => {
    modals.openConfirmModal({
      title: 'Reset Data',
      children: 'Reset all data to defaults? This cannot be undone.',
      labels: { confirm: 'Reset', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => resetToSeedData(),
    })
  }

  const totalClaims = Array.from(grouped.values()).reduce((sum, arr) => sum + arr.length, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, padding: 'var(--mantine-spacing-md) var(--mantine-spacing-lg)' }}>
      {/* Header */}
      <Group justify="space-between" pb="sm" style={{ flexShrink: 0 }}>
        <Group gap="sm">
          <Title order={3}>Billing Manager</Title>
          <ActionIcon variant="subtle" color="gray" size="sm" onClick={handleReset} title="Reset data">
            <IconX size={14} />
          </ActionIcon>
        </Group>

        <Group gap="sm">
          <TextInput
            placeholder="Search patient"
            leftSection={<IconSearch size={16} />}
            value={patientSearch}
            onChange={(e) => setPatientSearch(e.currentTarget.value)}
            size="sm"
            style={{ width: 200 }}
          />
          {hasActiveFilters() && (
            <ActionIcon variant="subtle" color="gray" onClick={clearFilters} title="Clear all filters">
              <IconX size={16} />
            </ActionIcon>
          )}
          <DatePickerInput
            type="range"
            placeholder="Service period"
            value={dateValue}
            onChange={handleDateChange}
            clearable
            size="sm"
            style={{ width: 260 }}
          />
        </Group>
      </Group>

      {/* Board */}
      {totalClaims === 0 && hasActiveFilters() ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Text c="dimmed" mb="xs">No claims match your filters.</Text>
            <Text
              c="blue"
              fz="sm"
              style={{ cursor: 'pointer' }}
              onClick={clearFilters}
            >
              Reset filters
            </Text>
          </div>
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: 'flex',
            gap: 'var(--mantine-spacing-md)',
            overflowX: 'auto',
            padding: 0,
            minHeight: 0,
          }}
        >
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              claims={grouped.get(status) ?? []}
              patients={patients}
            />
          ))}
        </div>
      )}
    </div>
  )
}
