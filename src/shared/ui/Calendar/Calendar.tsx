import { useEffect, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { ru } from 'react-day-picker/locale'
import clsx from 'clsx'
import CalendarIcon from '@/shared/assets/icons/calendar.svg?react'
import { Button } from '@/shared/ui/Button'
import { Text } from '@/shared/ui/Text'
import styles from './Calendar.module.css'

export interface CalendarProps {
  label?: string
  error?: string
  placeholder?: string
  value: Date | null
  onChange: (value: Date | null) => void
}

const formatDate = (date: Date) =>
  date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })

export const Calendar = ({ label, error, placeholder = 'дд.мм.гггг', value, onChange }: CalendarProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [draft, setDraft] = useState<Date | undefined>(value ?? undefined)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleOpen = () => {
    setDraft(value ?? undefined)
    setIsOpen(true)
  }

  const handleCancel = () => setIsOpen(false)

  const handleConfirm = () => {
    onChange(draft ?? null)
    setIsOpen(false)
  }

  return (
    <div className={styles.field} ref={wrapperRef}>
      {label && (
        <Text as="span" variant="body" className={styles.label}>
          {label}
        </Text>
      )}
      <div className={styles.wrapper}>
        <button type="button" className={clsx(styles.trigger, error && styles.triggerError)} onClick={handleOpen}>
          <Text as="span" variant="body" className={clsx(styles.value, !value && styles.placeholder)}>
            {value ? formatDate(value) : placeholder}
          </Text>
          <CalendarIcon className={styles.icon} />
        </button>

        {isOpen && (
          <div className={styles.popover}>
            <DayPicker
              mode="single"
              locale={ru}
              captionLayout="dropdown"
              selected={draft}
              onSelect={setDraft}
              defaultMonth={draft ?? new Date(2000, 0)}
              startMonth={new Date(1930, 0)}
              endMonth={new Date()}
              showOutsideDays
              components={{
                Nav: () => <></>,
              }}
              classNames={{
                months: styles.months,
                month: styles.month,
                month_caption: styles.monthCaption,
                dropdowns: styles.dropdowns,
                dropdown_root: styles.dropdownRoot,
                dropdown: styles.dropdown,
                caption_label: styles.captionLabel,
                chevron: styles.chevron,
                month_grid: styles.monthGrid,
                weekdays: styles.weekdays,
                weekday: styles.weekday,
                week: styles.week,
                day: styles.day,
                day_button: styles.dayButton,
                selected: styles.daySelected,
                today: styles.dayToday,
                outside: styles.dayOutside,
                disabled: styles.dayDisabled,
              }}
            />
            <div className={styles.actions}>
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Отменить
              </Button>
              <Button type="button" variant="primary" onClick={handleConfirm}>
                Выбрать
              </Button>
            </div>
          </div>
        )}
      </div>
      {error && (
        <Text as="span" variant="caption" className={styles.error}>
          {error}
        </Text>
      )}
    </div>
  )
}
