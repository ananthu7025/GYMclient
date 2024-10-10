import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = () => {
  
  const userDetails = useSelector((state: any) => state.auth.userDetails);

  return (
    <div className="app-header d-flex align-items-center">
      <div className="d-flex">
        <button className="toggle-sidebar">
          <i className="ri-menu-line" />
        </button>
        <button className="pin-sidebar">
          <i className="ri-menu-line" />
        </button>
      </div>
      <div className="app-brand ms-3">
        <Link to="#" className="d-lg-block d-none">
          <img
            src="../assets/images/logo.svg"
            className="logo"
            alt="Workout Admin Template"
          />
        </Link>
        <Link to="#" className="d-lg-none d-md-block">
          <img
            src="../assets/images/logo-sm.svg"
            className="logo"
            alt="Gym Admin Template"
          />
        </Link>
      </div>
      <div className="header-actions">
        <div className="search-container d-lg-block d-none mx-3">
          <input
            type="text"
            className="form-control"
            id="searchId"
            placeholder="Search"
          />
          <i className="ri-search-line" />
        </div>
        <div className="dropdown ms-2">
          <a
            id="userSettings"
            className="dropdown-toggle d-flex align-items-center"
            href="#!"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <div className="avatar-box">
              <i className="ri-user-line" />
            </div>
          </a>
          <div className="dropdown-menu dropdown-menu-end shadow-lg">
            <div className="px-3 py-2">
              <h6 className="m-0">
                {userDetails ? userDetails?.user?.name : "Loading..."}
              </h6>
            </div>
            <div className="mx-3 my-2 d-grid">
              <button className="btn btn-danger">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
