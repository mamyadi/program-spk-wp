import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationTriangle,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

const NotFound: React.FC = () => {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <FontAwesomeIcon
        icon={faExclamationTriangle}
        style={{ fontSize: "4rem", color: "#008080" }}
      />
      <h2 className="mt-4 mb-2">404 - Halaman Tidak Ditemukan</h2>
      <p className="text-muted">Halaman yang Anda cari tidak ditemukan.</p>
      <Link
        to="/"
        className="btn mt-3"
        style={{ backgroundColor: "#008080", color: "white" }}
      >
        <FontAwesomeIcon icon={faHome} className="me-2" />
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default NotFound;
