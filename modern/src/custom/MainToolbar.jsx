import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Toolbar,
  IconButton,
  Tooltip,
  Collapse,
  Divider,
  Box,
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
  const [getTransportations] = useTransportationsMutation();

  const t = useTranslation();
  const classes = useStyles();

  const user = useSelector((state) => state.session.user);

  const toolbarRef = useRef();

  const [filterOpen, setFilterOpen] = useState(false);

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
      getTransportations(values);
    } else {
      const devicesResponse = await fetch('/api/devices');
      if (devicesResponse.ok) {
        dispatch(devicesActions.update(await devicesResponse.json()));
        await getTransportations({});
      }
    }
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
          <Box display='flex' flexWrap='wrap' margin='auto' gap={1}>
            <FilterBar onChange={handleFilterBar} />
          </Box>
        </Box>
      </Collapse>
    </Toolbar>
  );
};

export default MainToolbar;
