import { es } from 'date-fns/locale'
import { Controller, ControllerProps } from 'react-hook-form'
//import DatePicker from 'react-datepicker'
//import 'react-datepicker/dist/react-datepicker.css'
import React from 'react'
import { InfoBadgeType } from '@comps/Badges/InfoBadge'
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  TextFieldProps
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
    | 'radios'
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
  radioOpts?: {
    value: string | number
    label: string
    defaultChecked?: boolean
  }[]
  defaultValue?: string
  containerClassName?: string
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
  radioOpts,
  defaultValue = '',
  containerClassName,
  // checked,
  ...rest
}: CustomInputTypes & Partial<Pick<TextFieldProps, 'size' | 'fullWidth'>>) => {
  return (
    <Controller
      rules={rules}
      name={name}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { isTouched, isDirty, error },
        formState: { defaultValues }
      }) => (
        <div className={`my-2 ${containerClassName} `}>
          {['text'].includes(type) && (
            <>
              <TextField
                fullWidth
                className={className}
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
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={es}
              >
                <DatePicker
                  className="w-full min-w-[100px]"
                  format="dd / MMM / yy"
                  label={label}
                  onChange={(event) => {
                    onChange(event)
                  }}
                  inputRef={ref}
                  value={new Date(value)}
                  minDate={rest.min}
                  maxDate={rest.max}
                  {...rest}
                />
              </LocalizationProvider>
            </>
          )}

          {type === 'select' && (
            <>
              <FormControl sx={{ minWidth: 100, width: '100%' }}>
                <InputLabel id="demo-simple-select-standard-label">
                  {label || placeholder}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-standard-label"
                  onChange={onChange}
                  ref={ref}
                  {...rest}
                  label={label}
                  defaultValue={defaultValue}
                  //  label={placeholder || 'Seleccionar'}
                >
                  {selectOptions?.map(({ value, label }: SelectOption) => (
                    <MenuItem key={value} value={value}>
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
                  className={`checkbox checkbox-sm ${inputClassName}`}
                  onChange={onChange}
                  onBlur={onBlur}
                  name={name}
                  ref={ref}
                  value={value}
                  defaultChecked={defaultChecked}
                  disabled={rest.disabled}
                  checked={rest.checked}
                  // checked={checked}
                  //{...rest}
                />
                <span className="bg-transparent">{label}</span>
              </label>
              {/* <FormControlLabel
                control={<Checkbox />}
                size="small"
                defaultChecked={defaultChecked}
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                value={rest?.checked}
                ref={ref}
                label={label}
                {...rest}
              /> */}
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

          {type === 'radios' && (
            <>
              <div className="text-center">
                <span className="label-text">{label}</span>
              </div>
              <div className="flex flex-col gap-1 font-semibold">
                {radioOpts?.map((radio) => (
                  <span
                    key={radio.label}
                    className="flex  w-full justify-end p-0 text-xs "
                  >
                    {radio.label}
                    <input
                      type="radio"
                      onChange={onChange}
                      onBlur={onBlur}
                      name={name}
                      ref={ref}
                      value={radio.value}
                      checked={value === radio.value}
                      //defaultChecked={radio?.defaultChecked}
                      //{...rest}
                    />
                  </span>
                ))}

                {/* {error?.message && (
                  <span className="text-error label-text text-xs whitespace-pre-line">
                    {error.message}
                  </span>
                )} */}
              </div>
            </>
          )}
          <div>
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
        </div>
      )}
    />
  )
}

export default InputContainer
