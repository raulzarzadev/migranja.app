import { createSlice } from '@reduxjs/toolkit'
import { AppState } from '..'
import { HYDRATE } from 'next-redux-wrapper'
import { FarmType } from '@firebase/Farm/farm.model'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'
import { AnimalFormattedWhitGenericEvenData } from 'types/base/AnimalType.model'

// Type for our state

export type FarmStateAnimalEvent = AnimalFormattedWhitGenericEvenData
export interface FarmState {
  farm?: FarmType | null
  userFarm?: FarmType | null
  animals: AnimalType[]
  events: FarmStateAnimalEvent[]
}

// Initial state
const initialState: FarmState = {
  farm: undefined,
  userFarm: undefined,
  animals: [],
  events: []
}

// Actual Slice
export const farmSlice = createSlice({
  name: 'farm',
  initialState,
  reducers: {
    setFarmState(state, action) {
      state.farm = action.payload
    },
    setFarmOvines(state, action) {
      state.animals = action.payload
    },
    setFarmAnimals(state, action) {
      state.animals = action.payload
    },
    setFarmEvents(state, action) {
      state.events = action.payload
    },
    setUserFarm(state, action) {
      state.userFarm = action.payload
    }

    // Special reducer for hydrating the state. Special case for next-redux-wrapper
  }
  // extraReducers: {
  //   [HYDRATE]: (state, action) => {
  //     // console.log('HYDRATE', action.payload)
  //     return {
  //       ...state,
  //       ...action.payload.farm
  //     }
  //   }
  // }
})

export const {
  setFarmState,
  setFarmOvines,
  setFarmAnimals,
  setFarmEvents,
  setUserFarm
} = farmSlice.actions

export const selectFarmState = (state: AppState) => state.farm.farm
export const selectFarmOvines = (state: AppState) => state.farm.animals
export const selectFarmAnimals = (state: AppState) => state.farm.animals
export const selectFarmEvents = (state: AppState) => state.farm.events
export const selectUserFarm = (state: AppState) => state.farm.userFarm

export default farmSlice.reducer
