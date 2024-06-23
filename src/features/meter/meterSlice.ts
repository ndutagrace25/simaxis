import axiosInstance from "../../utils/axios";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { AppThunk } from "../../store";
import { ReactElement } from "react";

export interface Meter {
  id: string;
  meter_type_id: string;
  serial_number: number | string | null;
  county_number: string;
  is_synced_to_stron: string | boolean | ReactElement;
  created_at: string;
  action?: string | ReactElement;
  MeterType: { name: string };
  CustomerMeter?: {
    id?: string;
    meter_id?: string;
  };
}

export interface CustomerMeter {
  id?: string;
  customer_id?: string;
  meter_id?: string;
  is_synced_to_stron?: boolean | ReactElement;
  account_id?: string;
  created_at?: string;
  tenant_id?: string;
  Customer?: {
    first_name?: string;
    middle_name?: string;
    last_name?: string;
    customer_number?: string;
  };
  Tenant?: {
    first_name?: string;
    last_name?: string;
  };
  Meter?: {
    serial_number?: string;
    county_number?: number;
    is_synced_to_stron?: boolean;
    MeterTokens?: any;
  };
  action?: any;
}

export interface MeterType {
  id: string;
  name: string;
}
export interface County {
  code: number;
  name: string;
}

interface AddMeterResponse {
  statusCode?: number;
  message?: string;
}

interface MeterState {
  meters: Meter[];
  metersError: string | null;
  loadingMeters: boolean;
  savedMeter: AddMeterResponse;
  savingMeter: boolean;
  savingMeterError: string | null;
  meterTypes: MeterType[];
  meterTypesError: string | null;
  loadingMeterTypes: boolean;
  counties: County[];
  countiesError: string | null;
  loadingCounties: boolean;
  syncingMeterToStron: boolean;
  syncedMeterToStron: AddMeterResponse;
  syncedMeterToStronError: string | null;
  syncedMeters: Meter[];
  syncedMetersError: string | null;
  loadingSyncedMeters: boolean;
  customerMeters: CustomerMeter[];
  customerMetersError: string | null;
  loadingCustomerMeters: boolean;
  syncingCustomerMeterToStron: boolean;
  syncedCustomerMeterToStron: AddMeterResponse;
  syncedCustomerMeterToStronError: string | null;
  landlordMeters: CustomerMeter[];
  landlordMetersError: string | null;
  loadingLandlordMeters: boolean;
  tenantMeter: CustomerMeter;
  tenantMeterError: string | null;
  loadingTenantMeter: boolean;
  updatedCustomerMeter: AddMeterResponse;
  updatingCustomerMeterError: string | null;
  updatingCustomerMeter: boolean;
}

const initialState: MeterState = {
  meters: [],
  metersError: null,
  loadingMeters: false,
  savedMeter: {},
  savingMeter: false,
  savingMeterError: null,
  meterTypes: [],
  meterTypesError: null,
  loadingMeterTypes: false,
  counties: [],
  countiesError: null,
  loadingCounties: false,
  syncingMeterToStron: false,
  syncedMeterToStron: {},
  syncedMeterToStronError: null,
  syncedMeters: [],
  syncedMetersError: null,
  loadingSyncedMeters: false,
  customerMeters: [],
  customerMetersError: null,
  loadingCustomerMeters: false,
  syncingCustomerMeterToStron: false,
  syncedCustomerMeterToStron: {},
  syncedCustomerMeterToStronError: null,
  landlordMeters: [],
  landlordMetersError: null,
  loadingLandlordMeters: false,
  tenantMeter: {},
  tenantMeterError: null,
  loadingTenantMeter: false,
  updatedCustomerMeter: {},
  updatingCustomerMeterError: null,
  updatingCustomerMeter: false,
};

