import { Badge, Button, Card, Group, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useNavigate } from '@tanstack/react-router'
import type { Claim } from '@/models'
import { useClaimsStore } from '@/stores'
import { resolveAction, formatCurrency, formatDate } from '@/utils'
import { ReadinessChecklist } from '@/components/claims/ReadinessChecklist'
import { PaymentForm } from '@/components/claims/PaymentForm'

interface ActionsSectionProps {
  claim: Claim
}

const statusColors: Record<string, string> = {
  'Ready for Review': 'blue',
  Submitted: 'cyan',
  Rejected: 'orange',
  Denied: 'red',
  Paid: 'green',
  'Written Off': 'gray',
}

export function ActionsSection({ claim }: ActionsSectionProps) {
  const navigate = useNavigate()
  const { submitClaim, writeOffClaim } = useClaimsStore()
  const [paymentOpen, { toggle: togglePayment }] = useDisclosure(false)
  const action = resolveAction(claim.status, claim.readiness.allPassing)

  const handlePrimaryAction = () => {
    if (!action) return
    if (action.action === 'submit') {
      submitClaim(claim.id)
      void navigate({ to: '/' })
    } else if (action.action === 'payment') {
      togglePayment()
    } else if (action.action === 'writeOff') {
      writeOffClaim(claim.id)
      void navigate({ to: '/' })
    }
  }

  const handleSecondaryAction = () => {
    writeOffClaim(claim.id)
    void navigate({ to: '/' })
  }

  return (
    <Card>
      <Group justify="space-between" mb="sm">
        <Text fw={600}>Status</Text>
        <Badge color={statusColors[claim.status] ?? 'gray'}>{claim.status}</Badge>
      </Group>

      {/* Ready for Review: show readiness checklist */}
      {(claim.status === 'Ready for Review' || claim.status === 'Rejected') && (
        <ReadinessChecklist readiness={claim.readiness} />
      )}

      {/* Rejected: show rejection reason */}
      {claim.status === 'Rejected' && claim.rejectionReason && (
        <Group gap="xs" mt="md" px="xs" py={6} style={{ background: 'var(--mantine-color-orange-0)', borderRadius: 6 }}>
          <Badge color="orange" size="sm">{claim.rejectionReason.code}</Badge>
          <Text fz="sm">{claim.rejectionReason.description}</Text>
        </Group>
      )}

      {/* Denied: show denial reason */}
      {claim.status === 'Denied' && claim.denialReason && (
        <Stack gap="xs" mt="sm">
          <Group gap="xs" px="xs" py={6} style={{ background: 'var(--mantine-color-red-0)', borderRadius: 6 }}>
            <Badge color="red" size="sm">{claim.denialReason.carcCode}</Badge>
            <Text fz="sm">{claim.denialReason.carcDescription}</Text>
          </Group>
          <Group gap="lg">
            <div>
              <Text fz="xs" c="dimmed">Amount at Risk</Text>
              <Text fz="sm" fw={600} c="red">{formatCurrency(claim.denialReason.amountAtRisk)}</Text>
            </div>
          </Group>
        </Stack>
      )}

      {/* Submitted: show submission info */}
      {claim.status === 'Submitted' && claim.submissionDate && (
        <Group gap="lg" mt="sm">
          <div>
            <Text fz="xs" c="dimmed">Submitted</Text>
            <Text fz="sm">{formatDate(claim.submissionDate)}</Text>
          </div>
          <div>
            <Text fz="xs" c="dimmed">Expected</Text>
            <Text fz="sm" fw={500}>{formatCurrency(claim.expectedAmount)}</Text>
          </div>
        </Group>
      )}

      {/* Paid: show payment info */}
      {claim.status === 'Paid' && claim.remittance && (
        <Group gap="lg" mt="sm">
          <div>
            <Text fz="xs" c="dimmed">Payment</Text>
            <Text fz="sm" fw={600} c="green">{formatCurrency(claim.remittance.paymentAmount)}</Text>
          </div>
          <div>
            <Text fz="xs" c="dimmed">Adjustments</Text>
            <Text fz="sm">{formatCurrency(claim.remittance.contractualAdjustment + claim.remittance.deductibleAmount + claim.remittance.otherAdjustment)}</Text>
          </div>
        </Group>
      )}

      {/* Payment form expands inline */}
      {paymentOpen && claim.status === 'Submitted' && (
        <PaymentForm claimId={claim.id} expectedAmount={claim.expectedAmount} />
      )}

      {/* Action buttons */}
      {action && !paymentOpen && (
        <Stack gap="xs" mt="md">
          <Button fullWidth onClick={handlePrimaryAction}>{action.label}</Button>
          {action.secondary && (
            <Button fullWidth variant="subtle" color="gray" onClick={handleSecondaryAction}>
              {action.secondary.label}
            </Button>
          )}
        </Stack>
      )}
    </Card>
  )
}
