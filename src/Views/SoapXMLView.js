import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function SoapXMLView() {
    const [teams, setTeams] = useState([]);
    const [teamsXML, setTeamsXML] = useState([]);
    const [newTeam, setNewTeam] = useState({
        name: '',
        stadium: '',
        coach: '',
        yearFounded: '',
        logoUrl: ''
    });
    const [editingTeamId, setEditingTeamId] = useState(null);
    const [editingTeam, setEditingTeam] = useState({
        id: null,
        name: '',
        stadium: '',
        coach: '',
        yearFounded: '',
        logoUrl: ''
    });

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = () => {
        fetch('http://localhost:3001/xml/equipos')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                return response.text();
            })
            .then(str => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(str, "application/xml");
                const teamsArray = Array.from(xmlDoc.getElementsByTagName("equipo")).map(team => ({
                    id: team.getElementsByTagName("id")[0].textContent,
                    name: team.getElementsByTagName("name")[0].textContent,
                    stadium: team.getElementsByTagName("stadium")[0].textContent,
                    coach: team.getElementsByTagName("coach")[0].textContent,
                    yearFounded: team.getElementsByTagName("yearFounded")[0].textContent,
                    logoUrl: team.getElementsByTagName("logoUrl")[0].textContent,
                }));
                setTeams(teamsArray);
                setTeamsXML(str);
            })
            .catch(error => console.error('Error fetching teams:', error));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (editingTeamId !== null) {
            setEditingTeam({ ...editingTeam, [name]: value });
        } else {
            setNewTeam({ ...newTeam, [name]: value });
        }
    };

    const handleAddTeam = () => {
        const teamXml = `
            <equipo>
                <name>${newTeam.name}</name>
                <stadium>${newTeam.stadium}</stadium>
                <coach>${newTeam.coach}</coach>
                <yearFounded>${newTeam.yearFounded}</yearFounded>
                <logoUrl>${newTeam.logoUrl}</logoUrl>
            </equipo>
        `;
        fetch('http://localhost:3001/xml/equipos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/xml'
            },
            body: teamXml
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add team');
                }
                return response.text();
            })
            .then(() => {
                fetchTeams();
                setNewTeam({
                    name: '',
                    stadium: '',
                    coach: '',
                    yearFounded: '',
                    logoUrl: ''
                });
            })
            .catch(error => console.error('Error adding team:', error));
    };

    const handleEditTeam = () => {
        const teamXml = `
            <equipo>
                <id>${editingTeam.id}</id>
                <name>${editingTeam.name}</name>
                <stadium>${editingTeam.stadium}</stadium>
                <coach>${editingTeam.coach}</coach>
                <yearFounded>${editingTeam.yearFounded}</yearFounded>
                <logoUrl>${editingTeam.logoUrl}</logoUrl>
            </equipo>
        `;
        fetch(`http://localhost:3001/xml/equipos/${editingTeam.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/xml'
            },
            body: teamXml
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to edit team');
                }
                return response.text();
            })
            .then(() => {
                fetchTeams();
                setEditingTeamId(null);
                setEditingTeam({
                    id: null,
                    name: '',
                    stadium: '',
                    coach: '',
                    yearFounded: '',
                    logoUrl: ''
                });
            })
            .catch(error => console.error('Error editing team:', error));
    };

    const handleDeleteTeam = (id) => {
        fetch(`http://localhost:3001/xml/equipos/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete team');
                }
                return response.text();
            })
            .then(() => {
                fetchTeams();
            })
            .catch(error => console.error('Error deleting team:', error));
    };

    const handleStartEditing = (team) => {
        setEditingTeamId(team.id);
        setEditingTeam(team);
    };

    return (
        <div>
            <h1>Equipos (XML)</h1>
            <h2>Agregar Nuevo Equipo</h2>
            <input type="text" name="name" placeholder="Nombre" value={newTeam.name} onChange={handleInputChange}/>
            <input type="text" name="stadium" placeholder="Estadio" value={newTeam.stadium}
                   onChange={handleInputChange}/>
            <input type="text" name="coach" placeholder="Entrenador" value={newTeam.coach}
                   onChange={handleInputChange}/>
            <input type="text" name="yearFounded" placeholder="Año de Fundación" value={newTeam.yearFounded}
                   onChange={handleInputChange}/>
            <input type="text" name="logoUrl" placeholder="URL del Logo" value={newTeam.logoUrl}
                   onChange={handleInputChange}/>
            <button onClick={handleAddTeam}>Agregar Equipo</button>

            <h2>Equipos Existentes</h2>
            {teams.length > 0 ? (
                <table>
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Estadio</th>
                        <th>Entrenador</th>
                        <th>Año de Fundación</th>
                        <th>Logo</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {teams.map(team => (
                        <tr key={team.id}>
                            <td>{editingTeamId === team.id ? (
                                <input type="text" name="name" value={editingTeam.name} onChange={handleInputChange}/>
                            ) : (
                                team.name
                            )}</td>
                            <td>{editingTeamId === team.id ? (
                                <input type="text" name="stadium" value={editingTeam.stadium}
                                       onChange={handleInputChange}/>
                            ) : (
                                team.stadium
                            )}</td>
                            <td>{editingTeamId === team.id ? (
                                <input type="text" name="coach" value={editingTeam.coach} onChange={handleInputChange}/>
                            ) : (
                                team.coach
                            )}</td>
                            <td>{editingTeamId === team.id ? (
                                <input type="text" name="yearFounded" value={editingTeam.yearFounded}
                                       onChange={handleInputChange}/>
                            ) : (
                                team.yearFounded
                            )}</td>
                            <td>{editingTeamId === team.id ? (
                                <input type="text" name="logoUrl" value={editingTeam.logoUrl}
                                       onChange={handleInputChange}/>
                            ) : (
                                <img src={team.logoUrl} alt={team.name} style={{maxWidth: '100px'}}/>
                            )}</td>
                            <td>
                                {editingTeamId === team.id ? (
                                    <button onClick={handleEditTeam}>Guardar Cambios</button>
                                ) : (
                                    <div>
                                        <button className="delete" onClick={() => handleDeleteTeam(team.id)}>Eliminar
                                        </button>
                                        <button className="edit" onClick={() => handleStartEditing(team)}>Editar
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay equipos disponibles.</p>
            )}
            <h2>Transmisión de datos:</h2>
            <pre>{teamsXML}</pre>
            <div className="button-container">
                <Link to="/">
                    <button className="styled-button">Inicio</button>
                </Link>
            </div>
        </div>
    );
}

export default SoapXMLView;

