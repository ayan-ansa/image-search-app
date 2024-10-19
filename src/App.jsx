import "./App.css";
import Home from "./pages/Home/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>,
    },
    {
      path: "/photos/:id",
      element: <Home/>,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
