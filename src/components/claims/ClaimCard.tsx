import type { ReactNode } from 'react'
import { Badge, Card, Group, Text } from '@mantine/core'
import type { Claim, Patient } from '@/models'
import { formatCurrency, formatDate, daysInStatus, statusColor } from '@/utils'

interface ClaimCardProps {
  claim: Claim
  patient: Patient
  onCardClick: () => void
  actionSlot?: ReactNode
}

export function ClaimCard({ claim, patient, onCardClick, actionSlot }: ClaimCardProps) {
  const days = daysInStatus(claim.statusChangedAt)

  return (
    <Card
      data-testid="claim-card"
      style={{ cursor: 'pointer' }}
      onClick={onCardClick}
    >
      <Group justify="space-between">
        <Text fz="lg" fw={700} data-testid="patient-name">
          {patient.firstName} {patient.lastName}
        </Text>
        <Badge color={statusColor(claim.status)}>{claim.status}</Badge>
      </Group>

      <Group mt="xs" gap="lg">
        <Text c="dimmed" fz="sm" data-testid="period-dates">
          {formatDate(claim.fromDate)} – {formatDate(claim.throughDate)}
        </Text>
        <Text c="dimmed" fz="sm" data-testid="payer-name">
          {claim.payerName}
        </Text>
        <Text fw={500} fz="sm" data-testid="amount">
          {formatCurrency(claim.totalCharges)}
        </Text>
      </Group>

      <Group justify="space-between" mt="xs">
        <Text c="dimmed" fz="xs" data-testid="days-in-status">
          {days} days in {claim.status}
        </Text>
        {actionSlot && (
          <div onClick={(e) => e.stopPropagation()}>{actionSlot}</div>
        )}
      </Group>
    </Card>
  )
}
