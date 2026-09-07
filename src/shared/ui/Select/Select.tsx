import ReactSelect, { type SingleValue } from 'react-select'
import clsx from 'clsx'
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg?react'
import CrossIcon from '@/shared/assets/icons/cross.svg?react'
import { Text } from '@/shared/ui/Text'
import styles from './Select.module.css'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  name?: string
  label?: string
  error?: string
  placeholder?: string
  options: SelectOption[]
  value: SelectOption | null
  onChange: (value: SelectOption | null) => void
  isSearchable?: boolean
}

export const Select = ({
  name,
  label,
  error,
  placeholder,
  options,
  value,
  onChange,
  isSearchable = false,
}: SelectProps) => {
  return (
    <div className={styles.field}>
      {label && (
        <Text as="span" variant="body" className={styles.label}>
          {label}
        </Text>
      )}
      <ReactSelect<SelectOption>
        unstyled
        name={name}
        options={options}
        value={value}
        onChange={(option: SingleValue<SelectOption>) => onChange(option)}
        placeholder={placeholder}
        isSearchable={isSearchable}
        isClearable={isSearchable}
        noOptionsMessage={() => 'Ничего не найдено'}
        classNames={{
          control: (state) =>
            clsx(
              styles.control,
              error && styles.controlError,
              state.isFocused && styles.controlFocused,
              state.selectProps.menuIsOpen && styles.controlOpen,
            ),
          placeholder: () => styles.placeholder,
          input: () => styles.input,
          singleValue: () => styles.singleValue,
          menu: () => styles.menu,
          menuList: () => styles.menuList,
          option: (state) =>
            clsx(
              styles.option,
              state.isFocused && styles.optionFocused,
              state.isSelected && styles.optionSelected,
            ),
          noOptionsMessage: () => styles.noOptions,
        }}
        components={{
          DropdownIndicator: (props) => {
            if (props.hasValue && props.selectProps.isClearable) return null
            return (
              <ChevronDownIcon
                className={clsx(styles.chevron, props.selectProps.menuIsOpen && styles.chevronOpen)}
                aria-hidden="true"
              />
            )
          },
          ClearIndicator: (props) => (
            <button
              type="button"
              className={styles.clearButton}
              onMouseDown={(event) => event.stopPropagation()}
              onClick={() => props.clearValue()}
              aria-label="Очистить"
            >
              <CrossIcon className={styles.clearIcon} aria-hidden="true" />
            </button>
          ),
          IndicatorSeparator: () => null,
        }}
      />
      {error && (
        <Text as="span" variant="caption" className={styles.error}>
          {error}
        </Text>
      )}
    </div>
  )
}
