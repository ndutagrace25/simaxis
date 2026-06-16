/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "../../utils/axios";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { AppThunk } from "../../store";
import { ReactElement } from "react";

export interface Payment {
  id: string;
  customer_id: string;
  meter_id: string;
  payment_date: string;
  amount: number | string;
  payment_method: string;
  phone_number: string;
  meter_number: string;
  payment_code: string;
  action?: string | ReactElement;
}

interface RevenueDataPoint {
  period: string;
  revenue: number;
  date: string;
  kplc?: number;
  siMaxis?: number;
  esperanza?: number;
}

interface GetPaymentsPayload {
  keyword?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

interface PaymentState {
  payments: Payment[];
  paymentsError: string | null;
  loadingPayments: boolean;
  totalPayments: number;
  currentPaymentsPage: number;
  paymentsPageSize: number;
  revenue: RevenueDataPoint[];
  revenueError: string | null;
  loadingRevenue: boolean;
}

const initialState: PaymentState = {
  payments: [],
  paymentsError: null,
  loadingPayments: false,
  totalPayments: 0,
  currentPaymentsPage: 1,
  paymentsPageSize: 10,
  revenue: [],
  revenueError: null,
  loadingRevenue: false,
};

const paymentSlice = createSlice({
  name: "peyment",
  initialState,
  reducers: {
    // PAYMENTS
    setPayments(state, action: PayloadAction<Payment[]>) {
      state.payments = action.payload;
    },
    setPaymentPagination(
      state,
      action: PayloadAction<{
        total: number;
        page: number;
        limit: number;
      }>
    ) {
      state.totalPayments = action.payload.total;
      state.currentPaymentsPage = action.payload.page;
      state.paymentsPageSize = action.payload.limit;
    },
    setPaymentError(state, action: PayloadAction<string | null>) {
      state.paymentsError = action.payload;
    },
    setLoadingPayments(state, action: PayloadAction<boolean>) {
      state.loadingPayments = action.payload;
    },
    // REVENUE
    setRevenue(state, action: PayloadAction<RevenueDataPoint[]>) {
      state.revenue = action.payload;
    },
    setRevenueError(state, action: PayloadAction<string | null>) {
      state.revenueError = action.payload;
    },
    setLoadingRevenue(state, action: PayloadAction<boolean>) {
      state.loadingRevenue = action.payload;
    },
  },
});

export const {
  // payments
  setPaymentError,
  setLoadingPayments,
  setPaymentPagination,
  setPayments,
  // revenue
  setRevenue,
  setRevenueError,
  setLoadingRevenue,
} = paymentSlice.actions;

export default paymentSlice.reducer;

export const getPayments =
  (payload: GetPaymentsPayload = {}): AppThunk =>
  async (dispatch) => {
    dispatch(setLoadingPayments(true));
    try {
      const params = new URLSearchParams();

      if (payload.keyword) params.set("keyword", payload.keyword);
      if (payload.startDate) params.set("start_date", payload.startDate);
      if (payload.endDate) params.set("end_date", payload.endDate);
      params.set("page", String(payload.page || 1));
      params.set("limit", String(payload.limit || 10));

      const response = await axiosInstance.get(`/payments?${params.toString()}`);

      dispatch(setPayments(response.data.payments));
      dispatch(
        setPaymentPagination({
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
        setPaymentError(
          error?.response?.data ? error.response.data.message : error.message
        )
      );
    } finally {
      dispatch(setLoadingPayments(false));
    }
  };

export const getRevenueData =
  (payload?: any): AppThunk =>
  async (dispatch) => {
    dispatch(setLoadingRevenue(true));
    try {
      const response = await axiosInstance.get(
        `/payments/revenue?filterType=${payload.filterType}&selectedDate=${payload.selectedDate}`
      );
      dispatch(setRevenue(response.data.data));
    } catch (error: any) {
      dispatch(setRevenueError(error.message));
    } finally {
      dispatch(setLoadingRevenue(false));
    }
  };
