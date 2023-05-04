const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="text-center">
      {progress < 0 && 'Error'}
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
