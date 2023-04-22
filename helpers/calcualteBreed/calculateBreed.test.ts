// import {
//   calculateBreedingResult,
//   ParensBirthEvent,
//   BreedingResult
// } from './breeding'

import {
  BreedingResult,
  ParensBirthEvent,
  calculateBreed
} from './calculateBreed'

describe('calculateBreedingResult', () => {
  test('should return correct breeding result when both parents have same breed', () => {
    const parensBirthEvent: ParensBirthEvent = {
      mother: { breed: 'Katadin*50%' },
      father: { breed: 'Katadin*50%' }
    }
    const expectedBreedingResult: BreedingResult = { breed: 'Katadin*100%' }

    expect(calculateBreed(parensBirthEvent)).toEqual(expectedBreedingResult)
  })

  test('should return correct breeding result when one parent has no breed', () => {
    const parensBirthEvent: ParensBirthEvent = {
      mother: { breed: '' },
      father: { breed: 'Dorper*100%' }
    }
    const expectedBreedingResult: BreedingResult = { breed: 'Dorper*100%' }

    expect(calculateBreed(parensBirthEvent)).toEqual(expectedBreedingResult)
  })

  test('should return correct breeding result when both parents have different breeds', () => {
    const parensBirthEvent: ParensBirthEvent = {
      mother: { breed: 'Katadin*50%' },
      father: { breed: 'Dorper*100%' }
    }
    const expectedBreedingResult: BreedingResult = {
      breed: 'Katadin*50%+Dorper*50%'
    }

    expect(calculateBreed(parensBirthEvent)).toEqual(expectedBreedingResult)
  })
})
