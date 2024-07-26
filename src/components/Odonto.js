import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Stage, Layer, Image, Line } from 'react-konva';
import useImage from 'use-image';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import defaultOdontograma from '../assets/odontograma.png'; // Import the default image

const Odonto = ({ id }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [lines, setLines] = useState([]);
  const [color, setColor] = useState('#000000'); // Color predeterminado
  const isDrawing = useRef(false);
  const stageRef = useRef();
  const [image] = useImage(imageUrl);

  useEffect(() => {
    axios.get(`http://localhost:59922/odontogramas/${id}/imagen`, { responseType: 'blob' })
      .then(response => {
        const url = URL.createObjectURL(response.data);
        setImageUrl(url);
      })
      .catch(error => {
        console.error('Error fetching the image', error);
      });
  }, [id]);

  const handleMouseDown = () => {
    isDrawing.current = true;
    setLines([...lines, { color: color, points: [] }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const undoLastLine = () => {
    setLines(lines.slice(0, -1));
  };

  const saveDrawing = async () => {
    const stage = stageRef.current;
    const dataUrl = stage.toDataURL();
    const file = await dataURLToFile(dataUrl, 'drawing.png');
  
    const formData = new FormData();
    formData.append('image', file);
  
    try {
      await axios.put(`http://localhost:59922/odontogramas/${id}/actualizarImg`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Image saved successfully');
    } catch (error) {
      console.error('Error saving the image', error);
    }
  };
  
  // Helper function to convert data URL to file
  const dataURLToFile = (dataURL, filename) => {
    const [header, data] = dataURL.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const byteString = atob(data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uintArray = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < byteString.length; i++) {
      uintArray[i] = byteString.charCodeAt(i);
    }
  
    return new File([arrayBuffer], filename, { type: mime });
  };

  const uploadDefaultImage = async () => {
    try {
      const response = await fetch(defaultOdontograma);
      const blob = await response.blob();
      const file = new File([blob], 'odontograma.png', { type: blob.type });
      
      const formData = new FormData();
      formData.append('image', file);
  
      await axios.post(`http://localhost:59922/odontogramas/${id}/subirImg`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Default image uploaded successfully');
    } catch (error) {
      console.error('Error uploading the default image', error);
    }
  };

  return (
    <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ flex: 2, paddingRight: '20px' }}>
        <h2>Odontograma</h2>
        <div className="p-field">
          <label htmlFor="colorPicker">Selecciona el color del lápiz:</label>
          <div style={{ display: 'flex', marginBottom: '10px' }}>
            <Button
              style={{ backgroundColor: 'red', border: 'none', margin: '0 5px' }}
              onClick={() => setColor('red')}
              aria-label="Red"
            />
            <Button
              style={{ backgroundColor: 'yellow', border: 'none', margin: '0 5px' }}
              onClick={() => setColor('yellow')}
              aria-label="Yellow"
            />
            <Button
              style={{ backgroundColor: 'blue', border: 'none', color: 'white', margin: '0 5px' }}
              onClick={() => setColor('blue')}
              aria-label="Blue"
            />
            <Button
              style={{ backgroundColor: 'green', border: 'none', margin: '0 5px' }}
              onClick={() => setColor('green')}
              aria-label="Green"
            />
            <Button
              style={{ backgroundColor: 'orange', border: 'none', margin: '0 5px' }}
              onClick={() => setColor('orange')}
              aria-label="Orange"
            />
            <Button
              style={{ backgroundColor: 'black', border: 'none', color: 'white', margin: '0 5px' }}
              onClick={() => setColor('black')}
              aria-label="Black"
            />
            <Button
              style={{ backgroundColor: 'skyblue', border: 'none', margin: '0 5px' }}
              onClick={() => setColor('skyblue')}
              aria-label="Sky Blue"
            />
            <Button
              style={{ backgroundColor: 'purple', border: 'none', color: 'white', margin: '0 5px' }}
              onClick={() => setColor('purple')}
              aria-label="Purple"
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Stage
            width={1000}
            height={600}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            ref={stageRef}
            style={{ border: '1px solid #ccc' }}
          >
            <Layer>
              {image && <Image image={image} width={1000} height={600} />}
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.color}
                  strokeWidth={5}
                  tension={0.5}
                  lineCap="round"
                  globalCompositeOperation="source-over"
                />
              ))}
            </Layer>
          </Stage>
        </div>
        <div className="p-field" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <Button
            label="Borrar"
            icon="pi pi-undo"
            className="p-button-secondary"
            onClick={undoLastLine}
          />
          <Button
            label="Guardar"
            icon="pi pi-save"
            className="p-button-success"
            onClick={saveDrawing}
          />
          <Button
            label="Subir"
            icon="pi pi-upload"
            className="p-button-warning"
            onClick={uploadDefaultImage}
          />
        </div>
      </div>
      <div style={{ flex: 1, paddingLeft: '20px', borderLeft: '1px solid #ccc', paddingTop: '20px' }}>
        <h3>Leyenda de colores</h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: 'red', marginRight: '10px' }}></div>
            <span>Extracción</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: 'yellow', marginRight: '10px' }}></div>
            <span>Cariado</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: 'green', marginRight: '10px' }}></div>
            <span>Limpieza</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: 'blue', marginRight: '10px' }}></div>
            <span>Blanqueado</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: 'orange', marginRight: '10px' }}></div>
            <span>Endodoncia</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: 'black', marginRight: '10px' }}></div>
            <span>Ortodoncia</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: 'skyblue', marginRight: '10px' }}></div>
            <span>Corona</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div style={{ width: '20px', height: '20px', backgroundColor: 'purple', marginRight: '10px' }}></div>
            <span>Empaste</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Odonto;
