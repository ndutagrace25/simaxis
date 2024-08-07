import axiosInstance from "../../utils/axios";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { AppThunk } from "../../store";

export interface Token {
  id: string;
  token: string;
  meter_id: string;
  issue_date: string;
  amount: string | number;
  total_units: string | number;
  token_type: string;
  created_at: string;
  Meter: {
    serial_number: string;
  };
}

interface TokenState {
  tokens: Token[];
  tokensError: string | null;
  loadingTokens: boolean;
}

const initialState: TokenState = {
  tokens: [],
  tokensError: null,
  loadingTokens: false,
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    // TOKENS
    setTokens(state, action: PayloadAction<Token[]>) {
      state.tokens = action.payload;
    },
    setTokenError(state, action: PayloadAction<string | null>) {
      state.tokensError = action.payload;
    },
    setLoadingTokens(state, action: PayloadAction<boolean>) {
      state.loadingTokens = action.payload;
    },
  },
});

export const {
  // tokens
  setTokenError,
  setLoadingTokens,
  setTokens,
} = tokenSlice.actions;

export default tokenSlice.reducer;

export const getTokens =
  (payload?: any): AppThunk =>
  async (dispatch) => {
    dispatch(setLoadingTokens(true));

    let url = `/tokens`;

    if (payload) url += `?meter_id=${payload}`;
    try {
      const response = await axiosInstance.get(url);

      dispatch(setTokens(response.data.tokens));
    } catch (error: any) {
      if (error?.response?.status === 401) {
        window.location.href = "/";
      }
      Swal.fire(
        "Error",
        error?.response?.data ? error.response.data.message : error.message,
        "error"
      );
      dispatch(
        setTokenError(
          error?.response?.data ? error.response.data.message : error.message
        )
      );
    } finally {
      dispatch(setLoadingTokens(false));
    }
  };
