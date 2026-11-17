import { useState, useEffect, useRef } from 'react'
import { useDebouncedValue } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useClaimsStore } from '@/stores'

export function useAutoSave(claimId: string, field: string, initialValue: string) {
  const [value, setValue] = useState(initialValue)
  const [debounced] = useDebouncedValue(value, 500)
  const updateClaimField = useClaimsStore((s) => s.updateClaimField)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (debounced === initialValue) return

    updateClaimField(claimId, field, debounced)
    notifications.show({ message: 'Saved', color: 'green', autoClose: 2000 })
  }, [debounced, claimId, field, initialValue, updateClaimField])

  return {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.value),
  }
}
