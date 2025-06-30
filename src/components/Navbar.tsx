import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faSignOutAlt,
  faCalculator,
  faCogs,
  faList,
} from "@fortawesome/free-solid-svg-icons";

const Navbar: React.FC = () => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{ backgroundColor: "#008080" }}
    >
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          <FontAwesomeIcon icon={faCalculator} className="me-2" />
          SPK-WP
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="/criteria"
              >
                <FontAwesomeIcon icon={faCogs} className="me-1" />
                Kriteria
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="/alternatives"
              >
                <FontAwesomeIcon icon={faList} className="me-1" />
                Alternatif
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to="/"
              >
                <FontAwesomeIcon icon={faChartBar} className="me-1" />
                Perhitungan
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            <span className="text-light me-3">{user?.username}</span>
            <button
              onClick={handleLogout}
              className="btn btn-outline-light btn-sm"
              title="Keluar"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
