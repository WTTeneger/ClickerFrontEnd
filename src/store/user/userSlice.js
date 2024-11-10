import { createSlice } from '@reduxjs/toolkit';

const locker = {
  rating: {
    name: 'Новичок',
    value: 0
  },
  access_token: null,
  tasks: {
    last_get: 0,
    daylyTasks: {},
    everTasks: {}
  },
  shop_upgrades: {
    data: [],
    last_get: 0,
  },
  autoClicker: {}
}


const initialState = {
  user: {
    gender: 'male',
    last_get: 0,
    finance: {},
    upgrades: {
      unlimitedEnergy: false,
      extraClick: false
    },
    rating: {
      name: 'Новичок',
      value: 0
    },
    name: "<user.name>",
    username: "<user.username>",
    access_token: null,

    tasks: {
      last_get: 0,
      daylyTasks: {},
      everTasks: {}
    },
    shop_upgrades: {
      data: [],
      last_get: 0,
    },
    autoClicker: {

    }
  }
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAccessToken: (state, { payload }) => {
      state.user.access_token = payload;
    },

    setEndGameBox: (state, { payload }) => {
      state?.user?.endbox?.isSeen != null && (state.user.endbox.isSeen = payload)
      console.log(state?.user?.endbox, payload)
    },

    resetCurrentUser: (state, { payload }) => {
      let data = {
        ...state.user,
        ...payload,
        last_get: parseInt(Date.now())
      }
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
      state.user.tasks.everTasks[payload.key] = { ...state.user.tasks.everTasks[payload.key], ...payload.data };
      // Object.keys(payload).length > 0 && (data[payload._id] = payload);
      // state.user.tasks.everTasks = data;
    },

    setAutoClicker: (state, { payload }) => {
      state.user.autoClicker = payload
    },

    updateBalance: (state, { payload }) => {
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
    },
    setError: (state, { payload }) => {
      state.user.error = payload;
    },
    addCoin(state, { payload }) {
      state.user.finance.coinBalance += payload;
      state.user.finance.totalEarned += payload;
    },
    spendCoin(state, { payload }) {
      state.user.finance.coinBalance -= payload;
    },
    spendRoll(state, { payload }) {
      state.user.finance.spinBalance -= payload;
    },

    setBonusWord: (state, { payload }) => {
      state.user.bonus = payload
    },
    setGender: (state, { payload }) => {
      state.user.gender = payload;
    }
  },
});

export const {
  resetCurrentUser, setDevMode, setIdentifier, updateBalance,
  updateEnergy, updateTasks, updateUpgrades, updateEverTaskById,
  setAccessToken, setError, setAutoClicker, setGender, setEndGameBox, setBonusWord,

  // finance tools
  spendRoll,
  addCoin,
  spendCoin

} = userSlice.actions;

export default userSlice.reducer;
