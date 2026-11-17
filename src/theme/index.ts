import { createTheme } from '@mantine/core'

export const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  defaultRadius: 'md',
  components: {
    Card: {
      defaultProps: {
        shadow: 'sm',
        padding: 'lg',
        radius: 'md',
        withBorder: true,
      },
    },
    Badge: {
      defaultProps: {
        variant: 'light',
        radius: 'sm',
      },
    },
  },
})

export const statusColors: Record<string, string> = {
  'Ready for Review': 'blue',
  'Submitted': 'cyan',
  'Rejected': 'orange',
  'Denied': 'red',
  'Paid': 'green',
  'Written Off': 'gray',
}
