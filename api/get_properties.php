<?php
// Establece las cabeceras para permitir el acceso desde tu frontend React (CORS) y especificar el tipo de contenido
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Permite CORS desde cualquier origen para tu frontend React
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Incluye tu archivo de configuración de la base de datos
// === ¡AJUSTE CRÍTICO DE LA RUTA! ===
// Si get_properties.php y config.php están AMBOS en la misma carpeta 'api',
// la ruta relativa es simplemente 'config.php' o '__DIR__ . '/config.php''
include __DIR__ . '/config.php'; // <--- ¡ESTA ES LA RUTA CORRECTA SI ESTÁN EN LA MISMA CARPETA!

$propiedades_array = []; // Este será el array que contendrá todas las propiedades con sus imágenes
$conn = null; // Inicializa la conexión a null

try {
    $conn = conectarDB(); // Asume que esta función se conecta y devuelve la conexión
    if (!$conn) {
        throw new Exception("No se pudo conectar a la base de datos.");
    }

    // Consulta principal para obtener los datos de las propiedades
    $sql = "SELECT
                id,
                titulo AS nombre,
                descripcion,
                tipo,
                region,
                provincia,
                sector,
                ciudad,
                precio,
                metros_cuadrados,
                habitaciones,
                banos,
                estacionamientos
            FROM propiedades
            WHERE estado = 'disponible'"; // Filtramos por propiedades disponibles

    $result = $conn->query($sql);

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $propiedad_id = $row['id']; // Obtenemos el ID de la propiedad actual

            // === Consulta secundaria para obtener TODAS las imágenes de esta propiedad (USANDO SENTENCIAS PREPARADAS) ===
            $sql_imagenes = "SELECT ruta_imagen FROM imagenes_propiedades WHERE propiedad_id = ? ORDER BY orden ASC";
            $stmt_imagenes = $conn->prepare($sql_imagenes);

            if (!$stmt_imagenes) {
                error_log("Error al preparar la consulta de imágenes para propiedad ID {$propiedad_id}: " . $conn->error);
                $imagenes_propiedad = ['img/no-image.jpg']; // Usar imagen por defecto
                $row['imagenes'] = $imagenes_propiedad;
                $propiedades_array[] = $row;
                continue;
            }

            $stmt_imagenes->bind_param("i", $propiedad_id); // "i" para integer
            $stmt_imagenes->execute();
            $result_imagenes = $stmt_imagenes->get_result();

            $imagenes_propiedad = [];
            if ($result_imagenes && $result_imagenes->num_rows > 0) {
                while ($img_row = $result_imagenes->fetch_assoc()) {
                    $imagenes_propiedad[] = $img_row['ruta_imagen'];
                }
            } else {
                $imagenes_propiedad[] = 'img/no-image.jpg';
            }
            $stmt_imagenes->close();

            $row['imagenes'] = $imagenes_propiedad;
            $propiedades_array[] = $row;
        }
    } else {
        error_log("Error en la consulta SQL principal de get_properties.php: " . $conn->error);
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Error al ejecutar la consulta de propiedades. Detalles: ' . $conn->error]);
        exit;
    }
} catch (Exception $e) {
    error_log("Error en get_properties.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error del servidor: ' . $e->getMessage()]);
    exit;
} finally {
    if ($conn) {
        $conn->close();
    }
}

echo json_encode($propiedades_array, JSON_UNESCAPED_UNICODE);
?>