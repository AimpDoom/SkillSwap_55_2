import { useState } from 'react'
import { AuthLayout } from '@/features/auth/ui/AuthLayout'
import { RegisterStepOne } from '@/features/auth/ui/RegisterStepOne'
import { RegisterStepTwo } from '@/features/auth/ui/RegisterStepTwo'
import { RegisterStepThree } from '@/features/auth/ui/RegisterStepThree'
import { Stepper } from '@/shared/ui/Stepper'
import { PromoPanel } from '@/shared/ui/PromoPanel'
import LightBulbImage from '@/shared/assets/images/light-bulb.svg?react'
import UserInfoImage from '@/shared/assets/images/user-info.svg?react'
import SchoolBoardImage from '@/shared/assets/images/school-board.svg?react'

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
  const [step, setStep] = useState<1 | 2 | 3>(1)

  return (
    <AuthLayout
      heading={<Stepper current={step} total={3} />}
      promo={<PromoPanel {...STEP_PROMO[step]} />}
      form={
        step === 1 ? (
          <RegisterStepOne onNext={() => setStep(2)} />
        ) : step === 2 ? (
          <RegisterStepTwo onBack={() => setStep(1)} onNext={() => setStep(3)} />
        ) : (
          <RegisterStepThree onBack={() => setStep(2)} onNext={() => {}} />
        )
      }
    />
  )
}
