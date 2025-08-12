import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../views/Home";
import Orders from "../views/Orders";
import Users from "../views/Users";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "users",
        element: <Users />,
      },
    ],
  },
]);

export default router;
