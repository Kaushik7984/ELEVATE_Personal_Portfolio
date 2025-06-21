import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './customBaseQuery';

export const experienceApi = createApi({
  reducerPath: 'experienceApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Experience'],
  endpoints: (builder) => ({
    getExperiences: builder.query({
      query: () => ({ url: 'experience', method: 'GET' }),
      providesTags: ['Experience'],
    }),
    getExperience: builder.query({
      query: (id) => ({ url: `experience/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'Experience', id }],
    }),
    createExperience: builder.mutation({
      query: (data) => ({ url: 'experience', method: 'POST', body: data }),
      invalidatesTags: ['Experience'],
    }),
    updateExperience: builder.mutation({
      query: ({ id, body }) => ({ url: `experience/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Experience', id }],
    }),
    deleteExperience: builder.mutation({
      query: (id) => ({ url: `experience/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Experience', id }],
    }),
  }),
});

export const {
  useGetExperiencesQuery,
  useGetExperienceQuery,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
} = experienceApi; 