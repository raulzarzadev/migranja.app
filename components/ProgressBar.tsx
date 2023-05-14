const ProgressBar = ({
  progress,
  errorLabel = 'error'
}: {
  progress: number
  errorLabel?: string
}) => {
  return (
    <div className="text-center">
      {progress < 0 && <span className="text-error text-xs">{errorLabel}</span>}
      {progress > 0 && (
        <>
          <span>{progress.toFixed(0)}%</span>
          <progress value={progress} max={100} className="progress mt-0" />
        </>
      )}
    </div>
  )
}

export default ProgressBar
