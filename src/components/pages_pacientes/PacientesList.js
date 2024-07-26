import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';

const PacientesList = () => {
    const [pacientes, setPacientes] = useState([]);
    const [visible, setVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPaciente, setCurrentPaciente] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        fechaNacimiento: '',
        direccion: '',
        telefono: '',
        email: ''
    });

    useEffect(() => {
        axios.get('http://localhost:26994/pacientes')
            .then(response => setPacientes(response.data))
            .catch(error => console.error('Error fetching pacientes:', error));
    }, []);

    const handleEdit = (paciente) => {
        setCurrentPaciente(paciente);
        setFormData(paciente);
        setIsEditing(true);
        setVisible(true);
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:26994/pacientes/eliminar?id=${id}`)
            .then(() => {
                setPacientes(pacientes.filter(paciente => paciente.id !== id));
                alert('Paciente eliminado con éxito');
            })
            .catch(error => console.error('Error deleting paciente:', error));
    };

    const handleSave = () => {
        if (isEditing) {
            axios.put('http://localhost:26994/pacientes/actualizar', formData)
                .then(() => {
                    setPacientes(pacientes.map(paciente => paciente.id === currentPaciente.id ? formData : paciente));
                    setVisible(false);
                    setIsEditing(false);
                    setCurrentPaciente(null);
                })
                .catch(error => console.error('Error updating paciente:', error));
        } else {
            axios.post('http://localhost:26994/pacientes/registrar', formData)
                .then(response => {
                    setPacientes([...pacientes, response.data]);
                    setVisible(false);
                })
                .catch(error => console.error('Error adding paciente:', error));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div>
                <Button
                    icon="pi pi-pencil"
                    className="p-button p-button-info p-mr-2"
                    onClick={() => handleEdit(rowData)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button p-button-danger"
                    onClick={() => handleDelete(rowData.id)}
                />
            </div>
        );
    };

    const footerContent = (
        <div>
            <Button label="Guardar" icon="pi pi-check" onClick={handleSave} />
            <Button label="Cancelar" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-secondary" />
        </div>
    );

    return (
        <div className="card">
            <Button 
                label="Agregar Paciente" 
                icon="pi pi-plus" 
                onClick={() => { 
                    setFormData({ nombre: '', apellido: '', fecha_nacimiento: '', direccion: '', telefono: '', email: '' }); 
                    setIsEditing(false); 
                    setVisible(true); 
                }} 
            />
            <DataTable value={pacientes} stripedRows tableStyle={{ minWidth: '50rem' }}>
                <Column field="nombre" header="Nombre"></Column>
                <Column field="apellido" header="Apellido"></Column>
                <Column field="fechaNacimiento" header="Fecha de Nacimiento"></Column>
                <Column field="direccion" header="Dirección"></Column>
                <Column field="telefono" header="Teléfono"></Column>
                <Column field="email" header="Email"></Column>
                <Column body={actionBodyTemplate} header="Acciones" style={{ textAlign: 'center' }}></Column>
            </DataTable>
            <Dialog header={isEditing ? 'Editar Paciente' : 'Agregar Paciente'} visible={visible} style={{ width: '50vw' }} footer={footerContent} onHide={() => setVisible(false)}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="nombre">Nombre</label>
                        <InputText id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="apellido">Apellido</label>
                        <InputText id="apellido" name="apellido" value={formData.apellido} onChange={handleInputChange} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                        <InputText id="fechaNacimiento" name="fechaNacimiento" type="date" value={formData.fechaNacimiento} onChange={handleInputChange} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="direccion">Dirección</label>
                        <InputText id="direccion" name="direccion" value={formData.direccion} onChange={handleInputChange} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="telefono">Teléfono</label>
                        <InputText id="telefono" name="telefono" value={formData.telefono} onChange={handleInputChange} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="email">Email</label>
                        <InputText id="email" name="email" value={formData.email} onChange={handleInputChange} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

export default PacientesList;
