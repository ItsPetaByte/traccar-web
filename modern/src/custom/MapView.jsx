import 'maplibre-gl/dist/maplibre-gl.css';
import maplibregl from 'maplibre-gl';
import React, {
  useRef, useLayoutEffect, useEffect, useState,
} from 'react';
import { SwitcherControl } from '../map/switcher/switcher';
import { FullscreenControl } from '../map/fullscreen/fullscreen';
import { useAttributePreference, usePreference } from '../common/util/preferences';
import usePersistedState, { savePersistedState } from '../common/util/usePersistedState';
import { mapImages } from '../map/core/preloadImages';
import useMapStyles from '../map/core/useMapStyles';

const element = document.createElement('div');
element.style.width = '100%';
element.style.height = '100%';
element.style.boxSizing = 'initial';

export const map = new maplibregl.Map({
  container: element,
  attributionControl: false,
  zoom: 6,
  maxZoom: 18,
  center: [75.06, 41.84],
  maxBounds: [[68.0, 39.0], [81.0, 44.0]],
});

let ready = false;
const readyListeners = new Set();

const addReadyListener = (listener) => {
  readyListeners.add(listener);
  listener(ready);
};

const removeReadyListener = (listener) => {
  readyListeners.delete(listener);
};

const updateReadyValue = (value) => {
  ready = value;
  readyListeners.forEach((listener) => listener(value));
};

const initMap = async () => {
  if (ready) return;
  if (!map.hasImage('background')) {
    Object.entries(mapImages).forEach(([key, value]) => {
      map.addImage(key, value, {
        pixelRatio: window.devicePixelRatio,
      });
    });
  }
  updateReadyValue(true);
};

map.addControl(new maplibregl.NavigationControl(), 'bottom-right');

const switcher = new SwitcherControl(
  () => updateReadyValue(false),
  (styleId) => savePersistedState('selectedMapStyle', styleId),
  () => {
    map.once('styledata', () => {
      const waiting = () => {
        if (!map.loaded()) {
          setTimeout(waiting, 33);
        } else {
          initMap();
        }
      };
      waiting();
    });
  },
);


map.addControl(switcher, 'bottom-right');
map.addControl(new FullscreenControl(), 'bottom-right');

const MapView = ({ children }) => {
  const containerEl = useRef(null);

  const [mapReady, setMapReady] = useState(false);

  const mapStyles = useMapStyles();
  const activeMapStyles = useAttributePreference('activeMapStyles', 'locationIqStreets,osm,carto');
  const [defaultMapStyle] = usePersistedState('selectedMapStyle', usePreference('map', 'locationIqStreets'));
  const mapboxAccessToken = useAttributePreference('mapboxAccessToken');
  const maxZoom = useAttributePreference('web.maxZoom');

  // useEffect(() => {
  //   const fullscreenControl = new maplibregl.FullscreenControl({});
  //   map.addControl(fullscreenControl, 'bottom-right');
  //   return () => map.removeControl(fullscreenControl);
  // }, []);


  useEffect(() => {
    if (maxZoom) {
      map.setMaxZoom(maxZoom);
    }
  }, [maxZoom]);

  useEffect(() => {
    maplibregl.accessToken = mapboxAccessToken;
  }, [mapboxAccessToken]);

  useEffect(() => {
    const filteredStyles = mapStyles.filter((s) => s.available && activeMapStyles.includes(s.id));
    const styles = filteredStyles.length ? filteredStyles : mapStyles.filter((s) => s.id === 'osm');
    switcher.updateStyles(styles, defaultMapStyle);
  }, [mapStyles, defaultMapStyle]);

  useEffect(() => {
    const listener = (ready) => setMapReady(ready);
    addReadyListener(listener);
    return () => {
      removeReadyListener(listener);
    };
  }, []);

  useLayoutEffect(() => {
    const currentEl = containerEl.current;
    currentEl.appendChild(element);
    map.resize();
    return () => {
      currentEl.removeChild(element);
    };
  }, [containerEl]);

  return (
    <div style={{ width: '100%', height: '100%' }} ref={containerEl}>
      {mapReady && children}
    </div>
  );
};

export default MapView;
