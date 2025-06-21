import { useState, useEffect } from "react";
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useReorderProjectsMutation,
} from "../../../redux/api/projectApi";
import styles from "./ManageProjects.module.scss";
import PropTypes from "prop-types";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const initialForm = { title: "", img: "", desc: "", link: "", order: 0, techStack: "" };
const BACKEND_URL = import.meta.env.VITE_API_URL;

const SortableProject = ({ project, handleEdit, handleDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: project._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={styles.projectCard}
    >
      <span className={styles.projectTitle}>{project.title}</span>
      <span className={styles.projectOrder}>Order: {project.order}</span>
      <img
        src={`${BACKEND_URL}${project.img}`}
        alt={project.title}
        className={styles.projectImg}
      />
      <span className={styles.projectDesc}>{project.desc}</span>
      <div className={styles.techStack}>
        {project.techStack?.map((tech, index) => (
          <span key={index} className={styles.techPill}>{tech}</span>
        ))}
      </div>
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
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => handleEdit(project)}
          className={styles.editButton}
        >
          Edit
        </button>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => handleDelete(project._id)}
          className={styles.deleteButton}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const ManageProjects = ({ onBack }) => {
  const { data: projectsData, isLoading, isError, refetch } = useGetProjectsQuery();
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const [reorderProjects] = useReorderProjectsMutation();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (projectsData) {
      setProjects(projectsData);
    }
  }, [projectsData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'order' ? parseInt(value, 10) : value });
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
    formData.append("order", String(form.order));
    formData.append("techStack", form.techStack);
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
      order: project.order,
      techStack: project.techStack?.join(", ") || "",
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

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p._id === active.id);
      const newIndex = projects.findIndex((p) => p._id === over.id);
      const newOrder = arrayMove(projects, oldIndex, newIndex);
      setProjects(newOrder);
      await reorderProjects(newOrder);
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
        <input
          name='order'
          type='number'
          value={form.order}
          onChange={handleChange}
          placeholder='Display Order'
          required
          className={styles.input}
        />
        <input
          name='techStack'
          placeholder='Tech Stack (comma-separated)'
          value={form.techStack || ''}
          onChange={handleChange}
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
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={projects.map((p) => p._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className={styles.projectList}>
            {isLoading && <p>Loading...</p>}
            {isError && <p className={styles.error}>Error loading projects.</p>}
            {projects && projects.length === 0 && <p>No projects found.</p>}
            {projects &&
              projects.map((project) => (
                <SortableProject
                  key={project._id}
                  project={project}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
ManageProjects.propTypes = {
  onBack: PropTypes.func,
};

SortableProject.propTypes = {
    project: PropTypes.object.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
};

export default ManageProjects;
