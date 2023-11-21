import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'devices',
  initialState: {
    items: {},
    serverItems: {},
    selectedId: null,
    selectedIds: [],
  },
  reducers: {
    refresh(state, action) {
      state.items = {};
      action.payload.forEach((item) => state.items[item.id] = item);
    },
    update(state, action) {
      action.payload.forEach((item) => state.items[item.id] = item);
      state.serverItems = state.items;
    },
    select(state, action) {
      state.selectedId = action.payload;
    },
    selectId(state, action) {
      state.selectedId = action.payload;
      state.selectedIds = state.selectedId ? [state.selectedId] : [];
    },
    selectIds(state, action) {
      state.selectedIds = action.payload;
      [state.selectedId] = state.selectedIds;
    },
    remove(state, action) {
      delete state.items[action.payload];
    },
    updateByAxelor(state, action) {
      const data = action.payload?.data;
      if (data == null) {
        state.items = state.serverItems;
        return;
      }
      if (data?.total < 1) {
        state.items = {};
      } else {
        const items = {};
        data?.data.map((item) => {
          const id = item?.['seals.idFromTraccar'];
          const originItem = state.serverItems[id];
          const mergedItem = { ...item, ...originItem, tripId: item.id };
          if (id && state.serverItems.hasOwnProperty(id)) {
            items[id] = mergedItem;
          }
        });
        state.items = items;
      }
    },
    mergeByAxelor(state, action) {
      const data = action.payload?.data;
      if (data.total < 1) {
        state.items = {};
      } else {
        data.data.map((item) => {
          const id = item?.['seals.idFromTraccar'];
          const originItem = state.serverItems[id];
          const mergedItem = {
            ...item,
            ...originItem,
            tripId: item.id,
            customsDestination: item?.['declaration.customsDestination'].name,
            customsDeparture: item?.['declaration.customsDeparture'].name,
          };
          if (id && state.serverItems.hasOwnProperty(id)) {

            delete mergedItem['declaration.customsDestination'];
            delete mergedItem['declaration.customsDeparture'];

            state.serverItems[id] = mergedItem;
            return state.serverItems[id];
          }
          return null;
        });
      }
    },
    resetByAxelor(state, action) {
      state.items = state.serverItems;
    },
  },
});

export { actions as devicesActions };
export { reducer as devicesReducer };
