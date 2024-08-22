import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  interface: {
    footer: true,
    header: true,
    aboutLevels: false,
  }
};

export const interfaceSlice = createSlice({
  name: 'interface',
  initialState,
  reducers: {
    setFooter: (state, { payload }) => {
      state.interface.footer = payload;
    },
    setHeader: (state, { payload }) => {
      state.interface.header = payload;
    },
    setAbout: (state, { payload }) => {
      state.interface.aboutLevels = payload;
    }
  }
});

export const {
  setFooter,
  setHeader,
  setAbout
} = interfaceSlice.actions;

export default interfaceSlice.reducer;
