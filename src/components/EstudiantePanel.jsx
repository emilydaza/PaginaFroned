import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TareasPendientes from "./TareasPendientes";
import "./Estudiante.css";

function EstudiantePanel() {
  const username = localStorage.getItem("username");
  const [materias, setMaterias] = useState([]);
  const [grado, setGrado] = useState("");
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
  const [notasMateria, setNotasMateria] = useState([]);
  const [tareasGrado, setTareasGrado] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const cargarMateriasPorGrado = async () => {
      try {
        const resGrado = await fetch(`http://localhost:5000/api/estudiante/${username}/grado`);
        const dataGrado = await resGrado.json();
        const gradoEstudiante = dataGrado.grado;
        setGrado(gradoEstudiante);

        const resMaterias = await fetch(`http://localhost:5000/api/materias-por-grado/${gradoEstudiante}`);
        const dataMaterias = await resMaterias.json();
        setMaterias(dataMaterias);
      } catch (err) {
        console.error("❌ Error al cargar grado y materias:", err);
      }
    };

    if (username) {
      cargarMateriasPorGrado();
    }
  }, [username]);

  useEffect(() => {
    if (!grado) return;

    fetch(`http://localhost:5000/api/tareas/grado/${grado}`)
      .then(res => res.json())
      .then(data => {
        const ordenadas = [...data].sort((a, b) => new Date(a.fecha_entrega) - new Date(b.fecha_entrega));
        setTareasGrado(ordenadas);
      })
      .catch(err => console.error("❌ Error al cargar tareas del grado:", err));
  }, [grado]);

  const seleccionarMateria = (materia) => {
    setMateriaSeleccionada(materia);

    fetch(`http://localhost:5000/api/notas-materia?nombre=${username}&materia=${materia}`)
      .then(res => res.json())
      .then(data => setNotasMateria(data))
      .catch(err => console.error("❌ Error al cargar notas por materia:", err));
  };

  const obtenerColor = (fecha) => {
    const hoy = new Date();
    const entrega = new Date(fecha);
    const diff = (entrega - hoy) / (1000 * 60 * 60 * 24);

    if (diff <= 3) return "#ff4d4d";       // rojo
    if (diff <= 7) return "#ffa94d";       // naranja
    return "#a0e7a0";                      // verde
  };

  console.log("📦 Tareas recibidas:", tareasGrado);

  return (
    <div className="contenedor-estudiante-flex" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div className="contenido-texto-estudiante">
        <div className="columna-izquierda"></div>
        <h1>Bienvenido, {username}</h1>
        <p>Grado: {grado}</p>
        <p>Aquí puedes ver tus materias, calificaciones y tareas pendientes.</p>

        {/* 🔴 Botón de cerrar sesión */}
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/"); // ajusta si tu login está en otra ruta
          }}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            width: "100%",
            maxWidth: "200px"
          }}
        >
          Cerrar sesión
        </button>

        {/* 🔔 Tareas del grado */}
        {tareasGrado.length > 0 && (
          <div style={{
            position: "absolute",
            top: "300px",
            right: "40px",
            width: "400px",
            maxHeight: "400px",
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            backgroundColor: "#fff"
          }}>
            <h3 style={{ marginBottom: "10px" }}>📌 Tareas pendientes</h3>
            {tareasGrado.map((tarea, i) => (
              <div key={i} style={{
                backgroundColor: obtenerColor(tarea.fecha_entrega),
                padding: "12px",
                marginBottom: "10px",
                borderRadius: "6px",
                color: "#000",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}>
                <strong>{tarea.materia.toUpperCase()}</strong><br />
                <span>{tarea.descripcion}</span><br />
                <span><strong>Entrega:</strong> {new Date(tarea.fecha_entrega).toLocaleDateString()}</span><br />
                <span><strong>Profesor:</strong> {tarea.profesor}</span>
              </div>
            ))}
          </div>
        )}

        {/* 📚 Botones de materias */}
        <div className="botones-materias">
          {materias.map((m, index) => (
            <button
              key={index}
              onClick={() => navigate(`/estudiante/${username}/materia/${m.materia}`)}
              className="boton-materia"
            >
              {m.materia.charAt(0).toUpperCase() + m.materia.slice(1)}
              <br />
              <span style={{ fontSize: "0.8em", color: "#555" }}>
                Profesor: {m.profesor}
              </span>
            </button>
          ))}
        </div>

        {/* 📊 Notas por materia */}
        {materiaSeleccionada && (
          <div className="tabla-notas">
            <h2>Notas de {materiaSeleccionada}</h2>
            {notasMateria.length > 0 ? (
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
                  {notasMateria.map((nota, index) => (
                    <tr key={index}>
                      <td>{nota.examen1}</td>
                      <td>{nota.examen2}</td>
                      <td>{nota.examen_final}</td>
                      <td>{nota.n1}</td>
                      <td>{nota.n2}</td>
                      <td>{nota.n3}</td>
                      <td>{nota.n4}</td>
                      <td>{nota.autoevaluacion}</td>
                      <td>{nota.heteroevaluacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay notas registradas.</p>
            )}

            <TareasPendientes grado={grado} materia={materiaSeleccionada} />
          </div>
        )}
      </div>

      {/* 📝 Panel de calificación */}
      <div className="panel-calificacion">
        <h3>Calificar profesor</h3>
        <button
          className="boton-calificar"
          onClick={() => navigate(`/estudiante/${username}/calificar`)}
        >
          Calificar a tus profesores
        </button>
        <p className="texto-explicativo">
          Aquí podrás evaluar el desempeño de tu profesor durante este período académico, compartiendo tus observaciones y sugerencias para mejorar el proceso de enseñanza.
        </p>
      </div>
    </div>
  );
}

export default EstudiantePanel;


