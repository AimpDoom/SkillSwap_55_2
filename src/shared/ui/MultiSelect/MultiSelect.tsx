import ReactSelect, { type MultiValue, type ValueContainerProps } from 'react-select'
import clsx from 'clsx'
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg?react'
import { Checkbox } from '@/shared/ui/Checkbox'
import { Text } from '@/shared/ui/Text'
import styles from './MultiSelect.module.css'

export interface MultiSelectOption {
  value: string
  label: string
}

export interface MultiSelectProps {
  label?: string
  error?: string
  placeholder?: string
  options: MultiSelectOption[]
  value: MultiSelectOption[]
  onChange: (value: MultiSelectOption[]) => void
}

const ValueContainer = (props: ValueContainerProps<MultiSelectOption, true>) => {
  const count = props.getValue().length

  return (
    <div className={styles.valueContainer}>
      {count > 0 ? (
        <Text as="span" variant="body" className={styles.summary}>
          Выбрано: {count}
        </Text>
      ) : (
        <Text as="span" variant="body" className={styles.placeholder}>
          {props.selectProps.placeholder}
        </Text>
      )}
      {props.children}
    </div>
  )
}

export const MultiSelect = ({
  label,
  error,
  placeholder,
  options,
  value,
  onChange,
}: MultiSelectProps) => {
  return (
    <div className={styles.field}>
      {label && (
        <Text as="span" variant="body" className={styles.label}>
          {label}
        </Text>
      )}
      <ReactSelect<MultiSelectOption, true>
        unstyled
        isMulti
        options={options}
        value={value}
        onChange={(selected: MultiValue<MultiSelectOption>) => onChange([...selected])}
        placeholder={placeholder}
        hideSelectedOptions={false}
        closeMenuOnSelect={false}
        isSearchable={false}
        isClearable={false}
        noOptionsMessage={() => 'Ничего не найдено'}
        classNames={{
          control: (state) =>
            clsx(
              styles.control,
              error && styles.controlError,
              state.isFocused && styles.controlFocused,
              state.selectProps.menuIsOpen && styles.controlOpen,
            ),
          input: () => styles.input,
          menu: () => styles.menu,
          menuList: () => styles.menuList,
          noOptionsMessage: () => styles.noOptions,
        }}
        components={{
          ValueContainer,
          DropdownIndicator: (props) => (
            <ChevronDownIcon
              className={clsx(styles.chevron, props.selectProps.menuIsOpen && styles.chevronOpen)}
            />
          ),
          IndicatorSeparator: () => null,
          MultiValue: () => null,
          Placeholder: () => null,
          Option: (props) => (
            <div
              ref={props.innerRef}
              {...props.innerProps}
              className={clsx(styles.option, props.isFocused && styles.optionFocused)}
            >
              <Checkbox checked={props.isSelected} readOnly label={props.label} />
            </div>
          ),
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
