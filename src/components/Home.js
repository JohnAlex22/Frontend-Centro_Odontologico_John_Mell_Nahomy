import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario')); // Recuperar la información del usuario

  return (
    <main>
      <h1>Bienvenido(a) {usuario ? usuario.nombre : 'Usuario'} a Dental Health</h1>
      <div className="grid">
        <div className="card"><Link to="/pacientes">Pacientes</Link></div>
        <div className="card"><Link to="/fichas">Fichas tecnicas</Link></div>
        <div className="card"><Link to="/citas">Citas</Link></div>
        <div className="card"><Link to="/odontograma">Odontograma</Link></div>
        <div className="card"><Link to="/historial">Historial</Link></div>
      </div>
    </main>
  );
}

export default Home;


