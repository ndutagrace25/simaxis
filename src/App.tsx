import { NavBar, NavDetails } from "./common";
import meterbox from "./assets/meterbox.png";
import { Button, Image } from "antd";
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";

const App = () => {
  return (
    <>
      <NavBar>
        <NavDetails />
      </NavBar>
      <div className="d-flex justify-content-center col-md-12">
        <div className="d-flex justify-content-between bg-white col-md-6 p-3 shadow-sm rounded mt-3 flex-wrap">
          <div className="col-md-6 ">
            <Image
              width={isMobile ? 300 : 400}
              src={meterbox}
              preview={false}
              className="col-md-12"
            />
          </div>
          <div className="col-md-6 px-3">
            <p className={`d-flex text-justify ${isMobile ? "mt-1" : "mt-5"}`}>
              We are thrilled to introduce a hassle-free solution to manage your
              electricity needs conveniently. Now, you can effortlessly top up
              your electricity tokens directly through Si-Maxis' user-friendly
              platform.
            </p>
            <div className="d-flex justify-content-between">
              <Link to="/login">
                <Button
                  type="default"
                  shape="round"
                  className="bg-green text-white fw-bold"
                >
                  Login
                </Button>
              </Link>
              <div>
                <small className="small-font me-2">
                  Don't have an account?
                </small>
                <Link to="/register">
                  <Button
                    type="default"
                    shape="round"
                    className="bg-green text-white fw-bold"
                  >
                    Register
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
