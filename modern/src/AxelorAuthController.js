import { useDispatch, useSelector, connect } from 'react-redux';
import { sessionActions } from './store';
import { http } from './services/AxelorFetchService';
import { useEffectAsync } from './reactHelper';

const AxelorAuthController = () => {
  const authenticated = useSelector((state) => !!state.session.user);
  // const token = useSelector((state) => state.session?.axelor);
  const dispatch = useDispatch();

  const user = { username: 'admin', password: 'Admin2023' };

  useEffectAsync(async () => {
    if (authenticated) {
      const response = await fetch('/api/users/axelor', {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'application/json', Authorization: `Basic ${btoa('admin:traccar2023')}` },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(sessionActions.updateAxelor(data));
      } else {
        throw Error(await response.text());
      }
    }
  }, [authenticated]);

  useEffectAsync(async () => {
    if (!authenticated) return;
      const response = await fetch(`${import.meta.env.APP_AXE_DOMAIN}login.jsp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;',
        },
        body: user,
      });

      if (response.ok) {
        const {headers} = response;
        console.log(headers, 'headers');
        console.log(response, "data");
      } else {
        throw Error(await response.text());
      }
  }, [authenticated]);

  return null;
};

export default connect()(AxelorAuthController);
