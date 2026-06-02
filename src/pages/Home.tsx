import { NavBar, NavDetails } from "../common";
import meterbox from "../assets/meterbox.png";
import { Button, Image } from "antd";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <NavBar>
        <NavDetails />
      </NavBar>
      <section className="hero-section">
        <div className="hero-card">
          <div className="hero-media">
            <Image src={meterbox} preview={false} className="hero-image" />
          </div>
          <div className="hero-copy">
            <h1>Smarter Token Management For Modern Buildings</h1>
            <p>
              We are thrilled to introduce a hassle-free solution to manage your
              electricity needs conveniently. Now, you can effortlessly top up
              your electricity tokens directly through Si-Maxis' user-friendly
              platform.
            </p>
            <div className="hero-actions">
              <Link to="/login">
                <Button type="primary" shape="round" className="btn-brand btn-brand-lg">
                  Continue To Login
                </Button>
              </Link>
              <small className="hero-note">
                New accounts are created by authorized users after sign in.
              </small>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
