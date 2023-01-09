import { eventsCRUD } from './main'
import { DTO_CreateFarmEventDropOut } from 'types/base/FarmEventDropOut.model'

// ************************************ CREATE DROP_OUT EVENT **

export const createDropOutEvent = (event: DTO_CreateFarmEventDropOut) => {
  return eventsCRUD.createItem(event)
}
