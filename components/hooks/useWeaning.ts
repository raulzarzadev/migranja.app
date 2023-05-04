import { updateAnimalState } from '@firebase/Animal/main'
import { useState } from 'react'
import { AnimalType } from 'types/base/AnimalType.model'
import useAnimal from './useAnimal'
import useFarmAnimals from './useFarmAnimals'
import useEvent from './useEvent'
import useEvents from './useEvents'
import { FarmEvent } from 'types/base/FarmEvent.model'
import useProgress from './useProgress'
import {
  AnimalStateType,
  inactiveAnimalsStates
} from 'types/base/AnimalState.model'
import { WeaningType } from '@comps/modal/ModalEditWeaning'
import {
  AnimalWeaning,
  AnimalWeaningEvent,
  AnimalWeaningType,
  WeaningEvent
} from 'types/base/AnimalWeaning.model'
import { FarmEventType } from '@comps/FarmEvents/FarmEvent/FarmEvent.model'
import { createEvent2, updateEvent } from '@firebase/Events/main'
import useCurrentFarm from './useCurrentFarm'

export type WeaningTypes = 'FOR_BELLY' | 'FOR_SALE' | 'FATTEN'

const useWeaning = () => {
  const { progress, setProgress } = useProgress()
  const { findAnimal } = useAnimal()
  const farm = useCurrentFarm()
  const { findEvent, events } = useEvents()
  // const handleWeaning = async (state: AnimalStateType) => {
  //   if (!animalId) return setError('No animalId')
  //   try {
  //     //* Update animal state
  //     await updateAnimalState(animalId, state, animal.state)
  //     //* Update mother animal state
  //     if (animalMotherId) {
  //       //* TODO: Check if have more children weaning
  //       await updateAnimalState(animalMotherId, 'FREE', 'SUCKLE')
  //     }
  //     //* Update event status to done
  //     //@ts-ignore
  //     await updateEvent(eventId, { 'eventData.status': 'DONE' })
  //   } catch (error) {
  //     console.log({ error })
  //   }
  // }

  const handleWeaning = async ({
    animalId,
    eventId,
    weaningType
  }: {
    animalId?: AnimalType['id']
    eventId?: FarmEvent['id']
    weaningType: WeaningTypes
  }) => {
    setProgress(10)
    //* Search event and animal, if do not exist any search in other
    let _animal: AnimalType | undefined
    let _event: WeaningEvent | undefined
    try {
      if (animalId) {
        _animal = findAnimal({ animalId })
      } else if (eventId) {
        const _event = findEvent({ eventId })
        _animal = findAnimal({ animalEarring: _event?.eventData.earring })
      }

      if (eventId) {
        _event = findEvent({ eventId }) as WeaningEvent
      } else {
        //* find any pending event where animalEarring appears
        const weaningEvent = events
          .filter((e) => e.type === 'WEANING')
          .find(
            (e) =>
              e.eventData.earring === _animal?.earring &&
              e.eventData.status === 'PENDING'
          )
        _event = weaningEvent as WeaningEvent
      }
      setProgress(20)
      console.log('destetando', { _animal, _event, weaningType })
      //* Update animal state
      //* - if animal state is inactive send warning
      if (!_animal) {
        const animalEvent = _event?.eventData?.earring
      }
      if (!_animal?.state) {
        console.log('no animal state')
      }
      if (_animal?.state && inactiveAnimalsStates.includes(_animal?.state)) {
        console.warn('animal is not active', _animal?.state)
      }
      //* - if animal state is LACTATING update
      if (_animal?.state === 'LACTATING') {
        await updateAnimalState(_animal.id, weaningType, _animal.state)
      }

      //* - Update mother state SUCKLE to FREE
      const motherId = _animal?.parents?.mother?.id
      if (motherId) {
        await updateAnimalState(motherId, 'FREE', 'SUCKLE')
      }

      setProgress(50)
      //* Update event state
      //@ts-ignore
      await updateEvent(_event.id, { 'eventData.status': 'DONE' })

      setProgress(100)
    } catch (error) {
      setProgress(-1)
      console.error(error)
    }
  }
  const handleWeaningAnimals = async ({
    animalsIds = [],
    weaningType
  }: {
    animalsIds: AnimalType['id'][]
    weaningType: WeaningTypes
  }) => {
    if (!animalsIds.length) return console.log('no animals')
    try {
      for (let i = 0; i < animalsIds?.length; i++) {
        const animalId = animalsIds?.[i]
        await handleWeaning({ animalId, weaningType })
        setProgress(100 * (i / animalsIds.length))
      }
    } catch (error) {
      console.error(error)
    }
  }
  return { handleWeaning, progress, handleWeaningAnimals }
}

export default useWeaning
