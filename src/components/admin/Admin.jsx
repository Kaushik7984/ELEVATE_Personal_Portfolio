import { useState, useEffect } from "react";
import { useLoginMutation } from "../../redux/api/authApi";
import styles from "./Admin.module.scss";
import ManageProjects from "./Project/ManageProjects";
import ManageSkills from "./Skill/ManageSkills";
import ManageResume from "./Resume/ManageResume";
import ManageExperience from "./Experience/ManageExperience";

const Admin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, isError, error, isSuccess }] = useLoginMutation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [section, setSection] = useState("dashboard"); // 'dashboard', 'projects', 'skills', etc.

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ username, password }).unwrap();
      if (res.message === "Login successful." && res.token) {
        localStorage.setItem("token", res.token);
        setIsAuthenticated(true);
      }
    } catch (err) {
      // error handled by isError
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    setSection("dashboard");
  };

  // Dashboard with cards
  if ((isAuthenticated || isSuccess) && section === "dashboard") {
    return (
      <div className={styles.adminBg}>
        <div className={styles.adminDashboard}>
          <h2 className={styles.adminHeading}>Admin Dashboard</h2>
          <p style={{ color: "#fff", fontSize: 18 }}>
            Welcome, {username || "Admin"}!
          </p>
          <button onClick={handleLogout} style={{ marginBottom: 24 }}>
            Logout
          </button>
          <div className={styles.dashboardCards}>
            <div
              className={styles.dashboardCard}
              onClick={() => setSection("projects")}
            >
              <h3>Manage Projects</h3>
              <p>Add, edit, or delete portfolio projects</p>
            </div>
            <div
              className={styles.dashboardCard}
              onClick={() => setSection("skills")}
            >
              <h3>Manage Skills</h3>
              <p>Add, edit, or delete skills</p>
            </div>
            <div
              className={styles.dashboardCard}
              onClick={() => setSection("experience")}
            >
              <h3>Manage Experience</h3>
              <p>Add, edit, or delete experience</p>
            </div>
            <div
              className={styles.dashboardCard}
              onClick={() => setSection("resume")}
            >
              <h3>Manage Resume</h3>
              <p>Upload or update your resume PDF</p>
            </div>
           
          </div>
        </div>
      </div>
    );
  }

  // Manage Projects section
  if ((isAuthenticated || isSuccess) && section === "projects") {
    return (
      <div className={styles.adminBg}>
        <div className={styles.adminDashboard}>
          <ManageProjects onBack={() => setSection("dashboard")} />
        </div>
      </div>
    );
  }

  // Manage Skills section
  if ((isAuthenticated || isSuccess) && section === "skills") {
    return (
      <div className={styles.adminBg}>
        <div className={styles.adminDashboard}>
          <ManageSkills onBack={() => setSection("dashboard")} />
        </div>
      </div>
    );
  }

  // Manage Resume section
  if ((isAuthenticated || isSuccess) && section === "resume") {
    return (
      <div className={styles.adminBg}>
        <div className={styles.adminDashboard}>
          <ManageResume onBack={() => setSection("dashboard")} />
        </div>
      </div>
    );
  }

  // Manage Experience section
  if ((isAuthenticated || isSuccess) && section === "experience") {
    return (
      <div className={styles.adminBg}>
        <div className={styles.adminDashboard}>
          <ManageExperience onBack={() => setSection("dashboard")} />
        </div>
      </div>
    );
  }

  // Login form
  return (
    <div className={styles.adminBg}>
      <form onSubmit={handleSubmit} className={styles.adminCard}>
        <h2 className={styles.adminHeading}>Admin Login</h2>
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.adminInput}
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.adminInput}
        />
        <button
          type='submit'
          disabled={isLoading}
          className={styles.adminButton}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        {isError && (
          <span className={styles.adminError}>
            {error?.data?.message || "Login failed"}
          </span>
        )}
      </form>
    </div>
  );
};

export default Admin;
 