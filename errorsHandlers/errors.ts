const createErrorFactory = function (name: string) {
  return class BussinesError extends Error {
    constructor(message: string) {
      super(message)
      this.name = name
    }
  }
}

export const CreateBreedingError = createErrorFactory('CreateBreedingError')
export const CreateBirthError = createErrorFactory('CreateBirthError')
