import { SkillsCategories } from '@/components/widgets/SkillsCategories'

import styles from './AllSkillsDropdown.module.css'

export function AllSkillsDropdown() {
  return (
    <div className={styles.dropdown} role="region" aria-label="Все категории навыков">
      <SkillsCategories />
    </div>
  )
}
