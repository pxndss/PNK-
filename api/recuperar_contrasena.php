<?php
// /var/www/html/api/recuperar_contrasena.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://18.218.217.229');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config.php'; // Usa __DIR__ para una ruta absoluta y segura

$response = ['success' => false, 'message' => ''];
$conn = null;

try {
    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Formato de datos JSON inválido.');
    }
    if (!isset($data['email'])) { // Se espera el campo 'email' de tu frontend
        throw new Exception('Falta el correo electrónico en la solicitud.');
    }

    $email = $data['email']; // Asumiendo que tu frontend envía 'email'

    $conn = conectarDB();

    if (!$conn) {
        throw new Exception('Error interno del servidor: No se pudo conectar a la base de datos.');
    }

    // *** CORRECCIÓN APLICADA AQUÍ: 'idusuarios' a 'id' y 'correo_electronico' a 'email' ***
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE email = ?");
    if (!$stmt) {
        throw new Exception('Error al preparar la consulta: ' . $conn->error);
    }
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        // Lógica para generar token y enviar correo (simulada)
        $response['success'] = true;
        $response['message'] = 'Si la dirección de correo electrónico está registrada, se han enviado instrucciones para restablecer tu contraseña.';
    } else {
        $response['success'] = true;
        $response['message'] = 'Si la dirección de correo electrónico está registrada, se han enviado instrucciones para restablecer tu contraseña.';
    }

    $stmt->close();

} catch (Exception $e) {
    error_log("Error en recuperar_contrasena.php: " . $e->getMessage());
    $response['message'] = 'Error interno del servidor: ' . $e->getMessage();
    http_response_code(500);
} finally {
    if ($conn) {
        $conn->close();
    }
    echo json_encode($response);
}
?>