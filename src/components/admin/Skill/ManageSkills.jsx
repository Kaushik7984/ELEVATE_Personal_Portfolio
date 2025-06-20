import { useState } from "react";
import {
  useGetSkillsQuery,
  useCreateSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
} from "../../../redux/api/skillsApi";
import PropTypes from "prop-types";
import styles from "./ManageSkills.module.scss";

const skillCategories = [
  {
    category: "Frontend Development",
    skills: [
      {
        name: "HTML",
        badge:
          "https://img.shields.io/badge/-HTML-23243a3?style=flat&logo=HTML5",
      },
      {
        name: "CSS",
        badge:
          "https://img.shields.io/badge/-CSS-23243a3?style=flat&logo=CSS3&logoColor=1572B6",
      },
      {
        name: "JavaScript",
        badge:
          "https://img.shields.io/badge/-JavaScript-23243a3?style=flat&logo=javascript",
      },
      {
        name: "TypeScript",
        badge:
          "https://img.shields.io/badge/-TypeScript-23243a3?style=flat&logo=typescript",
      },
      {
        name: "React.js",
        badge:
          "https://img.shields.io/badge/-React-23243a3?style=flat&logo=react",
      },
      {
        name: "Next.js",
        badge:
          "https://img.shields.io/badge/-Next.js-23243a3?style=flat&logo=nextdotjs",
      },
      {
        name: "Framer Motion",
        badge:
          "https://img.shields.io/badge/-Framer%20Motion-23243a3?style=flat&logo=framer",
      },
      {
        name: "Redux Toolkit",
        badge:
          "https://img.shields.io/badge/-Redux%20Toolkit-23243a3?style=flat&logo=redux",
      },
      {
        name: "RTK Query",
        badge:
          "https://img.shields.io/badge/-RTK%20Query-23243a3?style=flat&logo=redux",
      },
      {
        name: "i18next",
        badge:
          "https://img.shields.io/badge/-i18next-23243a3?style=flat&logo=i18next",
      },
    ],
  },
  {
    category: "Backend Development",
    skills: [
      {
        name: "Node.js",
        badge:
          "https://img.shields.io/badge/-Node.js-23243a3?style=flat&logo=node.js",
      },
      {
        name: "Express.js",
        badge:
          "https://img.shields.io/badge/-Express.js-23243a3?style=flat&logo=express",
      },
      {
        name: "Nest.js",
        badge:
          "https://img.shields.io/badge/-Nest.js-23243a3?style=flat&logo=nestjs",
      },
      {
        name: "Socket.io",
        badge:
          "https://img.shields.io/badge/-Socket.io-23243a3?style=flat&logo=socket.io",
      },
      {
        name: "Firebase",
        badge:
          "https://img.shields.io/badge/-Firebase-23243a3?style=flat&logo=firebase",
      },
    ],
  },
  {
    category: "Database & Storage",
    skills: [
      {
        name: "MongoDB",
        badge:
          "https://img.shields.io/badge/-MongoDB-23243a3?style=flat&logo=mongodb",
      },
      {
        name: "Mongoose ODM",
        badge:
          "https://img.shields.io/badge/-Mongoose%20ODM-23243a3?style=flat&logo=mongodb",
      },
      {
        name: "Firebase Firestore",
        badge:
          "https://img.shields.io/badge/-Firestore-23243a3?style=flat&logo=firebase",
      },
    ],
  },
  {
    category: "Tools",
    skills: [
      {
        name: "Git",
        badge: "https://img.shields.io/badge/-Git-23243a3?style=flat&logo=git",
      },
      {
        name: "GitHub",
        badge:
          "https://img.shields.io/badge/-GitHub-23243a3?style=flat&logo=github",
      },
      {
        name: "Postman",
        badge:
          "https://img.shields.io/badge/-Postman-23243a3?style=flat&logo=postman",
      },
      {
        name: "Visual Studio Code",
        badge:
          "https://img.shields.io/badge/-VS%20Code-23243a3?style=flat&logo=visualstudiocode",
      },
    ],
  },
];

