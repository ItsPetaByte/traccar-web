import React from 'react';
import { Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import StatusCard from './StatusCard';
import MobileGroupStatusCard from './MobileGroupStatusCard';
import { devicesActions } from '../store';
import MainMap from './MainMap';
import MainToolbar from './MainToolbar';
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

  const mobileGroupsPositions = useSelector(
    (state) => state.mobileGroups.positions
  );
  const selectedDeviceId = useSelector((state) => state.devices.selectedId);
  const selectedMobileGroupId = useSelector(
    (state) => state.mobileGroups.selectedId
  );
  const positions = useSelector((state) => state.session.positions);
  const filteredPositions = Object.values(positions);
  const selectedPosition = filteredPositions.find(
    (position) => selectedDeviceId && position.deviceId === selectedDeviceId
  );
  const selectedMobileGroupPosition = mobileGroupsPositions.find(
    (position) =>
      selectedMobileGroupId && position.groupNumber === selectedMobileGroupId
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
        <MainToolbar />
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
