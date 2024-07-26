import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';

const FichasTecnicas = () => {
    const [fichas, setFichas] = useState([]);
    const [visible, setVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentFicha, setCurrentFicha] = useState(null);
    const [formData, setFormData] = useState({
        pacienteId: '',
        diagnostico: '',
        tratamiento: '',
        presupuesto: '',
        pago: ''
    });

    useEffect(() => {
        axios.get('http://localhost:7122/fichas_tecnicas')
            .then(response => setFichas(response.data))
            .catch(error => console.error('Error fetching fichas tecnicas:', error));
    }, []);

    const handleEdit = (ficha) => {
        setCurrentFicha(ficha);
        setFormData(ficha);
        setIsEditing(true);
        setVisible(true);
    };

    const handleDelete = (id) => {
        axios.delete(`http://localhost:7122/fichas_tecnicas/eliminar?id=${id}`)
            .then(() => {
                setFichas(fichas.filter(ficha => ficha.id !== id));
                alert('Ficha técnica eliminada con éxito');
            })
            .catch(error => console.error('Error deleting ficha técnica:', error));
    };

    const handleSave = () => {
        if (isEditing) {
            axios.put('http://localhost:7122/fichas_tecnicas/actualizar', formData)
                .then(() => {
                    setFichas(fichas.map(ficha => ficha.id === currentFicha.id ? formData : ficha));
                    setVisible(false);
                    setIsEditing(false);
                    setCurrentFicha(null);
                })
                .catch(error => console.error('Error updating ficha técnica:', error));
        } else {
            axios.post('http://localhost:7122/fichas_tecnicas/registrar', formData)
                .then(response => {
                    setFichas([...fichas, response.data]);
                    setVisible(false);
                })
                .catch(error => console.error('Error adding ficha técnica:', error));
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
                label="Agregar Ficha Técnica" 
                icon="pi pi-plus" 
                onClick={() => { 
                    setFormData({ pacienteId: '', diagnostico: '', tratamiento: '', presupuesto: '', pago: '' }); 
                    setIsEditing(false); 
                    setVisible(true); 
                }} 
            />
            <DataTable value={fichas} stripedRows tableStyle={{ minWidth: '50rem' }}>
                <Column field="pacienteId" header="ID Paciente"></Column>
                <Column field="diagnostico" header="Diagnóstico"></Column>
                <Column field="tratamiento" header="Tratamiento"></Column>
                <Column field="presupuesto" header="Presupuesto"></Column>
                <Column field="pago" header="Pago"></Column>
                <Column body={actionBodyTemplate} header="Acciones" style={{ textAlign: 'center' }}></Column>
            </DataTable>
            <Dialog header={isEditing ? 'Editar Ficha Técnica' : 'Agregar Ficha Técnica'} visible={visible} style={{ width: '50vw' }} footer={footerContent} onHide={() => setVisible(false)}>
                <div className="p-fluid">
                    <div className="p-field">
                        <label htmlFor="pacienteId">ID Paciente</label>
                        <InputText id="pacienteId" name="pacienteId" value={formData.pacienteId} onChange={handleInputChange} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="diagnostico">Diagnóstico</label>
                        <InputText id="diagnostico" name="diagnostico" value={formData.diagnostico} onChange={handleInputChange} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="tratamiento">Tratamiento</label>
                        <InputText id="tratamiento" name="tratamiento" value={formData.tratamiento} onChange={handleInputChange} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="presupuesto">Presupuesto</label>
                        <InputText id="presupuesto" name="presupuesto" value={formData.presupuesto} onChange={handleInputChange} />
                    </div>
                    <div className="p-field">
                        <label htmlFor="pago">Pago</label>
                        <InputText id="pago" name="pago" value={formData.pago} onChange={handleInputChange} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
}

export default FichasTecnicas;
