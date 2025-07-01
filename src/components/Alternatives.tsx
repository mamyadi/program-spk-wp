import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

interface Criterion {
  id: number;
  code: string;
  name: string;                            <button
                              className="btn btn-sm btn-danger ms-2"
                              onClick={() => handleShowDeleteModal(alternative.id)}
                              title="Hapus"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>ght: number;
  type: "benefit" | "cost";
}

interface Score {
  id?: number;
  criteria_id: number;
  value: number;
}

interface Alternative {
  id: number;
  code: string;
  name: string;
  scores: Score[];
}

const Alternatives: React.FC = () => {
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [alternativeToDelete, setAlternativeToDelete] = useState<number | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<{
    code: string;
    name: string;
    scores: { [key: number]: number };
  }>({
    code: "",
    name: "",
    scores: {},
  });
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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

      // Fetch criteria first
      console.log("Fetching criteria...");
      const criteriaResponse = await axios.get(
        "http://localhost:5000/api/criteria",
        { headers }
      );

      if (criteriaResponse.data && criteriaResponse.data.criteria) {
        console.log(
          `Received ${criteriaResponse.data.criteria.length} criteria`
        );
        setCriteria(criteriaResponse.data.criteria);
      } else {
        console.error("No criteria data in response", criteriaResponse);
      }

      // Then fetch alternatives
      console.log("Fetching alternatives...");
      const alternativesResponse = await axios.get(
        "http://localhost:5000/api/alternatives",
        { headers }
      );

      if (alternativesResponse.data && alternativesResponse.data.alternatives) {
        console.log(
          `Received ${alternativesResponse.data.alternatives.length} alternatives`
        );
        setAlternatives(alternativesResponse.data.alternatives);
      } else {
        console.error("No alternatives data in response", alternativesResponse);
        setError("Format data tidak valid");
      }

      setError(null);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);

        // Handle different error types
        if (err.response.status === 401) {
          setError("Sesi anda telah berakhir, silakan login kembali");
        } else {
          setError(
            `Gagal memuat data: ${err.response.data.message || err.message}`
          );
        }
      } else {
        setError(`Gagal memuat data: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode: "add" | "edit", alternative?: Alternative) => {
    // Initialize scores object with criteria IDs
    const initialScores: { [key: number]: number } = {};
    criteria.forEach((criterion) => {
      initialScores[criterion.id] = 0;
    });

    if (mode === "add") {
      setFormData({
        code: "",
        name: "",
        scores: initialScores,
      });
      setSelectedId(null);
    } else if (alternative) {
      // Map alternative scores to the format needed for the form
      const scoreMap: { [key: number]: number } = {};
      alternative.scores.forEach((score) => {
        scoreMap[score.criteria_id] = score.value;
      });

      setFormData({
        code: alternative.code,
        name: alternative.name,
        scores: { ...initialScores, ...scoreMap },
      });
      setSelectedId(alternative.id);
    }

    setFormMode(mode);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleScoreChange = (criterionId: number, value: string) => {
    setFormData({
      ...formData,
      scores: {
        ...formData.scores,
        [criterionId]: parseFloat(value) || 0,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Convert scores object to array
      const scoresArray = Object.entries(formData.scores).map(
        ([criteriaId, value]) => ({
          criteria_id: parseInt(criteriaId),
          value,
        })
      );

      const payload = {
        code: formData.code,
        name: formData.name,
        scores: scoresArray,
      };

      if (formMode === "add") {
        await axios.post("http://localhost:5000/api/alternatives", payload);
      } else {
        await axios.put(
          `http://localhost:5000/api/alternatives/${selectedId}`,
          payload
        );
      }

      // Refresh alternatives list
      fetchData();
      handleCloseModal();
    } catch (err) {
      console.error("Error saving alternative:", err);
      setError("Gagal menyimpan data alternatif");
    }
  };

  const handleShowDeleteModal = (id: number) => {
    setAlternativeToDelete(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setAlternativeToDelete(null);
  };

  const handleDelete = async () => {
    if (alternativeToDelete === null) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/alternatives/${alternativeToDelete}`);
      // Close modal and refresh data
      setShowDeleteModal(false);
      setAlternativeToDelete(null);
      fetchData();
    } catch (err) {
      console.error("Error deleting alternative:", err);
      setError("Gagal menghapus data alternatif");
    }
  };

  return (
    <div className="row alternatives-page">
      <div className="col-12">
        <div className="card shadow-sm border-0">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0" style={{ color: "#008080" }}>
              Daftar Alternatif
            </h5>
            <button
              className="btn btn-sm"
              style={{ backgroundColor: "#008080", color: "white" }}
              onClick={() => handleOpenModal("add")}
            >
              <FontAwesomeIcon icon={faPlus} className="me-1" /> Tambah
              Alternatif
            </button>
          </div>
          <div className="card-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {loading ? (
              <div className="d-flex justify-content-center my-4">
                <div
                  className="spinner-border"
                  style={{ color: "#008080" }}
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>No</th>
                      <th>Kode</th>
                      <th>Nama Alternatif</th>
                      {criteria.map((criterion) => (
                        <th key={criterion.id}>{criterion.code}</th>
                      ))}
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alternatives.length === 0 ? (
                      <tr>
                        <td
                          colSpan={4 + criteria.length}
                          className="text-center py-3"
                        >
                          Belum ada data alternatif
                        </td>
                      </tr>
                    ) : (
                      alternatives.map((alternative, index) => (
                        <tr key={alternative.id}>
                          <td>{index + 1}</td>
                          <td>{alternative.code}</td>
                          <td>{alternative.name}</td>
                          {criteria.map((criterion) => {
                            const score = alternative.scores.find(
                              (s) => s.criteria_id === criterion.id
                            );
                            return (
                              <td key={criterion.id}>
                                {score ? score.value : "-"}
                              </td>
                            );
                          })}
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary me-1"
                              onClick={() =>
                                handleOpenModal("edit", alternative)
                              }
                              title="Edit"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleShowDeleteModal(alternative.id)}
                              title="Hapus"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ 
            display: "block", 
            backgroundColor: "rgba(0,0,0,0.5)"
          }}
        >
          <div className="modal-dialog modal-lg" style={{ 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100vh - 60px)",
            margin: "30px auto"
          }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {formMode === "add" ? "Tambah Alternatif" : "Edit Alternatif"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="code" className="form-label">
                        Kode
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="code"
                        name="code"
                        value={formData.code}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="name" className="form-label">
                        Nama Alternatif
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <h6 className="mt-4 mb-3">Nilai Kriteria:</h6>

                  <div className="row">
                    {criteria.map((criterion) => (
                      <div key={criterion.id} className="col-md-6 mb-3">
                        <label
                          htmlFor={`score_${criterion.id}`}
                          className="form-label"
                        >
                          {criterion.name} ({criterion.code})
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id={`score_${criterion.id}`}
                          value={formData.scores[criterion.id] || 0}
                          onChange={(e) =>
                            handleScoreChange(criterion.id, e.target.value)
                          }
                          step="0.01"
                          required
                        />
                        <small className="text-muted">
                          {criterion.type === "benefit"
                            ? "Semakin besar semakin baik"
                            : "Semakin kecil semakin baik"}
                        </small>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCloseModal}
                  >
                    <FontAwesomeIcon icon={faTimes} className="me-1" /> Batal
                  </button>
                  <button
                    type="submit"
                    className="btn"
                    style={{ backgroundColor: "#008080", color: "white" }}
                  >
                    <FontAwesomeIcon icon={faSave} className="me-1" /> Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="modal fade show"
          style={{ 
            display: "block", 
            backgroundColor: "rgba(0,0,0,0.5)"
          }}
        >
          <div className="modal-dialog" style={{ 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100vh - 60px)",
            margin: "30px auto"
          }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Konfirmasi Hapus</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseDeleteModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>Apakah Anda yakin ingin menghapus alternatif ini?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseDeleteModal}
                >
                  Batal
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alternatives;
