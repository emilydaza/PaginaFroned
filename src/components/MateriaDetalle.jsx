import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import NotasTabla from "./NotasTabla";

function MateriaDetalle({ usuarioActivo }) {
  const { nombre, grado } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const esProfesor = location.pathname.includes("/profesor");
  const esEstudiante = location.pathname.includes("/estudiante");

  const [notas, setNotas] = useState([]);
  const [gradoEstudiante, setGradoEstudiante] = useState(null);

  useEffect(() => {
    if (esProfesor) {
      fetch(`http://localhost:5000/api/asignaciones-estudiantes?grado=${grado}&materia=${nombre}`)
        .then(res => res.json())
        .then(data => {
          if (data.length > 0) {
            const datosFormateados = data.map(est => ({
              estudiante: est.nombre,
              notas: [
                est.examen1, est.examen2, est.examen_final,
                est.n1, est.n2, est.n3, est.n4,
                est.autoevaluacion, est.heteroevaluacion,
                ""
              ]
            }));
            setNotas(datosFormateados);
          } else {
            fetch(`http://localhost:5000/api/estudiantes-por-materia?grado=${grado}&materia=${nombre}`)
              .then(res => res.json())
              .then(estudiantes => {
                const datosVacios = estudiantes.map(est => ({
                  estudiante: est.nombre,
                  notas: ["", "", "", "", "", "", "", "", "", ""]
                }));
                setNotas(datosVacios);
              })
              .catch(err => console.error("❌ Error al traer estudiantes:", err));
          }
        })
        .catch(err => console.error("❌ Error al traer notas del grado:", err));
    }

    if (esEstudiante && usuarioActivo?.username) {
      fetch(`http://localhost:5000/api/grado/${usuarioActivo.username}`)
        .then(res => res.json())
        .then(({ grado }) => {
          setGradoEstudiante(grado);
          return fetch(`http://localhost:5000/api/notas/${grado}/${usuarioActivo.username}`);
        })
        .then(res => res.json())
        .then(data => {
          const datosFormateados = data.map(est => ({
            estudiante: est.nombre,
            notas: [
              est.examen1, est.examen2, est.examen_final,
              est.n1, est.n2, est.n3, est.n4,
              est.autoevaluacion, est.heteroevaluacion,
              ""
            ]
          }));
          setNotas(datosFormateados);
        })
        .catch(err => console.error("❌ Error al traer notas del estudiante:", err));
    }
  }, [nombre, usuarioActivo, esProfesor, esEstudiante, grado]);

  const guardarNota = async (estudiante, materia, profesor, valores) => {
    try {
      const payload = {
        nombre: estudiante,
        materia,
        grado: esProfesor ? grado : gradoEstudiante,
        examen1: valores[0],
        examen2: valores[1],
        examen_final: valores[2],
        n1: valores[3],
        n2: valores[4],
        n3: valores[5],
        n4: valores[6],
        autoevaluacion: valores[7],
        heteroevaluacion: valores[8]
      };

      const res = await fetch("http://localhost:5000/api/notas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const resultado = await res.json();
      if (!res.ok) throw new Error(resultado.mensaje || "No se pudo guardar la nota");
      console.log("✅ Nota registrada para", estudiante);
    } catch (err) {
      console.error("❌ Error al guardar nota:", err.message);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif", position: "relative" }}>
      {/* 🔴 Botón de cerrar sesión */}
      <button
        onClick={() => {
          localStorage.clear();
          navigate("/");
        }}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 20px",
          backgroundColor: "#e74c3c",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
          zIndex: 1000
        }}
      >
        Cerrar sesión
      </button>

      <h1>
        Materia: {nombre.charAt(0).toUpperCase() + nombre.slice(1)}
        {esProfesor && ` - Profesor`}
        {esEstudiante && gradoEstudiante && ` - Grado ${gradoEstudiante}`}
      </h1>

      <NotasTabla
        materia={nombre}
        grado={esProfesor ? grado : gradoEstudiante}
        editable={esProfesor}
        notas={notas}
        onGuardarNota={(estudiante, valores) =>
          guardarNota(estudiante, nombre, localStorage.getItem("username"), valores)
        }
      />
    </div>
  );
}

export default MateriaDetalle;


