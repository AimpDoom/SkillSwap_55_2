import styles from './user-info.module.css'
import { calculateAge } from '@/shared/lib/helpers'
import { fetchCityById } from '@/api/cities'
import { useEffect, useState } from 'react'
import type { City } from '@/entities/city/model/types'
import { yearSpell } from '@/shared/lib/helpers'

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
      <h2 className={styles.userName}>{name}</h2>
      <p className={styles.userDetails}>
        {city?.name}, {age} {yearSpell(age)}
      </p>
    </div>
  )
}
