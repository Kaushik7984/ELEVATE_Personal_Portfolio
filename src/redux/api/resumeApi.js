import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './customBaseQuery';

export const resumeApi = createApi({
  reducerPath: 'resumeApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Resume'],
  endpoints: (builder) => ({
    getResume: builder.query({
      query: () => ({ url: 'resume', method: 'GET' }),
      providesTags: ['Resume'],
    }),
    uploadResume: builder.mutation({
      query: (formData) => ({
        url: 'resume',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['Resume'],
    }),
  }),
});

export const { useGetResumeQuery, useUploadResumeMutation } = resumeApi; 