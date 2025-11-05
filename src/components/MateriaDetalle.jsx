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
                est.examen1 ?? "", est.examen2 ?? "", est.examen_final ?? "",
                est.n1 ?? "", est.n2 ?? "", est.n3 ?? "", est.n4 ?? "",
                est.autoevaluacion ?? "", est.heteroevaluacion ?? ""
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
      console.log("🎯 Entrando al bloque de estudiante");
      fetch(`http://localhost:5000/api/grado/${usuarioActivo.username}`)
        .then(res => res.json())
        .then(({ grado }) => {
          setGradoEstudiante(grado);
          return fetch(`http://localhost:5000/api/asignaciones-estudiantes?grado=${grado}&materia=${nombre}`);
        })
        .then(res => res.json())
        .then(data => {
          console.log("📦 Datos recibidos del backend:", data);
          const est = data.find(e => e.nombre?.toLowerCase() === usuarioActivo.username?.toLowerCase());
          if (est) {
            const datosFormateados = [{
              estudiante: est.nombre,
              notas: [
                est.examen1 ?? "", est.examen2 ?? "", est.examen_final ?? "",
                est.n1 ?? "", est.n2 ?? "", est.n3 ?? "", est.n4 ?? "",
                est.autoevaluacion ?? "", est.heteroevaluacion ?? ""
              ]
            }];
            console.log("📦 Datos recibidos:", data);
            setNotas(datosFormateados);
          } else {
            console.warn("⚠️ No se encontraron notas para el estudiante en esta materia");
          }
        })
        .catch(err => console.error("❌ Error al traer notas del estudiante:", err));
    }
  }, [nombre, usuarioActivo, esProfesor, esEstudiante, grado]);

  const guardarNota = async (estudiante, materia, profesor, valores) => {
    const campos = [
      "examen1", "examen2", "examen_final",
      "n1", "n2", "n3", "n4",
      "autoevaluacion", "heteroevaluacion"
    ];

    const gradoFinal = esProfesor ? grado : gradoEstudiante;

    for (let i = 0; i < campos.length; i++) {
      const campo = campos[i];
      const valor = valores[i] === "" || valores[i] === null ? null : Number(valores[i]);

      if (valor !== undefined && valor !== null && valor !== "") {
        try {
          const res = await fetch("http://localhost:5000/api/guardar-nota", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre: estudiante,
              grado: gradoFinal,
              materia,
              campo,
              valor
            })
          });

          const resultado = await res.json();
          if (!res.ok) throw new Error(resultado.error || "No se pudo guardar la nota");
          console.log(`✅ ${campo} guardado para ${estudiante}`);
        } catch (err) {
          console.error(`❌ Error al guardar ${campo} para ${estudiante}:`, err.message);
        }
      }
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif", position: "relative" }}>
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
        onGuardarNota={(estudiante, nuevasNotas) => {
          setNotas(prev =>
            prev.map(fila =>
              fila.estudiante === estudiante
                ? { ...fila, notas: nuevasNotas }
                : fila
            )
          );
        }}
      />
    </div>
  );
}

export default MateriaDetalle;



