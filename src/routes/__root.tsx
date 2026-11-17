import { createRootRoute, Outlet } from '@tanstack/react-router'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'
import { theme } from '@/theme'
import { AppLayout } from '@/components/layout/AppLayout'

import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-right" />
      <ModalsProvider>
        <AppLayout>
          <Outlet />
        </AppLayout>
      </ModalsProvider>
    </MantineProvider>
  )
}
