import React, { useState, useEffect } from "react";

function CrearTarea({ usuarioActivo }) {
  const [gradoSeleccionado, setGradoSeleccionado] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [gradosDisponibles, setGradosDisponibles] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // 🔍 Cargar grados que el profesor tiene asignados
  useEffect(() => {
    fetch(`http://localhost:5000/api/grados-profesor?nombre=${usuarioActivo?.username}`)
      .then(res => res.json())
      .then(data => setGradosDisponibles(data.grados || []))
      .catch(err => console.error("❌ Error al cargar grados:", err));
  }, [usuarioActivo]);

  const enviarTarea = async (e) => {
    e.preventDefault();

    const tarea = {
      profesor: usuarioActivo.username,
      grado: gradoSeleccionado,
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
    } else {
      setMensaje("❌ Error al enviar la tarea");
    }
  };

  return (
    <div style={{
      maxWidth: "600px",
      margin: "40px auto",
      padding: "30px",
      border: "2px solid #10164d",
      borderRadius: "10px",
      backgroundColor: "#f9f9f9"
    }}>
      <h2 style={{ marginBottom: "20px" }}>📤 Crear tarea para tus estudiantes</h2>

      <form onSubmit={enviarTarea}>
        <label>Grado:</label><br />
        <select
          value={gradoSeleccionado}
          onChange={(e) => setGradoSeleccionado(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "15px" }}
        >
          <option value="">Selecciona un grado</option>
          {gradosDisponibles.map((g, i) => (
            <option key={i} value={g}>{g}</option>
          ))}
        </select>

        <label>Fecha de entrega:</label><br />
        <input
          type="date"
          value={fechaEntrega}
          onChange={(e) => setFechaEntrega(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "15px" }}
        />

        <label>Descripción de la tarea:</label><br />
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={5}
          placeholder="Escribe aquí los detalles de la tarea..."
          required
          style={{ width: "100%", marginBottom: "20px" }}
        />

        <button type="submit" style={{ padding: "10px 20px" }}>Enviar tarea</button>
      </form>

      {mensaje && <p style={{ marginTop: "20px", color: "green" }}>{mensaje}</p>}
    </div>
  );
}

export default CrearTarea;

