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
  name: string;
  weight: number;
  type: "benefit" | "cost";
}

const Criteria: React.FC = () => {
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [criterionToDelete, setCriterionToDelete] = useState<number | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [formData, setFormData] = useState<Omit<Criterion, "id">>({
    code: "",
    name: "",
    weight: 0,
    type: "benefit",
  });
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    fetchCriteria();
  }, []);

  const fetchCriteria = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/criteria");
      setCriteria(response.data.criteria);
      setError(null);
    } catch (err) {
      console.error("Error fetching criteria:", err);
      setError("Gagal memuat data kriteria");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode: "add" | "edit", criterion?: Criterion) => {
    if (mode === "add") {
      setFormData({
        code: "",
        name: "",
        weight: 0,
        type: "benefit",
      });
      setSelectedId(null);
    } else if (criterion) {
      setFormData({
        code: criterion.code,
        name: criterion.name,
        weight: criterion.weight,
        type: criterion.type,
      });
      setSelectedId(criterion.id);
    }

    setFormMode(mode);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Handle special case for weight (convert to number)
    if (name === "weight") {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (formMode === "add") {
        await axios.post("http://localhost:5000/api/criteria", formData);
      } else {
        await axios.put(
          `http://localhost:5000/api/criteria/${selectedId}`,
          formData
        );
      }

      // Refresh criteria list
      fetchCriteria();
      handleCloseModal();
    } catch (err) {
      console.error("Error saving criterion:", err);
      setError("Gagal menyimpan data kriteria");
    }
  };

  const handleShowDeleteModal = (id: number) => {
    setCriterionToDelete(id);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setCriterionToDelete(null);
  };

  const handleDelete = async () => {
    if (criterionToDelete === null) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/criteria/${criterionToDelete}`);
      // Close modal and refresh data
      setShowDeleteModal(false);
      setCriterionToDelete(null);
      fetchCriteria();
    } catch (err) {
      console.error("Error deleting criterion:", err);
      setError("Gagal menghapus data kriteria");
    }
  };

  return (
    <div className="row criteria-page">
      <div className="col-12">
        <div className="card shadow-sm border-0">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0" style={{ color: "#008080" }}>
              Daftar Kriteria
            </h5>
            <button
              className="btn btn-sm"
              style={{ backgroundColor: "#008080", color: "white" }}
              onClick={() => handleOpenModal("add")}
            >
              <FontAwesomeIcon icon={faPlus} className="me-1" /> Tambah Kriteria
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
                      <th>Nama Kriteria</th>
                      <th>Bobot</th>
                      <th>Jenis</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {criteria.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-3">
                          Belum ada data kriteria
                        </td>
                      </tr>
                    ) : (
                      criteria.map((criterion, index) => (
                        <tr key={criterion.id}>
                          <td>{index + 1}</td>
                          <td>{criterion.code}</td>
                          <td>{criterion.name}</td>
                          <td>{criterion.weight}</td>
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
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary me-1"
                              onClick={() => handleOpenModal("edit", criterion)}
                              title="Edit"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleShowDeleteModal(criterion.id)}
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
          <div className="modal-dialog" style={{ 
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100vh - 60px)",
            margin: "30px auto"
          }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {formMode === "add" ? "Tambah Kriteria" : "Edit Kriteria"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
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

                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Nama Kriteria
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

                  <div className="mb-3">
                    <label htmlFor="weight" className="form-label">
                      Bobot
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      min="0"
                    />
                    <small className="text-muted">
                      Total bobot harus berjumlah 1.0
                    </small>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="type" className="form-label">
                      Jenis
                    </label>
                    <select
                      className="form-select"
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="benefit">
                        Benefit (Semakin besar semakin baik)
                      </option>
                      <option value="cost">
                        Cost (Semakin kecil semakin baik)
                      </option>
                    </select>
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
                <p>Apakah Anda yakin ingin menghapus kriteria ini?</p>
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

export default Criteria;
