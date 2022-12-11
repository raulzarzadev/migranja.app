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
  defaultValue,
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
  defaultValue?: string
  rules?: ControllerProps['rules']
}) => {
  return (
    <Controller
      //control={control}
      rules={rules}
      {...rest}
      name={name}
      render={({
        field: { onChange, onBlur, ...rest },
        fieldState: { invalid, isTouched, isDirty, error },
        formState
      }) => (
        <label className="form-control">
          {label && <span className="label-text">{label}</span>}
          {['text', 'datetime', 'number'].includes(type) && (
            <input
              className="input input-bordered input-sm"
              type={type}
              onBlur={onBlur} // notify when input is touched
              onChange={onChange} // send value to hook form
              placeholder={placeholder}
              defaultValue={defaultValue}
              {...rest}
            />
          )}
          {type === 'date' && (
            <input
              // defaultValue={myFormatDate(new Date(), 'input')}
              className="input input-bordered input-sm"
              type={'date'}
              onBlur={onBlur} // notify when input is touched
              onChange={onChange} // send value to hook form
              placeholder={placeholder}
              {...rest}
              value={myFormatDate(rest?.value || new Date(), 'input')}
            />
          )}
          {type === 'select' && (
            <select
              //  defaultValue={defaultValue || ''}
              className="input input-bordered input-sm"
              onBlur={onBlur} // notify when input is touched
              onChange={onChange} // send value to hook form
              {...rest}
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
              defaultValue={defaultValue}
              type={'checkbox'}
              className=" checkbox"
              onBlur={onBlur} // notify when input is touched
              onChange={onChange} // send value to hook form
              defaultChecked={false}
              {...rest}
            />
          )}
          {type === 'radio' && <input type={'radio'} />}

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
