// src/components/Properties/PropertiesList.jsx (Asumiendo que está en 'src/components/Properties/')
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import PropertyCard from './PropertyCard'; // Este componente sí es singular, está bien.
import Swal from 'sweetalert2';
// ¡IMPORTANTE! Asegúrate de que esta importación sea EXACTAMENTE así:
// La ruta es relativa a la ubicación de este archivo. Si está en src/components/Properties,
// entonces el CSS debe estar en src/components/Properties/PropertiesList.css
import './PropertiesList.css'; // <--- PropertiesList.css (PLURAL)

// ¡IMPORTANTE! Asegúrate de que el nombre de la constante sea EXACTAMENTE así:
const PropertiesList = () => { // <--- PropertiesList (PLURAL)
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [filters, setFilters] = useState({
        tipo: '',
        region: '',
        provincia: '',
        sector: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const regions = [
        { name: 'Coquimbo', provinces: [
            { name: 'Limarí', sectors: ['Ovalle', 'Combarbalá'] },
            { name: 'Choapa', sectors: ['Canela', 'Illapel'] },
            { name: 'Elqui', sectors: ['La Serena', 'Coquimbo'] }
        ]},
        { name: 'Valparaíso', provinces: [
            { name: 'Valparaíso', sectors: ['Valparaíso', 'Viña del Mar'] },
            { name: 'San Antonio', sectors: ['San Antonio', 'Algarrobo'] }
        ]}
    ];

    const fetchProperties = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://18.218.217.229/api/get_properties.php');

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error HTTP! status: ${response.status} - ${errorText}`);
            }

            const data = await response.json();

            if (Array.isArray(data)) {
                setProperties(data);
                setFilteredProperties(data); // Inicialmente, las propiedades filtradas son todas las propiedades
            } else {
                throw new Error('La API no devolvió un array de propiedades. Formato inesperado.');
            }
        } catch (err) {
            console.error("Error al cargar propiedades:", err);
            setError("No se pudieron cargar las propiedades. " + err.message);
            Swal.fire({
                icon: 'error',
                title: 'Error de carga',
                text: 'Hubo un problema al cargar las propiedades. Por favor, inténtelo de nuevo más tarde.',
                confirmButtonColor: '#dc3545'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

    // Manejar cambios en los filtros y actualizar filteredProperties
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    // Este useEffect se encargará de aplicar los filtros cada vez que 'properties' o 'filters' cambien
    useEffect(() => {
        let currentFiltered = properties.filter(property => {
            // Normalizar a minúsculas para una comparación sin distinción entre mayúsculas y minúsculas
            const tipoMatch = filters.tipo === '' || property.tipo.toLowerCase() === filters.tipo.toLowerCase();
            const regionMatch = filters.region === '' || property.region.toLowerCase() === filters.region.toLowerCase();
            const provinciaMatch = filters.provincia === '' || property.provincia.toLowerCase() === filters.provincia.toLowerCase();
            const sectorMatch = filters.sector === '' || property.sector.toLowerCase() === filters.sector.toLowerCase();

            return tipoMatch && regionMatch && provinciaMatch && sectorMatch;
        });
        setFilteredProperties(currentFiltered);
    }, [properties, filters]); // Dependencias: properties (cuando se cargan inicialmente) y filters (cuando cambian)


    // Lógica para las opciones de los selects dependientes
    const selectedRegion = regions.find(r => r.name === filters.region);
    const provincesForSelectedRegion = selectedRegion ? selectedRegion.provinces : [];
    const sectorsForSelectedProvince = filters.provincia ?
        (provincesForSelectedRegion.find(p => p.name === filters.provincia)?.sectors || []) : [];

    return (
        <Container className="my-5 properties-page-container">
            <h1 className="mb-4 text-center">Buscar Propiedades</h1>
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Form>
                        <Row>
                            <Col md={3} className="mb-3">
                                <Form.Group controlId="filterTipo">
                                    <Form.Label>Tipo de Propiedad</Form.Label>
                                    <Form.Select name="tipo" value={filters.tipo} onChange={handleFilterChange}>
                                        <option value="">Todos los tipos</option>
                                        <option value="Casa">Casa</option>
                                        <option value="Departamento">Departamento</option>
                                        <option value="Oficina">Oficina</option>
                                        <option value="Local Comercial">Local Comercial</option>
                                        <option value="Terreno">Terreno</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3} className="mb-3">
                                <Form.Group controlId="filterRegion">
                                    <Form.Label>Región</Form.Label>
                                    <Form.Select name="region" value={filters.region} onChange={handleFilterChange}>
                                        <option value="">Seleccione una región</option>
                                        {regions.map((reg) => (
                                            <option key={reg.name} value={reg.name}>{reg.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3} className="mb-3">
                                <Form.Group controlId="filterProvincia">
                                    <Form.Label>Provincia</Form.Label>
                                    <Form.Select
                                        name="provincia"
                                        value={filters.provincia}
                                        onChange={handleFilterChange}
                                        disabled={!filters.region} // Deshabilitar si no hay región seleccionada
                                    >
                                        <option value="">Seleccione una provincia</option>
                                        {provincesForSelectedRegion.map((prov) => (
                                            <option key={prov.name} value={prov.name}>{prov.name}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={3} className="mb-3">
                                <Form.Group controlId="filterSector">
                                    <Form.Label>Sector</Form.Label>
                                    <Form.Select
                                        name="sector"
                                        value={filters.sector}
                                        onChange={handleFilterChange}
                                        disabled={!filters.provincia} // Deshabilitar si no hay provincia seleccionada
                                    >
                                        <option value="">Seleccione un sector</option>
                                        {sectorsForSelectedProvince.map((sec) => (
                                            <option key={sec} value={sec}>{sec}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>

            {/* Renderizado condicional de contenido */}
            {loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando propiedades...</span>
                    </div>
                    <p className="mt-3">Cargando propiedades...</p>
                </div>
            ) : error ? (
                // Mensaje de error si hubo un problema al cargar
                <div className="alert alert-danger text-center my-5" role="alert">
                    {error}
                </div>
            ) : filteredProperties.length > 0 ? (
                // Mostrar propiedades si se cargaron y hay elementos filtrados
                <Row id="propiedades-resultados" className="g-4">
                    {filteredProperties.map(property => (
                        <Col key={property.id} sm={12} md={6} lg={4}>
                            <PropertyCard property={property} />
                        </Col>
                    ))}
                </Row>
            ) : (
                // Mostrar mensaje si no hay propiedades que coincidan con los filtros
                <div id="no-properties-message" className="col-12 text-center mt-5">
                    <p className="lead">No hay propiedades que coincidan con los filtros seleccionados.</p>
                </div>
            )}
        </Container>
    );
};

// ¡IMPORTANTE! Asegúrate de que esta exportación sea EXACTAMENTE así:
export default PropertiesList; // <--- PropertiesList (PLURAL)