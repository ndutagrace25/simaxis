import { Button } from "antd";
import { Link } from "react-router-dom";

const NavDetails = () => {
  return (
    <ul className="navbar-nav ms-auto site-nav-links">
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
            type="primary"
            shape="round"
            className="btn-brand text-white fw-semibold"
          >
            Login
          </Button>
        </Link>
      </li>
    </ul>
  );
};

export default NavDetails;
