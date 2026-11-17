import { createFileRoute } from '@tanstack/react-router'
import { ContentHeader } from '@/components/layout/ContentHeader'
import { Text } from '@mantine/core'

export const Route = createFileRoute('/claims/$claimId')({
  component: ClaimDetailPage,
})

function ClaimDetailPage() {
  const { claimId } = Route.useParams()

  return (
    <>
      <ContentHeader
        backTo={{ label: 'Back to Claims', href: '/claims' }}
        title={`Claim ${claimId}`}
      />
      <Text c="dimmed">Claim detail placeholder — will show UB-04 sections.</Text>
    </>
  )
}
