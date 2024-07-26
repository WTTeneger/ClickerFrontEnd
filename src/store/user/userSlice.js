import { createSlice } from '@reduxjs/toolkit';

const locker = {
  rating: {
    name: 'Новичек',
    value: 0
  },
  access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTY5NDUyOTEyLCJpYXQiOjE3MjE0MzgyNTcsImV4cCI6MTcyMjA0MzA1N30.XWSQi1Z-19-f40CG3btZ-y6n4pmRg7oEEIkR2Rf5LwU",
  tasks: {
    last_get: 0,
    daylyTasks: {},
    everTasks: {}
  },
  shop_upgrades: {
    data: [],
    last_get: 0,
  }
}


const initialState = {
  user: {
    last_get: 0,
    finance: {},
    upgrades: {
      unlimitedEnergy: false,
      extraClick: false
    },
    rating: {
      name: 'Новичек',
      value: 0
    },
    name: "<user.name>",
    username: "<user.username>",
    access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTY5NDUyOTEyLCJpYXQiOjE3MjE0MzgyNTcsImV4cCI6MTcyMjA0MzA1N30.XWSQi1Z-19-f40CG3btZ-y6n4pmRg7oEEIkR2Rf5LwU",

    tasks: {
      last_get: 0,
      daylyTasks: {},
      everTasks: {}
    },
    shop_upgrades: {
      data: [],
      last_get: 0,
    }
  }
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetCurrentUser: (state, { payload }) => {
      let data = {
        ...state.user,
        ...payload,
        last_get: parseInt(Date.now())
      }
      console.log(data)
      state.user = data
    },
    updateTasks: (state, { payload }) => {
      state.user.tasks = {
        ...locker.tasks,
        ...payload,
        last_get: parseInt(Date.now())
      };
    },

    updateUpgrades: (state, { payload }) => {
      let _payload = { data: payload }
      state.user.shop_upgrades = {
        ...locker.shop_upgrades,
        ..._payload,
        last_get: parseInt(Date.now())
      };
    },

    updateEverTaskById: (state, { payload }) => {
      console.log(payload.key, state.user.tasks.everTasks[payload.key].title)
      state.user.tasks.everTasks[payload.key] = { ...state.user.tasks.everTasks[payload.key], ...payload.data };
      // Object.keys(payload).length > 0 && (data[payload._id] = payload);
      // state.user.tasks.everTasks = data;
    },


    updateBalance: (state, { payload }) => {
      console.log('state.user', { ...state.user.finance }, { ...payload })
      Object.keys(payload).length > 0 && (state.user.finance.coinBalance = payload);
      // state.totalEarned = state.totalEarned + payload;
    },
    updateEnergy: (state, { payload }) => {
      state.user.energy = payload;
    },
    resetReferralData: (state, { payload }) => {
      state.user.referralData = payload;
    },
    changeCurrentUserValue: (state, { payload }) => {
      state.user.currentUser[payload.name] = payload.value;
    },
    setDevMode: (state, { payload }) => {
      state.user.isDevMode = true;
    },
    setIdentifier: (state, { payload }) => {
      state.user.identifier = payload;
    }
  },
});

export const { resetCurrentUser, setDevMode, setIdentifier, updateBalance, updateEnergy, updateTasks, updateUpgrades, updateEverTaskById } = userSlice.actions;

export default userSlice.reducer;
