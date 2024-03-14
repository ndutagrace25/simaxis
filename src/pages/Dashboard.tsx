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
          {/* <div className="d-flex justify-content-between">
            <div className="shadow-sm px-3 py-4 rounded bg-white col-5 d-flex justify-content-center align-items-center flex-column cursor mobile-card">
              <div>
                <img src={meterbox} width={50} height={50} />
              </div>
              <div className="mb-3">My Token Meters</div>
              <Button
                shape="round"
                type="primary"
                className="bg-blue text-white col-12"
              >
                View
              </Button>
            </div>
            <div className="shadow-sm px-3 py-4 rounded bg-white col-5 d-flex justify-content-center align-items-center flex-column cursor mobile-card">
              <div>
                <IconMessage width={50} height={50} className="text-blue fw-light" />
              </div>
              <div className="mb-3">Purchased Tokens</div>
              <Button
                shape="round"
                type="primary"
                className="bg-blue text-white col-12"
              >
                View
              </Button>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
