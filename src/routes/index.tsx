import { createFileRoute } from '@tanstack/react-router'
import { ContentHeader } from '@/components/layout/ContentHeader'
import { Text } from '@mantine/core'

export const Route = createFileRoute('/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <>
      <ContentHeader title="Dashboard" />
      <Text c="dimmed">Dashboard placeholder — will show summary tiles.</Text>
    </>
  )
}
