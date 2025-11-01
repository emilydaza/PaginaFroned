import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProfesorGrado() {
  const { materia, grado } = useParams();
  const [estudiantes, setEstudiantes] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/estudiantes-por-grado?grado=${grado}`)
      .then(res => res.json())
      .then(data => setEstudiantes(data || []))
      .catch(err => console.error("❌ Error al cargar estudiantes:", err));
  }, [grado]);

  return (
    <div style={{ padding: "40px", backgroundColor: "#10164d", color: "white", minHeight: "100vh" }}>
      <h2>👨‍🏫 Estudiantes de {grado} en {materia}</h2>
      {estudiantes.length > 0 ? (
        <ul style={{ marginTop: "20px" }}>
          {estudiantes.map((e, i) => (
            <li key={i} style={{ marginBottom: "10px", fontSize: "18px" }}>
              {e.nombre}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay estudiantes registrados en este grado.</p>
      )}
    </div>
  );
}

export default ProfesorGrado;
