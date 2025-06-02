import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ISubscription, ISubscriptionsState } from "../../models/subscribe";
import axios from "../../api/config";
import { RootState } from "../../store";

const initialState: ISubscriptionsState = {
  subscriptions: [],
  subscribers: [],
  currentChannelStatus: {
    channelId: null,
    isSubscribed: false,
    subscribersCount: 0,
  },
  loading: false,
  error: null,
};

export const toggleSubscription = createAsyncThunk<
  { channelId: string; isSubscribed: boolean },
  string,
  { state: RootState }
>("auth/toggleSubscription", async (channelId, { getState }) => {
  const { data } = await axios.post(`/subscribe/${channelId}`);
  return data;
});

export const checkSubscription = createAsyncThunk<
  {
    channelId: string;
    isSubscribed: boolean;
    subscribersCount: number;
  },
  string
>("auth/checkSubscription", async (channelId) => {
  const { data } = await axios.get(`/is-subscribed/${channelId}`);
  return { channelId, ...data };
});

export const fetchSubscribersCount = createAsyncThunk<
  { channelId: string; subscribersCount: number },
  string
>("auth/fetchSubscribersCount", async (channelId) => {
  const { data } = await axios.get(`/subscribers-count/${channelId}`);
  return { channelId, ...data };
});

export const subSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    resetChannelStatus: (state) => {
      state.currentChannelStatus = initialState.currentChannelStatus;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(toggleSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        const { channelId, isSubscribed } = action.payload;

        // Обновляем статус текущего канала
        if (state.currentChannelStatus.channelId === channelId) {
          state.currentChannelStatus.isSubscribed = isSubscribed;
          state.currentChannelStatus.subscribersCount += isSubscribed ? 1 : -1;
        }

        // Обновляем общий список подписок
        const index = state.subscriptions.findIndex(
          (sub) => sub.channelId === channelId
        );
        if (index >= 0) {
          state.subscriptions[index].isSubscribed = isSubscribed;
        } else {
          state.subscriptions.push({ channelId, isSubscribed });
        }

        state.loading = false;
      })
      .addCase(toggleSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Subscription error";
      })
      .addCase(checkSubscription.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkSubscription.fulfilled, (state, action) => {
        state.currentChannelStatus = {
          channelId: action.payload.channelId,
          isSubscribed: action.payload.isSubscribed,
          subscribersCount: action.payload.subscribersCount,
        };
        state.loading = false;
      })
      .addCase(fetchSubscribersCount.fulfilled, (state, action) => {
        const { channelId, subscribersCount } = action.payload;

        if (state.currentChannelStatus.channelId === channelId) {
          state.currentChannelStatus.subscribersCount = subscribersCount;
        }
      });
  },
});

export const { resetChannelStatus } = subSlice.actions;
export const subReducer = subSlice.reducer;
