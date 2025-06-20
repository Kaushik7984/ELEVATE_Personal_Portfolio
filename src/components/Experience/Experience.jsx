import "./experience.scss";
import { useGetExperiencesQuery } from '../../redux/api/experienceApi';

const Experience = () => {
  const { data: experiences = [], isLoading, isError } = useGetExperiencesQuery();

  return (
    <section className="experience-section" id="Experience">
      <h2 className="experience-title">Experience</h2>
      {isLoading ? (
        <p style={{ color: '#fff', textAlign: 'center' }}>Loading...</p>
      ) : isError ? (
        <p style={{ color: '#ff3e55', textAlign: 'center' }}>Error loading experiences.</p>
      ) : experiences.length === 0 ? (
        <p style={{ color: '#fff', textAlign: 'center' }}>No experience entries found.</p>
      ) : (
        <ul className="experience-list">
          {experiences.map((exp) => (
            <li className="experience-card" key={exp._id}>
              <div className="experience-role">
                {exp.role} <span style={{ fontWeight: 400, color: '#fff', fontSize: '1rem' }}>@ {exp.company}</span>
              </div>
              <div className="experience-meta">
                {exp.type} | {exp.duration} | {exp.location} | {exp.mode}
              </div>
              <div className="experience-tech">
                <strong>Technologies:</strong> {exp.technologies.join(", ")}
              </div>
              {exp.skills && exp.skills.length > 0 && (
                <div className="experience-skills">
                  <strong>Skills:</strong> {exp.skills.join(", ")}
                </div>
              )}
              <div className="experience-desc">{exp.description}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Experience;
