import { Card, Group, Text } from '@mantine/core'
import { useNavigate } from '@tanstack/react-router'
import type { Claim, Patient } from '@/models'
import { formatCurrency, formatDate, daysInStatus } from '@/utils'

interface KanbanClaimCardProps {
  claim: Claim
  patient: Patient
}

export function KanbanClaimCard({ claim, patient }: KanbanClaimCardProps) {
  const navigate = useNavigate()
  const days = daysInStatus(claim.statusChangedAt)

  return (
    <Card
      shadow="xs"
      padding="sm"
      radius="sm"
      style={{ cursor: 'pointer' }}
      onClick={() => navigate({ to: '/claims/$claimId', params: { claimId: claim.id } })}
    >
      <Text fz="sm" fw={700} lineClamp={1}>
        {patient.firstName} {patient.lastName}
      </Text>

      <Text c="dimmed" fz="xs" mt={4}>
        {formatDate(claim.fromDate)} – {formatDate(claim.throughDate)}
      </Text>

      <Group justify="space-between" mt={4}>
        <Text fw={500} fz="sm">{formatCurrency(claim.totalCharges)}</Text>
        <Text c="dimmed" fz="xs">{days}d</Text>
      </Group>
    </Card>
  )
}
