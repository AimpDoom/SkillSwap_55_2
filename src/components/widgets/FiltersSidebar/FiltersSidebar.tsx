import { useState } from 'react'

import crossIcon from '@/shared/assets/icons/cross.svg'

import { CityFilter } from './CityFilter'
import { GenderFilter } from './GenderFilter'
import { RoleFilter } from './RoleFilter'
import { SkillsFilter } from './SkillsFilter'
import styles from './FiltersSidebar.module.css'

export type RoleValue = 'all' | 'learn' | 'teach'
export type GenderValue = 'any' | 'male' | 'female'

export const FiltersSidebar = () => {
  const [role, setRole] = useState<RoleValue>('all')
  const [gender, setGender] = useState<GenderValue>('any')

  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>([])

  const [openCategory, setOpenCategory] = useState<string | null>(null)

  const toggleSkill = (skill: string) => {
    setSelectedSkills((current) =>
      current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill],
    )
  }

  const toggleCity = (city: string) => {
    setSelectedCities((current) =>
      current.includes(city) ? current.filter((item) => item !== city) : [...current, city],
    )
  }

  const activeFiltersCount =
    Number(role !== 'all') +
    selectedSkills.length +
    Number(gender !== 'any') +
    selectedCities.length

  const resetFilters = () => {
    setRole('all')
    setGender('any')
    setSelectedSkills([])
    setSelectedCities([])
    setOpenCategory(null)
  }

  return (
    <aside className={styles.sidebar} aria-label="Фильтры каталога">
      <div className={styles.header}>
        <h2 className={styles.title}>
          Фильтры
          {activeFiltersCount > 0 && ` (${activeFiltersCount})`}
        </h2>

        {activeFiltersCount > 0 && (
          <button className={styles.resetButton} type="button" onClick={resetFilters}>
            <span>Сбросить</span>

            <span className={styles.resetIconBox} aria-hidden="true">
              <img className={styles.resetIcon} src={crossIcon} alt="" />
            </span>
          </button>
        )}
      </div>

      <div className={styles.filters}>
        <RoleFilter value={role} onChange={setRole} />

        <SkillsFilter
          selectedSkills={selectedSkills}
          openCategory={openCategory}
          onToggleSkill={toggleSkill}
          onToggleOpen={setOpenCategory}
        />

        <GenderFilter value={gender} onChange={setGender} />

        <CityFilter selectedCities={selectedCities} onToggleCity={toggleCity} />
      </div>
    </aside>
  )
}
