import Loading from '@comps/Loading'

export const ProgressButton = ({
  progress,
  label,
  buttonLabel = 'Guardar',
  onClick,
  className,
  ...rest
}: {
  label?: string
  progress: number
  buttonLabel?: string
  className?: string
  onClick?: () => void
}) => {
  return (
    <div role="buttonProgress">
      {!!progress && (
        <progress value={progress} max={100} className="progress"></progress>
      )}
      {progress > 0 && progress !== 100 && (
        <div>
          Espera mientras terminar <Loading />
        </div>
      )}
      {progress < 100 && progress > 1 && (
        <div className="text-center">{label} </div>
      )}
      {progress == 100 && <div className="text-center">Listo. </div>}
      <div className="flex w-full justify-center">
        <button
          onClick={onClick}
          className={`btn btn-info ${className}`}
          disabled={progress > 0}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  )
}

export default ProgressButton
