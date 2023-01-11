import { eventsCRUD } from './main'
import { DTO_CreteAnimalWeaning } from 'types/base/AnimalWeaning.model'

// ************************************ CREATE  WEANING EVENT **

export const creteAnimalWeaning = (event: DTO_CreteAnimalWeaning) => {
  return eventsCRUD.createItem(event)
}