const initialForm = { name: "", badge: "", category: "" };

const ManageSkills = ({ onBack }) => {
  const { data: skills = [], isLoading } = useGetSkillsQuery();
  const [createSkill] = useCreateSkillMutation();
  const [updateSkill] = useUpdateSkillMutation();
  const [deleteSkill] = useDeleteSkillMutation();
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedSkill("");
    setForm({ ...form, category: e.target.value, name: "", badge: "" });
  };

  const handleSkillChange = (e) => {
    setSelectedSkill(e.target.value);
    const cat = skillCategories.find((c) => c.category === selectedCategory);
    const skill = cat?.skills.find((s) => s.name === e.target.value);
    if (skill) {
      setForm({
        ...form,
        name: skill.name,
        badge: skill.badge,
        category: selectedCategory,
      });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.badge || !form.category) {
      setError("All fields are required.");
      return;
    }
    setError("");
    if (editingId) {
      await updateSkill({ id: editingId, ...form });
      setEditingId(null);
    } else {
      await createSkill(form);
    }
    setForm(initialForm);
    setSelectedCategory("");
    setSelectedSkill("");
  };

  const handleEdit = (skill) => {
    setForm({ name: skill.name, badge: skill.badge, category: skill.category });
    setEditingId(skill._id);
    setSelectedCategory(skill.category);
    setSelectedSkill(skill.name);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this skill?")) {
      await deleteSkill(id);
      if (editingId === id) {
        setEditingId(null);
        setForm(initialForm);
        setSelectedCategory("");
        setSelectedSkill("");
      }
    }
  };

  // Get skills for selected category
  const skillsForCategory = selectedCategory
    ? skillCategories.find((c) => c.category === selectedCategory)?.skills || []
    : [];

  return (
    <div className={styles.managePanel}>
      {onBack && (
        <button onClick={onBack} style={{ marginBottom: 16 }}>
          ← Back to Dashboard
        </button>
      )}
      <h2 className={styles.heading}>Manage Skills</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <select
          className={styles.input}
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value=''>Select Category (or enter manually)</option>
          {skillCategories.map((cat) => (
            <option key={cat.category} value={cat.category}>
              {cat.category}
            </option>
          ))}
        </select>
        {selectedCategory && (
          <select
            className={styles.input}
            value={selectedSkill}
            onChange={handleSkillChange}
          >
            <option value=''>Select Skill (or enter manually)</option>
            {skillsForCategory.map((skill) => (
              <option key={skill.name} value={skill.name}>
                {skill.name}
              </option>
            ))}
          </select>
        )}
        <input
          name='name'
          placeholder='Skill Name'
          value={form.name}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          name='badge'
          placeholder='Badge URL'
          value={form.badge}
          onChange={handleChange}
          className={styles.input}
        />
        <input
          name='category'
          placeholder='Category'
          value={form.category}
          onChange={handleChange}
          className={styles.input}
        />
        <button type='submit' className={styles.saveBtn}>
          {editingId ? "Update Skill" : "Add Skill"}
        </button>
        {editingId && (
          <button
            type='button'
            className={styles.cancelBtn}
            onClick={() => {
              setEditingId(null);
              setForm(initialForm);
              setSelectedCategory("");
              setSelectedSkill("");
            }}
          >
            Cancel
          </button>
        )}
        {error && <div className={styles.error}>{error}</div>}
      </form>
      <div className={styles.list} style={{ marginTop: 32 }}>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          skills.map((skill) => (
            <div key={skill._id} className={styles.card}>
              <img
                src={skill.badge}
                alt={skill.name}
                className={styles.skillImg}
              />
              <div className={styles.skillInfo}>
                <div className={styles.skillName}>{skill.name}</div>
                <div className={styles.skillCategory}>{skill.category}</div>
              </div>
              <button
                className={styles.editBtn}
                onClick={() => handleEdit(skill)}
              >
                Edit
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDelete(skill._id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

ManageSkills.propTypes = {
  onBack: PropTypes.func,
};

export default ManageSkills;
