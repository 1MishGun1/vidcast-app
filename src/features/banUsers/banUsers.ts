import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BanState {
  show: boolean;
  reason: string;
  expiresAt: string | null;
  isPermanent: boolean;
}

const initialState: BanState = {
  show: false,
  reason: "",
  expiresAt: null,
  isPermanent: false,
};

const banSlice = createSlice({
  name: "ban",
  initialState,
  reducers: {
    showBanModal: (
      state,
      action: PayloadAction<{
        reason: string;
        expiresAt: string | null;
        isPermanent: boolean;
      }>
    ) => {
      state.show = true;
      state.reason = action.payload.reason;
      state.expiresAt = action.payload.expiresAt;
      state.isPermanent = action.payload.isPermanent;
    },
    hideBanModal: (state) => {
      state.show = false;
      state.reason = "";
      state.expiresAt = null;
      state.isPermanent = false;
    },
  },
});

export const { showBanModal, hideBanModal } = banSlice.actions;
export const banReducer = banSlice.reducer;
