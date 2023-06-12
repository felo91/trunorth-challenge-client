import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface Record extends Iterator<Record> {
  id: string,
  operation_id: string,
  user_id: string,
  amount?: number[],
  user_balance?: number,
  operation_response?: string,
  date: number
}

export interface RecordsState {
  data: Record[],
  lastEvaluatedKey: Record | null
  totalItems: number | undefined
}

const initialState: RecordsState = {
  data: [],
  lastEvaluatedKey: null,
  totalItems: undefined
}

export const recordSlice = createSlice({
  name: 'recordSlice',
  initialState,
  reducers: {
    setRecords: (state, { payload }: PayloadAction<RecordsState>) => {
      console.log('setRecords: ', payload)
      state.data = payload.data
      state.lastEvaluatedKey = payload.lastEvaluatedKey
      state.totalItems = payload.totalItems
    },
    removeRecord: (state, { payload }: PayloadAction<string>) => {
      state.data = state.data.filter(record => record.id !== payload)
    }
  },
})

export const { setRecords, removeRecord } = recordSlice.actions
export const recordReducer = recordSlice.reducer
export const selectRecords = (state: RootState) => state.recordReducer
