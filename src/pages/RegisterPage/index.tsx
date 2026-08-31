import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { SkillOffer } from '@/entities/skill/ui/SkillOffer/SkillOffer'
import { useCategories } from '@/entities/category/model/useCategories'
import { AuthLayout } from '@/features/auth/ui/AuthLayout'
import { RegisterStepOne } from '@/features/auth/ui/RegisterStepOne'
import { RegisterStepTwo } from '@/features/auth/ui/RegisterStepTwo'
import { RegisterStepThree } from '@/features/auth/ui/RegisterStepThree'
import {
  completeRegistration,
  type RegistrationSkillDraft,
  useRegistrationFlow,
} from '@/features/auth/model'
import { Modal } from '@/shared/ui/Modal'
import { Stepper } from '@/shared/ui/Stepper'
import { PromoPanel } from '@/shared/ui/PromoPanel'
import LightBulbImage from '@/shared/assets/images/light-bulb.svg?react'
import UserInfoImage from '@/shared/assets/images/user-info.svg?react'
import SchoolBoardImage from '@/shared/assets/images/school-board.svg?react'
import { ROUTES } from '@/shared/lib/constants'

const STEP_PROMO = {
  1: {
    image: <LightBulbImage />,
    title: 'Добро пожаловать в SkillSwap!',
    description: 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми',
  },
  2: {
    image: <UserInfoImage />,
    title: 'Расскажите немного о себе',
    description: 'Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена',
  },
  3: {
    image: <SchoolBoardImage />,
    title: 'Укажите, чем вы готовы поделиться',
    description: 'Так другие люди смогут увидеть ваше предложение и написать вам',
  },
} as const

export default function RegisterPage() {
  const navigate = useNavigate()
  const { categories } = useCategories()
  const [previewSkill, setPreviewSkill] = useState<RegistrationSkillDraft | null>(null)
  const { currentStep, draft, saveAccount, saveProfile, saveSkill, goNext, goBack } =
    useRegistrationFlow()

  const previewCategory = categories.find((category) => category.id === previewSkill?.categoryId)
  const previewSubcategory = previewCategory?.subcategories.find(
    (subcategory) => subcategory.id === previewSkill?.subcategoryId,
  )

  const handlePreview = (values: RegistrationSkillDraft) => {
    saveSkill(values)
    setPreviewSkill(values)
  }

  const handleCompleteRegistration = () => {
    if (!previewSkill) {
      return
    }

    const registeredUser = completeRegistration({ ...draft, skill: previewSkill })

    if (registeredUser) {
      setPreviewSkill(null)
      navigate(ROUTES.HOME)
    }
  }

  return (
    <>
      <AuthLayout
        heading={<Stepper current={currentStep} total={3} />}
        promo={<PromoPanel {...STEP_PROMO[currentStep]} />}
        form={
          currentStep === 1 ? (
            <RegisterStepOne
              initialValues={draft.account}
              onNext={(values) => {
                saveAccount(values)
                goNext()
              }}
            />
          ) : currentStep === 2 ? (
            <RegisterStepTwo
              initialValues={draft.profile}
              onBack={(values) => {
                saveProfile(values)
                goBack()
              }}
              onNext={(values) => {
                saveProfile(values)
                goNext()
              }}
            />
          ) : (
            <RegisterStepThree
              initialValues={draft.skill}
              onBack={(values) => {
                saveSkill(values)
                goBack()
              }}
              onNext={handlePreview}
            />
          )
        }
      />

      <Modal
        isOpen={previewSkill !== null}
        onClose={() => setPreviewSkill(null)}
        ariaLabel="Предпросмотр предложения"
      >
        {previewSkill && (
          <SkillOffer
            skill={previewSkill}
            variant="confirmation"
            categoryName={previewCategory?.name ?? ''}
            subcategoryName={previewSubcategory?.name ?? ''}
            onEdit={() => setPreviewSkill(null)}
            onDone={handleCompleteRegistration}
          />
        )}
      </Modal>
    </>
  )
}
