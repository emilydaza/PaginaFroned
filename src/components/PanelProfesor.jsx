import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PanelProfesor({ usuarioActivo }) {
  const [asignaciones, setAsignaciones] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
  const [gradoSeleccionado, setGradoSeleccionado] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/api/asignaciones?profesor=${usuarioActivo?.username}`)
      .then(res => res.json())
      .then(data => setAsignaciones(data))
      .catch(err => console.error("❌ Error al cargar asignaciones:", err));
  }, [usuarioActivo]);

  const enviarTarea = async (e) => {
    e.preventDefault();
    if (!materiaSeleccionada || !gradoSeleccionado) {
      alert("⚠️ Debes seleccionar una materia y un grado");
      return;
    }

    const tarea = {
      profesor: usuarioActivo.username,
      grado: gradoSeleccionado,
      materia: materiaSeleccionada,
      fecha_entrega: fechaEntrega,
      descripcion
    };

    const res = await fetch("http://localhost:5000/api/tareas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tarea)
    });

    if (res.ok) {
      setMensaje("✅ Tarea enviada correctamente");
      setDescripcion("");
      setFechaEntrega("");
      setGradoSeleccionado("");
      setMateriaSeleccionada(null);
    } else {
      setMensaje("❌ Error al enviar la tarea");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#10164d", color: "white", padding: "40px", position: "relative" }}>
      
      {/* 🔴 Botón de cerrar sesión */}
      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = "/";
 // ajusta si tu login está en otra ruta
        }}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px 15px",
          backgroundColor: "#e74c3c",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          zIndex: 1000
        }}
      >
        Cerrar sesión
      </button>

      {/* 🔵 Lado izquierdo: materias */}
      <div style={{ width: "35%", paddingRight: "30px" }}>
        <h2>📚 Materias de {usuarioActivo?.username}</h2>
        {asignaciones.map((a, i) => (
          <button
            key={i}
            onClick={() => {
              navigate(`/profesor/materia/${encodeURIComponent(a.materia)}`);
            }}
            style={{
              display: "block",
              width: "100%",
              marginBottom: "15px",
              padding: "12px",
              backgroundColor: "#ffffff",
              color: "#10164d",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            {a.materia.charAt(0).toUpperCase() + a.materia.slice(1)}
          </button>
        ))}
      </div>

      {/* ⚪ Lado derecho: formulario */}
      <div style={{ width: "65%", backgroundColor: "#f9f9f9", color: "#000", padding: "30px", borderRadius: "10px" }}>
        <h2>📤 Crear tarea</h2>

        <form onSubmit={enviarTarea}>
          <label>Materia seleccionada:</label><br />
          <input
            type="text"
            value={materiaSeleccionada || ""}
            readOnly
            placeholder="Selecciona una materia a la izquierda"
            style={{ width: "100%", marginBottom: "15px", padding: "10px" }}
          />

          <label>Grado:</label><br />
          <select
            value={gradoSeleccionado}
            onChange={(e) => setGradoSeleccionado(e.target.value)}
            required
            style={{ width: "100%", marginBottom: "15px", padding: "10px" }}
          >
            <option value="">Selecciona un grado</option>
            {[
              "1-1", "1-2", "2-1", "2-2", "3-1", "3-2", "4-1", "4-2",
              "5-1", "5-2", "6-1", "6-2", "7-1", "7-2", "8-1", "8-2",
              "9-1", "9-2", "10-1", "10-2", "11-1", "11-2"
            ].map((grado, i) => (
              <option key={i} value={grado}>{grado}</option>
            ))}
          </select>

          <label>Fecha de entrega:</label><br />
          <input
            type="date"
            value={fechaEntrega}
            onChange={(e) => setFechaEntrega(e.target.value)}
            required
            style={{ width: "100%", marginBottom: "15px", padding: "10px" }}
          />

          <label>Descripción:</label><br />
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={5}
            required
            style={{ width: "100%", marginBottom: "20px", padding: "10px" }}
          />

          <button
            type="submit"
            style={{
              padding: "12px 24px",
              backgroundColor: "#10164d",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Enviar tarea
          </button>
        </form>

        {mensaje && <p style={{ marginTop: "20px", color: "green" }}>{mensaje}</p>}

        {materiaSeleccionada && gradoSeleccionado && (
          <button
            onClick={() => navigate(`/profesor/materia/${materiaSeleccionada}/grado/${gradoSeleccionado}`)}
            style={{
              marginTop: "30px",
              padding: "12px 24px",
              backgroundColor: "#4f65c7",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            Calificar estudiantes
          </button>
        )}
      </div>
    </div>
  );
}

export default PanelProfesor;



