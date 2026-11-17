import { Button, Group, Popover, Stack, Text, TextInput } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { useDisclosure } from '@mantine/hooks'
import { IconCalendar, IconX } from '@tabler/icons-react'
import dayjs from 'dayjs'

interface DateRangePickerWithPresetsProps {
  value: [Date | null, Date | null]
  onChange: (value: [Date | null, Date | null]) => void
}

const presets: { label: string; range: () => [Date, Date] }[] = [
  {
    label: 'This Month',
    range: () => [dayjs().startOf('month').toDate(), dayjs().endOf('month').toDate()],
  },
  {
    label: 'Last Month',
    range: () => [dayjs().subtract(1, 'month').startOf('month').toDate(), dayjs().subtract(1, 'month').endOf('month').toDate()],
  },
  {
    label: 'Last 30 Days',
    range: () => [dayjs().subtract(30, 'day').toDate(), dayjs().toDate()],
  },
  {
    label: 'Last 60 Days',
    range: () => [dayjs().subtract(60, 'day').toDate(), dayjs().toDate()],
  },
  {
    label: 'Last 90 Days',
    range: () => [dayjs().subtract(90, 'day').toDate(), dayjs().toDate()],
  },
  {
    label: 'This Year',
    range: () => [dayjs().startOf('year').toDate(), dayjs().endOf('year').toDate()],
  },
]

function formatRange(value: [Date | null, Date | null]): string {
  if (!value[0]) return ''
  const from = dayjs(value[0]).format('MMM D, YYYY')
  if (!value[1]) return from + ' – ...'
  return `${from} – ${dayjs(value[1]).format('MMM D, YYYY')}`
}

export function DateRangePickerWithPresets({ value, onChange }: DateRangePickerWithPresetsProps) {
  const [opened, { toggle, close }] = useDisclosure(false)

  const handlePreset = (range: () => [Date, Date]) => {
    onChange(range())
    close()
  }

  const handleCalendarChange = (val: [string | Date | null, string | Date | null]) => {
    const parsed: [Date | null, Date | null] = [
      val[0] ? (val[0] instanceof Date ? val[0] : new Date(val[0])) : null,
      val[1] ? (val[1] instanceof Date ? val[1] : new Date(val[1])) : null,
    ]
    onChange(parsed)
    if (parsed[0] && parsed[1]) close()
  }

  const handleClear = () => {
    onChange([null, null])
  }

  return (
    <Popover opened={opened} onClose={close} position="bottom-end" shadow="md" width="auto">
      <Popover.Target>
        <TextInput
          placeholder="Service period"
          value={formatRange(value)}
          readOnly
          onClick={toggle}
          leftSection={<IconCalendar size={16} />}
          rightSection={value[0] ? (
            <IconX size={14} style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handleClear() }} />
          ) : undefined}
          size="sm"
          style={{ width: 260, cursor: 'pointer' }}
          styles={{ input: { cursor: 'pointer' } }}
        />
      </Popover.Target>
      <Popover.Dropdown>
        <Group gap="md" align="flex-start">
          <Stack gap={4} style={{ minWidth: 120 }}>
            <Text fz="xs" fw={600} c="dimmed" mb={4}>Quick Select</Text>
            {presets.map((preset) => (
              <Button
                key={preset.label}
                variant="subtle"
                size="compact-xs"
                justify="flex-start"
                onClick={() => handlePreset(preset.range)}
              >
                {preset.label}
              </Button>
            ))}
          </Stack>
          <DatePicker
            type="range"
            value={value}
            onChange={handleCalendarChange}
          />
        </Group>
      </Popover.Dropdown>
    </Popover>
  )
}
