import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CalificarProfesor.css";

function CalificarProfesor() {
  const estudiante = localStorage.getItem("username");
  const [materias, setMaterias] = useState([]);
  const [grado, setGrado] = useState("");
  const [materiaSeleccionada, setMateriaSeleccionada] = useState("");
  const [profesor, setProfesor] = useState("");
  const [comentario, setComentario] = useState("");
  const [calificacion, setCalificacion] = useState(5);
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  // Obtener grado del estudiante
  useEffect(() => {
    const obtenerGrado = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/estudiante/${estudiante}/grado`);
        const data = await res.json();
        setGrado(data.grado);
      } catch (err) {
        console.error("❌ Error al obtener grado:", err);
      }
    };

    if (estudiante) {
      obtenerGrado();
    }
  }, [estudiante]);

  // Obtener materias del grado
  useEffect(() => {
    const obtenerMaterias = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/materias-por-grado/${grado}`);
        const data = await res.json();
        setMaterias(data);
      } catch (err) {
        console.error("❌ Error al obtener materias:", err);
      }
    };

    if (grado) {
      obtenerMaterias();
    }
  }, [grado]);

 
  useEffect(() => {
    if (!materiaSeleccionada || materias.length === 0) return;

    const materiaObj = materias.find(m => m.materia === materiaSeleccionada);
    if (materiaObj) {
      setProfesor(materiaObj.profesor);
    } else {
      setProfesor("");
    }
  }, [materiaSeleccionada, materias]);
  

  // Enviar opinión
  const enviarOpinion = async (e) => {
    e.preventDefault();
    console.log("📤 Enviando opinión:", {
      estudiante,
      profesor,
      materia: materiaSeleccionada,
      comentario,
      calificacion
    });
    const res = await fetch("http://localhost:5000/api/opiniones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        estudiante,
        profesor,
        materia: materiaSeleccionada,
        comentario,
        calificacion
      })
    });

    if (res.ok) {
      setMensaje("✅ Opinión enviada correctamente");
      setComentario("");
      setCalificacion(5);
      setMateriaSeleccionada("");
      setTimeout(() => navigate("/estudiante"), 2000);
    } else {
      setMensaje("❌ Error al enviar opinión");
    }
  };

  return (
    <div className="formulario-calificacion">
      <h2>Calificar a tus profesores</h2>

      <form onSubmit={enviarOpinion}>
        <label htmlFor="materia">Materia:</label>
        <select
          id="materia"
          value={materiaSeleccionada}
          onChange={(e) => setMateriaSeleccionada(e.target.value)}
          required
        >
          <option value="">Selecciona una materia</option>
          {materias.map((m, i) => (
            <option key={i} value={m.materia}>
              {m.materia.charAt(0).toUpperCase() + m.materia.slice(1)} - Prof. {m.profesor}
            </option>
          ))}
        </select>

        <label htmlFor="comentario">Comentario:</label>
        <textarea
          id="comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          rows={4}
          placeholder="Escribe tu opinión sobre el profesor"
        />

        <label htmlFor="calificacion">Calificación (1 a 5):</label>
        <input
          type="number"
          id="calificacion"
          min="1"
          max="5"
          value={calificacion}
          onChange={(e) => setCalificacion(e.target.value)}
          required
        />

        <button type="submit">Enviar opinión</button>
      </form>

      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
}

export default CalificarProfesor;
