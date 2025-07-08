// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// Importa tus componentes
import NavbarComponent from './components/NavbarComponent';
import FooterComponent from './components/FooterComponent';
import Login from './components/Login.jsx';

// Asegúrate de que esta línea sea EXACTAMENTE así (PropertiesList PLURAL)
import PropertiesList from './components/Properties/PropertiesList';

// *** NUEVAS IMPORTACIONES DE COMPONENTES PARA LAS RUTAS FALTANTES ***
// Asegúrate de que los nombres de archivo y componentes sean correctos para tu proyecto
// Si tu archivo de registro es 'Register.jsx' y exporta 'Register', úsalo aquí.
import Recovery from './components/Recovery.js'; // Ya tienes este en tus archivos
// Asumo que tienes un componente para registrar, por ejemplo:
// import RegisterComponent from './components/RegisterComponent'; 
// Asumo que tienes un componente para publicar, por ejemplo:
// import PublishComponent from './components/PublishComponent';

function App() {
    const [user, setUser] = useState(null);

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <>
            <NavbarComponent user={user} onLogout={handleLogout} />
            <main>
                <Routes>
                    <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
                    <Route path="/" element={<PropertiesList />} />
                    <Route path="/propiedades" element={<PropertiesList />} />

                    {/* *** RUTAS AÑADIDAS PARA /registrarse, /publicar y /recuperar-contrasena *** */}
                    {/* Reemplaza 'YourRegisterComponent' con el nombre de tu componente de registro real */}
                    {/* Y asegúrate de que el archivo exista e esté importado arriba */}
                    <Route path="/registrarse" element={<div>Página de Registro (Placeholder)</div>} />
                    {/* <Route path="/registrarse" element={<RegisterComponent />} /> */}

                    {/* Reemplaza 'YourPublishComponent' con el nombre de tu componente de publicación real */}
                    {/* Y asegúrate de que el archivo exista e esté importado arriba */}
                    <Route path="/publicar" element={<div>Página de Publicar (Placeholder)</div>} />
                    {/* <Route path="/publicar" element={<PublishComponent />} /> */}

                    <Route path="/recuperar-contrasena" element={<Recovery />} /> {/* Esta ya la tenías en la barra */}

                    {/* Agrega la ruta de admin si tienes un componente para ella y la quieres activar */}
                    {/* <Route path="/admin" element={<AdminDashboard />} /> */}
                </Routes>
            </main>
            <FooterComponent user={user} />
        </>
    );
}

export default App;