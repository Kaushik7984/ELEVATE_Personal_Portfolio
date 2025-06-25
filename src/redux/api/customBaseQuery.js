import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// const baseUrl = 'http://localhost:5000/api/';
const baseUrl = import.meta.env.VITE_API_URL + "/api/";

export const customBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
