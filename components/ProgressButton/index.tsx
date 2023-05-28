import ProgressBar from '@comps/ProgressBar'
import { MouseEvent } from 'react'

export const ProgressButton = ({
  progress,
  label,
  buttonLabel = 'Guardar',
  successButtonLabel = 'Hecho',
  onClick,
  className,
  disabled,
  errorLabel,
  onSuccess,
  ...rest
}: {
  label?: string
  progress: number
  buttonLabel?: string
  className?: string
  disabled?: boolean
  errorLabel?: string
  onClick?: (e: MouseEvent) => void | undefined
  successButtonLabel?: string
  onSuccess?: () => void
}) => {
  return (
    <div role="buttonProgress">
      <ProgressBar progress={progress} errorLabel={errorLabel} />

      {progress === -1 && (
        <div className="text-center text-error">
          <span>Ups! Algo va mal. Intentalo de nuevo</span>
        </div>
      )}
      {progress >= 0 && progress <= 100 && (
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
      {progress === 101 && (
        <div className="flex w-full justify-center">
          <button
            onClick={(e) => {
              e.preventDefault()
              onSuccess?.()
            }}
            className={`btn btn-info ${className}`}
            disabled={!onSuccess}
          >
            {successButtonLabel}
          </button>
        </div>
      )}
    </div>
  )
}

export default ProgressButton
