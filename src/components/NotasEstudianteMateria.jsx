import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./NotasEstudianteMateria.css"; 

function NotasEstudianteMateria() {
  const { username, nombreMateria } = useParams();
  const [grado, setGrado] = useState("");
  const [notas, setNotas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {

        const resGrado = await fetch(`http://localhost:5000/api/estudiante/${username}/grado`);
        
        const dataGrado = await resGrado.json();
        setGrado(dataGrado.grado);

        const nombreReal = dataGrado.nombre;

        const resNotas = await fetch(
          `http://localhost:5000/api/notas-materia?nombre=${username}&materia=${nombreMateria}`
        );
        if (!resNotas.ok) {
          const errorText = await resNotas.text();
          console.error("❌ Error recibido del backend:", errorText);
          return; 
        }
        const dataNotas = await resNotas.json();
        setNotas(dataNotas);
        console.log("📦 Notas recibidas en frontend:", JSON.stringify(dataNotas, null, 2));
        console.log("📦 Notas recibidas:\n", JSON.stringify(dataNotas, null, 2));
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
            <th>N1</th>
            <th>N2</th>
            <th>N3</th>
            <th>N4</th>
            <th>Autoevaluación</th>
            <th>Heteroevaluación</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{nota.examen1 ?? ""}</td>
            <td>{nota.examen2 ?? ""}</td>
            <td>{nota.examen_final ?? ""}</td>
            <td>{nota.n1 ?? ""}</td>
            <td>{nota.n2 ?? ""}</td>
            <td>{nota.n3 ?? ""}</td>
            <td>{nota.n4 ?? ""}</td>
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
