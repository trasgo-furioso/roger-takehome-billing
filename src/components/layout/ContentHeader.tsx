import type { ReactNode } from 'react'
import { Button, Group, Title } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'

interface ContentHeaderProps {
  backTo?: { label: string; href: string }
  title: string
  action?: ReactNode
}

export function ContentHeader({ backTo, title, action }: ContentHeaderProps) {
  return (
    <Group justify="space-between" mt="md" mb="md">
      <Group>
        {backTo && (
          <Button
            component={Link}
            to={backTo.href}
            variant="subtle"
            leftSection={<IconArrowLeft size={16} />}
            size="sm"
          >
            {backTo.label}
          </Button>
        )}
        <Title order={2}>{title}</Title>
      </Group>
      {action && <Group>{action}</Group>}
    </Group>
  )
}
