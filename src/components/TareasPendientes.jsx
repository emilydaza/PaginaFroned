import React, { useEffect, useState } from "react";

function TareasPendientes({ grado, materia }) {
  const [tareas, setTareas] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/tareas/${grado}/${materia}`)
      .then(res => res.json())
      .then(data => setTareas(data))
      .catch(err => console.error("❌ Error al cargar tareas:", err));
  }, [grado, materia]);

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>📌 Tareas pendientes</h3>
      {tareas.length > 0 ? (
        <ul>
          {tareas.map((tarea, i) => (
            <li key={i}>
              <strong>{tarea.descripcion}</strong> — entrega: {tarea.fecha_entrega}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay tareas pendientes.</p>
      )}
    </div>
  );
}

export default TareasPendientes;
