import { createSlice } from '@reduxjs/toolkit';
import transportationApi from '../services/transportation';

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
  },
  extraReducers: (builder) => {
    builder.addMatcher(transportationApi.endpoints.transportations.matchFulfilled, (state, action) => {
      const payload = action.payload;
      if(payload.total < 1) {
        state.items = {};
      } else {
        payload.data.map((item) => {
          const id = item?.['seals.idFromTraccar'];
          const originItem = state.serverItems[id];
          const mergedItem = {...item, ...originItem, tripId: item.id};
          if(id && state.serverItems.hasOwnProperty(id)) {
            state.items[id] = mergedItem;
          };
        });
      }
    })
  }
});

export { actions as devicesActions };
export { reducer as devicesReducer };
