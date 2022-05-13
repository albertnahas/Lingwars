/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DrawerState, State, UserState } from '../types/state';
import { User } from '../types/user';

const initialState: DrawerState = {};

export const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    setDrawer: (state: DrawerState, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
  }
});
export const drawerSelector = (state: State) => state.drawer.open

// Action creators are generated for each case reducer function
export const { setDrawer } = drawerSlice.actions;

export default drawerSlice.reducer;
