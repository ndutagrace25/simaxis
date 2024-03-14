import { Button } from "antd";
import { NavBar, AccountTabs } from "../common";
import { IconUserCircle } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { isMobile } from "react-device-detect";

const Dashboard = () => {
  return (
    <>
      <NavBar>
        <div className="navbar-nav ms-auto dlflex align-items-center">
          <IconUserCircle className="text-blue me-2" />{" "}
          <div className="me-3">
            <small>Test User</small>
          </div>
          <Link to="/login">
            <Button
              type="primary"
              shape="round"
              className="bg-blue text-white fw-bold"
            >
              Logout
            </Button>
          </Link>
        </div>
      </NavBar>
      <div className="my-4 d-flex justify-content-center">
        <div className={isMobile ? "col-12 px-1" : "col-5 p-3"}>
          <AccountTabs />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
