import { useEffect, useState } from 'react'
import { fetchCategories } from '@/api/skills'
import type { SkillCategory } from './types'

export function useCategories() {
  const [categories, setCategories] = useState<SkillCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetchCategories()
      .then((data) => {
        if (!cancelled) setCategories(data)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { categories, isLoading }
}
