import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './customBaseQuery';

export const skillsApi = createApi({
  reducerPath: 'skillsApi',
  baseQuery: customBaseQuery,
  tagTypes: ['Skill'],
  endpoints: (builder) => ({
    getSkills: builder.query({
      query: () => ({ url: 'skills', method: 'GET' }),
      providesTags: ['Skill'],
    }),
    getSkill: builder.query({
      query: (id) => ({ url: `skills/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'Skill', id }],
    }),
    createSkill: builder.mutation({
      query: (data) => ({ url: 'skills', method: 'POST', body: data }),
      invalidatesTags: ['Skill'],
    }),
    updateSkill: builder.mutation({
      query: ({ id, ...data }) => ({ url: `skills/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Skill', id }],
    }),
    deleteSkill: builder.mutation({
      query: (id) => ({ url: `skills/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Skill', id }],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistically update the cache
        const patchResult = dispatch(
          skillsApi.util.updateQueryData('getSkills', undefined, (draft) => {
            return draft.filter((skill) => skill._id !== id);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetSkillsQuery,
  useGetSkillQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
} = skillsApi; 