import chevronDown from '@/shared/assets/icons/chevron-down.svg'
import chevronUp from '@/shared/assets/icons/chevron-up.svg'
import { Checkbox } from '@/shared/ui/Checkbox'

import styles from './FiltersSidebar.module.css'

type SkillsFilterProps = {
  selectedSkills: string[]
  openCategory: string | null
  onToggleSkill: (skill: string) => void
  onToggleOpen: (category: string | null) => void
}

const categories = [
  {
    name: 'Бизнес и карьера',
    subcategories: [
      'Управление командой',
      'Маркетинг и реклама',
      'Продажи и переговоры',
      'Личный бренд',
      'Резюме и собеседование',
      'Тайм-менеджмент',
      'Проектное управление',
      'Предпринимательство',
    ],
  },
  {
    name: 'Творчество и искусство',
    subcategories: [
      'Рисование и иллюстрация',
      'Фотография',
      'Видеомонтаж',
      'Музыка и звук',
      'Актёрское мастерство',
      'Креативное письмо',
      'Арт-терапия',
      'Декор и DIY',
    ],
  },
  {
    name: 'Иностранные языки',
    subcategories: [
      'Английский',
      'Французский',
      'Испанский',
      'Немецкий',
      'Китайский',
      'Японский',
      'Подготовка к экзаменам (IELTS, TOEFL)',
    ],
  },
  {
    name: 'Образование и развитие',
    subcategories: [
      'Личностное развитие',
      'Навыки обучения',
      'Когнитивные техники',
      'Скорочтение',
      'Навыки преподавания',
      'Коучинг',
    ],
  },
  {
    name: 'Здоровье и лайфстайл',
    subcategories: [
      'Йога и медитация',
      'Питание и ЗОЖ',
      'Ментальное здоровье',
      'Осознанность',
      'Физические тренировки',
      'Сон и восстановление',
      'Баланс жизни и работы',
    ],
  },
  {
    name: 'Дом и уют',
    subcategories: [
      'Уборка и организация',
      'Домашние финансы',
      'Приготовление еды',
      'Домашние растения',
      'Ремонт',
      'Хранение вещей',
    ],
  },
]

export const SkillsFilter = ({
  selectedSkills,
  openCategory,
  onToggleSkill,
  onToggleOpen,
}: SkillsFilterProps) => {
  return (
    <section className={styles.group}>
      <h3 className={styles.sectionTitle}>Навыки</h3>

      <div className={styles.options}>
        {categories.map((category) => {
          const isOpen = openCategory === category.name

          const hasSelected = category.subcategories.some((skill) => selectedSkills.includes(skill))

          return (
            <div className={styles.category} key={category.name}>
              <button
                className={styles.categoryToggle}
                type="button"
                onClick={() => onToggleOpen(isOpen ? null : category.name)}
                aria-expanded={isOpen}
              >
                <span
                  className={
                    hasSelected ? styles.categoryPartialVisual : styles.categoryEmptyVisual
                  }
                  aria-hidden="true"
                />

                <span className={styles.optionText}>{category.name}</span>

                <span className={styles.chevron} aria-hidden="true">
                  <img
                    className={styles.chevronIcon}
                    src={isOpen ? chevronUp : chevronDown}
                    alt=""
                  />
                </span>
              </button>

              {isOpen && (
                <div className={styles.subcategories}>
                  {category.subcategories.map((subcategory) => (
                    <Checkbox
                      key={subcategory}
                      className={styles.option}
                      checked={selectedSkills.includes(subcategory)}
                      label={subcategory}
                      onChange={() => onToggleSkill(subcategory)}
                    />
                  ))}
                </div>
              )}
            </div>
          )
        })}

        <button className={styles.linkButton} type="button">
          <span>Все категории</span>

          <span className={styles.chevron} aria-hidden="true">
            <img className={styles.chevronIcon} src={chevronDown} alt="" />
          </span>
        </button>
      </div>
    </section>
  )
}
