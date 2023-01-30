import { UserType } from '@firebase/Users/user.model'
import { BaseFarmEvent } from './FarmEvent.model'
import { TypeBase } from './TypeBase.model'
export type TypeOfInventory = 'full' | 'partial' | string
export interface Inventory {
  type: TypeOfInventory
  description: string
  farm: BaseFarmEvent['farm']
  createdBy: {
    userId: UserType['id']
    name: UserType['name']
  }
  date: string | number | Date
  physicalStock: InventoryStock[]
  stockDifferences: InventoryStock[]
  stockCoincidences: InventoryStock[]
  stockMissed: InventoryStock[]
}
export interface InventoryStock {
  earring: string
  comments: string
}

export interface InventoryDetails extends Inventory, TypeBase {}
