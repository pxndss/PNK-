import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom'; // <-- ¡CORREGIDO! Eliminado el '=>'

const Recovery = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Vacío',
                text: 'Por favor, ingresa tu correo electrónico.',
                confirmButtonColor: '#007bff'
            });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Swal.fire({
                icon: 'error',
                title: 'Formato Inválido',
                text: 'Por favor, ingresa un correo electrónico válido.',
                confirmButtonColor: '#dc3545'
            });
            return;
        }

        try {
            // *** ¡IMPORTANTE! AJUSTA ESTA URL CON LA IP REAL DE TU EC2 O LOCALHOST ***
            const response = await fetch('http://TU_IP_EC2_O_LOCALHOST/api/recuperar_contrasena.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Correo Enviado',
                    text: data.message,
                    timer: 3000,
                    showConfirmButton: false
                }).then(() => {
                    navigate('/login'); // Redirige al login después de enviar
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message || 'No se pudo procesar la solicitud de recuperación.',
                    confirmButtonColor: '#dc3545'
                });
            }
        } catch (error) {
            console.error("Error en la recuperación:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error de Conexión',
                text: 'Hubo un problema al conectar con el servidor. Inténtalo de nuevo.',
                confirmButtonColor: '#dc3545'
            });
        }
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <Card className="shadow p-4">
                        <Card.Body>
                            <h2 className="text-center mb-4">Recuperar Contraseña</h2>
                            <p className="text-center text-muted">Ingresa tu correo electrónico para recibir instrucciones de recuperación.</p>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="formBasicEmail">
                                    <Form.Label>Correo Electrónico</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Ingresa tu correo"
                                        name="email"
                                        value={email}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100 mt-3">
                                    Enviar Instrucciones
                                </Button>
                            </Form>
                            <div className="text-center mt-3">
                                <Link to="/login" className="text-decoration-none">Volver al Login</Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Recovery;