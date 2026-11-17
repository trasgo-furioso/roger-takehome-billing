import { Badge, Button, Card, Collapse, Group, Text } from '@mantine/core'
import type { Claim, Patient } from '@/models'
import { formatCurrency, formatDate, daysInStatus, statusColor } from '@/utils'
import { useUIStore } from '@/stores'
import { ReadinessChecklist } from './ReadinessChecklist'

interface ClaimCardProps {
  claim: Claim
  patient: Patient
  onCardClick: () => void
}

export function ClaimCard({ claim, patient, onCardClick }: ClaimCardProps) {
  const days = daysInStatus(claim.statusChangedAt)
  const expandedCardId = useUIStore((s) => s.expandedCardId)
  const expandedCardMode = useUIStore((s) => s.expandedCardMode)
  const expandCard = useUIStore((s) => s.expandCard)
  const collapseCard = useUIStore((s) => s.collapseCard)
  const isExpanded = expandedCardId === claim.id

  const handleReview = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (isExpanded) {
      collapseCard()
    } else {
      expandCard(claim.id, 'readiness')
    }
  }

  const handleSubmit = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    // Will be wired in US4
  }

  const renderActionButton = () => {
    if (claim.status === 'Ready for Review') {
      if (claim.readiness.allPassing) {
        return (
          <Button variant="light" size="xs" onClick={handleSubmit}>
            Submit Claim
          </Button>
        )
      }
      return (
        <Button variant="light" size="xs" onClick={handleReview}>
          Review
        </Button>
      )
    }
    return null
  }

  return (
    <Card data-testid="claim-card">
      <div style={{ cursor: 'pointer' }} onClick={onCardClick}>
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
        </Group>
      </div>

      {renderActionButton() && (
        <Group justify="flex-end" mt="xs">
          {renderActionButton()}
        </Group>
      )}

      <Collapse expanded={isExpanded && expandedCardMode === 'readiness'}>
        <ReadinessChecklist readiness={claim.readiness} />
      </Collapse>
    </Card>
  )
}
