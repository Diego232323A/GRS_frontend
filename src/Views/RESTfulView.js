import React, { useState, useEffect } from 'react';
import './styles.css';
import { Link } from "react-router-dom";

function RESTfulView() {
    const [teams, setTeams] = useState([]);
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
        fetch('http://localhost:3001/api/equipos')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                return response.json();
            })
            .then(data => setTeams(data))
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
        fetch('http://localhost:3001/api/equipos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTeam)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add team');
                }
                return response.json();
            })
            .then(data => {
                setTeams([...teams, data]);
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
        fetch(`http://localhost:3001/api/equipos/${editingTeam.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editingTeam)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to edit team');
                }
                return response.json();
            })
            .then(() => {
                const updatedTeams = teams.map(team => {
                    if (team.id === editingTeam.id) {
                        return { ...team, ...editingTeam };
                    }
                    return team;
                });
                setTeams(updatedTeams);
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
        fetch(`http://localhost:3001/api/equipos/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete team');
                }
                // Actualizar el estado de los equipos localmente después de eliminar uno
                setTeams(teams.filter(team => team.id !== id));
            })
            .catch(error => console.error('Error deleting team:', error));
    };

    const handleStartEditing = (team) => {
        setEditingTeamId(team.id);
        setEditingTeam(team);
    };

    return (
        <div>
            <h1>Equipos de Fútbol</h1>
            <h2>Agregar Nuevo Equipo</h2>
            <input type="text" name="name" placeholder="Nombre del equipo" value={newTeam.name}
                   onChange={handleInputChange}/>
            <input type="text" name="stadium" placeholder="Estadio" value={newTeam.stadium}
                   onChange={handleInputChange}/>
            <input type="text" name="coach" placeholder="Entrenador" value={newTeam.coach}
                   onChange={handleInputChange}/>
            <input type="text" name="yearFounded" placeholder="Año de fundación" value={newTeam.yearFounded}
                   onChange={handleInputChange}/>
            <input type="text" name="logoUrl" placeholder="URL del logo" value={newTeam.logoUrl}
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
                            {editingTeamId === team.id ? (
                                <>
                                    <td><input type="text" name="name" value={editingTeam.name}
                                               onChange={handleInputChange}/></td>
                                    <td><input type="text" name="stadium" value={editingTeam.stadium}
                                               onChange={handleInputChange}/></td>
                                    <td><input type="text" name="coach" value={editingTeam.coach}
                                               onChange={handleInputChange}/></td>
                                    <td><input type="text" name="yearFounded" value={editingTeam.yearFounded}
                                               onChange={handleInputChange}/></td>
                                    <td><input type="text" name="logoUrl" value={editingTeam.logoUrl}
                                               onChange={handleInputChange}/></td>
                                    <td>
                                        <button onClick={handleEditTeam}>Guardar Cambios</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{team.name}</td>
                                    <td>{team.stadium}</td>
                                    <td>{team.coach}</td>
                                    <td>{team.yearFounded}</td>
                                    <td><img src={team.logoUrl} alt={team.name} style={{maxWidth: '100px'}}/></td>
                                    <td>
                                        <button className="edit" onClick={() => handleStartEditing(team)}>Editar
                                        </button>
                                        <button className="delete" onClick={() => handleDeleteTeam(team.id)}>Eliminar
                                        </button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay equipos disponibles.</p>
            )}
            <br/>
            <h2>Transmisión de datos:</h2>
            <pre>{JSON.stringify(teams, null, 2)}</pre>
            <div className="button-container">
                <Link to="/">
                    <button className="styled-button">Inicio</button>
                </Link>
            </div>
        </div>
    );
}

export default RESTfulView;
