import { useRef } from "react";
import "./experience.scss";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useGetExperiencesQuery } from "../../redux/api/experienceApi";
import PropTypes from "prop-types";

const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SingleExperience = ({ item }) => {
  const ref = useRef();
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], [-300, 300]);

  return (
    <section>
      <div className='container'>
        <div className='wrapper'>
          <div className='imageContainer' ref={ref}>
            <img
              src={
                item.logo
                  ? `${BACKEND_URL}/uploads/${item.logo}`
                  : "/experience-default.png"
              }
              alt={item.company}
              className='logo'
            />
          </div>
          <motion.div className='textContainer' style={{ y }}>
            <h2>{item.role} </h2>
            <span
              style={{ fontWeight: 400, fontSize: "1rem", color: "#ffa500" }}
            >
              @ {item.company}
            </span>
            <p style={{ margin: 0, color: "#bbb" }}>
              {item.type} | {item.duration} | {item.location} | {item.mode}
            </p>
            <p>
              <strong>Technologies:</strong> {item.technologies.join(", ")}
            </p>
            {item.skills && item.skills.length > 0 && (
              <p>
                <strong>Skills:</strong> {item.skills.join(", ")}
              </p>
            )}
            <p style={{ color: "#eee" }}>{item.description}</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

SingleExperience.propTypes = {
  item: PropTypes.shape({
    logo: PropTypes.string,
    company: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    technologies: PropTypes.arrayOf(PropTypes.string).isRequired,
    skills: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string.isRequired,
  }).isRequired,
};

const Experience = () => {
  const ref = useRef();
  const { data: items, isLoading, isError } = useGetExperiencesQuery();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end end", "start start"],
  });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  if (isLoading)
    return (
      <div className='experience' ref={ref}>
        <h2>Loading...</h2>
      </div>
    );
  if (isError)
    return (
      <div className='experience' ref={ref}>
        <h2>Error loading experience.</h2>
      </div>
    );

  return (
    <div className='experience' ref={ref}>
      <div className='progress'>
        <h1>Experience</h1>
        <motion.div style={{ scaleX }} className='progressBar'></motion.div>
      </div>
      {items &&
        items.map((item) => (
          <SingleExperience item={item} key={item._id || item.id} />
        ))}
    </div>
  );
};

export default Experience;
