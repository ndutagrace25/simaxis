// store/reducers.ts

import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import customerReducer from "../features/customer/customerSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  customer: customerReducer,
});

export default rootReducer;
