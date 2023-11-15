import { grey } from '@mui/material/colors';
import createPalette from '@mui/material/styles/createPalette';
import { loadImage, prepareIcon } from './mapUtil';

import directionSvg from '../../resources/images/direction.svg';
import backgroundSvg from '../../resources/images/background.svg';
import animalSvg from '../../resources/images/icon/animal.svg';
import bicycleSvg from '../../resources/images/icon/bicycle.svg';
import boatSvg from '../../resources/images/icon/boat.svg';
import busSvg from '../../resources/images/icon/bus.svg';
import carSvg from '../../resources/images/icon/car.svg';
import craneSvg from '../../resources/images/icon/crane.svg';
import defaultSvg from '../../resources/images/icon/default.svg';
import helicopterSvg from '../../resources/images/icon/helicopter.svg';
import motorcycleSvg from '../../resources/images/icon/motorcycle.svg';
import offroadSvg from '../../resources/images/icon/offroad.svg';
import personSvg from '../../resources/images/icon/person.svg';
import pickupSvg from '../../resources/images/icon/pickup.svg';
import planeSvg from '../../resources/images/icon/plane.svg';
import scooterSvg from '../../resources/images/icon/scooter.svg';
import shipSvg from '../../resources/images/icon/ship.svg';
import tractorSvg from '../../resources/images/icon/tractor.svg';
import trainSvg from '../../resources/images/icon/train.svg';
import tramSvg from '../../resources/images/icon/tram.svg';
import trolleybusSvg from '../../resources/images/icon/trolleybus.svg';
import truckSvg from '../../resources/images/icon/truck.svg';
import vanSvg from '../../resources/images/icon/van.svg';
import truckDefaultSvg from '../../resources/images/icon/truck-default.svg';
import mobileGroupSvg from '../../resources/images/icon/mobileGroup.svg';
import truckBlueSvg from '../../resources/images/icon/truck-blue.svg';
import truckGreenSvg from '../../resources/images/icon/truck-green.svg';
import truckRedSvg from '../../resources/images/icon/truck-red.svg';
import truckGreySvg from '../../resources/images/icon/truck-grey.svg';

export const mapIcons = {
  animal: animalSvg,
  bicycle: bicycleSvg,
  boat: boatSvg,
  bus: busSvg,
  car: carSvg,
  crane: craneSvg,
  default: defaultSvg,
  helicopter: helicopterSvg,
  motorcycle: motorcycleSvg,
  offroad: offroadSvg,
  person: personSvg,
  pickup: pickupSvg,
  plane: planeSvg,
  scooter: scooterSvg,
  ship: shipSvg,
  tractor: tractorSvg,
  train: trainSvg,
  tram: tramSvg,
  trolleybus: trolleybusSvg,
  truck: truckSvg,
  van: vanSvg,
  mobileGroup: mobileGroupSvg,
  truckDefault: truckDefaultSvg,
  truckBlue: truckBlueSvg,
  truckGreen: truckGreenSvg,
  truckRed: truckRedSvg,
  truckGrey: truckGreySvg,
};

export const mapIconKey = (category) => (mapIcons.hasOwnProperty(category) ? category : 'default');

export const mapImages = {};

const mapPalette = createPalette({
  neutral: { main: grey[500] },
  primary: { main: '#2196f3' },
  secondary: { main: '#00f5bc' },
  success: { main: '#45de4b' },
  error: { main: '#f44336' },
  warning: { main: '#ff9800' },
  info: { main: '#2196f3' },
  light: { main: '#f5f5f5' },
  dark: { main: '#212121' },
});

export default async () => {
  const background = await loadImage(backgroundSvg);
  mapImages.background = await prepareIcon(background);
  mapImages.direction = await prepareIcon(await loadImage(directionSvg));
  await Promise.all(Object.keys(mapIcons).map(async (category) => {
    const results = [];
    ['primary', 'secondary', 'success', 'error', 'warning', 'info', 'light', 'dark', 'neutral'].forEach((color) => {
      results.push(loadImage(mapIcons[category]).then((icon) => {
        if (!category.includes('truck')) {
          mapImages[`${category}-${color}`] = prepareIcon(background, icon, mapPalette[color].main);
        } else {
          mapImages[`${category}-${color}`] = icon;
        }
      }));
    });
    await Promise.all(results);
  }));
};
