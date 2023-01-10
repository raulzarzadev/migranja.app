import Loading from 'components/Loading'

const ProgressButton = ({ progress }: { progress: number }) => {
  return (
    <div>
      {!!progress && (
        <progress value={progress} max={100} className="progress"></progress>
      )}
      {progress > 0 && progress !== 100 && (
        <div>
          Espera mientras terminar <Loading />
        </div>
      )}
      {progress == 100 && <div className="text-center">Listo. </div>}
      <button className="btn btn-info" disabled={progress > 0}>
        Guardar
      </button>
    </div>
  )
}

export default ProgressButton
