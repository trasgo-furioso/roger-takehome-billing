import { createFileRoute } from '@tanstack/react-router'
import { ContentHeader } from '@/components/layout/ContentHeader'
import { DashboardPage } from '@/components/dashboard/DashboardPage'

export const Route = createFileRoute('/')({
  component: DashboardRoute,
})

function DashboardRoute() {
  return (
    <>
      <ContentHeader title="Dashboard" />
      <DashboardPage />
    </>
  )
}
