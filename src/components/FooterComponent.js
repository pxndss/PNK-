// src/components/FooterComponent.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

// Asegúrate de desestructurar 'user' si lo usas
const FooterComponent = ({ user }) => { // Agrega 'user' aquí
    // Línea 10 (ejemplo): Si estás usando user.isLoggedIn o user.nombre_usuario aquí,
    // también debes verificar si 'user' existe
    const isLoggedIn = user && user.isLoggedIn;

    return (
        <footer className="bg-dark text-white mt-5 p-4 text-center">
            <Container>
                <Row>
                    <Col>
                        {/* Puedes mostrar algo diferente si el usuario está logueado */}
                        {isLoggedIn ? (
                            <p>Bienvenido, {user.nombre_usuario || 'Usuario'} | © 2025 PNK Inmobiliaria. Todos los derechos reservados.</p>
                        ) : (
                            <p>© 2025 PNK Inmobiliaria. Todos los derechos reservados.</p>
                        )}
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default FooterComponent;