import { SkillsCategories } from '@/components/widgets/SkillsCategories'
import { Container } from '@/shared/ui/Container'

import styles from './AllSkillsPage.module.css'

export default function AllSkillsPage() {
  return (
    <main className={styles.page}>
      <Container>
        <section className={styles.categoriesCard} aria-label="Все категории навыков">
          <SkillsCategories />
        </section>
      </Container>
    </main>
  )
}
