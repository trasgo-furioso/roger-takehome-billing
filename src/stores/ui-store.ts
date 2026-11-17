import { create } from 'zustand'

interface UIState {
  patientSearch: string
  dateRange: [string | null, string | null]

  setPatientSearch: (value: string) => void
  setDateRange: (range: [string | null, string | null]) => void
  clearFilters: () => void
  hasActiveFilters: () => boolean
}

export const useUIStore = create<UIState>()((set, get) => ({
  patientSearch: '',
  dateRange: [null, null],

  setPatientSearch: (value) => set({ patientSearch: value }),

  setDateRange: (range) => set({ dateRange: range }),

  clearFilters: () => set({ patientSearch: '', dateRange: [null, null] }),

  hasActiveFilters: () => {
    const state = get()
    return state.patientSearch !== '' || state.dateRange[0] !== null || state.dateRange[1] !== null
  },
}))
