import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const transportationApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "axelor-api" }),
  reducerPath: "transportation",
  endpoints: (builder) => ({
    transportations: builder.mutation({
      query: () => ({
        headers: {
            "Content-Type": "application/json",
            Authorization: "Basic YWRtaW46QWRtaW4yMDIz",
        },
        url: "ws/rest/com.axelor.apps.ens.db.TransportationTrip/search",
        method: "POST",
        body: JSON.stringify({
            offset: 0,
            fields: [
                "transportationNumber",                                 //номер поездки
                "transportationStatus",                                 //статус поездки
                
                "seals.numberEns",                                      //номер ЭНП
                "informationSeal.statusEns",                            //статус ЭНП
                "informationSeal.alarm",                                //вид тревоги
                "seals.positionsId.batteryLevel",                       //состояние заряда батареи %
                "seals.idFromTraccar",                                  //id ЭНП в траккаре
                
                "informationSeal.dateTimeActivation",                   //дата и время активации
                "informationSeal.dateTimeDeactivation",                 //дата и время деактивации
        
                "declaration.customsDeparture",                         //таможенный орган отправления
                "declaration.customsDestination",                       //таможенный орган назначения
                "phoneNumberDriver",                                    //номер телефон водителя
                "declaration.transportationVehicle.plateNo"             //гос. номер АТС
            ]
        }),
      }),
    }),
  }),
});

export const { useTransportationsMutation } = transportationApi;

export default transportationApi;
