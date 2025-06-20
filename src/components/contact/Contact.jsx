import { useRef, useState, useEffect } from "react";
import "./contact.scss";
import { motion, useInView } from "framer-motion";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";

const variants = {
  initial: {
    y: 500,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    },
  },
};

const Contact = () => {
  const ref = useRef();
  const formRef = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const isInView = useInView(ref, { margin: "-100px" });

  const validate = () => {
    const validationErrors = {};
    if (!formData.name.trim()) {
      validationErrors.name = "Name is required!";
    } else if (formData.name.length < 3) {
      validationErrors.name = "Name must be at least 3 characters long.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      validationErrors.email = "Email is required!";
    } else if (!emailRegex.test(formData.email)) {
      validationErrors.email = "Invalid email format.";
    }

    if (!formData.message.trim()) {
      validationErrors.message = "Message is required!";
    } else if (formData.message.length < 10) {
      validationErrors.message = "Message must be at least 10 characters.";
    }

    return validationErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate on every input change and update form validity
    const validationErrors = validate();
    setErrors(validationErrors);
    setIsFormValid(Object.keys(validationErrors).length === 0);
  };

  const sendEmail = (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    setLoading(true);

    emailjs
      .sendForm(
        "service_1ymqkki",
        "template_5ppb04n",
        formRef.current,
        "Ue-cEiX8Sniudcpuc"
      )
      .then(
        () => {
          setLoading(false);
          setFormData({ name: "", email: "", message: "" });
          setIsFormValid(false);

          Swal.fire({
            icon: "success",
            title: "Message Sent!",
            text: "Your message has been successfully sent. We'll get back to you soon!",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        },
        () => {
          setLoading(false);

          Swal.fire({
            icon: "error",
            title: "Message Failed!",
            text: "There was an error sending your message. Please try again later.",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        }
      );
  };

  useEffect(() => {
    const disableActions = (e) => {
      if (e.type === "contextmenu") e.preventDefault();
      if (
        e.type === "keydown" &&
        (e.key === "F12" ||
          (e.ctrlKey &&
            e.shiftKey &&
            (e.key === "I" || e.key === "J" || e.key === "C")) ||
          (e.ctrlKey && e.key === "U"))
      ) {
        e.preventDefault();
      }
    };

    const disableTextSelection = (e) => e.preventDefault();

    document.addEventListener("contextmenu", disableActions);
    document.addEventListener("keydown", disableActions);
    document.addEventListener("selectstart", disableTextSelection);
    document.addEventListener("dragstart", disableTextSelection);

    return () => {
      document.removeEventListener("contextmenu", disableActions);
      document.removeEventListener("keydown", disableActions);
      document.removeEventListener("selectstart", disableTextSelection);
      document.removeEventListener("dragstart", disableTextSelection);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      className='contact'
      variants={variants}
      initial='initial'
      whileInView='animate'
    >
      <motion.div className='textContainer' variants={variants}>
        <motion.h1 variants={variants}>Let’s work together</motion.h1>
        <motion.div className='item' variants={variants}>
          <h2>Mail</h2>
          <span>
            <a
              href='mailto:kaushik7984@gmail.com'
              target='_blank'
              rel='noreferrer'
            >
              kaushik7984@gmail.com
            </a>
          </span>
        </motion.div>
        <motion.div className='item' variants={variants}>
          <h2>Address</h2>
          <span>Dared, Bhavnagar</span>
        </motion.div>
        <motion.div className='item' variants={variants}>
          <h2>Phone</h2>
          <span>+91 99980 74631</span>
        </motion.div>
      </motion.div>
      <div className='formContainer'>
        <motion.div
          className='phoneSvg'
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 0 }}
          transition={{ delay: 3, duration: 1 }}
        >
          <svg width='450px' height='450px' viewBox='0 0 32.666 32.666'>
            <motion.path
              strokeWidth={0.2}
              fill='none'
              initial={{ pathLength: 0 }}
              animate={isInView && { pathLength: 1 }}
              transition={{ duration: 3 }}
              d='M28.189,16.504h-1.666c0-5.437-4.422-9.858-9.856-9.858l-0.001-1.664C23.021,4.979,28.189,10.149,28.189,16.504z
            M16.666,7.856L16.665,9.52c3.853,0,6.983,3.133,6.981,6.983l1.666-0.001C25.312,11.735,21.436,7.856,16.666,7.856z M16.333,0
            C7.326,0,0,7.326,0,16.334c0,9.006,7.326,16.332,16.333,16.332c0.557,0,1.007-0.45,1.007-1.006c0-0.559-0.45-1.01-1.007-1.01
            c-7.896,0-14.318-6.424-14.318-14.316c0-7.896,6.422-14.319,14.318-14.319c7.896,0,14.317,6.424,14.317,14.319
            c0,3.299-1.756,6.568-4.269,7.954c-0.913,0.502-1.903,0.751-2.959,0.761c0.634-0.377,1.183-0.887,1.591-1.529
            c0.08-0.121,0.186-0.228,0.238-0.359c0.328-0.789,0.357-1.684,0.555-2.518c0.243-1.064-4.658-3.143-5.084-1.814
            c-0.154,0.492-0.39,2.048-0.699,2.458c-0.275,0.366-0.953,0.192-1.377-0.168c-1.117-0.952-2.364-2.351-3.458-3.457l0.002-0.001
            c-0.028-0.029-0.062-0.061-0.092-0.092c-0.031-0.029-0.062-0.062-0.093-0.092v0.002c-1.106-1.096-2.506-2.34-3.457-3.459
            c-0.36-0.424-0.534-1.102-0.168-1.377c0.41-0.311,1.966-0.543,2.458-0.699c1.326-0.424-0.75-5.328-1.816-5.084
            c-0.832,0.195-1.727,0.227-2.516,0.553c-0.134,0.057-0.238,0.16-0.359,0.24c-2.799,1.774-3.16,6.082-0.428,9.292
            c1.041,1.228,2.127,2.416,3.245,3.576l-0.006,0.004c0.031,0.031,0.063,0.06,0.095,0.09c0.03,0.031,0.059,0.062,0.088,0.095
            l0.006-0.006c1.16,1.118,2.535,2.765,4.769,4.255c4.703,3.141,8.312,2.264,10.438,1.098c3.67-2.021,5.312-6.338,5.312-9.719
            C32.666,7.326,25.339,0,16.333,0z'
            />
          </svg>
        </motion.div>
        <motion.form
          ref={formRef}
          onSubmit={sendEmail}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 4, duration: 1 }}
        >
          <input
            type='text'
            name='name'
            placeholder='Name'
            value={formData.name}
            onChange={handleInputChange}
          />
          {errors.name && <span className='error'>{errors.name}</span>}

          <input
            type='email'
            name='email'
            placeholder='Email'
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <span className='error'>{errors.email}</span>}

          <textarea
            name='message'
            rows={8}
            placeholder='Message'
            required
            value={formData.message}
            onChange={handleInputChange}
          />
          {errors.message && <span className='error'>{errors.message}</span>}

          <button disabled={!isFormValid || loading}>
            {loading ? "Sending..." : "Submit"}
          </button>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default Contact;
