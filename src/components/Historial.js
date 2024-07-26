import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';

const Historial = () => {
  const [citas, setCitas] = useState([]);
  const [fichas, setFichas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [odontogramas, setOdontogramas] = useState({});
  const [expandedPacienteId, setExpandedPacienteId] = useState(null);
  const [editingDiente, setEditingDiente] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const citasResponse = await axios.get('http://localhost:8082/citas');
        const fichasResponse = await axios.get('http://localhost:7122/fichas_tecnicas');
        const pacientesResponse = await axios.get('http://localhost:26994/pacientes');
        const odontogramasResponse = await axios.get('http://localhost:59922/odontogramas');
        
        setCitas(citasResponse.data);
        setFichas(fichasResponse.data);
        setPacientes(pacientesResponse.data);
        setOdontogramas(odontogramasResponse.data.reduce((acc, item) => {
          if (!acc[item.pacienteId]) acc[item.pacienteId] = [];
          acc[item.pacienteId].push(item);
          return acc;
        }, {}));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const combineData = () => {
      const combinedData = citas.map(cita => {
        const paciente = pacientes.find(p => p.id === cita.pacienteId);
        const ficha = fichas.find(f => f.pacienteId === cita.pacienteId);
        return {
          ...cita,
          pacienteNombre: paciente ? `${paciente.nombre} ${paciente.apellido}` : '',
          diagnostico: ficha ? ficha.diagnostico : '',
          tratamiento: ficha ? ficha.tratamiento : '',
          presupuesto: ficha ? ficha.presupuesto : '',
          pago: ficha ? ficha.pago : ''
        };
      });
      setHistorial(combinedData);
    };

    combineData();
  }, [citas, fichas, pacientes]);

  const handleExpand = (pacienteId) => {
    setExpandedPacienteId(expandedPacienteId === pacienteId ? null : pacienteId);
  };

  const handleEdit = (diente) => {
    setEditingDiente(diente);
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:59922/odontogramas/actualizar`, editingDiente);
      console.log('Diente updated successfully');
      const response = await axios.get('http://localhost:59922/odontogramas');
      setOdontogramas(response.data.reduce((acc, item) => {
        if (!acc[item.pacienteId]) acc[item.pacienteId] = [];
        acc[item.pacienteId].push(item);
        return acc;
      }, {}));
      setShowEditDialog(false);
    } catch (error) {
      console.error('Error updating the diente:', error);
    }
  };

  const renderAccordionContent = (pacienteId) => {
    const odontograma = odontogramas[pacienteId] || [];
    return (
      <Accordion activeIndex={0}>
        {odontograma.map((item) => (
          <AccordionTab key={item.id} header={`Diente ${item.diente}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="m-0">
                Estado: {item.estado}
              </p>
              <Button
                label="Editar"
                icon="pi pi-pencil"
                className="p-button-info p-button-sm"
                onClick={() => handleEdit(item)}
                style={{ marginRight: '5px' }}
              />
            </div>
          </AccordionTab>
        ))}
      </Accordion>
    );
  };

  const actionBodyTemplate = (rowData) => (
    <Button
      label="Ver Detalles"
      icon="pi pi-chevron-down"
      onClick={() => handleExpand(rowData.pacienteId)}
    />
  );

  return (
    <main>
      <h1>Historial</h1>
      <p>Bienvenido a la página de historial.</p>
      <DataTable value={historial} stripedRows tableStyle={{ minWidth: '75rem' }}>
        <Column field="pacienteNombre" header="Paciente"></Column>
        <Column field="fecha" header="Fecha"></Column>
        <Column field="hora" header="Hora"></Column>
        <Column field="motivo" header="Motivo"></Column>
        <Column field="diagnostico" header="Diagnóstico"></Column>
        <Column field="tratamiento" header="Tratamiento"></Column>
        <Column field="presupuesto" header="Presupuesto"></Column>
        <Column field="pago" header="Pago"></Column>
        <Column body={actionBodyTemplate} header="Acciones"></Column>
      </DataTable>
      {expandedPacienteId && (
        <div style={{ marginTop: '20px' }}>
          {renderAccordionContent(expandedPacienteId)}
        </div>
      )}
      {showEditDialog && editingDiente && (
        <Dialog header="Editar Estado del Diente" visible={showEditDialog} onHide={() => setShowEditDialog(false)}>
          <div className="p-fluid">
            <div className="p-field">
              <label htmlFor="estado">Estado</label>
              <InputText
                id="estado"
                value={editingDiente.estado}
                onChange={(e) => setEditingDiente({ ...editingDiente, estado: e.target.value })}
              />
            </div>
            <Button label="Guardar" onClick={handleSaveEdit} />
          </div>
        </Dialog>
      )}
    </main>
  );
}

export default Historial;

