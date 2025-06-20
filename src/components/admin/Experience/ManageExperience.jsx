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
};

const ManageExperience = ({ onBack }) => {
  const { data: experiences = [], isLoading, isError, refetch } = useGetExperiencesQuery();
  const [createExperience] = useCreateExperienceMutation();
  const [updateExperience] = useUpdateExperienceMutation();
  const [deleteExperience] = useDeleteExperienceMutation();
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const payload = {
      ...form,
      technologies: form.technologies.split(",").map((t) => t.trim()),
    };
    try {
      if (editingId) {
        await updateExperience({ id: editingId, ...payload }).unwrap();
        setEditingId(null);
      } else {
        await createExperience(payload).unwrap();
      }
      setForm(initialForm);
      refetch();
    } catch (err) {
      setError("Error saving experience.");
    }
  };

  const handleEdit = (exp) => {
    setForm({
      ...exp,
      technologies: exp.technologies.join(", "),
    });
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
      )}      <h2 className={styles.heading}>Manage Experience</h2>
      <form className={styles.form} onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <input className={styles.input} name="role" value={form.role} onChange={handleChange} placeholder="Role" required />
        <input className={styles.input} name="company" value={form.company} onChange={handleChange} placeholder="Company" required />
        <input className={styles.input} name="type" value={form.type} onChange={handleChange} placeholder="Type (e.g. Full-time)" required />
        <input className={styles.input} name="duration" value={form.duration} onChange={handleChange} placeholder="Duration" required />
        <input className={styles.input} name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
        <input className={styles.input} name="mode" value={form.mode} onChange={handleChange} placeholder="Mode (e.g. Remote)" required />
        <input className={styles.input} name="technologies" value={form.technologies} onChange={handleChange} placeholder="Technologies (comma separated)" required />
        <textarea className={styles.textarea} name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
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