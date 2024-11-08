import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../../../images/logo.png";

export const NavBarBrand: React.FC = () => {
  return (
    <div className="nav-bar__brand">
      <NavLink to="/">
        <img
          className="nav-bar__logo"
          src={logo}
          alt="logo"
          width="80"
          height="50"
        />
      </NavLink>
    </div>
  );
};
