import { Alert, Badge, Button, Card, Collapse, Group, Text } from '@mantine/core'
import { IconAlertOctagon, IconAlertTriangle } from '@tabler/icons-react'
import { useNavigate } from '@tanstack/react-router'
import type { Claim, Patient } from '@/models'
import { formatCurrency, formatDate, daysInStatus, statusColor } from '@/utils'
import { useClaimsStore, useUIStore } from '@/stores'
import { ReadinessChecklist } from './ReadinessChecklist'
import { PaymentForm } from './PaymentForm'

interface ClaimCardProps {
  claim: Claim
  patient: Patient
  onCardClick: () => void
}

export function ClaimCard({ claim, patient, onCardClick }: ClaimCardProps) {
  const days = daysInStatus(claim.statusChangedAt)
  const navigate = useNavigate()
  const submitClaim = useClaimsStore((s) => s.submitClaim)
  const writeOffClaim = useClaimsStore((s) => s.writeOffClaim)
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
    submitClaim(claim.id)
    collapseCard()
  }

  const handlePay = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (isExpanded && expandedCardMode === 'payment') {
      collapseCard()
    } else {
      expandCard(claim.id, 'payment')
    }
  }

  const handleFix = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    navigate({ to: '/claims/$claimId', params: { claimId: claim.id } })
  }

  const handleAppeal = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    navigate({ to: '/claims/$claimId', params: { claimId: claim.id } })
  }

  const handleWriteOff = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    writeOffClaim(claim.id)
  }

  const renderActionButton = () => {
    if (claim.status === 'Ready for Review') {
      if (claim.readiness.allPassing) {
        return <Button variant="light" size="xs" onClick={handleSubmit}>Submit Claim</Button>
      }
      return <Button variant="light" size="xs" onClick={handleReview}>Review</Button>
    }
    if (claim.status === 'Submitted') {
      return <Button variant="light" color="cyan" size="xs" onClick={handlePay}>Pay</Button>
    }
    if (claim.status === 'Rejected') {
      return <Button variant="light" color="orange" size="xs" onClick={handleFix}>Fix</Button>
    }
    if (claim.status === 'Denied') {
      return (
        <Group gap="xs">
          <Button variant="light" size="xs" onClick={handleAppeal}>Appeal</Button>
          <Button variant="subtle" color="gray" size="xs" onClick={handleWriteOff}>Write Off</Button>
        </Group>
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

      {/* Rejection reason display */}
      {claim.status === 'Rejected' && claim.rejectionReason && (
        <Alert color="orange" icon={<IconAlertTriangle size={16} />} mt="xs" data-testid="rejection-reason">
          <Group gap="xs">
            <Badge color="orange" size="sm">{claim.rejectionReason.code}</Badge>
            <Text fz="sm">{claim.rejectionReason.description}</Text>
          </Group>
        </Alert>
      )}

      {/* Denial reason display */}
      {claim.status === 'Denied' && claim.denialReason && (
        <Alert color="red" icon={<IconAlertOctagon size={16} />} mt="xs" data-testid="denial-reason">
          <Group gap="xs" wrap="wrap">
            <Badge color="red" size="sm">{claim.denialReason.carcCode}</Badge>
            <Text fz="sm">{claim.denialReason.carcDescription}</Text>
          </Group>
          {claim.denialReason.rarcCode && (
            <Group gap="xs" mt="xs">
              <Badge color="red" variant="outline" size="sm">{claim.denialReason.rarcCode}</Badge>
              <Text fz="sm" c="dimmed">{claim.denialReason.rarcDescription}</Text>
            </Group>
          )}
          <Group gap="lg" mt="xs">
            <Text fw={500} fz="sm">At risk: {formatCurrency(claim.denialReason.amountAtRisk)}</Text>
            <Text fz="xs" c="dimmed">{daysInStatus(claim.denialReason.denialDate)} days since denial</Text>
          </Group>
        </Alert>
      )}

      {/* Paid remittance summary */}
      {claim.status === 'Paid' && claim.remittance && (
        <Group mt="xs" gap="lg" data-testid="remittance-summary">
          <Text fz="sm">Billed: {formatCurrency(claim.totalCharges)}</Text>
          <Text fz="sm" fw={500}>Paid: {formatCurrency(claim.remittance.paymentAmount)}</Text>
          {claim.remittance.contractualAdjustment > 0 && (
            <Text fz="sm" c="dimmed">Adj: {formatCurrency(claim.remittance.contractualAdjustment)}</Text>
          )}
        </Group>
      )}

      {renderActionButton() && (
        <Group justify="flex-end" mt="xs">
          {renderActionButton()}
        </Group>
      )}

      <Collapse expanded={isExpanded && expandedCardMode === 'readiness'}>
        <ReadinessChecklist readiness={claim.readiness} />
      </Collapse>

      <Collapse expanded={isExpanded && expandedCardMode === 'payment'}>
        <PaymentForm claimId={claim.id} expectedAmount={claim.expectedAmount} />
      </Collapse>
    </Card>
  )
}
