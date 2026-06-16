/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface GetTokensPayload {
  meterId?: string;
  page?: number;
  limit?: number;
}

interface TokenState {
  tokens: Token[];
  tokensError: string | null;
  loadingTokens: boolean;
  resendingToken: boolean;
  totalTokens: number;
  currentPage: number;
  pageSize: number;
}

const initialState: TokenState = {
  tokens: [],
  tokensError: null,
  loadingTokens: false,
  resendingToken: false,
  totalTokens: 0,
  currentPage: 1,
  pageSize: 10,
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    // TOKENS
    setTokens(state, action: PayloadAction<Token[]>) {
      state.tokens = action.payload;
    },
    setTokenPagination(
      state,
      action: PayloadAction<{
        total: number;
        page: number;
        limit: number;
      }>
    ) {
      state.totalTokens = action.payload.total;
      state.currentPage = action.payload.page;
      state.pageSize = action.payload.limit;
    },
    setTokenError(state, action: PayloadAction<string | null>) {
      state.tokensError = action.payload;
    },
    setLoadingTokens(state, action: PayloadAction<boolean>) {
      state.loadingTokens = action.payload;
    },
    setResendingToken(state, action: PayloadAction<boolean>) {
      state.resendingToken = action.payload;
    },
  },
});

export const {
  // tokens
  setTokenError,
  setLoadingTokens,
  setTokenPagination,
  setTokens,
  setResendingToken,
} = tokenSlice.actions;

export default tokenSlice.reducer;

export const getTokens =
  (payload: GetTokensPayload = {}): AppThunk =>
  async (dispatch) => {
    dispatch(setLoadingTokens(true));

    const params = new URLSearchParams();

    if (payload.meterId) params.set("meter_id", payload.meterId);
    params.set("page", String(payload.page || 1));
    params.set("limit", String(payload.limit || 10));

    const url = `/tokens?${params.toString()}`;
    try {
      const response = await axiosInstance.get(url);

      dispatch(setTokens(response.data.tokens));
      dispatch(
        setTokenPagination({
          total: response.data.total || 0,
          page: response.data.page || payload.page || 1,
          limit: response.data.limit || payload.limit || 10,
        })
      );
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

  export const sendTokensManually =
    (payload: any): AppThunk =>
    async (dispatch) => {
      dispatch(setResendingToken(true));
      try {
        const response = await axiosInstance.post(`/tokens/send-tokens-manually`, payload);
        Swal.fire("Success", response.data.message, "success");
        dispatch(setResendingToken(false));
      } catch (error: any) {
        dispatch(setResendingToken(false));
        Swal.fire(
          "Error",
          error?.response?.data ? error.response.data.message : error.message,
          "error"
        );
        dispatch(
          setTokenError(error?.response?.data ? error.response.data.message : error.message)
        );
      }
    };
