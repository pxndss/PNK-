// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap CSS primero
import './index.css'; // Luego tus estilos CSS globales personalizados
import App from './App';

// Usa createRoot para React 18
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Envuelve tu App con BrowserRouter aquí */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);