const meterSlice = createSlice({
  name: "meter",
  initialState,
  reducers: {
    // METERS
    setMeters(state, action: PayloadAction<Meter[]>) {
      state.meters = action.payload;
    },
    setMetersError(state, action: PayloadAction<string | null>) {
      state.metersError = action.payload;
    },
    setLoadingMeters(state, action: PayloadAction<boolean>) {
      state.loadingMeters = action.payload;
    },
    // SAVE A METER
    setSaveMeter(state, action: PayloadAction<AddMeterResponse>) {
      state.savedMeter = action.payload;
    },
    setSavingMetersError(state, action: PayloadAction<string | null>) {
      state.savingMeterError = action.payload;
    },
    setSavingMeter(state, action: PayloadAction<boolean>) {
      state.savingMeter = action.payload;
    },
    // METER TYPES
    setMeterTypes(state, action: PayloadAction<MeterType[]>) {
      state.meterTypes = action.payload;
    },
    setMeterTypesError(state, action: PayloadAction<string | null>) {
      state.meterTypesError = action.payload;
    },
    setLoadingMeterTypes(state, action: PayloadAction<boolean>) {
      state.loadingMeterTypes = action.payload;
    },
    // COUNTIES
    setCounties(state, action: PayloadAction<County[]>) {
      state.counties = action.payload;
    },
    setCountiesError(state, action: PayloadAction<string | null>) {
      state.countiesError = action.payload;
    },
    setLoadingCounties(state, action: PayloadAction<boolean>) {
      state.loadingCounties = action.payload;
    },
    // SYNC METER TO STRON
    setSyncMeter(state, action: PayloadAction<AddMeterResponse>) {
      state.syncedMeterToStron = action.payload;
    },
    setSyncMeterError(state, action: PayloadAction<string | null>) {
      state.syncedMeterToStronError = action.payload;
    },
    setSyncingMeter(state, action: PayloadAction<boolean>) {
      state.syncingMeterToStron = action.payload;
    },
    // SYNCED METERS
    setSyncedMeters(state, action: PayloadAction<Meter[]>) {
      state.syncedMeters = action.payload;
    },
    setSyncedMetersError(state, action: PayloadAction<string | null>) {
      state.syncedMetersError = action.payload;
    },
    setLoadingSyncedMeters(state, action: PayloadAction<boolean>) {
      state.loadingSyncedMeters = action.payload;
    },
    // CUSTOMERS METERS
    setCustomerMeters(state, action: PayloadAction<CustomerMeter[]>) {
      state.customerMeters = action.payload;
    },
    setCustomerMetersError(state, action: PayloadAction<string | null>) {
      state.customerMetersError = action.payload;
    },
    setLoadingCustomerMeters(state, action: PayloadAction<boolean>) {
      state.loadingCustomerMeters = action.payload;
    },
    // SYNCING CUSTOMER METER ACCOUNT TO STRON
    setSyncCustomerMeters(state, action: PayloadAction<AddMeterResponse>) {
      state.syncedCustomerMeterToStron = action.payload;
    },
    setSyncCustomerMetersError(state, action: PayloadAction<string | null>) {
      state.syncedCustomerMeterToStronError = action.payload;
    },
    setSyncingCustomerMeters(state, action: PayloadAction<boolean>) {
      state.syncingCustomerMeterToStron = action.payload;
    },
    // FETCHING LANDLORDS METERS
    setGetLandlordMeters(state, action: PayloadAction<CustomerMeter[]>) {
      state.landlordMeters = action.payload;
    },
    setGetLandlordMetersError(state, action: PayloadAction<string | null>) {
      state.landlordMetersError = action.payload;
    },
  setLoadingLandlordMeters(state, action: PayloadAction<boolean>) {
      state.loadingLandlordMeters = action.payload;
    },
    // TENANT METER
    setGetTenantMeter(state, action: PayloadAction<CustomerMeter>) {
      state.tenantMeter = action.payload;
    },
    setGetTenantMeterError(state, action: PayloadAction<string | null>) {
      state.tenantMeterError = action.payload;
    },
    setLoadingTenantMeter(state, action: PayloadAction<boolean>) {
      state.loadingTenantMeter = action.payload;
    },
    // UPDATE CUSTOMER METER
    setUpdateCustomerMeter(state, action: PayloadAction<AddMeterResponse>) {
      state.updatedCustomerMeter = action.payload;
    },
    setUpdatingCustomerMeterError(state, action: PayloadAction<string | null>) {
      state.updatingCustomerMeterError = action.payload;
    },
    setUpdatingCustomerMeter(state, action: PayloadAction<boolean>) {
      state.updatingCustomerMeter = action.payload;
    },
  },
});

