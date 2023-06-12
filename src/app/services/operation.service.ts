import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../redux/store'

interface OperationArgs {
  operation_id: string
  amount?: number[]
}

export const operationAPI = createApi({
  reducerPath: 'operationAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL + '/'+ process.env.REACT_APP_ENV || 'dev' +'/',
    prepareHeaders: (headers, { getState }) => {
      const { token } = (getState() as RootState).authReducer
      if (token)  headers.set('authorization', `${token}`)
      return headers
    },
  }),
  endpoints: (build) => ({
    operation: build.mutation<any, OperationArgs>({
      query: (args) => ({
        url: `v1/record`,
        method: 'POST',
        body: args,
      }),
    }),
    operations: build.query<any, void>({
      query: () => `v1/operation`,
    }),
  }),
})

export const { useOperationMutation, useOperationsQuery } = operationAPI
