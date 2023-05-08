import ProgressBar from '@comps/ProgressBar'

export const ProgressButton = ({
  progress,
  label,
  buttonLabel = 'Guardar',
  onClick,
  className,
  disabled,
  ...rest
}: {
  label?: string
  progress: number
  buttonLabel?: string
  className?: string
  disabled?: boolean
  onClick?: () => void
}) => {
  return (
    <div role="buttonProgress">
      <ProgressBar progress={progress} />
      <div className="flex w-full justify-center">
        <button
          onClick={onClick}
          className={`btn btn-info ${className}`}
          disabled={progress > 0 || disabled}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  )
}

export default ProgressButton
