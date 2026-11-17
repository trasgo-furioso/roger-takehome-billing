import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod/v4'
import { ContentHeader } from '@/components/layout/ContentHeader'
import { ClaimDetailPage } from '@/components/detail/ClaimDetailPage'
import { useClaimsStore } from '@/stores'

const searchSchema = z.object({
  fix: z.string().optional().catch(undefined),
})

export const Route = createFileRoute('/claims/$claimId')({
  validateSearch: (search) => searchSchema.parse(search),
  component: ClaimDetailRoute,
})

function ClaimDetailRoute() {
  const { claimId } = Route.useParams()
  const { fix } = Route.useSearch()
  const { getClaimById, getPatientById } = useClaimsStore()
  const claim = getClaimById(claimId)
  const patient = claim ? getPatientById(claim.patientId) : undefined
  const title = patient ? `${patient.firstName} ${patient.lastName}` : `Claim ${claimId}`

  return (
    <>
      <ContentHeader
        backTo={{ label: 'Back to Board', href: '/' }}
        title={title}
      />
      <ClaimDetailPage claimId={claimId} fixCode={fix} />
    </>
  )
}
