import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Autocomplete,
  Toolbar,
  IconButton,
  Tooltip,
  Collapse,
  Divider,
  TextField,
  Box,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  useLocalization,
  useTranslation,
} from '../common/components/LocalizationProvider';
import { sessionActions } from '../store';
import { nativePostMessage } from '../common/components/NativeInterface';
import FilterBar from './FilterBar';

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
  input: {
    minWidth: '300px',
    '& .MuiFormLabel-root': {
      top: '8%',
    },
    '& .MuiInputBase-root': {
      minHeight: '50px',
    },
  },
}));

const MainToolbar = ({ filter, setFilter, filterMap, setFilterMap }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const t = useTranslation();
  const { language } = useLocalization();
  const classes = useStyles();

  const user = useSelector((state) => state.session.user);
  const groups = useSelector((state) => state.groups.items);
  const devices = useSelector((state) => state.devices.items);
  const deviceStatusCount = (status) =>
    Object.values(devices).filter((d) => d.status === status).length;

  const toolbarRef = useRef();

  const [filterOpen, setFilterOpen] = useState(false);
  const [deviceStatusOptions, setDeviceStatusOptions] = useState([]);

  useEffect(() => {
    setDeviceStatusOptions([
      {
        id: 'online',
        label: `${t('deviceStatusOnline')} (${deviceStatusCount('online')})`,
      },
      {
        id: 'offline',
        label: `${t('deviceStatusOffline')} (${deviceStatusCount('offline')})`,
      },
      {
        id: 'unknown',
        label: `${t('deviceStatusUnknown')} (${deviceStatusCount('unknown')})`,
      },
    ]);
  }, [devices]);

  const handleFilter = (field, value) => {
    if (filterMap === false) {
      setFilterMap(true);
    }
    setFilter({ ...filter, [field]: value });
  };

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

  return (
    <Toolbar ref={toolbarRef} className={classes.toolbar}>
      <Box className={classes.toolbarRow}>
        <IconButton
          color='inherit'
          edge='start'
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <FilterAltIcon />
        </IconButton>

        <Tooltip arrow title={t('loginLogout')}>
          <IconButton color='inherit' edge='end' onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Collapse in={filterOpen} sx={{ width: '100%' }}>
        <Divider />
        <Box className={classes.toolbarRow}>
          <Box
            display='flex'
            flexDirection={{ xs: 'column', md: 'row' }}
            gap={1}
          >
            <Autocomplete
              multiple
              className={classes.input}
              options={deviceStatusOptions}
              value={deviceStatusOptions.filter((f) =>
                filter.statuses.some((s) => s === f.id)
              )}
              onChange={(event, value) => {
                const ids = value.map((item) => item?.id || item);
                handleFilter('statuses', ids);
              }}
              // eslint-disable-next-line react/jsx-props-no-spreading
              renderInput={(params) => (
                <TextField {...params} label={t('deviceStatus')} />
              )}
            />
            <Autocomplete
              multiple
              className={classes.input}
              options={Object.values(groups)}
              value={filter.groups}
              onChange={(event, value) => {
                handleFilter('groups', value);
              }}
              // eslint-disable-next-line react/jsx-props-no-spreading
              renderInput={(params) => (
                <TextField {...params} label={t('settingsGroups')} />
              )}
            />

            {/* <FilterBar onChange={(values) => console.log(values)} /> */}
          </Box>
        </Box>
      </Collapse>
    </Toolbar>
  );
};

export default MainToolbar;
