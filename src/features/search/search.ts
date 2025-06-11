import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../api/config";
import { ISearchState, IVideoSearchResult } from "../../models/search";

export const fetchSearchResults = createAsyncThunk<
  IVideoSearchResult[],
  string
>("search/fetchSearchResults", async (query) => {
  try {
    const res = await axios.get(`/search?q=${encodeURIComponent(query)}`);
    return res.data.results;
  } catch (err: any) {
    console.error(err);
  }
});

const initialState: ISearchState = {
  results: [],
  loading: false,
  error: null,
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.results = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSearchResults.fulfilled,
        (state, action: PayloadAction<IVideoSearchResult[]>) => {
          state.loading = false;
          state.results = action.payload;
        }
      )
      .addCase(fetchSearchResults.rejected, (state) => {
        state.loading = false;
        state.error = "Ошибка при поиске";
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;
export const searchReducer = searchSlice.reducer;
