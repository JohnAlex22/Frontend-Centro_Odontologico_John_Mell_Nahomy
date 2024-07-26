import React from 'react';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { GiAbstract005 } from "react-icons/gi";
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';  // Importa los estilos CSS
import logo from '../assets/Logo.png';

export default function Header() {
    const navigate = useNavigate();

    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        // Aquí debes implementar la lógica para cerrar sesión (e.g., eliminar token, etc.)
        // Luego redirige al login
        navigate('/login');
    };

    const items = [
        {
            label: 'Inicio',
            icon: 'pi pi-home',
            template: (item, options) => (
                <Link to="/" className={options.className}>
                    <GiAbstract005 style={{ marginRight: '10px' }} />
                    {item.label}
                </Link>
            )
        },
        {
            label: 'Pacientes',
            icon: 'pi pi-users',
            template: (item, options) => (
                <Link to="/pacientes" className={options.className}>
                    <GiAbstract005 style={{ marginRight: '10px' }} />
                    {item.label}
                </Link>
            )
        },
        {
            label: 'Fichas Técnicas',
            icon: 'pi pi-file',
            template: (item, options) => (
                <Link to="/fichas" className={options.className}>
                    <GiAbstract005 style={{ marginRight: '5px' }} />
                    {item.label}
                </Link>
            )
        },
        {
            label: 'Odontograma',
            icon: 'pi pi-pencil',
            template: (item, options) => (
                <Link to="/odontograma" className={options.className}>
                    <GiAbstract005 style={{ marginRight: '5px' }} />
                    {item.label}
                </Link>
            )
        },
        {
            label: 'Citas',
            icon: 'pi pi-calendar',
            template: (item, options) => (
                <Link to="/citas" className={options.className}>
                    <GiAbstract005 style={{ marginRight: '5px' }} />
                    {item.label}
                </Link>
            )
        },
        {
            label: 'Historial',
            icon: 'pi pi-book',
            template: (item, options) => (
                <Link to="/historial" className={options.className}>
                    <GiAbstract005 style={{ marginRight: '5px' }} />
                    {item.label}
                </Link>
            )
        }
    ];

    const start = <img alt="logo" src={logo} height="80" className="mr-2"></img>;
    const end = (
        <div className="search-container">
            <InputText placeholder="Buscar" type="text" className="w-8rem sm:w-auto" />
            <Button 
                label="Cerrar Sesión" 
                icon="pi pi-sign-out" 
                className="p-button-danger p-button-rounded" 
                onClick={handleLogout} 
                style={{ marginLeft: '1rem' }} 
            />
        </div>
    );

    return (
        <div className="card">
            <Menubar model={items} start={start} end={end} className="menubar-custom" />
        </div>
    );
}
