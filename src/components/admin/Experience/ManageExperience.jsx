import { useState } from "react";
import {
  useGetExperiencesQuery,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
} from "../../../redux/api/experienceApi";
import PropTypes from "prop-types";
import styles from "./ManageExperience.module.scss";

const initialForm = {
  role: "",
  company: "",
  type: "",
  duration: "",
  location: "",
  mode: "",
  technologies: "",
  description: "",
  logo: null,
};

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ManageExperience = ({ onBack }) => {
  const { data: experiences = [], isLoading, isError, refetch } = useGetExperiencesQuery();
  const [createExperience] = useCreateExperienceMutation();
  const [updateExperience] = useUpdateExperienceMutation();
  const [deleteExperience] = useDeleteExperienceMutation();
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [logoPreview, setLogoPreview] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo" && files && files[0]) {
      setForm({ ...form, logo: files[0] });
      setLogoPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const formData = new FormData();
    formData.append("role", form.role);
    formData.append("company", form.company);
    formData.append("type", form.type);
    formData.append("duration", form.duration);
    formData.append("location", form.location);
    formData.append("mode", form.mode);
    formData.append("technologies", form.technologies);
    formData.append("description", form.description);
    if (form.logo instanceof File) {
      formData.append("logo", form.logo);
    }
    try {
      if (editingId) {
        await updateExperience({ id: editingId, body: formData }).unwrap();
        setEditingId(null);
      } else {
        await createExperience(formData).unwrap();
      }
      setForm(initialForm);
      setLogoPreview("");
      refetch();
    } catch (err) {
      setError("Error saving experience.");
    }
  };

  const handleEdit = (exp) => {
    setForm({
      ...exp,
      technologies: exp.technologies.join(", "),
      logo: null, // reset file input
    });
    setLogoPreview(exp.logo ? `${BACKEND_URL}/uploads/${exp.logo}` : "");
    setEditingId(exp._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      await deleteExperience(id);
      refetch();
    }
  };

  return (
    <div className={styles.manageExperience}>
      {onBack && (
        <button onClick={onBack} style={{ marginBottom: 16 }}>
          ← Back to Dashboard
        </button>
      )}
      <h2 className={styles.heading}>Manage Experience</h2>
      <form className={styles.form} onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input className={styles.input} name="role" value={form.role} onChange={handleChange} placeholder="Role" required />
        <input className={styles.input} name="company" value={form.company} onChange={handleChange} placeholder="Company" required />
        <input className={styles.input} name="type" value={form.type} onChange={handleChange} placeholder="Type (e.g. Full-time)" required />
        <input className={styles.input} name="duration" value={form.duration} onChange={handleChange} placeholder="Duration" required />
        <input className={styles.input} name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
        <input className={styles.input} name="mode" value={form.mode} onChange={handleChange} placeholder="Mode (e.g. Remote)" required />
        <input className={styles.input} name="technologies" value={form.technologies} onChange={handleChange} placeholder="Technologies (comma separated)" required />
        <textarea className={styles.textarea} name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
        <input className={styles.input} type="file" name="logo" accept="image/*" onChange={handleChange} />
        {logoPreview && (
          <img src={logoPreview} alt="Logo Preview" style={{ maxWidth: 120, maxHeight: 80, margin: '10px 0', borderRadius: 8 }} />
        )}
        <button className={styles.button} type="submit">{editingId ? "Update" : "Add"} Experience</button>
        {error && <div className={styles.error}>{error}</div>}
      </form>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error loading experiences.</div>
      ) : (
        <ul className={styles.experienceList}>
          {experiences.map((exp) => (
            <li className={styles.experienceCard} key={exp._id}>
              {exp.logo && (
                <img src={`${BACKEND_URL}/uploads/${exp.logo}`} alt="Logo" style={{ maxWidth: 80, maxHeight: 60, borderRadius: 6, marginBottom: 8 }} />
              )}
              <span className={styles.experienceTitle}><strong>{exp.role}</strong> @ {exp.company} ({exp.type})</span>
              <span>{exp.duration} | {exp.location} | {exp.mode}</span>
              <span><strong>Technologies:</strong> {exp.technologies.join(", ")}</span>
              <span className={styles.experienceDesc}>{exp.description}</span>
              <div className={styles.cardActions}>
                <button className={styles.editButton} onClick={() => handleEdit(exp)}>Edit</button>
                <button className={styles.deleteButton} onClick={() => handleDelete(exp._id)} style={{ marginLeft: 8 }}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

ManageExperience.propTypes = {
  onBack: PropTypes.func,
};

export default ManageExperience; 