import { createSlice } from '@reduxjs/toolkit'
import { AppState } from '..'
import { ErrorType } from '@firebase/Errors/main'

// Type for our state

// Initial state
const initialState: ErrorType[] = []

// Actual Slice
export const errorsSlice = createSlice({
  name: 'errors',
  initialState,
  reducers: {
    setErrors(state, action) {
      state = action.payload
    }
  }
})

export const { setErrors } = errorsSlice.actions

export const selectAppErrors = (state: AppState) => state.errors

export default errorsSlice.reducer
