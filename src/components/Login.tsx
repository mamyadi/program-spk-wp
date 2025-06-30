import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalculator,
  faUser,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

const Login: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Trim the input values to remove any accidental whitespace
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      setError("Username dan Password harus diisi");
      return;
    }

    console.log("Login attempt with:", {
      username: trimmedUsername,
      passwordLength: trimmedPassword.length,
    });

    setLoading(true);
    setError(null);

    try {
      console.log("Calling login function...");
      // Use the trimmed values for login
      const success = await login(trimmedUsername, trimmedPassword);
      console.log("Login result:", success);

      if (!success) {
        console.error("Login failed with valid credentials");
        setError("Username atau Password tidak valid");
      } else {
        console.log("Login successful!");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Terjadi kesalahan pada server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="row justify-content-center align-items-center login-container auth-page"
      style={{ minHeight: "100vh", margin: 0 }}
    >
      <div className="col-md-4">
        <div className="card shadow border-0 form-container">
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <h2 className="mb-2" style={{ color: "#008080" }}>
                <FontAwesomeIcon icon={faCalculator} className="me-2" />
                SPK-WP
              </h2>
              <p className="text-muted">
                Sistem Pendukung Keputusan Metode Weighted Product
              </p>
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    placeholder="Masukkan username"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faLock} />
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    placeholder="Masukkan password"
                  />
                </div>
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-lg"
                  style={{ backgroundColor: "#008080", color: "white" }}
                  disabled={loading}
                >
                  {loading ? "Memproses..." : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
