import { apiSlice } from "../api/apiSlice";

export const fileSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    uploadFile: build.mutation({
      query: (formdata) => ({
        url: `/files/upload`,
        method: "POST",
        body: formdata, // auto convert to JSON data
      }),
    }),
  }),
});

export const { useUploadFileMutation } = fileSlice;
