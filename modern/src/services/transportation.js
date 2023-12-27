// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { http } from "./AxelorFetchService";

// const transportationFields = [
//   "transportationNumber",                                 //номер поездки
//   "transportationStatus",                                 //статус поездки
  
//   "seals.numberEns",                                      //номер ЭНП
//   "informationSeal.statusEns",                            //статус ЭНП
//   "informationSeal.alarm",                                //вид тревоги
//   "seals.positionsId.batteryLevel",                       //состояние заряда батареи %
//   "seals.idFromTraccar",                                  //id ЭНП в траккаре
  
//   "informationSeal.dateTimeActivation",                   //дата и время активации
//   "informationSeal.dateTimeDeactivation",                 //дата и время деактивации

//   "declaration.customsDeparture.name",                         //таможенный орган отправления
//   "declaration.customsDestination.name",                       //таможенный орган назначения
//   "phoneNumberDriver",                                    //номер телефон водителя
//   "declaration.transportationVehicle.plateNo"             //гос. номер АТС
// ]

// const transportationsOperators = {
//   "informationSeal.statusEns": "in",
//   transportationStatus: "in",
//   transportationNumber: "like",
//   'declaration.transportationVehicle.plateNo': 'like',
//   'seals.numberEns': 'like',
//   'declaration.registrationNumberTd': 'like',
// };


// const handleCriteries = (values, operators) => {
//   let criteries = [];
//   Object.entries(values).forEach(([key, value]) => {
//     const criteriaValue = Array.isArray(value) ? value.map((item) => item?.value ?? "") : value;
//     if (criteriaValue != null && criteriaValue.length > 0) {
//       criteries.push({
//         fieldName: key,
//         operator: operators[key],
//         value: operators[key] === "like" ?  `%${criteriaValue}%`: criteriaValue,
//       });
//     }
//   });

//   return criteries;
// };

// const transportationApi = createApi({
//   baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.APP_AXE_DOMAIN }),
//   reducerPath: "transportation",
//   endpoints: (builder) => ({
//     transportations: builder.mutation({
//       query: (values) => ({
//         headers: http.headers,
//         url: "ws/rest/com.axelor.apps.ens.db.TransportationTrip/search",
//         method: "POST",
//         body: JSON.stringify({
//             offset: 0,
//             fields: transportationFields,
//             data: {
//               operator: 'and',
//               criteria: handleCriteries(values, transportationsOperators)
//             }
//         }),
//       }),
//     }),
//   }),
// });

// export const { useTransportationsMutation } = transportationApi;

// export default transportationApi;



import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { http } from "./AxelorFetchService";

const buildParams = (url, data) => {
  const transportationStatus =  data?.transportationStatus?.map((item) => item?.value).join(",");
  const statusEns = data?.["informationSeal.statusEns"]?.map((item) => item?.value).join(",");
  const numberEns = data?.["seals.numberEns"];
  const transportationNumber = data?.transportationNumber;
  const registrationNumberTd = data?.["declaration.registrationNumberTd"];
  const plateNo = data?.["declaration.transportationVehicle.plateNo"];

  const params = new URLSearchParams();
  transportationStatus && params.append('transportationStatus',  String(transportationStatus));
  transportationNumber && params.append('transportationNumber', String(transportationNumber));
  numberEns && params.append('numberEns', String(numberEns));
  registrationNumberTd && params.append('registrationNumberTd', String(registrationNumberTd));
  plateNo && params.append('plateNo', String(plateNo));
  statusEns && params.append('statusEns', String(statusEns));

  return `${url}?${params}`
}

export const transformTransportationResponse = (data) => {
  const value = data?.data?.data?.map((item) => {
    return {
      ...item,
      "seals.numberEns": item?.seals?.numberEns,
      "informationSeal.dateTimeDeactivation":
        item?.informationSeal?.dateTimeDeactivation,
      "declaration.customsDeparture.name":
        item?.declaration?.customsDeparture?.name,
      "informationSeal.alarm": item?.informationSeal?.alarm,
      phoneNumberDriver: item?.phoneNumberDriver,
      "declaration.transportationVehicle.plateNo":
        item?.declaration?.transportationVehicle?.plateNo,
      "seals.positionsId.batteryLevel":
        item?.seals?.positionsId?.batteryLevel,
      "declaration.customsDestination.name":
        item?.declaration?.customsDestination?.name,
      "seals.idFromTraccar": item?.seals?.idFromTraccar,
      id: item?.id,
      transportationNumber: item?.transportationNumber,
      transportationStatus: item?.transportationStatus,
      "informationSeal.statusEns": item?.informationSeal?.statusEns,
      "informationSeal.dateTimeActivation":
        item?.informationSeal?.dateTimeActivation,
    };
  });

  return {
    data: { data: value, total: data?.data?.total ?? 0 },
  }
}

const transportationApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.APP_AXE_DOMAIN }),
  reducerPath: "transportation",
  endpoints: (builder) => ({
    transportations: builder.mutation({
      query: (values) => ({
        headers: http.headers,
        url: buildParams('/ws/trip/status', values),
        method: "GET",
        keepUnusedDataFor: 0.0001
      }),
    }),
  }),
});

export const { useTransportationsMutation } = transportationApi;

export default transportationApi;
