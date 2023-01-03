import { CreateBirthEventType } from '@firebase/Events/event.model'
import {
  AnimalType,
  ParentsType
} from '@firebase/types.model.ts/AnimalType.model'
export interface CreateBirthDataType {
  currentFarm: any
  farmAnimals: Partial<AnimalType>[]
  animal: any
  formValues: any
  calfs: any[]
}
export const formatBirth = (
  data: CreateBirthDataType
): {
  formatBirthEvent: CreateBirthEventType
} => {
  const currentFarm = data.currentFarm
  const animal = data.animal
  const formValues = data.formValues
  const farmAnimals = data.farmAnimals

  const motherLastVersion =
    farmAnimals?.find(({ id }) => id == animal.id) || animal

  const fatherLastVersion =
    farmAnimals?.find(({ id }) => id == animal?.breeding?.breedingMale?.id) ||
    animal?.breeding?.breedingMale

  const parentsDefaultData: AnimalType['parents'] = {
    father: {
      breed: fatherLastVersion?.breed || '',
      earring: fatherLastVersion?.earring || '',
      name: fatherLastVersion?.name || '',
      id: fatherLastVersion?.id || '',
      inTheFarm: true
    },
    mother: {
      breed: motherLastVersion?.breed || '',
      earring: motherLastVersion?.earring || '',
      name: motherLastVersion?.name || '',
      id: motherLastVersion?.id || '',
      inTheFarm: true
    }
  }

  const defaultBirthValues: Partial<AnimalType> = {
    birthday: formValues.date || new Date(),
    type: 'ovine',
    name: '',
    batch: animal.breeding?.batch || '',
    weight: {
      atBirth: 0
    },
    farm: {
      id: currentFarm?.id,
      name: currentFarm?.name
    },
    parents: parentsDefaultData
  }
  const motherBreed = parentsDefaultData.mother?.breed?.replaceAll(' ', '')
  const fatherBreed = parentsDefaultData.father?.breed?.replaceAll(' ', '')
  const breed =
    !motherBreed || !fatherBreed
      ? motherBreed || fatherBreed
      : fatherBreed === motherBreed
      ? fatherBreed
      : `(1/2${motherBreed}-1/2${fatherBreed})`

  const formattedCalfs = data?.calfs?.map((calf: any) => {
    const statuses: AnimalType['statuses'] = {
      isAlive: !!calf?.isAlive,
      isInTheFarm: !!calf?.isAlive,
      isPregnant: false
    }

    const calfFormatted = {
      ...defaultBirthValues,
      earring: calf.earring,
      breed: breed?.replaceAll(' ', ''),
      birthType: data?.calfs?.length,
      statuses
    }
    return calfFormatted
  })

  const birthData = {
    date: formValues.date,
    parents: parentsDefaultData,
    calfs: formattedCalfs,
    batch: animal.breeding?.batch
  }

  const formatBirthEvent: CreateBirthEventType = {
    type: 'BIRTH',
    birthData,
    farm: {
      id: currentFarm?.id || '',
      name: currentFarm?.name || ''
    }
  }

  return { formatBirthEvent }
}
