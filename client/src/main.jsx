import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.css";
import store from "./store/store.js";
import Feedbacks from "./pages/Feedback.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";



const router = createBrowserRouter([
  {
      path: "/",
      element: <App />,
      children: [
          {
              path: "/",
              element: <Feedbacks />,
          },
          {
              path: "/login",
              element: <Login />,
          },
          {
              path: "/signup",
              element: <SignUp />,
          },
          
      ],
  },

]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
      <RouterProvider router={router} />
  </Provider>
);