export const {
  // meters
  setMetersError,
  setLoadingMeters,
  setMeters,
  // save a meter
  setSaveMeter,
  setSavingMetersError,
  setSavingMeter,
  // meter types
  setMeterTypes,
  setMeterTypesError,
  setLoadingMeterTypes,
  // counties
  setCounties,
  setCountiesError,
  setLoadingCounties,
  // forward/sync meter to stron
  setSyncMeter,
  setSyncMeterError,
  setSyncingMeter,
  // synced meters
  setSyncedMeters,
  setSyncedMetersError,
  setLoadingSyncedMeters,
  // customer meters
  setCustomerMeters,
  setCustomerMetersError,
  setLoadingCustomerMeters,
  // syncing customer meters to stron
  setSyncCustomerMeters,
  setSyncCustomerMetersError,
  setSyncingCustomerMeters,
  // fetching landlord meters
  setGetLandlordMeters,
  setGetLandlordMetersError,
  setLoadingLandlordMeters,
  // fetch tenant meter
  setGetTenantMeter,
  setGetTenantMeterError,
  setLoadingTenantMeter,
  // update customer meter
  setUpdateCustomerMeter,
  setUpdatingCustomerMeterError,
  setUpdatingCustomerMeter,
} = meterSlice.actions;

export default meterSlice.reducer;

export const getMeters = (): AppThunk => async (dispatch) => {
  dispatch(setLoadingMeters(true));
  try {
    const response = await axiosInstance.get(`/meter`);

    dispatch(setMeters(response.data.meters));
  } catch (error: any) {
    Swal.fire(
      "Error",
      error?.response?.data ? error.response.data.message : error.message,
      "error"
    );
    dispatch(
      setMetersError(
        error?.response?.data ? error.response.data.message : error.message
      )
    );
  } finally {
    dispatch(setLoadingMeters(false));
  }
};

export const saveMeter =
  (payload: {
    serial_number: number;
    meter_type_id: string;
    county_number: number;
  }): AppThunk =>
  async (dispatch) => {
    dispatch(setSavingMeter(true));
    try {
      const response = await axiosInstance.post(`/meter`, payload);
      Swal.fire("Success", response.data.message, "success");
      dispatch(setSaveMeter(response.data));
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data ? error.response.data.message : error.message,
        "error"
      );
      dispatch(
        setSavingMetersError(
          error?.response?.data ? error.response.data.message : error.message
        )
      );
    } finally {
      dispatch(setSavingMeter(false));
    }
  };

export const getMeterTypes = (): AppThunk => async (dispatch) => {
  dispatch(setLoadingMeterTypes(true));
  try {
    const response = await axiosInstance.get(`/meter_types`);

    dispatch(setMeterTypes(response.data.meter_types));
  } catch (error: any) {
    Swal.fire(
      "Error",
      error?.response?.data ? error.response.data.message : error.message,
      "error"
    );
    dispatch(
      setMeterTypesError(
        error?.response?.data ? error.response.data.message : error.message
      )
    );
  } finally {
    dispatch(setLoadingMeterTypes(false));
  }
};

export const getCounties = (): AppThunk => async (dispatch) => {
  dispatch(setLoadingCounties(true));
  try {
    const response = await axiosInstance.get(`/counties`);

    dispatch(setCounties(response.data.counties));
  } catch (error: any) {
    Swal.fire(
      "Error",
      error?.response?.data ? error.response.data.message : error.message,
      "error"
    );
    dispatch(
      setCountiesError(
        error?.response?.data ? error.response.data.message : error.message
      )
    );
  } finally {
    dispatch(setLoadingCounties(false));
  }
};

export const syncMeter =
  (payload: { id: string }): AppThunk =>
  async (dispatch) => {
    dispatch(setSyncingMeter(true));
    try {
      const response = await axiosInstance.post(`/meter/stron`, payload);
      Swal.fire("Success", response.data.message, "success");
      dispatch(setSyncMeter(response.data));
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data ? error.response.data.message : error.message,
        "error"
      );
      dispatch(
        setSyncMeterError(
          error?.response?.data ? error.response.data.message : error.message
        )
      );
    } finally {
      dispatch(setSyncingMeter(false));
    }
  };

