import { useState, useEffect } from "react";
import {
  useGetExperiencesQuery,
  useCreateExperienceMutation,
  useUpdateExperienceMutation,
  useDeleteExperienceMutation,
  useReorderExperiencesMutation,
} from "../../../redux/api/experienceApi";
import PropTypes from "prop-types";
import styles from "./ManageExperience.module.scss";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  order: 0,
};

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SortableExperience = ({ experience, handleEdit, handleDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: experience._id });

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
      className={styles.experienceCard}
    >
      {experience.logo && (
        <img src={`${BACKEND_URL}/uploads/${experience.logo}`} alt="Logo" style={{ maxWidth: 80, maxHeight: 60, borderRadius: 6, marginBottom: 8 }} />
      )}
      <span className={styles.experienceTitle}><strong>{experience.role}</strong> @ {experience.company} ({experience.type})</span>
      <span>Order: {experience.order}</span>
      <span>{experience.duration} | {experience.location} | {experience.mode}</span>
      <span><strong>Technologies:</strong> {experience.technologies.join(", ")}</span>
      <span className={styles.experienceDesc}>{experience.description}</span>
      <div className={styles.cardActions}>
        <button onPointerDown={(e) => e.stopPropagation()} className={styles.editButton} onClick={() => handleEdit(experience)}>Edit</button>
        <button onPointerDown={(e) => e.stopPropagation()} className={styles.deleteButton} onClick={() => handleDelete(experience._id)} style={{ marginLeft: 8 }}>Delete</button>
      </div>
    </div>
  );
};

const ManageExperience = ({ onBack }) => {
  const { data: experiencesData, isLoading, isError, refetch } = useGetExperiencesQuery();
  const [createExperience] = useCreateExperienceMutation();
  const [updateExperience] = useUpdateExperienceMutation();
  const [deleteExperience] = useDeleteExperienceMutation();
  const [reorderExperiences] = useReorderExperiencesMutation();
  const [experiences, setExperiences] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [logoPreview, setLogoPreview] = useState("");

  useEffect(() => {
    if (experiencesData) {
      setExperiences(experiencesData);
    }
  }, [experiencesData]);

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
    formData.append("order", form.order);
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
      try {
        await deleteExperience(id).unwrap();
        refetch();
      } catch (err) {
        setError("Error deleting experience.");
      }
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = experiences.findIndex((p) => p._id === active.id);
      const newIndex = experiences.findIndex((p) => p._id === over.id);
      const newOrder = arrayMove(experiences, oldIndex, newIndex);
      setExperiences(newOrder);
      await reorderExperiences(newOrder);
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
        <input type="number" name="order" value={form.order} onChange={handleChange} placeholder="Display Order" required className={styles.input} />
        <textarea className={styles.textarea} name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
        <input className={styles.input} type="file" name="logo" accept="image/*" onChange={handleChange} />
        {logoPreview && (
          <img src={logoPreview} alt="Logo Preview" style={{ maxWidth: 120, maxHeight: 80, margin: '10px 0', borderRadius: 8 }} />
        )}
        <button className={styles.button} type="submit">{editingId ? "Update" : "Add"} Experience</button>
        {error && <div className={styles.error}>{error}</div>}
      </form>
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={experiences.map((p) => p._id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className={styles.experienceList}>
            {isLoading && <p>Loading...</p>}
            {isError && <p>Error loading experiences.</p>}
            {experiences &&
              experiences.map((exp) => (
                <SortableExperience
                  key={exp._id}
                  experience={exp}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                />
              ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
};

ManageExperience.propTypes = {
  onBack: PropTypes.func,
};

SortableExperience.propTypes = {
    experience: PropTypes.object.isRequired,
    handleEdit: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
};

export default ManageExperience; 