import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Link } from "react-router-dom";

// Consulta GraphQLView para obtener todos los equipos
const GET_TEAMS = gql`
  query {
    teams {
      id
      name
      stadium
      coach
      yearFounded
      logoUrl
    }
  }
`;

// Mutación GraphQLView para agregar un equipo
const ADD_TEAM = gql`
  mutation AddTeam($name: String!, $stadium: String, $coach: String, $yearFounded: Int, $logoUrl: String) {
    addTeam(name: $name, stadium: $stadium, coach: $coach, yearFounded: $yearFounded, logoUrl: $logoUrl) {
      id
      name
      stadium
      coach
      yearFounded
      logoUrl
    }
  }
`;

// Mutación GraphQLView para actualizar un equipo
const UPDATE_TEAM = gql`
  mutation UpdateTeam($id: ID!, $name: String!, $stadium: String, $coach: String, $yearFounded: Int, $logoUrl: String) {
    updateTeam(id: $id, name: $name, stadium: $stadium, coach: $coach, yearFounded: $yearFounded, logoUrl: $logoUrl) {
      id
      name
      stadium
      coach
      yearFounded
      logoUrl
    }
  }
`;

// Mutación GraphQLView para eliminar un equipo
const DELETE_TEAM = gql`
  mutation DeleteTeam($id: ID!) {
    deleteTeam(id: $id) {
      id
    }
  }
`;

function GraphQLView() {
    const [formData, setFormData] = useState({
        id: null,
        name: '',
        stadium: '',
        coach: '',
        yearFounded: '',
        logoUrl: ''
    });

    const { loading, error, data } = useQuery(GET_TEAMS);
    const [addTeam] = useMutation(ADD_TEAM, {
        update(cache, { data: { addTeam } }) {
            const { teams } = cache.readQuery({ query: GET_TEAMS });
            cache.writeQuery({
                query: GET_TEAMS,
                data: { teams: [...teams, addTeam] },
            });
        }
    });

    const [updateTeam] = useMutation(UPDATE_TEAM, {
        update(cache, { data: { updateTeam } }) {
            const { teams } = cache.readQuery({ query: GET_TEAMS });
            cache.writeQuery({
                query: GET_TEAMS,
                data: { teams: teams.map(team => team.id === updateTeam.id ? updateTeam : team) },
            });
        }
    });

    const [deleteTeam] = useMutation(DELETE_TEAM, {
        update(cache, { data: { deleteTeam } }) {
            const { teams } = cache.readQuery({ query: GET_TEAMS });
            cache.writeQuery({
                query: GET_TEAMS,
                data: { teams: teams.filter(team => team.id !== deleteTeam.id) },
            });
        }
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveTeam = async () => {
        try {
            if (formData.id) {
                await updateTeam({ variables: { ...formData, yearFounded: parseInt(formData.yearFounded) } });
            } else {
                await addTeam({ variables: { ...formData, yearFounded: parseInt(formData.yearFounded) } });
            }
            setFormData({
                id: null,
                name: '',
                stadium: '',
                coach: '',
                yearFounded: '',
                logoUrl: ''
            });
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleDeleteTeam = async (id) => {
        try {
            await deleteTeam({ variables: { id } });
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    const handleStartEditing = (team) => {
        setFormData({ ...team, yearFounded: team.yearFounded.toString() });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div>
            <h1>Equipos de Fútbol</h1>
            <h2>Agregar/Editar Equipo</h2>
            <input type="text" name="name" placeholder="Nombre del equipo" value={formData.name}
                   onChange={handleInputChange}/>
            <input type="text" name="stadium" placeholder="Estadio" value={formData.stadium}
                   onChange={handleInputChange}/>
            <input type="text" name="coach" placeholder="Entrenador" value={formData.coach}
                   onChange={handleInputChange}/>
            <input type="text" name="yearFounded" placeholder="Año de fundación" value={formData.yearFounded}
                   onChange={handleInputChange}/>
            <input type="text" name="logoUrl" placeholder="URL del logo" value={formData.logoUrl}
                   onChange={handleInputChange}/>
            <button onClick={handleSaveTeam}>Guardar</button>

            <h2>Equipos Existentes</h2>
            <table>
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Estadio</th>
                    <th>Entrenador</th>
                    <th>Año de Fundación</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {data.teams.map(team => (
                    <tr key={team.id}>
                        <td>{team.name}</td>
                        <td>{team.stadium}</td>
                        <td>{team.coach}</td>
                        <td>{team.yearFounded}</td>
                        <td><img src={team.logoUrl} alt={team.name} style={{maxWidth: '100px'}}/></td>
                        <td>
                            <button className="edit" onClick={() => handleStartEditing(team)}>Editar</button>
                            <button className="delete" onClick={() => handleDeleteTeam(team.id)}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <h2>Transmisión de datos:</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
            <div className="button-container">
                <Link to="/">
                    <button className="styled-button">Inicio</button>
                </Link>
            </div>
        </div>
    );
}

export default GraphQLView;
