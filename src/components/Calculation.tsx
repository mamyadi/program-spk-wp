import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalculator,
  faTrophy,
  faSync,
} from "@fortawesome/free-solid-svg-icons";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Criterion {
  id: number;
  code: string;
  name: string;
  weight: number;
  normalizedWeight: number;
  type: "benefit" | "cost";
}

interface Alternative {
  id: number;
  code: string;
  name: string;
  scores: {
    [key: number]: number;
  };
}

interface VectorS {
  id: number;
  code: string;
  name: string;
  s: number;
}

interface VectorV extends VectorS {
  v: number;
}

const Calculation: React.FC = () => {
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [decisionMatrix, setDecisionMatrix] = useState<Alternative[]>([]);
  const [vectorS, setVectorS] = useState<VectorS[]>([]);
  const [vectorV, setVectorV] = useState<VectorV[]>([]);
  const [rankedAlternatives, setRankedAlternatives] = useState<VectorV[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCalculation();
  }, []);

  const fetchCalculation = async () => {
    try {
      setLoading(true);

      // Make sure the authorization header is set
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        setError("Anda perlu login terlebih dahulu");
        setLoading(false);
        return;
      }

      // Set the authorization header for this request
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      console.log("Fetching calculation data...");
      const response = await axios.get(
        "http://localhost:5000/api/calculation",
        { headers }
      );

      console.log("Calculation data received:", Object.keys(response.data));

      setCriteria(response.data.criteria);
      setDecisionMatrix(response.data.decisionMatrix);
      setVectorS(response.data.vectorS);
      setVectorV(response.data.vectorV);
      setRankedAlternatives(response.data.rankedAlternatives);

      setError(null);
    } catch (err: any) {
      console.error("Error fetching calculation data:", err);
      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);

        // Handle different error types
        if (err.response.status === 401) {
          setError("Sesi anda telah berakhir, silakan login kembali");
        } else {
          setError(
            `Gagal memuat data perhitungan: ${
              err.response.data.message || err.message
            }`
          );
        }
      } else {
        setError(`Gagal memuat data perhitungan: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Chart data
  const chartData = {
    labels: vectorV.map((alt) => alt.code),
    datasets: [
      {
        label: "Nilai V",
        data: vectorV.map((alt) => alt.v),
        backgroundColor: "#008080",
        borderColor: "#005959",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Grafik Nilai Preferensi (Vektor V)",
      },
    },
  };

  return (
    <div className="row calculation-page">
      <div className="col-12 mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <h4 style={{ color: "#008080" }}>
            <FontAwesomeIcon icon={faCalculator} className="me-2" />
            Perhitungan SPK Metode WP
          </h4>
          <button
            className="btn btn-sm"
            style={{ backgroundColor: "#008080", color: "white" }}
            onClick={fetchCalculation}
            disabled={loading}
          >
            <FontAwesomeIcon icon={faSync} className="me-1" />
            Refresh Data
          </button>
        </div>
      </div>

      {error && (
        <div className="col-12 mb-4">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        </div>
      )}

      {loading ? (
        <div className="col-12">
          <div className="d-flex justify-content-center my-5">
            <div
              className="spinner-border"
              style={{ color: "#008080" }}
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Bobot Kriteria */}
          <div className="col-md-12 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0">1. Bobot Kriteria</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Kriteria</th>
                        <th>Nama</th>
                        <th>Jenis</th>
                        <th>Bobot (W)</th>
                        <th>Bobot Ternormalisasi (W)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {criteria.map((criterion) => (
                        <tr key={criterion.id}>
                          <td>{criterion.code}</td>
                          <td>{criterion.name}</td>
                          <td>
                            <span
                              className={
                                criterion.type === "benefit"
                                  ? "text-success"
                                  : "text-danger"
                              }
                            >
                              {criterion.type === "benefit"
                                ? "Benefit"
                                : "Cost"}
                            </span>
                          </td>
                          <td>{criterion.weight}</td>
                          <td>{criterion.normalizedWeight.toFixed(4)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Matriks Keputusan */}
          <div className="col-md-12 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0">2. Matriks Keputusan</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Alternatif</th>
                        {criteria.map((criterion) => (
                          <th key={criterion.id}>{criterion.code}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {decisionMatrix.map((alt) => (
                        <tr key={alt.id}>
                          <td>
                            {alt.code} - {alt.name}
                          </td>
                          {criteria.map((criterion) => (
                            <td key={criterion.id}>
                              {alt.scores[criterion.id] || 0}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Vektor S */}
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0">3. Vektor S</h5>
              </div>
              <div className="card-body">
                <p className="small text-muted mb-3">
                  Vektor S dihitung dengan mengalikan semua kriteria untuk
                  setiap alternatif yang telah dipangkatkan dengan bobot yang
                  telah dinormalisasi.
                  <br />
                  {`S = ∏(x_ij^w_j)`} untuk kriteria benefit
                  <br />
                  {`S = ∏(x_ij^(-w_j))`} untuk kriteria cost
                </p>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Alternatif</th>
                        <th>Nilai S</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vectorS.map((vector) => (
                        <tr key={vector.id}>
                          <td>
                            {vector.code} - {vector.name}
                          </td>
                          <td>{vector.s.toFixed(6)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Vektor V */}
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0">4. Vektor V (Preferensi)</h5>
              </div>
              <div className="card-body">
                <p className="small text-muted mb-3">
                  Vektor V adalah preferensi alternatif yang digunakan untuk
                  perangkingan.
                  <br />
                  {`V = S_i / ∑S_i untuk i = 1,2,...,n`}
                </p>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Alternatif</th>
                        <th>Nilai V</th>
                        <th>Rank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vectorV.map((vector, index) => (
                        <tr key={vector.id}>
                          <td>
                            {vector.code} - {vector.name}
                          </td>
                          <td>{vector.v.toFixed(6)}</td>
                          <td>
                            {rankedAlternatives.findIndex(
                              (alt) => alt.id === vector.id
                            ) + 1}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Grafik */}
          <div className="col-md-8 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0">5. Visualisasi Hasil</h5>
              </div>
              <div className="card-body">
                <div className="chart-container">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>

          {/* Kesimpulan */}
          <div className="col-md-4 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white">
                <h5 className="card-title mb-0">6. Kesimpulan</h5>
              </div>
              <div className="card-body">
                {rankedAlternatives.length > 0 ? (
                  <>
                    <div className="alert alert-success">
                      <div className="d-flex align-items-center">
                        <FontAwesomeIcon
                          icon={faTrophy}
                          className="me-3 fa-2x"
                        />
                        <div>
                          <h5 className="mb-1">Alternatif Terbaik:</h5>
                          <h6 className="mb-0">
                            {rankedAlternatives[0].code} -{" "}
                            {rankedAlternatives[0].name}
                          </h6>
                          <small>
                            Nilai V: {rankedAlternatives[0].v.toFixed(6)}
                          </small>
                        </div>
                      </div>
                    </div>

                    <p className="mt-3">Peringkat Alternatif:</p>
                    <ol className="list-group list-group-numbered">
                      {rankedAlternatives.map((alt, index) => (
                        <li
                          key={alt.id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div className="ms-2 me-auto">
                            {alt.code} - {alt.name}
                          </div>
                          <span className="badge bg-success rounded-pill">
                            {alt.v.toFixed(4)}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </>
                ) : (
                  <div className="alert alert-info">
                    Tidak ada data untuk perhitungan
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Calculation;
