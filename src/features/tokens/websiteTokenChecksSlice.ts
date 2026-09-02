/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../../utils/axios";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { AppThunk } from "../../store";

export interface WebsiteTokenCheckSummaryRow {
  meter_number: string;
  number_of_checks: string | number;
  last_check: string;
}

interface GetWebsiteTokenCheckSummaryPayload {
  page?: number;
  limit?: number;
}

interface WebsiteTokenChecksState {
  summary: WebsiteTokenCheckSummaryRow[];
  summaryError: string | null;
  loadingSummary: boolean;
  totalMeters: number;
  currentPage: number;
  pageSize: number;
}

const initialState: WebsiteTokenChecksState = {
  summary: [],
  summaryError: null,
  loadingSummary: false,
  totalMeters: 0,
  currentPage: 1,
  pageSize: 10,
};

const websiteTokenChecksSlice = createSlice({
  name: "websiteTokenChecks",
  initialState,
  reducers: {
    setSummary(state, action: PayloadAction<WebsiteTokenCheckSummaryRow[]>) {
      state.summary = action.payload;
    },
    setSummaryPagination(
      state,
      action: PayloadAction<{
        total: number;
        page: number;
        limit: number;
      }>
    ) {
      state.totalMeters = action.payload.total;
      state.currentPage = action.payload.page;
      state.pageSize = action.payload.limit;
    },
    setSummaryError(state, action: PayloadAction<string | null>) {
      state.summaryError = action.payload;
    },
    setLoadingSummary(state, action: PayloadAction<boolean>) {
      state.loadingSummary = action.payload;
    },
  },
});

export const {
  setSummary,
  setSummaryPagination,
  setSummaryError,
  setLoadingSummary,
} = websiteTokenChecksSlice.actions;

export default websiteTokenChecksSlice.reducer;

export const getWebsiteTokenCheckSummary =
  (payload: GetWebsiteTokenCheckSummaryPayload = {}): AppThunk =>
  async (dispatch) => {
    dispatch(setLoadingSummary(true));

    const params = new URLSearchParams();

    params.set("page", String(payload.page || 1));
    params.set("limit", String(payload.limit || 10));

    const url = `/website-token-checks?${params.toString()}`;
    try {
      const response = await axiosInstance.get(url);

      dispatch(setSummary(response.data.data));
      dispatch(
        setSummaryPagination({
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
        setSummaryError(
          error?.response?.data ? error.response.data.message : error.message
        )
      );
    } finally {
      dispatch(setLoadingSummary(false));
    }
  };
