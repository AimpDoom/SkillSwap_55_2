import styles from './user-info.module.css'
import { calculateAge } from '@/shared/lib/helpers'
import { fetchCityById } from '@/api/cities'
import { useEffect, useState } from 'react'
import type { City } from '@/entities/city/model/types'
import { yearSpell } from '@/shared/lib/helpers'
import { Text } from '@/shared/ui/Text'

export const UserInfo = ({
  name,
  cityId,
  birthDate,
}: {
  name: string
  cityId: string
  birthDate: string
}) => {
  const [city, setCity] = useState<City | null>(null)
  useEffect(() => {
    const fetchData = async () => {
      const cityData = await fetchCityById(cityId)
      if (cityData) setCity(cityData)
    }
    fetchData()
  }, [cityId])

  const age = calculateAge(birthDate)
  return (
    <div className={styles.userInfoContainer}>
      <Text variant="h2" className={styles.userName}>{name}</Text>
      <Text variant="body" className={styles.userDetails}>
        {city?.name}, {age} {yearSpell(age)}
      </Text>
    </div>
  )
}
