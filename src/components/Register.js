import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CSS/Auth.css';
import fondoImage2 from '../assets/Fondo4.png';
import logo from '../assets/Logo.png';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8008/usuarios/registrar', { nombre, email, contrasena: password, rol: 'usuario' });
      if (response.data) {
        navigate('/login');
      } else {
        alert('Registro fallido');
      }
    } catch (error) {
      alert('Ocurrió un error');
    }
  };

  return (
    <div className="login-main">
      <div className="login-left">
        <img src={fondoImage2} alt="Ilustración de Inicio de Sesión" />
      </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
          <img src={logo} alt="Ilustración de Inicio de Sesión" />
          </div>
          <div className="login-center">
            <h2>Registro</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Registrarse</button>
            </form>
            <p className="login-bottom-p">
              ¿Ya tienes una cuenta? <a href="/login">Iniciar sesión</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


