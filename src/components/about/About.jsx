import { motion } from "framer-motion";
import "./about.scss";
import Skillbar from "./Skillbar";
import Swal from "sweetalert2";
import { useGetResumeQuery } from "../../redux/api/resumeApi";

const textVariants = {
  initial: {
    x: -500,
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

const BACKEND_URL = import.meta.env.VITE_API_URL || "";

const About = () => {
  const { data, isLoading } = useGetResumeQuery();
  const resumeUrl =
    data && data.filename ? `${BACKEND_URL}/uploads/${data.filename}` : null;

  const handleDownloadResume = () => {
    Swal.fire({
      icon: "success",
      title: "Download Successful!",
      text: "Kaushik's resume has been downloaded.",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  };

  return (
    <div className='about'>
      <div className='wrapper'>
        <motion.div
          className='textContainer'
          variants={textVariants}
          initial='initial'
          animate='animate'
        >
          <motion.h1 variants={textVariants}>Hi, I&apos;m</motion.h1>
          <motion.h1 variants={textVariants}>Kaushik Tapaniya</motion.h1>
          <motion.h2 variants={textVariants}>
            Welcome to my portfolio website, Experience a dynamic and visually
            stunning portfolio built with ReactJS. Enjoy smooth, engaging
            animations powered by Framer Motion and a modern design crafted with
            SCSS.
          </motion.h2>

          <motion.div variants={textVariants} className='buttons'>
            <a
              href={resumeUrl || "#"}
              target='_blank'
              download={!!resumeUrl}
              onClick={
                resumeUrl ? handleDownloadResume : (e) => e.preventDefault()
              }
              style={{
                pointerEvents: resumeUrl ? "auto" : "none",
                opacity: resumeUrl ? 1 : 0.5,
              }}
            >
              <motion.button variants={textVariants}>
                {isLoading ? "Loading Resume..." : "Download my Resume"}
              </motion.button>
            </a>
            <a href='#Contact'>
              <motion.button variants={textVariants}>
                {" "}
                Contact Me{" "}
              </motion.button>
            </a>
          </motion.div>
        </motion.div>
        <motion.div className='skill'>
          <Skillbar />
        </motion.div>
      </div>
    </div>
  );
};

export default About;
