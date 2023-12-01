import React, { useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LinearProgress } from '@mui/material';
import EventPage from '../other/EventPage';
import GeofencesPage from '../other/GeofencesPage';
import NetworkPage from '../other/NetworkPage';
import PositionPage from '../other/PositionPage';
import ChartReportPage from '../reports/ChartReportPage';
import CombinedReportPage from '../reports/CombinedReportPage';
import EventReportPage from '../reports/EventReportPage';
import RouteReportPage from '../reports/RouteReportPage';
import ScheduledPage from '../reports/ScheduledPage';
import StatisticsPage from '../reports/StatisticsPage';
import StopReportPage from '../reports/StopReportPage';
import SummaryReportPage from '../reports/SummaryReportPage';
import TripReportPage from '../reports/TripReportPage';
import AccumulatorsPage from '../settings/AccumulatorsPage';
import CalendarPage from '../settings/CalendarPage';
import CalendarsPage from '../settings/CalendarsPage';
import CommandDevicePage from '../settings/CommandDevicePage';
import CommandGroupPage from '../settings/CommandGroupPage';
import CommandPage from '../settings/CommandPage';
import CommandsPage from '../settings/CommandsPage';
import ComputedAttributePage from '../settings/ComputedAttributePage';
import ComputedAttributesPage from '../settings/ComputedAttributesPage';
import DeviceConnectionsPage from '../settings/DeviceConnectionsPage';
import DevicePage from '../settings/DevicePage';
import DevicesPage from '../settings/DevicesPage';
import DriverPage from '../settings/DriverPage';
import DriversPage from '../settings/DriversPage';
import GeofencePage from '../settings/GeofencePage';
import GroupConnectionsPage from '../settings/GroupConnectionsPage';
import GroupPage from '../settings/GroupPage';
import GroupsPage from '../settings/GroupsPage';
import MaintenancePage from '../settings/MaintenancePage';
import MaintenancesPage from '../settings/MaintenancesPage';
import NotificationPage from '../settings/NotificationPage';
import NotificationsPage from '../settings/NotificationsPage';
import PreferencesPage from '../settings/PreferencesPage';
import ServerPage from '../settings/ServerPage';
import UserConnectionsPage from '../settings/UserConnectionsPage';
import UserPage from '../settings/UserPage';
import UsersPage from '../settings/UsersPage';
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

        <Route path="position/:id" element={<PositionPage />} />
        <Route path="network/:positionId" element={<NetworkPage />} />
        <Route path="event/:id" element={<EventPage />} />
        <Route path="replay" element={<ReplayPage />} />
        <Route path="geofences" element={<GeofencesPage />} />

        <Route path="settings">
          <Route path="accumulators/:deviceId" element={<AccumulatorsPage />} />
          <Route path="calendars" element={<CalendarsPage />} />
          <Route path="calendar/:id" element={<CalendarPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="commands" element={<CommandsPage />} />
          <Route path="command/:id" element={<CommandPage />} />
          <Route path="command" element={<CommandPage />} />
          <Route path="attributes" element={<ComputedAttributesPage />} />
          <Route path="attribute/:id" element={<ComputedAttributePage />} />
          <Route path="attribute" element={<ComputedAttributePage />} />
          <Route path="devices" element={<DevicesPage />} />
          <Route path="device/:id/connections" element={<DeviceConnectionsPage />} />
          <Route path="device/:id/command" element={<CommandDevicePage />} />
          <Route path="device/:id" element={<DevicePage />} />
          <Route path="device" element={<DevicePage />} />
          <Route path="drivers" element={<DriversPage />} />
          <Route path="driver/:id" element={<DriverPage />} />
          <Route path="driver" element={<DriverPage />} />
          <Route path="geofence/:id" element={<GeofencePage />} />
          <Route path="geofence" element={<GeofencePage />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="group/:id/connections" element={<GroupConnectionsPage />} />
          <Route path="group/:id/command" element={<CommandGroupPage />} />
          <Route path="group/:id" element={<GroupPage />} />
          <Route path="group" element={<GroupPage />} />
          <Route path="maintenances" element={<MaintenancesPage />} />
          <Route path="maintenance/:id" element={<MaintenancePage />} />
          <Route path="maintenance" element={<MaintenancePage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="notification/:id" element={<NotificationPage />} />
          <Route path="notification" element={<NotificationPage />} />
          <Route path="preferences" element={<PreferencesPage />} />
          <Route path="server" element={<ServerPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="user/:id/connections" element={<UserConnectionsPage />} />
          <Route path="user/:id" element={<UserPage />} />
          <Route path="user" element={<UserPage />} />
        </Route>

        <Route path="reports">
          <Route path="combined" element={<CombinedReportPage />} />
          <Route path="chart" element={<ChartReportPage />} />
          <Route path="event" element={<EventReportPage />} />
          <Route path="route" element={<RouteReportPage />} />
          <Route path="stop" element={<StopReportPage />} />
          <Route path="summary" element={<SummaryReportPage />} />
          <Route path="trip" element={<TripReportPage />} />
          <Route path="scheduled" element={<ScheduledPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default Navigation;
