import React from 'react';
import { Routes, Route, Link, NavLink } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';
import Contact from './components/Contact';
import ContactSuccess from './components/ContactSuccess';
import NotFound from './components/NotFound';

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <span className="logo-icon">✂</span>
            <span className="logo-text">ROSE & BLADE</span>
          </Link>
          <nav className="nav">
            <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Главная
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              О нас
            </NavLink>
            <NavLink to="/services" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Услуги
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Записаться
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Products />} />
          <Route path="/services/:id" element={<ProductDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/contact/success" element={<ContactSuccess />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 ROSE & BLADE. Стиль с характером.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;