import { Outlet, Navigate } from "react-router-dom";

const PrivateRoutes: React.FC = () => {
  const token = sessionStorage.getItem("token");

  return token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
