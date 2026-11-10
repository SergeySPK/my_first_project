import React from 'react';
import './App.css';
import BasicHooks from './components/BasicHooks';
import AdvancedHooks from './components/AdvancedHooks';
import CustomHooks from './components/CustomHooks';
import HooksTests from './components/HooksTests';

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1>Практическая работа №16: React Hooks</h1>
        <p>Изучите и реализуйте различные React хуки</p>
      </header>

      <main>
        <BasicHooks />
        <AdvancedHooks />
        <CustomHooks />
        <HooksTests />
      </main>

      <footer style={{ marginTop: '30px', textAlign: 'center', color: '#64748b' }}>
        <p>Проверьте консоль браузера для отладки и запустите тесты</p>
      </footer>
    </div>
  );
}

export default App;