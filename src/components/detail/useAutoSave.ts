import { useState, useRef } from 'react'
import { notifications } from '@mantine/notifications'
import { useClaimsStore } from '@/stores'

export function useAutoSave(claimId: string, field: string, initialValue: string) {
  const [value, setValue] = useState(initialValue)
  const updateClaimField = useClaimsStore((s) => s.updateClaimField)
  const initialRef = useRef(initialValue)

  const handleBlur = () => {
    if (value === initialRef.current) return
    updateClaimField(claimId, field, value)
    initialRef.current = value
    notifications.show({ message: 'Saved', color: 'green', autoClose: 2000 })
  }

  return {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.currentTarget.value),
    onBlur: handleBlur,
  }
}
