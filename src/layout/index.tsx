import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../slices/authSlice";
import Breadcrumb from "../components/Breadcrumb";
import { usePromiseTracker } from "react-promise-tracker";

const Layout = ({ children }: { children?: React.ReactNode }) => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state: any) => state.auth.token);
  const { promiseInProgress } = usePromiseTracker();

  useEffect(() => {
    if (token) {
      dispatch<any>(getUserDetails());
    } else {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="page-wrapper">
      <div className="main-container">
        <Sidebar />
        <div className="app-container">
          <Navbar />
          <Breadcrumb />
          <div className="app-body">
            {promiseInProgress ? (
              <div className="loading">Loading&#8230;</div>
            ) : (
              children || <Outlet />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
