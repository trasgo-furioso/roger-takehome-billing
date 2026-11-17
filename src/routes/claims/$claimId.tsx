import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Button, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { ContentHeader } from '@/components/layout/ContentHeader'
import { ClaimDetailPage } from '@/components/detail/ClaimDetailPage'
import { PaymentForm } from '@/components/claims/PaymentForm'
import { useClaimsStore } from '@/stores'
import { resolveAction } from '@/utils'

export const Route = createFileRoute('/claims/$claimId')({
  component: ClaimDetailRoute,
})

function ClaimDetailRoute() {
  const { claimId } = Route.useParams()
  const navigate = useNavigate()
  const { getClaimById, getPatientById, submitClaim, writeOffClaim } = useClaimsStore()
  const [paymentOpen, { toggle: togglePayment }] = useDisclosure(false)
  const claim = getClaimById(claimId)
  const patient = claim ? getPatientById(claim.patientId) : undefined
  const title = patient ? `${patient.firstName} ${patient.lastName}` : `Claim ${claimId}`

  const action = claim ? resolveAction(claim.status, claim.readiness.allPassing) : null

  const handlePrimaryAction = () => {
    if (!action || !claim) return
    if (action.action === 'submit') {
      submitClaim(claimId)
      navigate({ to: '/claims' })
    } else if (action.action === 'payment') {
      togglePayment()
    } else if (action.action === 'writeOff') {
      writeOffClaim(claimId)
      navigate({ to: '/claims' })
    }
  }

  const handleSecondaryAction = () => {
    if (!claim) return
    writeOffClaim(claimId)
    navigate({ to: '/claims' })
  }

  const renderActionButtons = () => {
    if (!action) return undefined
    return (
      <Group gap="xs">
        <Button onClick={handlePrimaryAction}>{action.label}</Button>
        {action.secondary && (
          <Button variant="subtle" color="gray" onClick={handleSecondaryAction}>
            {action.secondary.label}
          </Button>
        )}
      </Group>
    )
  }

  return (
    <>
      <ContentHeader
        backTo={{ label: 'Back to Claims', href: '/claims' }}
        title={title}
        action={renderActionButtons()}
      />
      {paymentOpen && claim && (
        <PaymentForm claimId={claimId} expectedAmount={claim.expectedAmount} />
      )}
      <ClaimDetailPage claimId={claimId} />
    </>
  )
}
