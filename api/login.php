<?php
// /var/www/html/api/login.php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://18.218.217.229');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

error_log("DEBUG: login.php iniciado."); // Debug 1

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php'; // Asegúrate de que config.php esté en la misma carpeta
error_log("DEBUG: config.php incluido."); // Debug 2

$response = ['success' => false, 'message' => ''];
$conn = null;

try {
    $email = '';
    $password = '';

    $input = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() === JSON_ERROR_NONE && !empty($input)) {
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        error_log("DEBUG: Datos leídos como JSON."); // Debug 3.1
    } else {
        $email = $_POST['usuario'] ?? '';
        $password = $_POST['clave'] ?? '';
        error_log("DEBUG: Datos leídos como form-urlencoded."); // Debug 3.2
    }

    if (empty($email) || empty($password)) {
        $response['message'] = "Por favor, ingresa tu correo y contraseña.";
        error_log("DEBUG: Campos vacíos."); // Debug 4
        echo json_encode($response);
        exit();
    }

    $conn = conectarDB();
    error_log("DEBUG: Intentando conectar a DB."); // Debug 5

    if (!$conn) {
        $response['message'] = "Error interno del servidor: No se pudo conectar a la base de datos.";
        error_log("DEBUG: Fallo de conexión a DB."); // Debug 6
        throw new Exception("No se pudo conectar a la base de datos.");
    }
    error_log("DEBUG: Conectado a DB."); // Debug 7

    $stmt = $conn->prepare("SELECT id, nombre, tipo_usuario, password FROM usuarios WHERE email = ?");
    error_log("DEBUG: Consulta preparada."); // Debug 8
    if (!$stmt) {
        $response['message'] = "Error al preparar la consulta: " . $conn->error;
        error_log("DEBUG: Fallo al preparar consulta: " . $conn->error); // Debug 9
        throw new Exception("Error al preparar la consulta: " . $conn->error);
    }
    $stmt->bind_param("s", $email);
    $stmt->execute();
    error_log("DEBUG: Consulta ejecutada."); // Debug 10
    $result = $stmt->get_result();
    error_log("DEBUG: Resultado obtenido."); // Debug 11

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        error_log("DEBUG: Usuario encontrado. Intentando password_verify."); // Debug 12
        if (password_verify($password, $user['password'])) {
            $_SESSION['loggedin'] = true;
            $_SESSION['usuario_id'] = $user['id'];
            $_SESSION['nombre_usuario'] = $user['nombre'];
            $_SESSION['tipo_usuario'] = $user['tipo_usuario'];

            $response['success'] = true;
            $response['message'] = "Inicio de sesión exitoso.";
            $response['user'] = [
                'id' => $user['id'],
                'nombre' => $user['nombre'],
                'tipo_usuario' => $user['tipo_usuario']
            ];
            error_log("DEBUG: Login exitoso."); // Debug 13
        } else {
            $response['message'] = "Credenciales incorrectas.";
            error_log("DEBUG: Contraseña incorrecta."); // Debug 14
        }
    } else {
        $response['message'] = "Credenciales incorrectas.";
        error_log("DEBUG: Correo no encontrado."); // Debug 15
    }

    if ($stmt) { $stmt->close(); } // Asegurarse de cerrar el stmt

} catch (Exception $e) {
    error_log("ERROR CATCHED en login.php: " . $e->getMessage()); // Debug 16
    $response['message'] = "Error interno del servidor: " . $e->getMessage();
    http_response_code(500);
} finally {
    if ($conn) {
        $conn->close();
        error_log("DEBUG: Conexión a DB cerrada."); // Debug 17
    }
    echo json_encode($response);
    exit();
}
?>