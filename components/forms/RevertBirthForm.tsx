const RevertBirthForm = () => {
  function handleRevertBirth() {}

  return (
    <div>
      <div>Revertir parto</div>
      <p>Al revertir un parto se eliminaran los siguientes elementos </p>
      <p className="text-center">1. Animales</p>
      <p className="text-center">2. Destetes</p>
      <p className="text-center">3. Parto</p>
      <p>Al revertir un parto se actualizaran los siguientes elementos </p>
      <p className="text-center">1. Monta</p>
      <div className="text-center">
        <button
          className="btn btn-error btn-outline mt-6"
          onClick={(e) => {
            e.preventDefault()
            handleRevertBirth()
          }}
        >
          Revertir
        </button>
      </div>
    </div>
  )
}

export default RevertBirthForm
