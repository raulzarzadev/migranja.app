const ProgressBar = ({
  progress,
  errorLabel = 'error'
}: {
  progress: number
  errorLabel?: string
}) => {
  return (
    <div className="text-center">
      {progress < -1 && (
        <span className="text-error text-xs">{errorLabel}</span>
      )}
      {progress > 0 && progress <= 100 && (
        <>
          <span>{progress.toFixed(0)}%</span>
          <progress value={progress} max={100} className="progress mt-0" />
        </>
      )}
    </div>
  )
}

export default ProgressBar
