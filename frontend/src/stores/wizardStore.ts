import { create } from 'zustand'

interface WizardState {
  step: number
  businessName: string
  description: string
  vibe: string
  template: string
  domainSlug: string
  logo: string | null
  setStep: (step: number) => void
  setField: (field: string, value: string | null) => void
  reset: () => void
}

const initialState = {
  step: 1,
  businessName: '',
  description: '',
  vibe: '',
  template: 'business',
  domainSlug: '',
  logo: null
}

export const useWizardStore = create<WizardState>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  reset: () => set(initialState)
}))
