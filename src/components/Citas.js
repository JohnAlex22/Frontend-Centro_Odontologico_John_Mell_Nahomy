import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import axios from 'axios';

const Citas = () => {
    const [citas, setCitas] = useState([]);
    const [visible, setVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCita, setCurrentCita] = useState(null);
    const [formData, setFormData] = useState({
        pacienteId: '',
        fecha: null,
        hora: '',
        motivo: ''
    });

    useEffect(() => {
        axios.get('http://localhost:8082/citas')
            .then(response => setCitas(response.data))
            .catch(error => console.error('Error fetching citas:', error));
    }, []);

    const handleEdit = (cita) => {
        setCurrentCita(cita);
        setFormData({ ...cita, fecha: new Date(cita.fecha) });
        setIsEditing(true);
        setVisible(true);
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8082/citas/eliminar?id=${id}`)
            .then(() => {
                setCitas(citas.filter(cita => cita.id !== id));
                alert('Cita eliminada con éxito');
            })
            .catch(error => console.error('Error deleting cita:', error));
    };

    const handleSave = () => {
        const requestData = { ...formData, fecha: formData.fecha.toISOString().split('T')[0] };
        if (isEditing) {
            axios.put('http://localhost:8082/citas/actualizar', requestData)
                .then(() => {
                    setCitas(citas.map(cita => cita.id === currentCita.id ? formData : cita));
                    setVisible(false);
                    setIsEditing(false);
                    setCurrentCita(null);
                })
                .catch(error => console.error('Error updating cita:', error));
        } else {
            axios.post('http://localhost:8082/citas/registrar', requestData)
                .then(response => {
                    setCitas([...citas, response.data]);
                    setVisible(false);
                })
                .catch(error => console.error('Error adding cita:', error));
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
                label="Agregar Cita" 
                icon="pi pi-plus" 
                onClick={() => { 
                    setFormData({ pacienteId: '', fecha: null, hora: '', motivo: '' }); 
                    setIsEditing(false); 
                    setVisible(true); 
                }} 
            />
            <DataTable value={citas} stripedRows tableStyle={{ minWidth: '50rem' }}>
                <Column field="pacienteId" header="ID Paciente"></Column>
                <Column field="fecha" header="Fecha"></Column>
                <Column field="hora" header="Hora"></Column>
                <Column field="motivo" header="Motivo"></Column>
                <Column body={actionBodyTemplate} header="Acciones" style={{ textAlign: 'center' }}></Column>
            </DataTable>
            <Dialog header={isEditing ? 'Editar Cita' : 'Agregar Cita'} visible={visible} style={{ width: '50vw' }} footer={footerContent} onHide={() => setVisible(false)}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="pacienteId">ID Paciente</label>
                        <InputText id="pacienteId" name="pacienteId" value={formData.pacienteId} onChange={handleInputChange} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="fecha">Fecha</label>
                        <Calendar id="fecha" name="fecha" value={formData.fecha} onChange={handleInputChange} dateFormat="yy-mm-dd" />
                    </div>
                    <div className="p-field">
                        <label htmlFor="hora">Hora</label>
                        <InputText id="hora" name="hora" value={formData.hora} onChange={handleInputChange} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="motivo">Motivo</label>
                        <InputTextarea id="motivo" name="motivo" value={formData.motivo} onChange={handleInputChange} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

export default Citas;
