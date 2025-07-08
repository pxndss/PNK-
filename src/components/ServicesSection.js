import React from 'react';

const ServicesSection = () => {
    return (
        <section className="services" id="servicios">
            <div className="container">
                <h2 className="text-center mb-5">Nuestros Servicios</h2>
                <div className="row">
                    <div className="col-md-4">
                        <div className="service-card">
                            <i className="fas fa-home service-icon"></i>
                            <h3>Compra y Venta</h3>
                            <p>Encuentra la propiedad perfecta o vende tu inmueble con nosotros</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="service-card">
                            <i className="fas fa-key service-icon"></i>
                            <h3>Arriendo</h3>
                            <p>Amplia selección de propiedades en arriendo</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="service-card">
                            <i className="fas fa-chart-line service-icon"></i>
                            <h3>Asesoría</h3>
                            <p>Asesoramiento profesional en inversiones inmobiliarias</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;