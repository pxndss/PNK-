import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Necesitarás react-router-dom para las redirecciones

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook para la navegación

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario (recargar la página)
        setError(''); // Limpiar errores previos

        try {
            // URL de tu API de login en el servidor EC2
            // Asegúrate de que esta URL sea correcta (ej. http://tu_ip_ec2/api/login_api.php)
            const response = await fetch('http://18.218.217.229/api/login.php', { // CAMBIAR si el PHP se llama diferente o está en otra ruta
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', // O 'application/json' si decides enviar JSON desde React
                },
                // Si envías como application/x-www-form-urlencoded:
                body: new URLSearchParams({
                    usuario: email,
                    clave: password,
                }).toString(),
                // Si decides enviar como application/json, el 'body' sería:
                // body: JSON.stringify({
                //     usuario: email,
                //     clave: password,
                // }),
            });

            // Verificar si la respuesta fue OK (status 2xx)
            if (!response.ok) {
                // Si el servidor devuelve un 400, 401, etc., lo manejamos aquí
                const errorData = await response.json(); // Intentar leer el JSON del error
                setError(errorData.message || 'Error al iniciar sesión. Inténtalo de nuevo.');
                return;
            }

            const data = await response.json(); // Leer la respuesta JSON del servidor

            if (data.success) {
                // Inicio de sesión exitoso
                // Aquí podrías guardar el token de sesión o los datos del usuario en localStorage/sessionStorage
                // Por ejemplo: localStorage.setItem('token', data.token);
                console.log('Inicio de sesión exitoso:', data.user);

                // Redirigir al usuario según su tipo (esto lo hace el frontend)
                switch (data.user.tipo_usuario) {
                    case 'admin':
                        navigate('/admin/dashboard'); // Ruta de tu frontend React para el dashboard de admin
                        break;
                    case 'gestor':
                        navigate('/gestor/dashboard'); // Ruta de tu frontend React para el dashboard de gestor
                        break;
                    case 'propietario':
                        navigate('/propietario/dashboard'); // Ruta de tu frontend React para el dashboard de propietario
                        break;
                    default:
                        navigate('/dashboard'); // Ruta por defecto
                }
            } else {
                // Mensaje de error de credenciales incorrectas desde el servidor
                setError(data.message || 'Credenciales incorrectas. Verifique su correo y contraseña.');
            }
        } catch (err) {
            // Error de red o cualquier otro error inesperado
            console.error('Error de red o del servidor:', err);
            setError('No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.');
        }
    };

    return (
        <div className="login-container">   
            <div className="logo">
                <img src="../img/logo.png" alt="PNK Inmobiliaria Logo" height="80" />
            </div>
            <h2>Iniciar Sesión</h2>

            {error && <p className="error-message">{error}</p>}

            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="usuario">Correo Electrónico:</label>
                    <input
                        type="email"
                        id="usuario"
                        name="usuario"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="clave">Contraseña:</label>
                    <input
                        type="password"
                        id="clave"
                        name="clave"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Entrar</button>
            </form>
            <div className="register-link">
                ¿No tienes cuenta? <a href="/registro">Regístrate aquí</a> {/* Asegúrate de que esta ruta sea de React Router */}
            </div>
        </div>
    );
};

export default LoginPage;