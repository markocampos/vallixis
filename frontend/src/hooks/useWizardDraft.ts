import { useEffect } from 'react'
import { useWizardStore } from '../stores/wizardStore'

const DRAFT_KEY = 'vallixis_wizard_draft'

export function useWizardDraft() {
  const store = useWizardStore()

  // Save draft on every field change
  useEffect(() => {
    const draft = {
      businessName: store.businessName,
      description: store.description,
      vibe: store.vibe,
      template: store.template,
      domainSlug: store.domainSlug
    }
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    } catch {
      // ignore
    }
  }, [store.businessName, store.description, store.vibe, store.template, store.domainSlug])

  // Restore draft on mount
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY)
      if (!raw) return
      const draft = JSON.parse(raw)
      if (draft.businessName) store.setField('businessName', draft.businessName)
      if (draft.description) store.setField('description', draft.description)
      if (draft.vibe) store.setField('vibe', draft.vibe)
      if (draft.template) store.setField('template', draft.template)
      if (draft.domainSlug) store.setField('domainSlug', draft.domainSlug)
    } catch {
      // ignore
    }
  }, [])

  const clearDraft = () => {
    try { sessionStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
  }

  return { clearDraft }
}
