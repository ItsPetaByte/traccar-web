import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { http } from "./AxelorFetchService";


const mobileGroupApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'axelor-api' }),
  reducerPath: "mobile-group",
  endpoints: (builder) => ({
    mobileGroupPositions: builder.mutation({
      query: () => ({
        headers: http.headers,
        url: "ws/mobile-position/getCoordinates",
        method: "POST"
      }),
    }),
  }),
});

export const { useMobileGroupPositionsMutation } = mobileGroupApi;

export default mobileGroupApi;
