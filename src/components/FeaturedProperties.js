import React, { useState, useEffect } from 'react';
import PropertyCard from './PropertyCard'; // Asegúrate de que PropertyCard.js existe y está en la misma carpeta

const FeaturedProperties = () => {
    const [propiedades, setPropiedades] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                // *** ¡IMPORTANTE! AJUSTA ESTA URL CON LA IP REAL DE TU EC2 ***
                // Por ejemplo: 'http://54.123.45.67/api/propiedades_destacadas.php'
                // O si estás desarrollando localmente y tienes XAMPP/WAMP, podría ser:
                // 'http://localhost/api/propiedades_destacadas.php'
                 const response = await fetch('http://18.218.217.229/api/propiedades.php');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.error) {
                    throw new Error(data.error);
                }
                setPropiedades(data);
            } catch (err) {
                console.error("Error fetching properties:", err);
                setError("No se pudieron cargar las propiedades destacadas. Inténtalo más tarde.");
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

    if (loading) {
        return (
            <section className="featured-properties" id="propiedades">
                <div className="container">
                    <h2 className="text-center mb-5">Cargando Propiedades...</h2>
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="featured-properties" id="propiedades">
                <div className="container">
                    <h2 className="text-center mb-5">Propiedades Destacadas</h2>
                    <div className="col-12 text-center text-danger">
                        <p>{error}</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="featured-properties" id="propiedades">
            <div className="container">
                <h2 className="text-center mb-5">Propiedades Destacadas</h2>
                <div className="row justify-content-center">
                    {propiedades.length > 0 ? (
                        propiedades.map(propiedad => (
                            <PropertyCard key={propiedad.id} propiedad={propiedad} />
                        ))
                    ) : (
                        <div className="col-12 text-center">
                            <p>No hay propiedades destacadas disponibles en este momento.</p>
                        </div> // <-- Este fue el 'div' que se corrigió.
                    )}
                </div>
            </div>
        </section>
    );
}; // Cierre de la función del componente

export default FeaturedProperties;