import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./NotasEstudianteMateria.css"; // Opcional para estilos

function NotasEstudianteMateria() {
  const { username, nombreMateria } = useParams();
  const [grado, setGrado] = useState("");
  const [notas, setNotas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Obtener grado del estudiante
        const resGrado = await fetch(`http://localhost:5000/api/estudiante/${username}/grado`);
        const dataGrado = await resGrado.json();
        setGrado(dataGrado.grado);

        // Obtener notas del estudiante para esa materia
        const resNotas = await fetch(
          `http://localhost:5000/api/notas-materia?nombre=${username}&materia=${nombreMateria}`
        );
        const dataNotas = await resNotas.json();
        setNotas(dataNotas);
      } catch (err) {
        console.error("❌ Error al cargar notas:", err);
      }
    };

    cargarDatos();
  }, [username, nombreMateria]);

  const nota = notas[0] || {};

  return (
    <div className="notas-estudiante-materia">
      <h2>{nombreMateria.charAt(0).toUpperCase() + nombreMateria.slice(1)}</h2>
      <p>Estudiante: {username}</p>
      <p>Grado: {grado}</p>

      <table>
        <thead>
          <tr>
            <th>Examen 1</th>
            <th>Examen 2</th>
            <th>Examen Final</th>
            <th>H1</th>
            <th>H2</th>
            <th>H3</th>
            <th>H4</th>
            <th>Autoevaluación</th>
            <th>Heteroevaluación</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{nota.examen1 ?? ""}</td>
            <td>{nota.examen2 ?? ""}</td>
            <td>{nota.examen_final ?? ""}</td>
            <td>{nota.h1 ?? ""}</td>
            <td>{nota.h2 ?? ""}</td>
            <td>{nota.h3 ?? ""}</td>
            <td>{nota.h4 ?? ""}</td>
            <td>{nota.autoevaluacion ?? ""}</td>
            <td>{nota.heteroevaluacion ?? ""}</td>
          </tr>
        </tbody>
      </table>

      <button onClick={() => navigate("/estudiante")}>⬅ Volver</button>
    </div>
  );
}

export default NotasEstudianteMateria;
