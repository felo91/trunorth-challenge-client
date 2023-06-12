import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { IOperationRequest } from '../../interfaces/operation.interface'

export interface OperationState {
  operationResult: string | null
  userBalance: number | null
  operations: IOperationRequest[] | null
}

const initialState: OperationState = {
  operationResult: null,
  userBalance: null,
  operations: [] // Add this line
}

export const operationSlice = createSlice({
  name: 'operation',
  initialState,
  reducers: {
    setOperation: (state, { payload }: PayloadAction<Omit<OperationState, 'operations'>>) => {
      console.log('operationSlice:: setOperation: ', payload)
      state.operationResult = payload.operationResult
      state.userBalance = payload.userBalance
    },
    setOperations: (state, { payload }: PayloadAction<IOperationRequest[]>) => { // Add this function
      state.operations = payload;
    },
  },
})

export const { setOperation, setOperations } = operationSlice.actions
export const operationReducer = operationSlice.reducer
export const selectOperationResult = (state: RootState) => state.operationReducer
export const selectOperations = (state: RootState) => state.operationReducer.operations
