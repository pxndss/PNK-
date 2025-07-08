import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <section className="hero" id="inicio">
            <div className="container">
                <div className="hero-content">
                    <h1>Tu Hogar Ideal te Espera</h1>
                    <p className="lead">Descubre las mejores propiedades en las ubicaciones más exclusivas</p>
                    <div className="hero-buttons">
                        <a href="#propiedades" className="btn btn-primary btn-lg me-3">
                            <i className="fas fa-home"></i> Ver Propiedades
                        </a>
                        <Link to="/registrarme" className="btn btn-outline-light btn-lg">
                            <i className="fas fa-user-plus"></i> Registrarse
                        </Link>
                    </div>
                    <div className="hero-features mt-4">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="feature-item">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <span>Mejores Ubicaciones</span>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="feature-item">
                                    <i className="fas fa-hand-holding-usd"></i>
                                    <span>Precios Competitivos</span>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="feature-item">
                                    <i className="fas fa-shield-alt"></i>
                                    <span>Seguridad Garantizada</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;