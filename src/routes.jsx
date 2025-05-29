import Home from "./pages/home/index";
import Login from "./pages/login/index";
import SignUp from "./pages/signup/index";
import EmailVerification from "./pages/email-verification/index";
import ForgotPassword from "./pages/forgot-password/index";
import ResetPassword from "./pages/reset-password/index";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import NotFound from "./pages/not-found/index";
import EditProfile from "./pages/edit-profile/index.jsx";
import MyFavorites from "./pages/my-favorites/index.jsx";
import MyOrders from "./pages/my-orders/index.jsx";

const routes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/sign-in",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/verify-email",
    element: <EmailVerification />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/profile",
    element:(<ProtectedRoute><EditProfile /></ProtectedRoute>),
  },
  {
    path: "/my-favorites",
    element: (<ProtectedRoute><MyFavorites /></ProtectedRoute>),
  },

    {
    path: "/orders",
    element: (<ProtectedRoute><MyOrders /></ProtectedRoute>),
  },

  

  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
