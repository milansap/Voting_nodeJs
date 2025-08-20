import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import AuthLayout from "./components/authLayout/AuthLayout";
import Login from "./pages/auth/login/Login";
import Layout from "./components/Layout/Layout";
import Home from "./pages/home/Home";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <AuthLayout />,
      children: [
        {
          path: "",
          element: <Login />,
        },
      ],
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <Home />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
