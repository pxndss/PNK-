<?php
function conectarDB() {
    // Asegúrate de que estos valores coincidan con tu configuración de MySQL/MariaDB
    $db_host = "localhost"; // O la IP/nombre de host de tu servidor de base de datos
    $db_user = "root";
    $db_pass = "Admin#123"; // La contraseña de tu usuario de DB
    $db_name = "pnkinmobiliaria"; // El nombre de tu base de datos, 
    // Crear una nueva conexión
    $conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

    // Verificar la conexión
    if ($conn->connect_error) {
        // En un entorno de producción, es mejor no mostrar el error completo
        // Por ahora, para depurar, lo mostraremos.
        die("Error de conexión a la base de datos: " . $conn->connect_error);
    }

    // Establecer el charset a UTF-8 para evitar problemas con caracteres especiales
    $conn->set_charset("utf8mb4");

    return $conn;
}
?>