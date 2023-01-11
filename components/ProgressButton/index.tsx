import Loading from '@comps/Loading'

export const ProgressButton = ({ progress }: { progress: number }) => {
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
      {progress == 100 && <div className="text-center">Listo. </div>}
      <div className="flex w-full justify-center">
        <button className="btn btn-info" disabled={progress > 0}>
          Guardar
        </button>
      </div>
    </div>
  )
}

// export default ProgressButton
