import { useEffect, useState } from 'react'
import { fetchCities } from '@/api/cities'
import type { City } from './types'

export function useCities() {
  const [cities, setCities] = useState<City[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetchCities()
      .then((data) => {
        if (!cancelled) setCities(data)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { cities, isLoading }
}
