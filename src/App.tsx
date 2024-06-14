import { appSession } from "./utils/appStorage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Dashboard, Home, Login, Register } from "./pages";
import PrivateRoutes from "./utils/PrivateRoutes";

import setAuthToken from "./utils/setAuthToken";

const App = () => {
  const token = appSession.getToken();
  setAuthToken(token);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-account" element={<Dashboard />} />
        <Route element={<PrivateRoutes />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
