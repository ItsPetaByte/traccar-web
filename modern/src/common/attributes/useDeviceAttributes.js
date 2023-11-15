import { useMemo } from 'react';

export default (t) => useMemo(() => ({
  'web.reportColor': {
    name: t('attributeWebReportColor'),
    type: 'string',
    subtype: 'color',
  },
  devicePassword: {
    name: t('attributeDevicePassword'),
    type: 'string',
  },
  deviceImage: {
    name: t('attributeDeviceImage'),
    type: 'string',
  },
  'processing.copyAttributes': {
    name: t('attributeProcessingCopyAttributes'),
    type: 'string',
  },
  'decoder.timezone': {
    name: t('sharedTimezone'),
    type: 'string',
  },
  deviceInactivityStart: {
    name: t('attributeDeviceInactivityStart'),
    type: 'number',
  },
  deviceInactivityPeriod: {
    name: t('attributeDeviceInactivityPeriod'),
    type: 'number',
  },
  transportationNumber: {
    name: 'transportationNumber',
    type: 'string'
  },
  transportationStatus: {
    name: 'transportationStatus',
    type: 'string'
  },
  "seals.numberEns": {
    name: 'seals.numberEns',
    type: 'string'
  },
  "informationSeal.statusEns": {
    name: 'transportationNumber',
    type: 'string'
  },
  "informationSeal.alarm": {
    name: 'transportationNumber',
    type: 'string'
  },
  "seals.positionsId.batteryLevel": {
    name: 'transportationNumber',
    type: 'string'
  },
  "seals.idFromTraccar": {
    name: 'transportationStatus',
    type: 'string'
  },
  "informationSeal.dateTimeActivation": {
    name: 'transportationStatus',
    type: 'string'
  },
  "informationSeal.dateTimeDeactivation": {
    name: 'transportationStatus',
    type: 'string'
  },
  "declaration.customsDeparture.name": {
    name: 'transportationNumber',
    type: 'string'
  },
  "declaration.customsDestination.name": {
    name: 'transportationStatus',
    type: 'string'
  },  
  phoneNumberDriver: {
    name: 'transportationNumber',
    type: 'string'
  },
  "declaration.transportationVehicle.plateNo" : {
    name: 'transportationStatus',
    type: 'string'
  },
}), [t]);
