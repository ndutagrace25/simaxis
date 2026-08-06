/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../../utils/axios";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { AppThunk } from "../../store";

export interface TokenUsageReportRow {
  meter_id: string;
  serial_number: string;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  categories: string | null;
  total_amount: string | number;
  total_units: string | number;
  token_count: string | number;
}

interface GetTokenUsageReportPayload {
  month?: number;
  year?: number;
  meterId?: string;
  page?: number;
  limit?: number;
}

interface TokenUsageReportState {
  report: TokenUsageReportRow[];
  reportError: string | null;
  loadingReport: boolean;
  totalMeters: number;
  currentPage: number;
  pageSize: number;
}

const initialState: TokenUsageReportState = {
  report: [],
  reportError: null,
  loadingReport: false,
  totalMeters: 0,
  currentPage: 1,
  pageSize: 10,
};

const tokenUsageReportSlice = createSlice({
  name: "tokenUsageReport",
  initialState,
  reducers: {
    setReport(state, action: PayloadAction<TokenUsageReportRow[]>) {
      state.report = action.payload;
    },
    setReportPagination(
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
    setReportError(state, action: PayloadAction<string | null>) {
      state.reportError = action.payload;
    },
    setLoadingReport(state, action: PayloadAction<boolean>) {
      state.loadingReport = action.payload;
    },
  },
});

export const {
  setReport,
  setReportPagination,
  setReportError,
  setLoadingReport,
} = tokenUsageReportSlice.actions;

export default tokenUsageReportSlice.reducer;

export const getTokenUsageReport =
  (payload: GetTokenUsageReportPayload = {}): AppThunk =>
  async (dispatch) => {
    dispatch(setLoadingReport(true));

    const params = new URLSearchParams();

    if (payload.month) params.set("month", String(payload.month));
    if (payload.year) params.set("year", String(payload.year));
    if (payload.meterId) params.set("meter_id", payload.meterId);
    params.set("page", String(payload.page || 1));
    params.set("limit", String(payload.limit || 10));

    const url = `/tokens/monthly-report?${params.toString()}`;
    try {
      const response = await axiosInstance.get(url);

      dispatch(setReport(response.data.data));
      dispatch(
        setReportPagination({
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
        setReportError(
          error?.response?.data ? error.response.data.message : error.message
        )
      );
    } finally {
      dispatch(setLoadingReport(false));
    }
  };
