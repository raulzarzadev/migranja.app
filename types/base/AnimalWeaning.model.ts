import { AnimalType } from './AnimalType.model'
import { FarmEvent, SetGenericEventType } from './FarmEvent.model'
import { EventStatus } from './LABELS_TYPES/EventTypes'
import { TypeBase } from './TypeBase.model'

export interface AnimalWeaning {
  type: 'WEANING'
  farm: {
    id: string
    name: string
  }
  eventData: AnimalWeaningEventData
}

export interface AnimalWeaningEventData {
  earring: string
  date: number | string
  status: EventStatus
}

export interface AnimalWeaningType extends Partial<AnimalType> {
  eventData: AnimalWeaningEventData
}

export interface AnimalWeaningEvent extends TypeBase {}

export interface DTO_CreteAnimalWeaning extends AnimalWeaning {}
