import { Button } from "antd";
import { Link } from "react-router-dom";

const NavDetails = () => {
  return (
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
  );
};

export default NavDetails;
