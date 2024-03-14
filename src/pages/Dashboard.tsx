import { Button } from "antd";
import { NavBar } from "../common";
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
      <div className="my-5 d-flex justify-content-center">
        <div className={isMobile ? "col-12 px-3" : "col-5 p-3"}>
          <div className="d-flex justify-content-between">
            <div className="shadow-sm px-3 py-4 rounded bg-white col-5 d-flex justify-content-center align-items-center flex-column cursor">
              <div className="mb-3">My Token Meters</div>
              <Button
                shape="round"
                type="primary"
                className="bg-blue text-white col-12"
              >
                View
              </Button>
            </div>
            <div className="shadow-sm px-3 py-4 rounded bg-white col-5 d-flex justify-content-center align-items-center flex-column cursor">
              <div className="mb-3">Purchases Tokens</div>
              <Button
                shape="round"
                type="primary"
                className="bg-blue text-white col-12"
              >
                View
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
