// src/components/NavbarComponent.js
import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

// Importa los estilos de la Navbar si tienes un archivo CSS específico para ella
// import './NavbarStyles.css'; // <--- Si tienes un CSS para la Navbar, impórtalo aquí

// Asegúrate de que las props se desestructuren correctamente
const NavbarComponent = ({ user, onLogout }) => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogoutClick = () => {
        onLogout(); // Llama a la función de logout pasada como prop
        navigate('/'); // Redirige al inicio después de cerrar sesión
    };

    // Esto maneja el caso donde 'user' es null o undefined al inicio,
    // o si 'isLoggedIn' no está presente.
    const isLoggedIn = user && user.isLoggedIn;
    const userName = user && user.nombre_usuario ? user.nombre_usuario : 'Usuario';
    const isAdmin = user && user.rol === 'admin';

    return (
        // Usamos bg="dark" y variant="dark" de Bootstrap para un esquema de color oscuro,
        // esto ya debería dar una apariencia decente si Bootstrap está cargado.
        <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img
                        // RUTA CORREGIDA: Si 'logo.png' está en public/img, esta es la ruta correcta.
                        // Según la imagen image_37c065.png, tienes 'logo.png' dentro de 'public/img'.
                        // Si quieres usar 'pnk-logo.png', asegúrate de que exista en public/img/ o en public/.
                        src="/img/logo.png" //
                        height="30"
                        className="d-inline-block align-top"
                        alt="PNK Inmobiliaria Logo" // Texto alternativo para accesibilidad
                    />
                    PNK Inmobiliaria
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto"> {/* 'me-auto' empuja los elementos de la derecha al final */}
                        <Nav.Link as={Link} to="/">Inicio</Nav.Link>
                        <Nav.Link as={Link} to="/propiedades">Propiedades</Nav.Link>
                        {/* 'Publicar' y 'Registrarse' pueden ser visibles para todos o solo para logueados/no logueados */}
                        <Nav.Link as={Link} to="/publicar">Publicar</Nav.Link>
                        {/* 'Registrarse' normalmente es para no logueados, podrías ponerlo dentro del 'else' del isLoggedIn */}
                        {!isLoggedIn && <Nav.Link as={Link} to="/registrarse">Registrarse</Nav.Link>}
                    </Nav>
                    <Nav>
                        {isLoggedIn ? (
                            <>
                                {/* Muestra el nombre de usuario si está logueado */}
                                <Nav.Link disabled className="text-white me-2">
                                    ¡Hola, {userName}!
                                </Nav.Link>
                                {/* Botón para cerrar sesión */}
                                <Button variant="outline-light" onClick={handleLogoutClick}>
                                    Cerrar Sesión
                                </Button>
                                {/* Link para Admin si el usuario tiene rol 'admin' */}
                                {isAdmin && (
                                    <Nav.Link as={Link} to="/admin" className="ms-2">Admin</Nav.Link>
                                )}
                            </>
                        ) : (
                            <>
                                {/* Botón para iniciar sesión */}
                                <Button variant="primary" onClick={handleLoginClick} className="me-2">
                                    Iniciar Sesión
                                </Button>
                                {/* Link para recuperar contraseña */}
                                <Nav.Link as={Link} to="/recuperar-contrasena">Recuperar Contraseña</Nav.Link>
                                {/* Si 'Admin' es para que no logueados accedan al panel de admin (menos común, pero si es tu caso) */}
                                {/* <Nav.Link as={Link} to="/admin" className="ms-2">Admin</Nav.Link> */}
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;