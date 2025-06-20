import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { projectApi } from './api/projectApi';
import { skillsApi } from './api/skillsApi';
import { resumeApi } from './api/resumeApi';
import { experienceApi } from './api/experienceApi';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [projectApi.reducerPath]: projectApi.reducer,
    [skillsApi.reducerPath]: skillsApi.reducer,
    [resumeApi.reducerPath]: resumeApi.reducer,
    [experienceApi.reducerPath]: experienceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, projectApi.middleware, skillsApi.middleware, resumeApi.middleware, experienceApi.middleware),
}); 