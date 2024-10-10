import { Routes, Route, BrowserRouter } from "react-router-dom";
import { routes } from "./routes"; 
import Layout from "./layout";
import ProtectedRoute from "./utils/ProtectedRoutes";
import "./App.css";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./assets/fonts/remix/remixicon.css";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ToastContainer
        theme="colored"
        hideProgressBar
        position="bottom-right"
        autoClose={1500}
        transition={Slide}
      />
      <Routes>
        {routes.map(({ path, element, protected: isProtected, layout }) => {
          const routeElement = isProtected ? (
            <ProtectedRoute>{element}</ProtectedRoute>
          ) : (
            element
          );

          return (
            <Route
              key={path}
              path={path}
              element={layout ? <Layout>{routeElement}</Layout> : routeElement}
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
