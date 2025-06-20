import "./app.scss";
import Contact from "./components/contact/Contact";
import Cursor from "./components/cursor/Cursor";
import Hero from "./components/hero/Hero";
import Navbar from "./components/navbar/Navbar";
import Parallax from "./components/parallax/Parallax";
import Portfolio from "./components/portfolio/Portfolio";
import About from "./components/about/About";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./components/admin/Admin";
import Experience from "./components/Experience/Experience";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/admin/*' element={<Admin />} />
        <Route
          path='/*'
          element={
            <div className='section'>
              <Cursor />
              <section id='Home'>
                <Navbar />
                <Hero />
              </section>
              <section id='About'>
                <Parallax type='about' />
              </section>
              <section>
                <About />
              </section>
              <section>
                <Experience />
              </section>
              <section id='Portfolio'>
                <Parallax type='portfolio' />
              </section>
              {/* <section> */}
                <Portfolio />
              {/* </section> */}
              <section id='Contact'>
                <Contact />
              </section>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
