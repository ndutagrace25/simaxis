/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from "antd";
import { NavBar, AccountTabs } from "../common";
import { IconUserCircle } from "@tabler/icons-react";
import { isMobile } from "react-device-detect";
import { Link, useNavigate } from "react-router-dom";
import { appSession } from "../utils/appStorage";
import { AdminTabs } from ".";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import {
  getLandlordMeters,
  getTenantMeters,
} from "../features/meter/meterSlice";
import { getLandlordTenants } from "../features/customer/customerSlice";

const Dashboard = () => {
  const navigate = useNavigate();
  const user = appSession.getUser();
  const dispatch = useDispatch<AppDispatch>();

  const { updatingCustomerMeter } = useSelector(
    (state: RootState) => state.meter
  );

  useEffect(() => {
    if (user?.role === "Landlord") {
      dispatch(getLandlordMeters({ id: user?.customer_id }));
      dispatch(getLandlordTenants(user?.customer_id));
    }
    if (user?.role === "Tenant") {
      dispatch(getTenantMeters({ id: user?.customer_id }));
    }
  }, [updatingCustomerMeter]);

  return (
    <>
      <NavBar>
        <div className="navbar-nav ms-auto d-flex align-items-center gap-2 py-2">
          <IconUserCircle className="text-blue me-1" />
          <div className="me-2 text-nowrap">
            <small>
              {user?.first_name} {user?.last_name} ({user?.role})
            </small>
          </div>
          <Link to="/register">
            <Button type="default" shape="round" className="btn-outline-brand">
              Register User
            </Button>
          </Link>
          <Button
            type="primary"
            shape="round"
            className="btn-brand text-white fw-bold"
            onClick={() => {
              sessionStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </Button>
        </div>
      </NavBar>
      <div className="d-flex justify-content-center dashboard-shell">
        <div className={isMobile ? "col-12 px-2" : "col-6 p-3"}>
          {(user?.role === "Tenant" || user?.role === "Landlord") && (
            <>
              {user?.is_verified ? (
                <AccountTabs />
              ) : (
                <div className="awaiting-card">Account awaiting approval</div>
              )}
            </>
          )}
        </div>
      </div>
      {user?.is_verified &&
        (user?.role === "Super Admin" || user?.role === "System User") && (
          <div className="dashboard-admin-wrap mx-3 px-3 rounded">
            <AdminTabs />
          </div>
        )}
    </>
  );
};

export default Dashboard;
