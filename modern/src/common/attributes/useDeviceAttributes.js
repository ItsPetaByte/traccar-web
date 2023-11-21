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
    name: t('axelorTransportationNumber'),
    type: 'string'
  },
  transportationStatus: {
    name: t('axelorTransportationStatus'),
    type: 'string'
  },
  'seals.numberEns': {
    name: t('axelorNumberEns'),
    type: 'string'
  },
  'informationSeal.statusEns': {
    name: t('axelorStatusEns'),
    type: 'string'
  },
  'informationSeal.alarm': {
    name: t('axelorTypeOfAlarm'),
    type: 'string'
  },
  'seals.positionsId.batteryLevel': {
    name: t('axelorBatteryLevel'),
    type: 'string'
  },
  'seals.idFromTraccar': {
    name: t('axelorTraccarIdEns'),
    type: 'string'
  },
  'informationSeal.dateTimeActivation': {
    name: t('axelorDateTimeActivation'),
    type: 'string'
  },
  'informationSeal.dateTimeDeactivation': {
    name: t('axelorDateTimeDeactivation'),
    type: 'string'
  },
  'declaration.customsDeparture.name': {
    name: t('axelorCustomsDeparture'),
    type: 'string'
  },
  'declaration.customsDestination.name': {
    name: t('axelorCustomsDestination'),
    type: 'string'
  },  
  phoneNumberDriver: {
    name: t('axelorPhoneNumberDriver'),
    type: 'string'
  },
  'declaration.transportationVehicle.plateNo' : {
    name: t('axelorDeclarationTransportationVehiclePlateNo'),
    type: 'string'
  },
}), [t]);
