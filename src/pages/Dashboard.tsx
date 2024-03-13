import { Button } from "antd";
import { NavBar } from "../common";
import { IconUserCircle } from "@tabler/icons-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      <NavBar>
        <div className="navbar-nav ms-auto dlflex align-items-center">
          <IconUserCircle className="text-success me-2" />{" "}
          <div className="me-3">
            <small>Test User</small>
          </div>
          <Link to="/login">
            <Button
              type="default"
              shape="round"
              className="bg-green text-white fw-bold"
            >
              Logout
            </Button>
          </Link>
        </div>
      </NavBar>
    </>
  );
};

export default Dashboard;
