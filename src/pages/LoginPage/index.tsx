import { AuthLayout } from '@/features/auth/ui/AuthLayout'
import { LoginForm } from '@/features/auth/ui/LoginForm'
import { PromoPanel } from '@/shared/ui/PromoPanel'
import { Text } from '@/shared/ui/Text'
import LightBulbImage from '@/shared/assets/images/light-bulb.svg?react'

export default function LoginPage() {
  return (
    <AuthLayout
      heading={
        <Text variant="h2">
          Вход
        </Text>
      }
      promo={
        <PromoPanel
          image={<LightBulbImage />}
          title="С возвращением в SkillSwap!"
          description="Обменивайтесь знаниями и навыками с другими людьми"
        />
      }
      form={<LoginForm />}
    />
  )
}
