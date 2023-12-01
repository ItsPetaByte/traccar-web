import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { http } from "./AxelorFetchService";

const transportationFields = [
  "transportationNumber",                                 //номер поездки
  "transportationStatus",                                 //статус поездки
  
  "seals.numberEns",                                      //номер ЭНП
  "informationSeal.statusEns",                            //статус ЭНП
  "informationSeal.alarm",                                //вид тревоги
  "seals.positionsId.batteryLevel",                       //состояние заряда батареи %
  "seals.idFromTraccar",                                  //id ЭНП в траккаре
  
  "informationSeal.dateTimeActivation",                   //дата и время активации
  "informationSeal.dateTimeDeactivation",                 //дата и время деактивации

  "declaration.customsDeparture.name",                         //таможенный орган отправления
  "declaration.customsDestination.name",                       //таможенный орган назначения
  "phoneNumberDriver",                                    //номер телефон водителя
  "declaration.transportationVehicle.plateNo"             //гос. номер АТС
]

const transportationsOperators = {
  "informationSeal.statusEns": "in",
  transportationStatus: "in",
  transportationNumber: "like",
  'declaration.transportationVehicle.plateNo': 'like',
  'seals.numberEns': 'like',
  'declaration.registrationNumberTd': 'like',
};


const handleCriteries = (values, operators) => {
  let criteries = [];
  Object.entries(values).forEach(([key, value]) => {
    const criteriaValue = Array.isArray(value) ? value.map((item) => item?.value ?? "") : value;
    if (criteriaValue != null && criteriaValue.length > 0) {
      criteries.push({
        fieldName: key,
        operator: operators[key],
        value: operators[key] === "like" ?  `%${criteriaValue}%`: criteriaValue,
      });
    }
  });

  return criteries;
};

const transportationApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.APP_AXE_DOMAIN }),
  reducerPath: "transportation",
  endpoints: (builder) => ({
    transportations: builder.mutation({
      query: (values) => ({
        headers: http.headers,
        url: "ws/rest/com.axelor.apps.ens.db.TransportationTrip/search",
        method: "POST",
        body: JSON.stringify({
            offset: 0,
            fields: transportationFields,
            data: {
              operator: 'and',
              criteria: handleCriteries(values, transportationsOperators)
            }
        }),
      }),
    }),
  }),
});

export const { useTransportationsMutation } = transportationApi;

export default transportationApi;
