import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { authSlice } from './slices/authSlice'
import { createWrapper } from 'next-redux-wrapper'
import { counterSlice } from './slices/couterSlice'
import { farmSlice } from './slices/farmSlice'
import { errorsSlice } from './slices/errorsSlice'

const makeStore = () =>
  configureStore({
    reducer: {
      [authSlice.name]: authSlice.reducer,
      [counterSlice.name]: counterSlice.reducer,
      [farmSlice.name]: farmSlice.reducer,
      [errorsSlice.name]: errorsSlice.reducer
    },
    devTools: true
  })

export type AppStore = ReturnType<typeof makeStore>
export type AppState = ReturnType<AppStore['getState']>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>

export const wrapper = createWrapper<AppStore>(makeStore)
