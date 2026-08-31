import { useState } from 'react'

import type {
  AuthFormValues,
  RegistrationDraft,
  RegistrationProfileDraft,
  RegistrationSkillDraft,
  RegistrationStep,
} from './types'

const INITIAL_REGISTRATION_DRAFT: RegistrationDraft = {
  account: null,
  profile: null,
  skill: null,
}

export function useRegistrationFlow() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1)

  const [draft, setDraft] = useState<RegistrationDraft>(INITIAL_REGISTRATION_DRAFT)

  const saveAccount = (values: AuthFormValues) => {
    setDraft((current) => ({
      ...current,
      account: values,
    }))
  }

  const saveProfile = (values: RegistrationProfileDraft) => {
    setDraft((current) => ({
      ...current,
      profile: values,
    }))
  }

  const saveSkill = (values: RegistrationSkillDraft) => {
    setDraft((current) => ({
      ...current,
      skill: values,
    }))
  }

  const goToStep = (step: RegistrationStep) => {
    setCurrentStep(step)
  }

  const goNext = () => {
    setCurrentStep((current) => (current < 3 ? ((current + 1) as RegistrationStep) : current))
  }

  const goBack = () => {
    setCurrentStep((current) => (current > 1 ? ((current - 1) as RegistrationStep) : current))
  }

  const reset = () => {
    setCurrentStep(1)
    setDraft(INITIAL_REGISTRATION_DRAFT)
  }

  return {
    currentStep,
    draft,
    saveAccount,
    saveProfile,
    saveSkill,
    goToStep,
    goNext,
    goBack,
    reset,
  }
}
