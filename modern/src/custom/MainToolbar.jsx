import React, {useEffect, useRef, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Toolbar,
  IconButton,
  Tooltip,
  Collapse,
  Divider,
  Box,
  Badge, Typography
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import { useTranslation } from '../common/components/LocalizationProvider';
import { devicesActions, sessionActions } from '../store';
import { nativePostMessage } from '../common/components/NativeInterface';
import FilterBar from './FilterBar';
import { useTransportationsMutation } from '../services/transportation';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#0f5696',
  },
  toolbarRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
    width: '100%',
    padding: `${theme.spacing(1)} 0`,
    color: '#fff',
  },
  toolbarFilterRow: {
    alignItems: 'center',
    width: '100%',
    padding: `${theme.spacing(1)} 0`,
  },
  input: {
    flexBasis: '300px',
    flexGrow: 1,
    '& .MuiFormLabel-root': {
      top: '8%',
    },
    '& .MuiInputBase-root': {
      minHeight: '50px',
    },
  },
}));

const MainToolbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toolbarRef = useRef();
  const classes = useStyles();
  const [getTransportations] = useTransportationsMutation();

  const t = useTranslation();

  const user = useSelector((state) => state.session.user);
  const devices = useSelector((state) => state.devices);

  const [filterOpen, setFilterOpen] = useState(false);
  const [badgeCount, setBadgeCount] = useState(0);
  const [ensCount, setEnsCount] = useState(0);

  const handleLogout = async () => {
    const notificationToken = window.localStorage.getItem('notificationToken');
    if (notificationToken && !user.readonly) {
      window.localStorage.removeItem('notificationToken');
      const tokens = user.attributes.notificationTokens?.split(',') || [];
      if (tokens.includes(notificationToken)) {
        const updatedUser = {
          ...user,
          attributes: {
            ...user.attributes,
            notificationTokens:
              tokens.length > 1
                ? tokens.filter((it) => it !== notificationToken).join(',')
                : undefined,
          },
        };
        await fetch(`/api/users/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedUser),
        });
      }
    }

    await fetch('/api/session', { method: 'DELETE' });
    nativePostMessage('logout');
    navigate('/login');
    dispatch(sessionActions.updateUser(null));
  };

  const handleFilterBar = async (values) => {
    const isFiltered = Object.values(values).some(
      ([value]) => !!value || value?.length < 1
    );

    if (isFiltered) {

      const data = await getTransportations(isFiltered ? values : {});

      setEnsCount(data?.data?.total ?? 0);

      dispatch(devicesActions.updateByAxelor(data));

    } else {

      dispatch(devicesActions.resetByAxelor());
    }

  };

  const handleFilterBarChanges = (count) => {

    setBadgeCount(count);

    if (count === 0) {
      if (devices.items) {
        setEnsCount(Object.values(devices.items).length);
      }
    }

  };


  useEffect(() => {
    if (devices.items) {
      setEnsCount(Object.values(devices.items).length);
    }
  }, []);


  return (
    <Toolbar ref={toolbarRef} className={classes.toolbar}>

      <Box className={classes.toolbarRow}>

        <Box
          display='flex'
          gap={1}
          sx={{ flexGrow: 1 }}
        >
          <Typography variant="h6">{ t("axelorEnsPositions") }</Typography>

          <Box
              display='flex'
              gap={1}
              alignItems='center'
          >
            <Typography variant="p">{
              `(${t("axelorEnsTotalCount")}: ${ensCount})`
            }</Typography>

          </Box>

        </Box>

        <IconButton
          color='inherit'
          edge='start'
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <Badge badgeContent={badgeCount} color='success'>
            <FilterAltIcon />
          </Badge>
        </IconButton>

        <Tooltip arrow title={t('loginLogout')}>
          <IconButton color='inherit' edge='end' onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Collapse in={filterOpen} sx={{ width: '100%' }}>
        <Divider />
        <Box className={classes.toolbarFilterRow}>
          <Box display='flex' flexWrap='wrap' gap={1}>
            <FilterBar
              onApplyFilter={handleFilterBar}
              onBadgeCountChange={handleFilterBarChanges}
            />
          </Box>
        </Box>
      </Collapse>

    </Toolbar>
  );
};

export default MainToolbar;
