import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import Odonto from './Odonto'; // Importa el componente Odonto
import posicionDientes from '../assets/PosicionDientes.jpg'; // Importa la imagen

const Odontograma = () => {
  const [pacientes, setPacientes] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [odontograma, setOdontograma] = useState([]);
  const [diente, setDiente] = useState('');
  const [estado, setEstado] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [showOdonto, setShowOdonto] = useState(false); // Nuevo estado

  useEffect(() => {
    // Obtener lista de pacientes
    axios.get('http://localhost:26994/pacientes')
      .then(response => setPacientes(response.data))
      .catch(error => console.error('Error fetching pacientes:', error));
  }, []);

  useEffect(() => {
    if (selectedPaciente) {
      // Obtener odontograma para el paciente seleccionado
      axios.get(`http://localhost:59922/odontogramas?paciente_id=${selectedPaciente}`)
        .then(response => setOdontograma(response.data))
        .catch(error => console.error('Error al obtener odontograma:', error));
    }
  }, [selectedPaciente]);

  const handleAddOdontograma = () => {
    axios.post('http://localhost:59922/odontogramas/registrar', {
      pacienteId: selectedPaciente,
      diente: diente,
      estado: estado,
      img_url: null
    })
    .then(response => {
      setOdontograma([...odontograma, response.data]);
      setDiente('');
      setEstado('');
    })
    .catch(error => console.error('Error al agregar odontograma:', error));
  };

  const pacienteTemplate = (rowData) => {
    return (
      <Button
        label="Seleccionar"
        onClick={() => {
          setSelectedPaciente(rowData.id);
          setShowOdonto(true); // Mostrar componente Odonto al seleccionar un paciente
          setDialogVisible(false);
        }}
      />
    );
  };

  const footerContent = (
    <div>
      <Button label="Agregar Diente" icon="pi pi-check" onClick={handleAddOdontograma} />
      <Button label="Cancelar" icon="pi pi-times" onClick={() => setDialogVisible(false)} className="p-button-secondary" />
    </div>
  );

  return (
    <main>
      <h1>Odontograma</h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
        <img 
          src={posicionDientes} 
          alt="Posición de Dientes" 
          style={{ width: '250px', height: 'auto', borderRadius: '5px', boxShadow: '0 0 5px rgba(0,0,0,0.2)', marginBottom: '20px' }} 
        />
        <Button 
          label="Seleccionar Paciente" 
          icon="pi pi-plus" 
          onClick={() => setDialogVisible(true)}
        />
      </div>
      {selectedPaciente && (
        <div>
          <h2>Odontograma para Paciente ID: {selectedPaciente}</h2>
          <div>
            <label>Diente:</label>
            <InputText 
              type="number" 
              value={diente} 
              onChange={(e) => setDiente(e.target.value)} 
            />
            <label>Estado:</label>
            <InputText 
              value={estado} 
              onChange={(e) => setEstado(e.target.value)} 
            />
            <Button label="Agregar Diente" icon="pi pi-check" onClick={handleAddOdontograma} />
          </div>
        </div>
      )}

      <Dialog 
        header="Seleccionar Paciente" 
        visible={dialogVisible} 
        style={{ width: '50vw' }} 
        footer={footerContent} 
        onHide={() => setDialogVisible(false)}
      >
        <DataTable value={pacientes} stripedRows tableStyle={{ minWidth: '50rem' }}>
          <Column field="nombre" header="Nombre"></Column>
          <Column field="apellido" header="Apellido"></Column>
          <Column field="fechaNacimiento" header="Fecha de Nacimiento"></Column>
          <Column field="direccion" header="Dirección"></Column>
          <Column field="telefono" header="Teléfono"></Column>
          <Column field="email" header="Email"></Column>
          <Column body={pacienteTemplate} header="Seleccionar" style={{ textAlign: 'center' }}></Column>
        </DataTable>
      </Dialog>

      {showOdonto && <Odonto id={selectedPaciente} />} {/* Mostrar Odonto cuando se selecciona un paciente */}
    </main>
  );
}

export default Odontograma;
