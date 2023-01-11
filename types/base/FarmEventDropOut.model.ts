import { FarmEvent } from './FarmEvent.model'
import { AnimalCurrentStatusType } from './LABELS_TYPES/AnimalCurrentStatus'
import { TypeBase } from './TypeBase.model'

export interface AnimalElementalInfo {
  id: string
  earring: string
  name: string
}
export interface DropOutEventData {
  date: number | string | Date
  animals: AnimalElementalInfo[]
  comments: string
}

export interface FarmEventDropOut extends Omit<FarmEvent, 'type'> {
  type: 'DROP_OUT' | 'DROP_IN'
  reason: AnimalCurrentStatusType
  eventData: DropOutEventData
  createdBy: {
    id: string
    name: string
  }
}

export interface DTO_CreateFarmEventDropOut
  extends Omit<FarmEventDropOut, 'createdAt' | 'updatedAt' | 'userId' | 'id'> {}

export interface DTO_UpdateFarmEventDropOut
  extends Omit<TypeBase, 'updatedAt' | 'userId' | 'id'> {}
