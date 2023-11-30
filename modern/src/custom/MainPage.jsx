import React from 'react';
import { Alert, Paper, Snackbar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import StatusCard from './StatusCard';
import MobileGroupStatusCard from './MobileGroupStatusCard';
import { devicesActions } from '../store';
import MainMap from './MainMap';
import MainToolbar from './MainToolbar';
import { mobileGroupsActions } from '../store/mobile-groups';
import { useTranslation } from '../common/components/LocalizationProvider';

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
  const t = useTranslation();

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
    (position) => selectedMobileGroupId && position.groupNumber === selectedMobileGroupId
  );

  const device = useSelector((state) => state.devices.items[selectedDeviceId]);

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

      {selectedDeviceId && device?.tripId && (
        <StatusCard
          device={device}
          onClose={() => dispatch(devicesActions.selectId(null))}
        />
      )}

      {selectedMobileGroupId && (
        <MobileGroupStatusCard
          position={selectedMobileGroupPosition}
          onClose={() => dispatch(mobileGroupsActions.selectId(null))}
        />
      )}

      <Snackbar
        open={!!(selectedDeviceId && !device?.tripId)}
        autoHideDuration={2000}
        onClose={() => {
          dispatch(devicesActions.selectId(null));
        }}
      >
        <Alert elevation={6} severity='warning' variant='filled'>
          {t('sharedNoData')}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MainPage;
