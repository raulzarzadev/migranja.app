import { SellEvent } from 'types/base/SellEvent.type'
import { eventsCRUD } from './main'

export const createSellEvent = (event: SellEvent) => {
  return eventsCRUD.createItem(event)
}
