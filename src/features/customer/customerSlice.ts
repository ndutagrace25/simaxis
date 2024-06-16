import axiosInstance from "../../utils/axios";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { AppThunk } from "../../store";
import { ReactElement } from "react";

export interface Customer {
  id: string;
  user_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  national_id: number;
  location: string;
  is_active: boolean;
  is_verified: boolean | ReactElement;
  is_synced_to_stron: boolean | ReactElement;
  created_at: string | Date;
  User: {
    phone: string;
    email: string;
  };
  action?: ReactElement;
  building_name?: string;
}

export interface Landlord {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  location: string;
  building_name: string;
}

interface VeryfyCustomerResponse {
  statusCode?: number;
  message?: string;
}

interface CustomerState {
  customers: Customer[];
  customersError: string | null;
  loadingCustomers: boolean;
  verifiedCustomer: VeryfyCustomerResponse;
  veryfyingCustomer: boolean;
  veryfyingCustomerError: string | null;
  updatedCustomer: VeryfyCustomerResponse;
  updatingCustomer: boolean;
  updatingCustomerError: string | null;
  landlords: Landlord[];
  landlordsError: string | null;
  loadingLandlords: boolean;
}

const initialState: CustomerState = {
  customers: [],
  customersError: null,
  loadingCustomers: false,
  verifiedCustomer: {},
  veryfyingCustomer: false,
  veryfyingCustomerError: null,
  updatedCustomer: {},
  updatingCustomer: false,
  updatingCustomerError: null,
  landlords: [],
  landlordsError: null,
  loadingLandlords: false,
};

const authSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    // CUSTOMERS
    setCustomers(state, action: PayloadAction<Customer[]>) {
      state.customers = action.payload;
    },
    setCustomersError(state, action: PayloadAction<string | null>) {
      state.customersError = action.payload;
    },
    setLoadingCustomers(state, action: PayloadAction<boolean>) {
      state.loadingCustomers = action.payload;
    },
    // VERYFY CUSTOMER
    setVerifyCustomer(state, action: PayloadAction<VeryfyCustomerResponse>) {
      state.verifiedCustomer = action.payload;
    },
    setVerifyCustomerError(state, action: PayloadAction<string | null>) {
      state.veryfyingCustomerError = action.payload;
    },
    setVerifyingCustomer(state, action: PayloadAction<boolean>) {
      state.veryfyingCustomer = action.payload;
    },
    // UPDATE CUSTOMER
    setUpdateCustomer(state, action: PayloadAction<VeryfyCustomerResponse>) {
      state.updatedCustomer = action.payload;
    },
    setUpdateCustomerError(state, action: PayloadAction<string | null>) {
      state.updatingCustomerError = action.payload;
    },
    setUpdatingCustomer(state, action: PayloadAction<boolean>) {
      state.updatingCustomer = action.payload;
    },
    // LANDLORDS
    setLandlords(state, action: PayloadAction<Landlord[]>) {
      state.landlords = action.payload;
    },
    setLandlordsError(state, action: PayloadAction<string | null>) {
      state.landlordsError = action.payload;
    },
    setLoadingLandlords(state, action: PayloadAction<boolean>) {
      state.loadingLandlords = action.payload;
    },
  },
});

export const {
  // customers
  setCustomersError,
  setLoadingCustomers,
  setCustomers,
  // verify customer
  setVerifyCustomer,
  setVerifyCustomerError,
  setVerifyingCustomer,
  // update customer
  setUpdateCustomer,
  setUpdateCustomerError,
  setUpdatingCustomer,
  // landlords
  setLandlords,
  setLandlordsError,
  setLoadingLandlords,
} = authSlice.actions;

export default authSlice.reducer;

export const getCustomers = (): AppThunk => async (dispatch) => {
  dispatch(setLoadingCustomers(true));
  try {
    const response = await axiosInstance.get(`/customer`);

    dispatch(setCustomers(response.data.customers));
  } catch (error: any) {
    Swal.fire(
      "Error",
      error?.response?.data ? error.response.data.message : error.message,
      "error"
    );
    dispatch(
      setCustomersError(
        error?.response?.data ? error.response.data.message : error.message
      )
    );
  } finally {
    dispatch(setLoadingCustomers(false));
  }
};

export const verifyCustomer =
  (payload: { id: string }): AppThunk =>
  async (dispatch) => {
    dispatch(setVerifyingCustomer(true));
    try {
      const response = await axiosInstance.post(`/customer/stron`, payload);
      Swal.fire("Success", response.data.message, "success");
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data ? error.response.data.message : error.message,
        "error"
      );
      dispatch(
        setVerifyCustomerError(
          error?.response?.data ? error.response.data.message : error.message
        )
      );
    } finally {
      dispatch(setVerifyingCustomer(false));
    }
  };

export const updateCustomer =
  (payload: { id: string; data: { is_verified: boolean } }): AppThunk =>
  async (dispatch) => {
    dispatch(setUpdatingCustomer(true));
    try {
      const response = await axiosInstance.patch(
        `/customer/${payload.id}`,
        payload.data
      );
      Swal.fire("Success", response.data.message, "success");
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data ? error.response.data.message : error.message,
        "error"
      );
      dispatch(
        setUpdateCustomerError(
          error?.response?.data ? error.response.data.message : error.message
        )
      );
    } finally {
      dispatch(setUpdatingCustomer(false));
    }
  };

export const getLandlords = (): AppThunk => async (dispatch) => {
  dispatch(setLoadingLandlords(true));
  try {
    const response = await axiosInstance.get(`/landlord`);

    dispatch(setLandlords(response.data.landlords));
  } catch (error: any) {
    Swal.fire(
      "Error",
      error?.response?.data ? error.response.data.message : error.message,
      "error"
    );
    dispatch(
      setLandlordsError(
        error?.response?.data ? error.response.data.message : error.message
      )
    );
  } finally {
    dispatch(setLoadingLandlords(false));
  }
};
