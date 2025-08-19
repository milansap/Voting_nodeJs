import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import AuthLayout from "./components/authLayout/AuthLayout";
import Login from "./pages/auth/login/Login";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <AuthLayout />,
      children: [
        {
          path: "",
          element: <Login />,
        }
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
