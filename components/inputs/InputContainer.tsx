import { es } from 'date-fns/locale'
import { Controller, ControllerProps } from 'react-hook-form'
//import DatePicker from 'react-datepicker'
//import 'react-datepicker/dist/react-datepicker.css'
import React from 'react'
import { addDays, subDays } from 'date-fns'
import { OVINE_DAYS } from 'FARM_CONFIG/FARM_DATES'
import InfoBadge, { InfoBadgeType } from '@comps/Badges/InfoBadge'
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

export interface SelectOption {
  label?: string
  value?: string | number
}
export interface ColorizeRangeDates {
  start: any
  end: any
  color: string
}
export interface CustomInputTypes
  extends Partial<Pick<HTMLInputElement, 'step' | 'disabled' | 'checked'>> {
  name: string
  min?: any
  max?: any
  type:
    | 'date'
    | 'text'
    | 'datetime'
    | 'select'
    | 'checkbox'
    | 'textarea'
    //| 'radio'
    | 'number'
  // | 'date-inline'
  label?: string
  selectOptions?: SelectOption[]
  placeholder?: string
  rules?: ControllerProps['rules']
  className?: string
  inputClassName?: string
  defaultChecked?: boolean
  onClickAlreadyExist?: (earring: string) => void
  datesRangeColor?: ColorizeRangeDates[]
  infoBadge?: InfoBadgeType
  // checked?: boolean
}

const InputContainer = ({
  name,
  type = 'text',
  label,
  selectOptions,
  placeholder,
  rules,
  className,
  inputClassName,
  defaultChecked,
  onClickAlreadyExist,
  datesRangeColor,
  infoBadge,
  // checked,
  ...rest
}: CustomInputTypes) => {
  return (
    <Controller
      rules={rules}
      name={name}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { isTouched, isDirty, error },
        formState: { defaultValues }
      }) => (
        <div className="my-2">
          {['text'].includes(type) && (
            <>
              <TextField
                label={label}
                type={type}
                onBlur={onBlur} // notify when input is touched
                onChange={onChange} // send value to hook form
                placeholder={placeholder}
                value={value ?? ''}
                ref={ref}
                {...rest}
              />
            </>
          )}
          {type === 'number' && (
            <>
              <TextField
                label={label}
                type={'number'}
                onBlur={onBlur} // notify when input is touched
                onChange={onChange} // send value to hook form
                placeholder={placeholder}
                value={value ?? 0}
                {...rest}
              />
            </>
          )}
          {type === 'date' && (
            <>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  format="dd / MMM / yy"
                  label={label}
                  onChange={(event) => {
                    onChange(event)
                  }}
                  inputRef={ref}
                  value={value}
                  {...rest}
                />
              </LocalizationProvider>
            </>
          )}

          {type === 'select' && (
            <>
              <FormControl sx={{ minWidth: 120, width: '100%' }}>
                <InputLabel id="demo-simple-select-standard-label">
                  {label || placeholder}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  onChange={onChange}
                  ref={ref}
                  {...rest}
                  label={label}
                  //  label={placeholder || 'Seleccionar'}
                >
                  {selectOptions?.map(({ value, label }: SelectOption) => (
                    <MenuItem key={label} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
          {type === 'checkbox' && (
            <>
              <label className="flex items-center">
                <input
                  type={'checkbox'}
                  className={`checkbox checkbox-xs ${inputClassName}`}
                  onChange={onChange}
                  onBlur={onBlur}
                  name={name}
                  ref={ref}
                  value={value}
                  defaultChecked={defaultChecked}
                  // checked={checked}
                  {...rest}
                />
                <span>{label}</span>
              </label>
            </>
          )}
          {type === 'textarea' && (
            <TextField
              multiline
              minRows={3}
              fullWidth
              // className="textarea input-bordered resize-none"
              onBlur={onBlur} // notify when input is touched
              onChange={onChange} // send value as number
              placeholder={placeholder}
              value={value ?? ''}
              {...rest}
            />
          )}
          {error?.type && (
            <span className="label-text text-alt text-error whitespace-pre-line text-xs">
              {error?.message}
              {error?.type === 'alreadyExist' && (
                <span
                  className="ml-2 link"
                  onClick={(e) => onClickAlreadyExist?.(value)}
                >
                  ver
                </span>
              )}
            </span>
          )}
        </div>
      )}
    />
  )
}

export default InputContainer
