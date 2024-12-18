import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import API_BASE_URL from '../../utils/constants.js';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  endpoints: (builder) => ({
    getTasks: builder.mutation({
      query: ({ access_token }) => ({
        url: `tasks`,
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      }),
    }),
    getClicker: builder.mutation({
      query: ({ access_token }) => ({
        url: 'clicker',
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      }),
    }),
    setSeenEndData: builder.mutation({
      query: ({ access_token }) => ({
        url: 'clicker/set-seen-endstage',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      }),
    }),

    getPaylinkToAutoClicker: builder.mutation({
      query: ({ access_token }) => ({
        url: 'clicker/buy-auto-clicker',
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      }),
    }),

    getPaylinkToRoll: builder.mutation({
      query: ({ access_token, count }) => ({
        url: `roll/buy-roll?count=${count}`,
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      }),
    }),

    claimAutoClicker: builder.mutation({
      query: ({ access_token }) => ({
        url: 'clicker/get-bonus',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      }),
    }),


    getDailyReward: builder.mutation({
      query: ({ access_token }) => ({
        url: 'tasks/get-dayly-bonus',
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      }),
    }),

    // обновление данны кликера
    sendInfo: builder.mutation({
      query: ({ access_token, data }) => ({
        url: 'clicker',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        body: {
          ...data,
          timestamp: Date.now()
        }
      }),
    }),


    checkTask: builder.mutation({
      query: ({ access_token, id }) => ({
        url: `tasks/${id}/check`,
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      })
    }),


    genSlot: builder.mutation({
      query: ({ access_token, bet, countLine }) => ({
        url: 'casino/gen-slot',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        body: {
          bet,
          countLine
        }
      })
    }),

    authorization: builder.mutation({
      query: ({ web }) => ({
        url: 'me/auth',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: {
          hash: web.initDataUnsafe,
          data_check_string: web.initData
        }
      })
    }),

    getRefs: builder.mutation({
      query: ({ access_token }) => ({
        url: 'me/refs',
        method: 'get',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      })
    }),

    getClaim: builder.mutation({
      query: ({ access_token }) => ({
        url: 'me/refs/claim',
        method: 'post',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      })
    }),

    getUpgrades: builder.mutation({
      query: ({ access_token }) => ({
        url: 'upgrades',
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      })
    }),
    buyUpgrade: builder.mutation({
      query: ({ access_token, upgradeId }) => ({
        url: 'upgrades/buy',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        body: {
          upgradeId: upgradeId
        }
      })
    }),

    getRatings: builder.mutation({
      query: ({ access_token }) => ({
        url: 'rating',
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      })
    }),

    getRoll: builder.mutation({
      query: ({ access_token }) => ({
        url: 'roll/spin',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      })
    }),


    setGender: builder.mutation({
      query: ({ access_token, gender }) => ({
        url: 'me/selectGender',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        body: {
          gender: gender
        }
      })
    }),

    setWalletAddress: builder.mutation({
      query: ({ access_token, address, type = 'disconnect' }) => ({
        url: 'me/set-crypto-address',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        body: {
          type: type,
          address: address
        }
      })
    }),

    setLanguage: builder.mutation({
      query: ({ access_token, language }) => ({
        url: 'me/set-language',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        body: {
          language: language
        }
      })
    }),
    
    setVibration: builder.mutation({
      query: ({ access_token, vibration }) => ({
        url: 'me/set-vibration',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        body: {
          vibration: vibration
        }
      })
    }),
    setSound: builder.mutation({
      query: ({ access_token, sound }) => ({
        url: 'me/set-sound',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        body: {
          sound: sound
        }
      })
    }),


    getRefers: builder.mutation({
      query: ({ access_token }) => ({
        url: 'lootduck/get-referals',
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
      })
    }),

    setBuy: builder.mutation({
      query: ({ access_token, id }) => ({
        url: 'lootduck/set-is-buyed',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        },
        body: {
          id,
        }
      })
    }),



    getGifts: builder.mutation({
      query: ({ access_token }) => ({
        url: 'super-prize/get-all',
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        }
      })
    }),

    mintGift: builder.mutation({
      query: ({ access_token }) => ({
        url: 'super-prize/open',
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': `Bearer ${access_token}`
        }
      })
    }),

  }),
});

export const {
  useGetClickerMutation, useGetTasksMutation, useSendInfoMutation, useSetSeenEndDataMutation,
  useCheckTaskMutation, useGenSlotMutation, useGetUpgradesMutation, useGetRatingsMutation,
  useBuyUpgradeMutation, useAuthorizationMutation, useGetRollMutation, useGetRefsMutation, useGetClaimMutation,
  useGetPaylinkToAutoClickerMutation, useClaimAutoClickerMutation, useGetDailyRewardMutation, useSetGenderMutation, useSetWalletAddressMutation,
  useGetRefersMutation, useSetBuyMutation, useGetGiftsMutation, useMintGiftMutation, useGetPaylinkToRollMutation,

  useSetLanguageMutation, useSetVibrationMutation, useSetSoundMutation,
} = userApi;
