// store/reducers.ts

import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import customerReducer from "../features/customer/customerSlice";
import meterReducer from "../features/meter/meterSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  customer: customerReducer,
  meter: meterReducer,
});

export default rootReducer;
