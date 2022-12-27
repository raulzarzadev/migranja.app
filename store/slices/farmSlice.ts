import { createSlice } from '@reduxjs/toolkit'
import { AppState } from '..'
import { HYDRATE } from 'next-redux-wrapper'
import { FarmType } from '@firebase/Farm/farm.model'
import { AnimalType } from '@firebase/types.model.ts/AnimalType.model'

// Type for our state
export interface FarmState {
  farm: FarmType | null
  animals: AnimalType[]
}

// Initial state
const initialState: FarmState = {
  farm: null,
  animals: []
}

// Actual Slice
export const farmSlice = createSlice({
  name: 'farm',
  initialState,
  reducers: {
    // Action to set the Farmentication status
    setFarmState(state, action) {
      state.farm = action.payload
    },
    setFarmOvines(state, action) {
      state.animals = action.payload
    }

    // Special reducer for hydrating the state. Special case for next-redux-wrapper
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      // console.log('HYDRATE', action.payload)
      return {
        ...state,
        ...action.payload.farm
      }
    }
  }
})

export const { setFarmState, setFarmOvines } = farmSlice.actions

export const selectFarmState = (state: AppState) => state.farm.farm
export const selectFarmOvines = (state: AppState) => state.farm.animals

export default farmSlice.reducer
