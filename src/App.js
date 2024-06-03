import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import './App.css'
import InicioView from "./Views/InicioView";
import RESTfulView from "./Views/RESTfulView";
import GraphQLView from "./Views/GraphQLView";
import SoapXMLView from "./Views/SoapXMLView";

const client = new ApolloClient({
    uri: 'http://localhost:3001/graphql',
    cache: new InMemoryCache()
});

function App() {
    return (
        <ApolloProvider client={client}>
            <Router>
                <Routes>
                    <Route path="/" element={<InicioView />} />
                    <Route path="/button1" element={<RESTfulView />} />
                    <Route path="/button2" element={<GraphQLView />} />
                    <Route path="/button3" element={<SoapXMLView />} />
                </Routes>
            </Router>
        </ApolloProvider>
    );
}

export default App;
