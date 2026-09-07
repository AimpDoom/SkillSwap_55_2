import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { fetchSkills } from '@/api/skills'
import type { Skill } from '@/entities/skill'
import { ROUTES } from '@/shared/lib/constants'
import { Input } from '@/shared/ui/Input'

import styles from './SearchBar.module.css'

const MAX_SUGGESTIONS_COUNT = 7

export function SearchBar() {
  const location = useLocation()
  const navigate = useNavigate()

  const searchRef = useRef<HTMLDivElement>(null)

  const [skills, setSkills] = useState<Skill[]>([])
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false)

  const searchValue = new URLSearchParams(location.search).get('search') ?? ''

  useEffect(() => {
    let isMounted = true

    const loadSkills = async () => {
      try {
        const loadedSkills = await fetchSkills()

        if (isMounted) {
          setSkills(loadedSkills)
        }
      } catch {
        if (isMounted) {
          setSkills([])
        }
      }
    }

    void loadSkills()

    return () => {
      isMounted = false
    }
  }, [])

  const suggestions = useMemo(() => {
    const normalizedQuery = searchValue.trim().toLocaleLowerCase('ru-RU')

    if (!normalizedQuery) {
      return []
    }

    const uniqueTitles = new Map<string, string>()

    skills.forEach((skill) => {
      const normalizedTitle = skill.title.trim().toLocaleLowerCase('ru-RU')

      if (normalizedTitle.includes(normalizedQuery) && !uniqueTitles.has(normalizedTitle)) {
        uniqueTitles.set(normalizedTitle, skill.title.trim())
      }
    })

    return Array.from(uniqueTitles.values()).slice(0, MAX_SUGGESTIONS_COUNT)
  }, [searchValue, skills])

  const updateSearch = (value: string) => {
    const searchParams = new URLSearchParams()

    if (value.trim().length > 0) {
      searchParams.set('search', value)
    }

    const nextSearch = searchParams.toString()

    navigate(
      {
        pathname: ROUTES.HOME,
        search: nextSearch ? `?${nextSearch}` : '',
      },
      {
        replace: location.pathname === ROUTES.HOME,
      },
    )
  }

  const handleSearchChange = (value: string) => {
    updateSearch(value)

    setIsSuggestionsOpen(value.trim().length > 0)
  }

  const handleSuggestionSelect = (title: string) => {
    updateSearch(title)
    setIsSuggestionsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSuggestionsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSuggestionsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    if (!searchValue.trim()) {
      setIsSuggestionsOpen(false)
    }
  }, [searchValue])

  const shouldShowSuggestions =
    isSuggestionsOpen && searchValue.trim().length > 0 && suggestions.length > 0

  return (
    <div ref={searchRef} className={styles.searchWrapper}>
      <Input
        className={styles.search}
        type="search"
        value={searchValue}
        placeholder="Искать навык"
        aria-label="Искать навык"
        startIcon={<span className={styles.icon} />}
        onChange={(event) => handleSearchChange(event.target.value)}
        onFocus={() => {
          if (searchValue.trim()) {
            setIsSuggestionsOpen(true)
          }
        }}
      />

      {shouldShowSuggestions && (
        <ul className={styles.suggestions} aria-label="Подсказки навыков">
          {suggestions.map((title) => (
            <li className={styles.suggestionItem} key={title}>
              <button
                className={styles.suggestionButton}
                type="button"
                onClick={() => handleSuggestionSelect(title)}
              >
                {title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
