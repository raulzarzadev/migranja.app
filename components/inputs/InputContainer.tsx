import { es } from 'date-fns/locale'
import { Controller, ControllerProps } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import React from 'react'
import { addDays, subDays } from 'date-fns'
import { OVINE_DAYS } from 'FARM_CONFIG/FARM_DATES'
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
  extends Partial<Pick<HTMLInputElement, 'step' | 'disabled'>> {
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
  label?: string
  selectOptions?: SelectOption[]
  placeholder?: string
  rules?: ControllerProps['rules']
  className?: string
  inputClassName?: string
  defaultChecked?: boolean
  onClickAlreadyExist?: (earring: string) => void
  datesRangeColor?: ColorizeRangeDates[]
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
        <label className={`form-control ${className ?? ''}`}>
          {label && <span className="label-text">{label}</span>}
          {['text'].includes(type) && (
            <input
              className="input input-bordered input-sm bg-transparent"
              type={type}
              onBlur={onBlur} // notify when input is touched
              onChange={onChange} // send value to hook form
              placeholder={placeholder}
              value={value ?? ''}
              {...rest}
            />
          )}
          {type === 'number' && (
            <input
              className="input input-bordered input-sm bg-transparent"
              type={type}
              onBlur={onBlur} // notify when input is touched
              onChange={(e) => onChange(parseFloat(e.target.value || ''))} // send value as number
              placeholder={placeholder}
              value={value ?? ''}
              {...rest}
            />
          )}
          {type === 'date' && (
            <div className="">
              <DatePicker
                onBlur={onBlur}
                className="input input-bordered input-sm w-full bg-transparent"
                selected={value ? new Date(value) : new Date()}
                onChange={(date: Date) => onChange(date)}
                //onBlur={onBlur}
                // closeOnScroll
                locale={es}
                dateFormat="dd-MM-yy"
                ref={ref}
                name={name}
                minDate={rest?.min as unknown as Date}
                maxDate={rest?.max as unknown as Date}
                dayClassName={(date) => {
                  const plusMinusDays = OVINE_DAYS.gestationTolerance
                  const res = datesRangeColor
                    ?.map(({ start, end, color }) => {
                      if (
                        subDays(start, plusMinusDays).getTime() <=
                          date.getTime() &&
                        date.getTime() <= addDays(end, plusMinusDays).getTime()
                      )
                        return color
                    })
                    .join(' ')
                  return res || ' '
                }}
                {...rest}
              />
            </div>
          )}
          {type === 'select' && (
            <select
              className="input input-bordered input-sm bg-transparent"
              onChange={onChange}
              onBlur={onBlur}
              name={name}
              ref={ref}
              value={value}
            >
              <option value="">{placeholder ?? 'Select'}</option>
              {selectOptions?.map(({ value, label }: SelectOption) => (
                <option key={label} value={value}>
                  {label}
                </option>
              ))}
            </select>
          )}
          {type === 'checkbox' && (
            <>
              <input
                type={'checkbox'}
                className={`checkbox ${inputClassName}`}
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                ref={ref}
                value={value}
                defaultChecked={defaultChecked}
                {...rest}
              />
            </>
          )}
          {type === 'textarea' && (
            <textarea
              className="textarea input-bordered resize-none"
              onBlur={onBlur} // notify when input is touched
              onChange={onChange} // send value as number
              placeholder={placeholder}
              value={value ?? ''}
              {...rest}
            />
          )}
          {error?.type && (
            <span className="label-text text-alt text-error ">
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
        </label>
      )}
    />
  )
}

export default InputContainer
