import { HTMLProps, useEffect, useRef } from 'react'

export default function IndeterminateCheckbox({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate, rest.checked])

  return (
    <div className="form-control">
      <label
        className="label"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <input
          type="checkbox"
          ref={ref}
          className={className + ' cursor-pointer checkbox checkbox-xs'}
          {...rest}
        />
      </label>
    </div>
  )
}
