import Sidebar from '../sidebar/Sidebar'
import './navbar.scss'
import { motion } from 'framer-motion'

const Navbar = () => {
  return (
    <div className="navbar">
      <Sidebar />
      <div className="wrapper">
      
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}>
            <img src="/kt1.png" alt="KT" />
          </motion.span>
        <div className="social">
          <a href="https://www.linkedin.com/in/kaushik-tapaniya" target="_blank"><img src="./linkedin.png" alt="linkedin" /></a>
          <a href="https://github.com/Kaushik7984" target="_blank"><img src="./github.png" alt="github" /></a>
          <a href="https://www.instagram.com/kaushiiq_7" target="_blank"><img src="./instagram.png" alt="instagram" /></a>
        </div>
      </div>
    </div>
  )
}

export default Navbar
