import { tr } from 'date-fns/locale'
import { Controller, ControllerProps } from 'react-hook-form'
import { myFormatDate } from 'utils/dates/myDateUtils'

export interface SelectOption {
  label?: string
  value?: string | number
}
const InputContainer = ({
  name,
  type = 'text',
  label,
  selectOptions,
  placeholder,
  rules,
  ...rest
}: {
  name: string
  type:
    | 'date'
    | 'text'
    | 'datetime'
    | 'select'
    | 'checkbox'
    | 'radio'
    | 'number'
  label?: string
  selectOptions?: SelectOption[]
  placeholder?: string
  rules?: ControllerProps['rules']
}) => {
  return (
    <Controller
      //control={control}
      rules={rules}
      name={name}
      render={({
        field: { onChange, onBlur, value, name, ref },
        fieldState: { invalid, isTouched, isDirty, error },
        formState
      }) => (
        <label className="form-control">
          {label && <span className="label-text">{label}</span>}
          {['text', 'number'].includes(type) && (
            <input
              className="input input-bordered input-sm"
              type={type}
              onBlur={onBlur} // notify when input is touched
              onChange={onChange} // send value to hook form
              placeholder={placeholder}
              value={value ?? ''}
              {...rest}
            />
          )}
          {type === 'date' && (
            <input
              className="input input-bordered input-sm"
              type={'date'}
              onChange={onChange}
              onBlur={onBlur}
              name={name}
              ref={ref}
              value={myFormatDate(value || new Date(), 'input', {
                dateOnly: true
              })}
            />
          )}
          {type === 'select' && (
            <select
              className="input input-bordered input-sm"
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
            <input
              type={'checkbox'}
              className=" checkbox"
              onChange={onChange}
              onBlur={onBlur}
              name={name}
              ref={ref}
              value={value}
            />
          )}

          {error?.type && (
            <span className="label-text text-alt text-error ">
              {error?.message}
            </span>
          )}
        </label>
      )}
    />
  )
}

export default InputContainer
