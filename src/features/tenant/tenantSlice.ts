import axiosInstance from "../../utils/axios";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { AppThunk } from "../../store";
import { ReactElement } from "react";

export interface Tenant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: string;
  Customer: {
    first_name: string;
    middle_name: string;
    last_name: string;
    building_name: string;
  };
  action?: string | ReactElement;
}

interface TenantState {
  tenants: Tenant[];
  tenantsError: string | null;
  loadingTenants: boolean;
}

const initialState: TenantState = {
  tenants: [],
  tenantsError: null,
  loadingTenants: false,
};

const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    // TENANTS
    setTenants(state, action: PayloadAction<Tenant[]>) {
      state.tenants = action.payload;
    },
    setTenantError(state, action: PayloadAction<string | null>) {
      state.tenantsError = action.payload;
    },
    setLoadingTenants(state, action: PayloadAction<boolean>) {
      state.loadingTenants = action.payload;
    },
  },
});

export const {
  // tenants
  setTenantError,
  setLoadingTenants,
  setTenants,
} = tenantSlice.actions;

export default tenantSlice.reducer;

export const getTenants = (): AppThunk => async (dispatch) => {
  dispatch(setLoadingTenants(true));
  try {
    const response = await axiosInstance.get(`/tenant`);

    dispatch(setTenants(response.data.tenants));
  } catch (error: any) {
    Swal.fire(
      "Error",
      error?.response?.data ? error.response.data.message : error.message,
      "error"
    );
    dispatch(
      setTenantError(
        error?.response?.data ? error.response.data.message : error.message
      )
    );
  } finally {
    dispatch(setLoadingTenants(false));
  }
};
