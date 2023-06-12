import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ILoginRequest } from '../interfaces/login.interface'

export const authAPI = createApi({
  reducerPath: 'authAPI',
  tagTypes: ['Post'],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL + '/'+ process.env.REACT_APP_ENV || 'dev' +'/',
  }),
  endpoints: (build) => ({
    login: build.mutation<any, ILoginRequest>({
      query: ({ email, password }) => ({
        url: `v1/login`,
        method: 'POST',
        body: { username: email, password },
      }),
    }),
  }),
})

export const { useLoginMutation } = authAPI
