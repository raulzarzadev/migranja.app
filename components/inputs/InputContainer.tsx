import { Controller } from 'react-hook-form'
import { myFormatDate } from 'utils/dates/myDateUtils'
export interface SelectOption {
  label: string
  value: string | number
}
const InputContainer = ({
  name,
  type = 'text',
  label = 'label',
  selectOptions,
  placeholder,
  ...rest
}: {
  name: string
  type: 'date' | 'text' | 'datetime' | 'select' | 'checkbox' | 'radio'
  label: string
  selectOptions?: SelectOption[]
  placeholder?: string
}) => {
  return (
    <Controller
      //control={control}
      {...rest}
      name={name}
      render={({
        field: { onChange, onBlur, value, ...rest },
        fieldState: { invalid, isTouched, isDirty, error },
        formState
      }) => (
        <label className="form-control">
          <span className="label-text">{label}</span>
          {['text', 'datetime'].includes(type) && (
            <input
              className="input input-bordered input-sm"
              type={type}
              onBlur={onBlur} // notify when input is touched
              onChange={onChange} // send value to hook form
              checked={value}
              placeholder={placeholder}
              {...rest}
            />
          )}
          {type === 'date' && (
            <input
              className="input input-bordered input-sm"
              type={type}
              onBlur={onBlur} // notify when input is touched
              onChange={onChange} // send value to hook form
              placeholder={placeholder}
              value={myFormatDate(value, 'input')}
              {...rest}
            />
          )}
          {type === 'select' && (
            <select
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
              type={'checkbox'}
              className=" checkbox"
              onBlur={onBlur} // notify when input is touched
              onChange={onChange} // send value to hook form
              defaultChecked={false}
              {...rest}
            />
          )}
          {type === 'radio' && <input type={'radio'} />}
        </label>
      )}
    />
  )
}

export default InputContainer
