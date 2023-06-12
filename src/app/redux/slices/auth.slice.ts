import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface AuthState {
  data: {
    userId: string
    token: string
    user_balance: number
  }
}

const initialState = {
  userId: '',
  token: '',
  user_balance: 0,
}

export const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setAuthenticatedUser: (state, { payload }: PayloadAction<AuthState>) => {
      console.log('authSlice:: setAuthenticatedUser: ', payload)
      state.userId = payload.data.userId
      state.token = payload.data.token
      state.user_balance = payload.data.user_balance
      console.log(state.token)
    },
    resetState: (state) => {
      state.token = ''
      state.userId = ''
      localStorage.setItem('user', '')
    },
  },
})

export const { setAuthenticatedUser, resetState } = authSlice.actions
export const authReducer = authSlice.reducer
export const selectAuthenticatedUser = (state: RootState) => state.authReducer
