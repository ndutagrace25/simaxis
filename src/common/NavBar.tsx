import { ReactNode } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

interface Props {
  children: ReactNode;
}

const NavBar = ({ children }: Props) => {
  return (
    <div className="site-nav-wrap">
      <nav className="navbar navbar-expand-lg site-navbar">
        <div className="container-fluid site-nav-container">
          <Link className="navbar-brand site-brand" to="/">
            <img src={logo} className="rounded" width={88} alt="Si-Maxis logo" />
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
          <div className="collapse navbar-collapse site-navbar-collapse" id="navbarNav">
            {children}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
