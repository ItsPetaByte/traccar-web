import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { http } from "./AxelorFetchService";

const dictionariesApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.APP_AXE_DOMAIN }),
  reducerPath: "dictionaries-api",
  endpoints: (builder) => ({
    mobileGroupStatuses: builder.mutation({
      query: () => ({
        headers: http.headers,
        url: "ws/selection/ens.mobile.group.status.select",
        method: "POST",
        body: JSON.stringify({
            translate: true
        }),
      }),
    }),
    mobileGroupCarTypes: builder.mutation({
        query: () => ({
          headers: http.headers,
          url: "ws/selection/ens.mobile.group.car.model.select",
          method: "POST",
          body: JSON.stringify({
              translate: true
          }),
        }),
    }),
    transportationStatuses: builder.mutation({
      query: () => ({
        headers: http.headers,
        url: "ws/selection/ens.transportation.status.select",
        method: "POST",
        body: JSON.stringify({
            translate: true
        }),
      }),
    }),
    deviceStatuses: builder.mutation({
      query: () => ({
        headers: http.headers,
        url: "ws/selection/ens.status.select",
        method: "POST",
        body: JSON.stringify({
            translate: true
        }),
      }),
    }),
  }),
});

export const { useMobileGroupCarTypesMutation, useMobileGroupStatusesMutation, useDeviceStatusesMutation, useTransportationStatusesMutation } = dictionariesApi;

export default dictionariesApi;
