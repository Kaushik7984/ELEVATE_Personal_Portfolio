import { useRef } from "react";
import {
  useGetResumeQuery,
  useUploadResumeMutation,
} from "../../../redux/api/resumeApi";
import PropTypes from "prop-types";
import styles from "../Project/ManageProjects.module.scss";

const BACKEND_URL = import.meta.env.VITE_API_URL;

const ManageResume = ({ onBack }) => {
  const { data, isLoading, refetch } = useGetResumeQuery();
  const [uploadResume, { isLoading: isUploading }] = useUploadResumeMutation();
  const fileInputRef = useRef();

  const handleUpload = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("resume", file);
    await uploadResume(formData);
    refetch();
    fileInputRef.current.value = "";
  };

  return (
    <div
      className={styles.managePanel}
      style={{ maxWidth: 500, margin: "0 auto" }}
    >
      {onBack && (
        <button onClick={onBack} style={{ marginBottom: 16 }}>
          ← Back to Dashboard
        </button>
      )}
      <h2 className={styles.heading}>Manage Resume</h2>
      <form className={styles.form} onSubmit={handleUpload}>
        <input
          type='file'
          accept='application/pdf'
          ref={fileInputRef}
          className={styles.input}
        />
        <button type='submit' className={styles.saveBtn} disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload Resume"}
        </button>
      </form>
      <div style={{ marginTop: 24 }}>
        {isLoading ? (
          <div>Loading current resume...</div>
        ) : data && data.filename ? (
          <div>
            <div style={{ color: "#ffa500", fontWeight: 500, marginBottom: 8 }}>
              Current Resume: {data.filename}
            </div>
            <a
              href={`${BACKEND_URL}/uploads/${data.filename}`}
              target='_blank'
              rel='noopener noreferrer'
              className={styles.saveBtn}
              style={{
                textDecoration: "none",
                display: "inline-block",
                marginTop: 8,
              }}
            >
              Download Current Resume
            </a>
          </div>
        ) : (
          <div style={{ color: "#ff3e55" }}>No resume uploaded yet.</div>
        )}
      </div>
    </div>
  );
};

ManageResume.propTypes = {
  onBack: PropTypes.func,
};

export default ManageResume;
