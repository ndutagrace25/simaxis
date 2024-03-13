import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { NotFound } from "./common";
import { Dashboard, Login, Register } from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/my-account",
    element: <Dashboard />,
  },
]);

export default router;
