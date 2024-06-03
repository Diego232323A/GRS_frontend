import React from 'react';
import { Link } from 'react-router-dom';
import './Inicio.css';

function InicioView() {
    return (
        <div className="container">
            <div className="content">
                <h1>Aplicación de Protocolos de Transmisión</h1>
                <h2>Explora las diferentes opciones de transmisión disponibles</h2>
                <p>Selecciona un protocolo de transmisión para obtener más información y realizar operaciones específicas.</p>
                <div className="protocols-container">
                    <Link to="/button1" className="protocol-card">
                        <img src="https://assets.toptal.io/images?url=https%3A%2F%2Fbs-uploads.toptal.io%2Fblackfish-uploads%2Fcomponents%2Fblog_post_page%2F4085894%2Fcover_image%2Fretina_500x200%2Fcover-5-new-things-rest-specification-d2c16da0c19bab3cacf69b2b910409a3.png" alt="RESTfulView" />
                        <div className="protocol-name">RESTfulView</div>
                    </Link>
                    <Link to="/button2" className="protocol-card">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/1/17/GraphQL_Logo.svg" alt="GraphQLView" />
                        <div className="protocol-name">GraphQLView</div>
                    </Link>
                    <Link to="/button3" className="protocol-card">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e6/Text-xml.svg" alt="SOAP/XML" />
                        <div className="protocol-name">SOAP/XML</div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default InicioView;
