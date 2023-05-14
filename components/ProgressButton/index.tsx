import ProgressBar from '@comps/ProgressBar'
import { MouseEvent } from 'react'

export const ProgressButton = ({
  progress,
  label,
  buttonLabel = 'Guardar',
  onClick,
  className,
  disabled,
  errorLabel,
  ...rest
}: {
  label?: string
  progress: number
  buttonLabel?: string
  className?: string
  disabled?: boolean
  errorLabel?: string
  onClick?: (e: MouseEvent) => void | undefined
}) => {
  return (
    <div role="buttonProgress">
      <ProgressBar progress={progress} errorLabel={errorLabel} />
      {progress >= 0 && (
        <div className="flex w-full justify-center">
          <button
            onClick={onClick}
            className={`btn btn-info ${className}`}
            disabled={progress > 0 || disabled}
          >
            {buttonLabel}
          </button>
        </div>
      )}
    </div>
  )
}

export default ProgressButton
