import { Link } from "react-router-dom";

const App = () => {
  return (
    <div className="">
      <div className="text-center">
        <h4>Si-Maxis Meters Limited</h4>
      </div>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </div>
  );
};

export default App;
