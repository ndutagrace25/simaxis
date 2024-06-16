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
