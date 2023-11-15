import React, { useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LinearProgress } from '@mui/material';
import ReplayPage from './ReplayPage';
import MainPage from './MainPage';
import LoginPage from '../login/LoginPage';
import useQuery from '../common/util/useQuery';
import { useEffectAsync } from '../reactHelper';
import { devicesActions } from '../store';
import App from './App';

const Navigation = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [redirectsHandled, setRedirectsHandled] = useState(false);

  const { pathname } = useLocation();
  const query = useQuery();

  useEffectAsync(async () => {
    if (query.get('token')) {
      const token = query.get('token');
      await fetch(`/api/session?token=${encodeURIComponent(token)}`);
      navigate(pathname);
    } else if (query.get('deviceId')) {
      const deviceId = query.get('deviceId');
      const response = await fetch(`/api/devices?uniqueId=${deviceId}`);
      if (response.ok) {
        const items = await response.json();
        if (items.length > 0) {
          dispatch(devicesActions.selectId(items[0].id));
        }
      } else {
        throw Error(await response.text());
      }
      navigate('/');
    } else if (query.get('eventId')) {
      const eventId = parseInt(query.get('eventId'), 10);
      navigate(`/event/${eventId}`);
    } else {
      setRedirectsHandled(true);
    }
  }, [query]);

  if (!redirectsHandled) {
    return <LinearProgress />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<App />}>
        <Route index element={<MainPage />} />
        <Route path="replay" element={<ReplayPage />} />
      </Route>
    </Routes>
  );
};

export default Navigation;
