import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'transportationStatuses',
  initialState: {
    items: {},
    selectedId: null,
    selectedIds: [],
  },
  reducers: {
    refresh(state, action) {
      state.items = {};
      action.payload.forEach((item) => state.items[item.value] = item);
    },
    update(state, action) {
      console.log(action.payload.data);
      action.payload.data.forEach((item) => state.items[item.value] = item);
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
});

export { actions as transportationStatusesActions };
export { reducer as transportationStatusesReducer };