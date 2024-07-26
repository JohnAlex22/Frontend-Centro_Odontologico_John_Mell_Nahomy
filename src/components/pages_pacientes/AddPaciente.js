import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import './AddPaciente.css'; // Asegúrate de tener el archivo de estilos adecuado

const AddPaciente = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const paciente = {
            nombre,
            apellido,
            fechaNacimiento, // Usa el nombre correcto del campo
            direccion,
            telefono,
            email
        };

        console.log('Datos a enviar:', paciente); // Agrega un log para verificar los datos

        try {
            await axios.post('http://localhost:26994/pacientes/registrar', paciente);
            alert('Paciente agregado con éxito');
            navigate('/pacientes/list'); // Redirige a la lista de pacientes
        } catch (error) {
            console.error('Error al agregar paciente:', error);
            alert('Error al agregar paciente');
        }
    };

    return (
        <div className="card">
            <h2>Agregar Paciente</h2>
            <form onSubmit={handleSubmit}>
                <div className="p-field">
                    <label htmlFor="nombre">Nombre</label>
                    <InputText
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="apellido">Apellido</label>
                    <InputText
                        id="apellido"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        required
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                    <InputText
                        id="fechaNacimiento"
                        type="date"
                        value={fechaNacimiento}
                        onChange={(e) => setFechaNacimiento(e.target.value)}
                        required
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="direccion">Dirección</label>
                    <InputText
                        id="direccion"
                        value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="telefono">Teléfono</label>
                    <InputText
                        id="telefono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="email">Email</label>
                    <InputText
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <Button type="submit" label="Agregar Paciente" className="p-mt-2" />
            </form>
        </div>
    );
};

export default AddPaciente;

