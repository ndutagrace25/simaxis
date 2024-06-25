// store/reducers.ts

import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import customerReducer from "../features/customer/customerSlice";
import meterReducer from "../features/meter/meterSlice";
import paymentReducer from "../features/payment/paymentSlice";
import tenantReducer from "../features/tenant/tenantSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  customer: customerReducer,
  meter: meterReducer,
  tenant: tenantReducer,
  payment: paymentReducer,
});

export default rootReducer;
