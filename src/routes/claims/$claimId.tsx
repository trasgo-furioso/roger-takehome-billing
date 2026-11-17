import { createFileRoute } from '@tanstack/react-router'
import { ContentHeader } from '@/components/layout/ContentHeader'
import { ClaimDetailPage } from '@/components/detail/ClaimDetailPage'
import { useClaimsStore } from '@/stores'

export const Route = createFileRoute('/claims/$claimId')({
  component: ClaimDetailRoute,
})

function ClaimDetailRoute() {
  const { claimId } = Route.useParams()
  const { getClaimById, getPatientById } = useClaimsStore()
  const claim = getClaimById(claimId)
  const patient = claim ? getPatientById(claim.patientId) : undefined
  const title = patient ? `${patient.firstName} ${patient.lastName}` : `Claim ${claimId}`

  return (
    <>
      <ContentHeader
        backTo={{ label: 'Back to Claims', href: '/claims' }}
        title={title}
      />
      <ClaimDetailPage claimId={claimId} />
    </>
  )
}
