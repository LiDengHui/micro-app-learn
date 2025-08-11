import { createBrowserRouter } from "react-router-dom";
import Home from "../views/Home";
import Orders from "../views/Orders";
import Users from "../views/Users";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/orders",
    element: <Orders />,
  },
  {
    path: "/users",
    element: <Users />,
  },
]);

export default router;
