import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

import { CityFilter } from './CityFilter'
import { GenderFilter } from './GenderFilter'
import { RoleFilter } from './RoleFilter'
import { SkillsFilter } from './SkillsFilter'
import {
  INITIAL_CATALOG_FILTERS,
  type CatalogFilters,
  type GenderValue,
  type RoleValue,
} from './types'
import styles from './FiltersSidebar.module.css'

type FiltersSidebarProps = {
  filters: CatalogFilters
  onChange: Dispatch<SetStateAction<CatalogFilters>>
}

export const FiltersSidebar = ({ filters, onChange }: FiltersSidebarProps) => {
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  const { role, gender, selectedSkills, selectedCities } = filters

  const changeRole = (value: RoleValue) => {
    onChange((current) => ({
      ...current,
      role: value,
    }))
  }

  const changeGender = (value: GenderValue) => {
    onChange((current) => ({
      ...current,
      gender: value,
    }))
  }

  const toggleSkill = (skill: string) => {
    onChange((current) => ({
      ...current,
      selectedSkills: current.selectedSkills.includes(skill)
        ? current.selectedSkills.filter((item) => item !== skill)
        : [...current.selectedSkills, skill],
    }))
  }

  const toggleCity = (city: string) => {
    onChange((current) => ({
      ...current,
      selectedCities: current.selectedCities.includes(city)
        ? current.selectedCities.filter((item) => item !== city)
        : [...current.selectedCities, city],
    }))
  }

  const activeFiltersCount =
    Number(role !== 'all') +
    selectedSkills.length +
    Number(gender !== 'any') +
    selectedCities.length

  const resetFilters = () => {
    onChange(INITIAL_CATALOG_FILTERS)
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
              <span className={styles.resetIcon} aria-hidden="true" />
            </span>
          </button>
        )}
      </div>

      <div className={styles.filters}>
        <RoleFilter value={role} onChange={changeRole} />

        <SkillsFilter
          selectedSkills={selectedSkills}
          openCategory={openCategory}
          onToggleSkill={toggleSkill}
          onToggleOpen={setOpenCategory}
        />

        <GenderFilter value={gender} onChange={changeGender} />

        <CityFilter selectedCities={selectedCities} onToggleCity={toggleCity} />
      </div>
    </aside>
  )
}
