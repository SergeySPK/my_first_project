import React from 'react';
import './App.css';
import UserRegistrationForm from './components/UserRegistrationForm';
import UserRegistrationFormWithValidation from './components/UserRegistrationFormWithValidation';
import ContactFormUncontrolled from './components/ContactFormUncontrolled';
import FormTests from './components/FormTests';

function App() {
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#0f766e' }}>Практическая работа №17: React формы</h1>
        <p>Управляемые и неуправляемые компоненты, валидация</p>
      </header>

      <main>
        <UserRegistrationForm />
        <UserRegistrationFormWithValidation />
        <ContactFormUncontrolled />
        <FormTests />
      </main>

      <footer style={{ marginTop: '30px', textAlign: 'center', color: '#64748b' }}>
        <p>© 2026 ПР17 - React формы</p>
      </footer>
    </div>
  );
}

export default App;