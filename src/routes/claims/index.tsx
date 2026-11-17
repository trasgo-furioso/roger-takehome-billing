import { createFileRoute } from '@tanstack/react-router'
import { ContentHeader } from '@/components/layout/ContentHeader'
import { Text } from '@mantine/core'

export const Route = createFileRoute('/claims/')({
  component: ClaimsPage,
})

function ClaimsPage() {
  return (
    <>
      <ContentHeader title="Claims" />
      <Text c="dimmed">Claims list placeholder — will show stacked claim cards.</Text>
    </>
  )
}
