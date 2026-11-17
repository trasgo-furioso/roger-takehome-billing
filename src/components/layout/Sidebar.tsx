import { Group, NavLink, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import {
  IconFileText,
  IconLayoutDashboard,
  IconRefresh,
} from '@tabler/icons-react'
import { Link, useRouterState } from '@tanstack/react-router'
import { useClaimsStore } from '@/stores'

export function Sidebar() {
  const { location } = useRouterState()
  const pathname = location.pathname
  const resetToSeedData = useClaimsStore((s) => s.resetToSeedData)

  const handleReset = () => {
    modals.openConfirmModal({
      title: 'Reset Data',
      children: 'Reset all data to defaults? This cannot be undone.',
      labels: { confirm: 'Reset', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => resetToSeedData(),
    })
  }

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
        onClick={handleReset}
      />
    </>
  )
}
