import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../redux/store'
import { Record } from '../redux/slices/record.slice'

export const recordAPI = createApi({
  reducerPath: 'recordAPI',
  tagTypes: ['Record'],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL + '/'+ process.env.REACT_APP_ENV || 'dev' +'/',
    prepareHeaders: (headers, { getState }) => {
      const { token } = (getState() as RootState).authReducer
      if (token)  headers.set('authorization', `${token}`)
      return headers
    },
  }),
  endpoints: (build) => ({
    getRecords: build.query<any, { filter?: string|undefined , lastEvaluatedKey?: Record | null }>({
      query: (params) => ({ 
        url: 'v1/record' + ((params.filter || params.lastEvaluatedKey) ? '?' + (params.filter ? 'filter=' + encodeURIComponent(params.filter) : '') + (params.filter && params.lastEvaluatedKey ? '&' : '') + (params.lastEvaluatedKey ? 'lastEvaluatedKey=' + JSON.stringify(params.lastEvaluatedKey) : '') : '') , 
        method: 'GET',

      }),
    }),
    deleteRecord: build.mutation<any, string>({
      query: (queryParams) => ({
        url: `v1/record${queryParams}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const { useGetRecordsQuery, useDeleteRecordMutation } = recordAPI
