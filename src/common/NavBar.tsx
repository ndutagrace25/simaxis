import { Button } from "antd";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

const NavBar = ({ children }: Props) => {
  return (
    <div className="">
      <nav className="navbar navbar-expand-lg bg-white shadow-sm">
        <div className="container-fluid ">
          <Link className="navbar-brand" to="/">
            Si-Maxis Meters Limited
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            {children}
          
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