export const getSyncedMeters = (): AppThunk => async (dispatch) => {
  dispatch(setLoadingSyncedMeters(true));
  try {
    const response = await axiosInstance.get(`/meter/synced/customer`);

    dispatch(setSyncedMeters(response.data.synced_meters));
  } catch (error: any) {
    Swal.fire(
      "Error",
      error?.response?.data ? error.response.data.message : error.message,
      "error"
    );
    dispatch(
      setSyncedMetersError(
        error?.response?.data ? error.response.data.message : error.message
      )
    );
  } finally {
    dispatch(setLoadingSyncedMeters(false));
  }
};

export const getCustomerMeters = (): AppThunk => async (dispatch) => {
  dispatch(setLoadingCustomerMeters(true));
  try {
    const response = await axiosInstance.get(`/customer-meter`);

    dispatch(setCustomerMeters(response.data.customer_meters));
  } catch (error: any) {
    Swal.fire(
      "Error",
      error?.response?.data ? error.response.data.message : error.message,
      "error"
    );
    dispatch(
      setCustomerMetersError(
        error?.response?.data ? error.response.data.message : error.message
      )
    );
  } finally {
    dispatch(setLoadingCustomerMeters(false));
  }
};

export const syncCustomerMeter =
  (payload: {
    id: string | undefined;
    Account_ID: string | undefined;
    CUST_ID: string | undefined;
    METER_ID: string | undefined;
  }): AppThunk =>
  async (dispatch) => {
    dispatch(setSyncingCustomerMeters(true));
    try {
      const response = await axiosInstance.post(
        `/customer-meter/stron`,
        payload
      );
      Swal.fire("Success", response.data.message, "success");
      dispatch(setSyncCustomerMeters(response.data));
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data ? error.response.data.message : error.message,
        "error"
      );
      dispatch(
        setSyncingCustomerMeters(
          error?.response?.data ? error.response.data.message : error.message
        )
      );
    } finally {
      dispatch(setSyncingCustomerMeters(false));
    }
  };

export const getLandlordMeters =
  (payload: { id: string | undefined; serial_number?: string }): AppThunk =>
  async (dispatch) => {
    dispatch(setLoadingLandlordMeters(true));
    try {
      let url = `/customer-meter/landlord/${payload?.id}`;

      if (payload?.serial_number) {
        url += `?serial_number=${payload?.serial_number}`;
      }
      const response = await axiosInstance.get(url);

      dispatch(setGetLandlordMeters(response.data.landlord_meters));
    } catch (error: any) {
      console.log(error?.response?.status, "errorrrrr");
      if (error?.response?.status === 401) {
        window.location.href = "/";
        sessionStorage.clear();
      }
      Swal.fire(
        "Error",
        error?.response?.data ? error.response.data.message : error.message,
        "error"
      );
      dispatch(
        setGetLandlordMetersError(
          error?.response?.data ? error.response.data.message : error.message
        )
      );
    } finally {
      dispatch(setLoadingLandlordMeters(false));
    }
  };

export const getTenantMeters =
  (payload: { id: string }): AppThunk =>
  async (dispatch) => {
    dispatch(setLoadingTenantMeter(true));
    try {
      let url = `/customer-meter/landlord/tenant/${payload?.id}`;

      const response = await axiosInstance.get(url);

      dispatch(setGetTenantMeter(response.data.tenant_meter));
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data ? error.response.data.message : error.message,
        "error"
      );
      dispatch(
        setGetTenantMeterError(
          error?.response?.data ? error.response.data.message : error.message
        )
      );
    } finally {
      dispatch(setLoadingTenantMeter(false));
    }
  };

export const updateCustomerMeter =
  (payload: { id: string | undefined; data: { tenant_id?: string } }): AppThunk =>
  async (dispatch) => {
    dispatch(setUpdatingCustomerMeter(true));
    try {
      const response = await axiosInstance.patch(
        `/customer-meter/${payload.id}`,
        payload?.data
      );
      Swal.fire("Success", response.data.message, "success");
      dispatch(setUpdateCustomerMeter(response.data));
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data ? error.response.data.message : error.message,
        "error"
      );
      dispatch(
        setUpdatingCustomerMeterError(
          error?.response?.data ? error.response.data.message : error.message
        )
      );
    } finally {
      dispatch(setUpdatingCustomerMeter(false));
    }
  };
