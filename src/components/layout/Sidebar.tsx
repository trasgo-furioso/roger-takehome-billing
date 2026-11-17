import { Group, NavLink, Text } from '@mantine/core'
import {
  IconFileText,
  IconLayoutDashboard,
  IconRefresh,
} from '@tabler/icons-react'
import { Link, useRouterState } from '@tanstack/react-router'

export function Sidebar() {
  const { location } = useRouterState()
  const pathname = location.pathname

  return (
    <>
      <Group p="md" pb="xs">
        <Text fw={700} fz="lg">
          Billing Manager
        </Text>
      </Group>

      <NavLink
        component={Link}
        to="/"
        label="Dashboard"
        leftSection={<IconLayoutDashboard size={20} />}
        active={pathname === '/'}
      />
      <NavLink
        component={Link}
        to="/claims"
        label="Claims"
        leftSection={<IconFileText size={20} />}
        active={pathname.startsWith('/claims')}
      />
      <NavLink
        label="Reset"
        leftSection={<IconRefresh size={20} />}
        onClick={() => {
          // Will be wired to resetToSeedData with confirmation in Phase 12
        }}
      />
    </>
  )
}
