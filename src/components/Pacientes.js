import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Route, Routes, useNavigate } from 'react-router-dom';
import PacientesList from './pages_pacientes/PacientesList'; 
import AddPaciente from './pages_pacientes/AddPaciente'; 
import { Card } from 'primereact/card'; // Importa el componente Card de PrimeReact
import './CSS/Pacientes.css'; // Agrega tu CSS para estilos personalizados

const Pacientes = () => {
    const navigate = useNavigate();

    const handleViewPatients = () => navigate('list');
    const handleAddPatient = () => navigate('add');

    return (
        <div>
            <Menubar model={[
                {
                    label: 'Pacientes',
                    icon: 'pi pi-users',
                    items: [
                        {
                            label: 'Ver Pacientes',
                            icon: 'pi pi-list',
                            command: handleViewPatients 
                        },
                        {
                            label: 'Agregar Paciente',
                            icon: 'pi pi-plus',
                            command: handleAddPatient 
                        }
                    ]
                }
            ]} />

            <div className="card-container">
                <div className="p-card-custom" onClick={handleViewPatients}>
                    <Card title="Ver Pacientes">
                        <p>Accede a la lista de pacientes registrados.</p>
                    </Card>
                </div>
                <div className="p-card-custom" onClick={handleAddPatient}>
                    <Card title="Agregar Paciente">
                        <p>Rellena el formulario para agregar un nuevo paciente.</p>
                    </Card>
                </div>
            </div>

            <Routes>
                <Route path="list" element={<PacientesList />} />
                <Route path="add" element={<AddPaciente />} />
            </Routes>
        </div>
    );
}

export default Pacientes;
