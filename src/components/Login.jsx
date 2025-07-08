// src/components/Login.jsx
import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';

// ¡IMPORTA TU ARCHIVO DE ESTILOS PERSONALIZADO AQUÍ!
import './LoginStyles.css'; // Ruta relativa al mismo directorio

// Asegúrate de que los iconos de Font Awesome estén disponibles globalmente
// (ej. importados en tu index.html o App.js)

const Login = ({ onLoginSuccess }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos Vacíos',
                text: 'Por favor, ingresa tu correo electrónico y contraseña.',
                confirmButtonColor: '#ff8c00'
            });
            return;
        }

        try {
            // *** ¡IMPORTANTE! AJUSTA ESTA URL CON LA IP REAL DE TU EC2 ***
            const response = await fetch('http://18.218.217.229/api/login.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.username, password: formData.password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Bienvenido!',
                    text: data.message,
                    timer: 2000,
                    showConfirmButton: false,
                    confirmButtonColor: '#ff8c00'
                }).then(() => {
                    if (onLoginSuccess) {
                        onLoginSuccess(data.user);
                    }
                    navigate('/dashboard');
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Acceso Denegado',
                    text: data.message || 'Usuario o contraseña incorrectos.',
                    confirmButtonColor: '#dc3545'
                });
            }
        } catch (error) {
            console.error("Error en el login:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: 'Hubo un problema al conectar con el servidor. Inténtalo de nuevo más tarde.',
                confirmButtonColor: '#dc3545'
            });
        }
    };

    return (
        <Container fluid className="login-full-height">
            <Row className="justify-content-center align-items-center h-100">
                <Col md={6} lg={4}>
                    <Card className="login-card custom-shadow">
                        <Card.Body>
                            <div className="login-icon">
                                {/* Asegúrate de que logo.png exista en tu carpeta 'public/img' de React */}
                                <img src="/img/logo.png" alt="Logo PNK" style={{ maxWidth: '100px', marginBottom: '20px' }} /> {/* <--- ¡RUTA CORREGIDA AQUÍ! */}
                                {/* O un icono de Font Awesome si lo prefieres: */}
                                {/* <i className="fas fa-user-circle" style={{ fontSize: '80px', color: '#e67e22', marginBottom: '20px' }}></i> */}
                            </div>

                            <h2 className="text-center mb-4 login-titulo">
                                Iniciar Sesión
                            </h2>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formBasicUsername">
                                    <Form.Label>Usuario / Correo Electrónico</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Ingresa tu correo"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formBasicPassword">
                                    <Form.Label>Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Contraseña"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100 mt-3">
                                    Ingresar
                                </Button>
                            </Form>
                            <div className="text-center mt-3">
                                <Link to="/recuperar" className="text-decoration-none">¿Olvidaste tu contraseña?</Link>
                            </div>
                            <div className="text-center mt-3 login-enlace">
                                ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

// Si no se encuentra el logo, muestra un icono alternativo de Font Awesome
export default Login;