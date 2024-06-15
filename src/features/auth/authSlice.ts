import axiosInstance from "../../utils/axios";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { saveDataToSessionStorage } from "../../utils/session";
import Swal from "sweetalert2";
import { AppThunk } from "../../store";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  role: string;
}

interface LoginDetails {
  statusCode?: number;
  message?: string;
  token?: string;
  user?: User;
}

export interface RegistrationDetails {
  username: string | undefined;
  phone: string | undefined;
  email: string | undefined;
  role: string | undefined;
  password: string | undefined;
  first_name: string | undefined;
  middle_name: string | undefined;
  last_name: string | undefined;
  location: string | undefined;
  national_id: number | undefined;
  plot_number: string | undefined;
  meter_number?: number | undefined;
  building_name?: string | undefined;
}

interface RegistrationResponse {
  statusCode?: number;
  message?: string;
  errors?: any[];
}

interface AuthState {
  user: LoginDetails;
  loggingError: string | null;
  loggingLoading: boolean;
  registeredUser: RegistrationResponse;
  registrationError: string | null | any[];
  loadingRegistration: boolean;
}

const initialState: AuthState = {
  user: {},
  loggingError: null,
  loggingLoading: false,
  registeredUser: {},
  registrationError: null,
  loadingRegistration: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // LOGIN
    setUserDetails(state, action: PayloadAction<LoginDetails>) {
      state.user = action.payload;
    },
    setLoginError(state, action: PayloadAction<string | null>) {
      state.loggingError = action.payload;
    },
    setLogging(state, action: PayloadAction<boolean>) {
      state.loggingLoading = action.payload;
    },
    // REGISTRATION
    setRegistration(state, action: PayloadAction<RegistrationResponse>) {
      state.registeredUser = action.payload;
    },
    setRegistrationError(state, action: PayloadAction<string | null | any[]>) {
      state.registrationError = action.payload;
    },
    setLoadingRegistration(state, action: PayloadAction<boolean>) {
      state.loadingRegistration = action.payload;
    },
  },
});

export const {
  // login
  setLoginError,
  setLogging,
  setUserDetails,
  // registration
  setRegistration,
  setRegistrationError,
  setLoadingRegistration,
} = authSlice.actions;

export default authSlice.reducer;

export const loginUser =
  (payload: {
    phone: string | undefined;
    password: string | undefined;
  }): AppThunk =>
  async (dispatch) => {
    dispatch(setLogging(true));
    try {
      const response = await axiosInstance.post<LoginDetails>(
        `/user/login`,
        payload
      );
      // save auth token.
      await saveDataToSessionStorage("token", response.data.token);
      // save logged in user
      await saveDataToSessionStorage("user", response.data.user);
      window.location.href = "/my-account";
      dispatch(setUserDetails(response.data));
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data ? error.response.data.message : error.message,
        "error"
      );
      dispatch(
        setLoginError(
          error?.response?.data ? error.response.data.message : error.message
        )
      );
    } finally {
      dispatch(setLogging(false));
    }
  };

export const registerUser =
  (payload: RegistrationDetails): AppThunk =>
  async (dispatch) => {
    dispatch(setLoadingRegistration(true));
    try {
      const response = await axiosInstance.post<RegistrationResponse>(
        `/user/register`,
        payload
      );
      Swal.fire("Success", response.data.message, "success");
      window.location.href = "/login";
    } catch (error: any) {
      console.log(
        error?.response?.data
          ? error.response.data.message && error.response.data.errors
            ? error.response.data.errors[0]?.message
            : error.response.data.message && !error.response.data.errors
            ? error.response.data.message
            : ""
          : error.message
      );
      Swal.fire(
        "Error",
        error?.response?.data
          ? error.response.data.message && error.response.data.errors
            ? error.response.data.errors[0]?.message
            : error.response.data.message && !error.response.data.errors
            ? error.response.data.message
            : ""
          : error.message,
        "error"
      );
      dispatch(
        setRegistrationError(
          error?.response?.data ? error.response.data.message : error.message
        )
      );
    } finally {
      dispatch(setLoadingRegistration(false));
    }
  };
