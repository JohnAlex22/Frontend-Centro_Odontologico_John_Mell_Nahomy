import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Pacientes from './components/Pacientes';
import Fichas from './components/FichasTecnicas';
import Odontograma from './components/Odontograma';
import Citas from './components/Citas';
import Historial from './components/Historial';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function App() {
  const isAuthenticated = localStorage.getItem('token'); // Verifica si hay un token en el almacenamiento local
  const location = useLocation();

  return (
    <>
      {isAuthenticated && location.pathname !== '/login' && location.pathname !== '/register' && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {isAuthenticated ? (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/pacientes/*" element={<Pacientes />} />
            <Route path="/fichas" element={<Fichas />} />
            <Route path="/odontograma" element={<Odontograma />} />
            <Route path="/citas" element={<Citas />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}




