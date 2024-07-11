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

interface PaymentState {
  payments: Payment[];
  paymentsError: string | null;
  loadingPayments: boolean;
}

const initialState: PaymentState = {
  payments: [],
  paymentsError: null,
  loadingPayments: false,
};

const paymentSlice = createSlice({
  name: "peyment",
  initialState,
  reducers: {
    // PAYMENTS
    setPayments(state, action: PayloadAction<Payment[]>) {
      state.payments = action.payload;
    },
    setPaymentError(state, action: PayloadAction<string | null>) {
      state.paymentsError = action.payload;
    },
    setLoadingPayments(state, action: PayloadAction<boolean>) {
      state.loadingPayments = action.payload;
    },
  },
});

export const {
  // payments
  setPaymentError,
  setLoadingPayments,
  setPayments,
} = paymentSlice.actions;

export default paymentSlice.reducer;

export const getPayments = (payload?: any): AppThunk => async (dispatch) => {
  dispatch(setLoadingPayments(true));
  try {
    const response = await axiosInstance.get(`/payments?keyword=${payload}`);

    dispatch(setPayments(response.data.payments));
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
