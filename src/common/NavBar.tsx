import { Button } from "antd";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="">
      <nav className="navbar navbar-expand-lg bg-white shadow-sm">
        <div className="container-fluid ">
          <a className="navbar-brand" href="#">
            Si-Maxis Meters Limited
          </a>
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
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item me-4">
                <a className="nav-link" href="#">
                  About Us
                </a>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link ">
                  <Button
                    type="default"
                    size="small"
                    shape="round"
                    className="bg-green text-white fw-bold"
                  >
                    <small>Login</small>
                  </Button>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link ">
                  <Button
                    type="default"
                    size="small"
                    shape="round"
                    className="bg-green text-white fw-bold"
                  >
                    <small>Register</small>
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
