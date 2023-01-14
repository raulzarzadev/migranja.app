import { createSlice } from '@reduxjs/toolkit'
import { AppState } from '..'
import { HYDRATE } from 'next-redux-wrapper'
import { UserType } from '../../firebase/Users/user.model'

// Type for our state
export interface AuthState {
  user?: UserType | null
}

// Initial state
const initialState: AuthState = {
  user: undefined
}

// Actual Slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set the authentication status
    setAuthState(state, action) {
      state.user = action.payload
    }

    // Special reducer for hydrating the state. Special case for next-redux-wrapper
  }
  // extraReducers: {
  //   [HYDRATE]: (state, action) => {
  //     // console.log('HYDRATE', action.payload)
  //     return {
  //       ...state,
  //       ...action.payload.auth
  //     }
  //   }
  // }
})

export const { setAuthState } = authSlice.actions

export const selectAuthState = (state: AppState) => state.auth.user

export default authSlice.reducer
