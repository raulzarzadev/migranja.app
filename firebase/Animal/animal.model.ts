import { AnimalType } from '../types.model.ts/AnimalType.model'

export interface CreateAnimalDTO extends Partial<AnimalType> {}
