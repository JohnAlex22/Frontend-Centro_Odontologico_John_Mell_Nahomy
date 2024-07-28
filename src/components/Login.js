import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fondoImage3 from '../assets/Fondo4.png'; // Ajusta la ruta si es necesario
import logo from '../assets/Logo.png';
import axios from 'axios';
import './CSS/Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8008/usuarios/login', { email, contrasena: password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token); // Guarda el token en el almacenamiento local
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario)); // Guarda la información del usuario
        navigate('/home');
      } else {
        alert('Inicio de sesión fallido');
      }
    } catch (error) {
      alert('Ocurrió un error');
    }
  };

  return (
    <div className="login-main">
      <div className="login-left">
    <img 
      src={fondoImage3} 
      alt="Ilustración de Inicio de Sesión" 
      style={{ width: '400px', height: '400px' }} 
    />
  </div>
      <div className="login-right">
        <div className="login-right-container">
          <div className="login-logo">
          <img src={logo} alt="Ilustración de Inicio de Sesión" />
          </div>
          <div className="login-center">
            <h2>Iniciar sesión</h2>
            <form onSubmit={handleSubmit}>
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
              <button type="submit">Iniciar sesión</button>
            </form>
            <p className="login-bottom-p">
              ¿No tienes una cuenta? <a href="/register">Regístrate</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
