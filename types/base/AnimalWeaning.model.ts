import { AnimalType } from './AnimalType.model'
import { FarmEvent, SetGenericEventType } from './FarmEvent.model'
import { TypeBase } from './TypeBase.model'

export interface AnimalWeaning {
  type: 'WEANING'
  //status: 'DONE' | 'PENDING'
  farm: {
    id: string
    name: string
  }
  eventData: {
    earring: string
    date: Date | string | number
    status: 'PENDING' | 'DONE'
  }
}

export interface AnimalWeaningEventData {
  earring: string
  date: Date | string | number
  status: 'PENDING' | 'DONE'
}

export interface AnimalWeaningType extends Partial<AnimalType> {
  eventData: AnimalWeaningEventData
}

export interface DTO_CreteAnimalWeaning extends AnimalWeaning {}
