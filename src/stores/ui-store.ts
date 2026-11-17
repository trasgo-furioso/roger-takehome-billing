import { create } from 'zustand'

interface UIState {
  expandedCardId: string | null
  expandedCardMode: 'readiness' | 'payment' | null

  expandCard: (claimId: string, mode: 'readiness' | 'payment') => void
  collapseCard: () => void
}

export const useUIStore = create<UIState>()((set) => ({
  expandedCardId: null,
  expandedCardMode: null,

  expandCard: (claimId, mode) =>
    set({ expandedCardId: claimId, expandedCardMode: mode }),

  collapseCard: () =>
    set({ expandedCardId: null, expandedCardMode: null }),
}))
