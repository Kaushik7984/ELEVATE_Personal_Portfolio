import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './customBaseQuery';

export const projectApi = createApi({
  reducerPath: 'projectApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Project'],
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: () => ({ url: 'projects', method: 'GET' }),
      providesTags: ['Project'],
    }),
    getProject: builder.query({
      query: (id) => ({ url: `projects/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'Project', id }],
    }),
    createProject: builder.mutation({
      query: (data) => ({ url: 'projects', method: 'POST', body: data }),
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation({
      query: ({ id, body }) => ({ url: `projects/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Project', id }, 'Project'],
    }),
    reorderProjects: builder.mutation({
      query: (projects) => ({
        url: 'projects/reorder',
        method: 'PUT',
        body: { projects },
      }),
      invalidatesTags: ['Project'],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({ url: `projects/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Project', id }],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useReorderProjectsMutation,
} = projectApi; 