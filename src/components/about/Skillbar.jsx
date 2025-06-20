import "./skillbar.scss";
import { useGetSkillsQuery } from "../../redux/api/skillsApi";
import { motion } from "framer-motion";

const groupSkillsByCategory = (skills) => {
  const grouped = {};
  skills.forEach((skill) => {
    if (!grouped[skill.category]) grouped[skill.category] = [];
    grouped[skill.category].push(skill);
  });
  return grouped;
};

const textVariants = {
  initial: {
    x: 500,
    opacity: 0,
  },
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 1,
      staggerChildren: 0.1,
    },
  },
};

const Skillbar = () => {
  const { data: skills = [], isLoading } = useGetSkillsQuery();
  const grouped = groupSkillsByCategory(skills);

  return (
    <motion.section
      className='skills'
      id='skills'
      variants={textVariants}
      initial='initial'
      animate='animate'
    >
      <motion.h3 className='skills-header' variants={textVariants}>
        Under the Hood
      </motion.h3>
      {isLoading ? (
        <div style={{ textAlign: "center", color: "#ffa500", fontWeight: 500 }}>
          Loading skills...
        </div>
      ) : (
        <motion.div className='skills-categories' variants={textVariants}>
          {Object.keys(grouped).map((category) => (
            <motion.div
              className='skills-category'
              key={category}
              variants={textVariants}
            >
              <motion.h4
                className='skills-category-title'
                variants={textVariants}
              >
                {category}
              </motion.h4>
              <motion.div className='skills-badges' variants={textVariants}>
                {grouped[category].map((skill) => (
                  <motion.img
                    key={skill._id}
                    src={skill.badge}
                    alt={skill.name + " badge"}
                    className='skill-badge'
                    loading='lazy'
                    variants={textVariants}
                  />
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.section>
  );
};

export default Skillbar;
