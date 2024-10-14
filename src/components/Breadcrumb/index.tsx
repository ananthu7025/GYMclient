import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/").filter((i) => i);

  return (
    <div className="app-hero-header d-flex align-items-center">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>

        {pathSegments.map((segment, index) => {
          const path = `/${pathSegments?.slice(0, index + 1)?.join("/")}`;
          const isLast = index === pathSegments.length - 1;

          return (
            <li
              key={index}
              className={`breadcrumb-item ${isLast ? "breadcrumb-active" : ""}`}
            >
              {isLast ? (
                <span>
                  {segment?.charAt(0)?.toUpperCase() + segment?.slice(1)}
                </span>
              ) : (
                <Link to={path}>
                  {segment?.charAt(0)?.toUpperCase() + segment?.slice(1)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default Breadcrumb;
