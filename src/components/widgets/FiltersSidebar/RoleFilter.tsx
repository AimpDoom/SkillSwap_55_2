import { Radio } from '@/shared/ui/Radio'

import type { RoleValue } from './FiltersSidebar'
import styles from './FiltersSidebar.module.css'

type RoleFilterProps = {
  value: RoleValue
  onChange: (value: RoleValue) => void
}

const roles: Array<{
  label: string
  value: RoleValue
}> = [
  {
    label: 'Всё',
    value: 'all',
  },
  {
    label: 'Хочу научиться',
    value: 'learn',
  },
  {
    label: 'Могу научить',
    value: 'teach',
  },
]

export const RoleFilter = ({ value, onChange }: RoleFilterProps) => {
  return (
    <section className={styles.options} aria-label="Тип обмена">
      {roles.map((role) => (
        <Radio
          key={role.value}
          className={styles.option}
          name="role"
          value={role.value}
          checked={value === role.value}
          label={role.label}
          onChange={() => onChange(role.value)}
        />
      ))}
    </section>
  )
}
