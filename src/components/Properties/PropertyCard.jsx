// src/components/Properties/PropertyCard.jsx (Asumiendo que está en 'src/components/Properties/')
import React from 'react';
import { Card, Button } from 'react-bootstrap';
// import { Link } from 'react-router-dom'; // Descomentar si implementas una ruta de detalles
import './PropertyCard.css'; // Estilos para cada tarjeta de propiedad

const PropertyCard = ({ property }) => {
    // Definimos la IP de tu servidor EC2 como una constante para fácil modificación
    // ¡IMPORTANTE! Asegúrate de que esta URL base sea CORRECTA y apunte a tu servidor.
    const BASE_IMAGE_URL = 'http://18.218.217.229/'; 

    // Ruta de la imagen de fallback. Debe coincidir con la ubicación en tu carpeta 'public'.
    // Si 'no-image.jpg' está en public/img/propiedades/, la ruta es '/img/propiedades/no-image.jpg'.
    // Según tus imágenes anteriores, esta es la estructura correcta para public/.
    const FALLBACK_IMAGE_PATH = '/img/propiedades/no-image.jpg';

    // Construye la URL completa de la primera imagen de la propiedad.
    // 'property.imagenes' es el array de rutas de imágenes que viene de tu PHP (ej: "img/propiedades/foto1.jpg").
    const imageUrl = property.imagenes && property.imagenes.length > 0
        ? `${BASE_IMAGE_URL}${property.imagenes[0]}` // Concatena la IP con la ruta relativa del backend
        : FALLBACK_IMAGE_PATH; // Usa la ruta de fallback local de React si no hay imágenes

    // Formatea el precio a CLP (Peso Chileno)
    const formattedPrice = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0 // Sin decimales
    }).format(property.precio);

    return (
        <Card className="property-card h-100 shadow-sm"> {/* Añadido shadow-sm para una sombra sutil */}
            <Card.Img
                variant="top"
                src={imageUrl}
                alt={property.titulo || 'Imagen de Propiedad'} // Mejorar alt text por accesibilidad
                className="property-card-img"
                // Manejador de errores para la imagen: si la imagen no carga, usa la de fallback
                onError={(e) => {
                    e.target.onerror = null; // Evita bucles infinitos de error si el fallback también falla
                    e.target.src = FALLBACK_IMAGE_PATH; // Asigna la imagen de fallback si la original falla
                }}
            />
            <Card.Body className="d-flex flex-column"> {/* Usamos flexbox para que el botón se pegue abajo */}
                <Card.Title>{property.titulo}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                    {property.tipo} en {property.ciudad || 'N/A'}, {property.region || 'N/A'}
                </Card.Subtitle>
                <Card.Text className="property-description">
                    {property.descripcion ? property.descripcion.substring(0, 100) + '...' : 'Sin descripción.'}
                </Card.Text>
                <div className="property-details mb-3 mt-auto"> {/* mt-auto empuja los detalles hacia abajo */}
                    <p><i className="fas fa-bed"></i> {property.habitaciones || 'N/A'} Dorm.</p>
                    <p><i className="fas fa-bath"></i> {property.banos || 'N/A'} Baños</p>
                    <p><i className="fas fa-ruler-combined"></i> {property.metros_cuadrados || 'N/A'} m²</p>
                    <p className="property-price">{formattedPrice}</p>
                </div>
                {/* Botón para ver detalles (puedes enlazar a una ruta de detalles si la creas) */}
                <Button variant="primary" className="w-100 mt-auto"> {/* mt-auto para pegar al final de la Card.Body */}
                    Ver Detalles
                </Button>
                {/* Ejemplo con Link de react-router-dom si tienes una ruta /propiedades/:id */}
                {/* <Link to={`/propiedades/${property.id}`} className="btn btn-primary w-100 mt-auto">
                    Ver Detalles
                </Link> */}
            </Card.Body>
        </Card>
    );
};

export default PropertyCard;