<?php
// /var/www/html/api/test_db.php
header('Content-Type: text/plain'); // Para ver la salida como texto plano
header('Access-Control-Allow-Origin: *'); // Permite acceso desde cualquier origen

// Incluye tu archivo de configuración de la base de datos
require_once 'config.php'; // Asegúrate de que esta ruta sea correcta para config.php

echo "Intentando conectar a la base de datos...\n";

$conn = conectarDB();

if ($conn) {
    echo "¡Conexión a la base de datos exitosa!\n\n";

    // Intentar una consulta simple para verificar la tabla 'usuarios'
    $query = "SELECT idusuarios, nombre, correo_electronico, tipo_usuario FROM usuarios LIMIT 1";
    $result = $conn->query($query);

    if ($result) {
        if ($result->num_rows > 0) {
            echo "Datos de la tabla 'usuarios' encontrados:\n";
            while($row = $result->fetch_assoc()) {
                echo "ID: " . $row["idusuarios"]. " - Nombre: " . $row["nombre"]. " - Correo: " . $row["correo_electronico"]. " - Tipo: " . $row["tipo_usuario"]. "\n";
            }
        } else {
            echo "No se encontraron registros en la tabla 'usuarios'.\n";
        }
        $result->free();
    } else {
        echo "Error al ejecutar la consulta: " . $conn->error . "\n";
    }

    $conn->close();
    echo "\nConexión cerrada.\n";

} else {
    echo "¡Error: No se pudo conectar a la base de datos! Revisa las credenciales en config.php.\n";
    // Si hay un error de conexión, el error_log en conectarDB() debería tener más detalles
}
?>

