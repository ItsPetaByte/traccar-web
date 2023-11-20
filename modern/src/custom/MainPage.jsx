import React, { useState, useEffect } from 'react';
import { Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useDispatch, useSelector } from 'react-redux';
import StatusCard from './StatusCard';
import MobileGroupStatusCard from './MobileGroupStatusCard';
import { devicesActions } from '../store';
import usePersistedState from '../common/util/usePersistedState';
import useFilter from '../main/useFilter';
import MainMap from './MainMap';
import MainToolbar from './MainToolbar';
import { useAttributePreference } from '../common/util/preferences';
import { mobileGroupsActions } from '../store/mobile-groups';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
  },
  header: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 6,
  },
}));

const MainPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();

  const desktop = useMediaQuery(theme.breakpoints.up('md'));

  const mapOnSelect = useAttributePreference('mapOnSelect', true);
  const mobileGroupsPositions = useSelector(
    (state) => state.mobileGroups.positions
  );
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  const selectedMobileGroupId = useSelector(
    (state) => state.mobileGroups.selectedId
  );

  const positions = useSelector((state) => state.session.positions);
  const devices = useSelector((state) => state.devices.items);
  const [filteredPositions, setFilteredPositions] = useState([]);
  const selectedPosition = filteredPositions.find(
    (position) => selectedDeviceId && position.deviceId === selectedDeviceId
  );

  const selectedMobileGroupPosition = mobileGroupsPositions.find(
    (position) =>
      selectedMobileGroupId && position.groupNumber === selectedMobileGroupId
  );

  const [filteredDevices, setFilteredDevices] = useState([]);

  const [keyword, setKeyword] = useState('');
  const [filter, setFilter] = usePersistedState('filter', {
    statuses: [],
    groups: [],
  });
  const [filterSort, setFilterSort] = usePersistedState('filterSort', '');
  const [filterMap, setFilterMap] = usePersistedState('filterMap', false);

  const [devicesOpen, setDevicesOpen] = useState(desktop);

  useEffect(() => {
    if (!desktop && mapOnSelect && selectedDeviceId) {
      setDevicesOpen(false);
    }
  }, [desktop, mapOnSelect, selectedDeviceId]);

  useFilter(
    keyword,
    filter,
    filterSort,
    filterMap,
    positions,
    setFilteredDevices,
    setFilteredPositions
  );

  return (
    <div className={classes.root}>
      <MainMap
        filteredPositions={filteredPositions}
        selectedPosition={selectedPosition}
        selectedMobileGroupPosition={selectedMobileGroupPosition}
        mobileGroupsPositions={mobileGroupsPositions}
      />
      <Paper square elevation={3} className={classes.header}>
        <MainToolbar
          filteredDevices={filteredDevices}
          devicesOpen={devicesOpen}
          setDevicesOpen={setDevicesOpen}
          keyword={keyword}
          setKeyword={setKeyword}
          filter={filter}
          setFilter={setFilter}
          filterSort={filterSort}
          setFilterSort={setFilterSort}
          filterMap={filterMap}
          setFilterMap={setFilterMap}
        />
      </Paper>
      {selectedDeviceId && (
        <StatusCard
          deviceId={selectedDeviceId}
          position={selectedPosition}
          onClose={() => dispatch(devicesActions.selectId(null))}
        />
      )}

      {selectedMobileGroupId && (
        <MobileGroupStatusCard
          position={selectedMobileGroupPosition}
          onClose={() => dispatch(mobileGroupsActions.selectId(null))}
        />
      )}
    </div>
  );
};

export default MainPage;
