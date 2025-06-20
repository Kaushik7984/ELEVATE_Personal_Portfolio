import { useState } from "react";
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "../../../redux/api/projectApi";
import styles from "./ManageProjects.module.scss";
import PropTypes from "prop-types";

const initialForm = { title: "", img: "", desc: "", link: "" };
const BACKEND_URL = import.meta.env.VITE_API_URL;

const ManageProjects = ({ onBack }) => {
  const { data: projects, isLoading, isError, refetch } = useGetProjectsQuery();
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, img: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("desc", form.desc);
    formData.append("link", form.link);
    if (form.img instanceof File) {
      formData.append("img", form.img);
    }

    try {
      if (editingId) {
        await updateProject({ id: editingId, body: formData }).unwrap();
        setEditingId(null);
      } else {
        await createProject(formData).unwrap();
      }
      setForm(initialForm);
      setImagePreview("");
      // Reset file input if possible (by resetting the form)
      e.target.reset();
      refetch();
    } catch (err) {
      setError("Error saving project.");
    }
  };

  const handleEdit = (project) => {
    setForm({
      title: project.title,
      img: project.img,
      desc: project.desc,
      link: project.link,
    });
    setEditingId(project._id);
    setImagePreview(project.img ? `${BACKEND_URL}${project.img}` : "");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this project?")) {
      try {
        await deleteProject(id).unwrap();
        refetch();
      } catch {
        setError("Error deleting project.");
      }
    }
  };

  return (
    <div className={styles.manageProjects}>
      {onBack && (
        <button onClick={onBack} style={{ marginBottom: 16 }}>
          ← Back to Dashboard
        </button>
      )}
      <h2 className={styles.heading}>Manage Projects</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name='title'
          placeholder='Title'
          value={form.title}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <input
          type='file'
          name='img'
          onChange={handleFileChange}
          accept='image/*'
          className={styles.input}
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt='Preview'
            style={{ maxWidth: "200px", display: "block", margin: "10px 0" }}
          />
        )}
        <input
          name='link'
          placeholder='Demo Link'
          value={form.link}
          onChange={handleChange}
          required
          className={styles.input}
        />
        <textarea
          name='desc'
          placeholder='Description'
          value={form.desc}
          onChange={handleChange}
          required
          rows={3}
          className={styles.textarea}
        />
        <button type='submit' className={styles.button}>
          {editingId ? "Update" : "Add"} Project
        </button>
        {editingId && (
          <button
            type='button'
            onClick={() => {
              setEditingId(null);
              setForm(initialForm);
              setImagePreview("");
            }}
            className={styles.cancelButton}
          >
            Cancel Edit
          </button>
        )}
        {error && <span className={styles.error}>{error}</span>}
      </form>
      <div className={styles.projectList}>
        {isLoading && <p>Loading...</p>}
        {isError && <p className={styles.error}>Error loading projects.</p>}
        {projects && projects.length === 0 && <p>No projects found.</p>}
        {projects &&
          projects.map((project) => (
            <div key={project._id} className={styles.projectCard}>
              <span className={styles.projectTitle}>{project.title}</span>
              <img
                src={`${BACKEND_URL}${project.img}`}
                alt={project.title}
                className={styles.projectImg}
              />
              <span className={styles.projectDesc}>{project.desc}</span>
              <a
                href={project.link}
                target='_blank'
                rel='noopener noreferrer'
                className={styles.projectLink}
              >
                Demo
              </a>
              <div className={styles.cardActions}>
                <button
                  onClick={() => handleEdit(project)}
                  className={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project._id)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
ManageProjects.propTypes = {
  onBack: PropTypes.func,
};

export default ManageProjects;
