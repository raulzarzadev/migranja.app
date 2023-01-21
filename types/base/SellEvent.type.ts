import { CreateGenericEventType } from './FarmEvent.model'

export interface AnimalSell {
  earring: string
  weight: number
  obs?: string
}
export interface SellEventData {
  date: number | Date | string
  animalsQuantity: boolean
  earrings: AnimalSell[]
  price: number
  total: number
  totalWeight: number
  type: 'onFoot' | 'onCarcass'
}
export interface SellEvent extends CreateGenericEventType<SellEventData> {}
