import { useEffect, useRef, useState } from 'react'

import { AllSkillsDropdown } from './AllSkillsDropdown'
import styles from './Navigation.module.css'

export function Navigation() {
  const [isSkillsOpen, setIsSkillsOpen] = useState(false)
  const skillsMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (skillsMenuRef.current && !skillsMenuRef.current.contains(event.target as Node)) {
        setIsSkillsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSkillsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <nav className={styles.navigation} aria-label="Основная навигация">
      <a className={styles.link} href="#about">
        О проекте
      </a>

      <div ref={skillsMenuRef}>
        <button
          className={styles.skillsButton}
          type="button"
          onClick={() => setIsSkillsOpen((current) => !current)}
          aria-expanded={isSkillsOpen}
          aria-haspopup="true"
        >
          <span>Все навыки</span>

          <svg className={styles.chevron} viewBox="0 0 16 16" aria-hidden="true">
            <path d="m4.5 6 3.5 3.5L11.5 6" />
          </svg>
        </button>

        {isSkillsOpen && <AllSkillsDropdown />}
      </div>
    </nav>
  )
}
