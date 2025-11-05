import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profesor.css";

function Profesor() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const [materias, setMaterias] = useState([]);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState(null);
  const [gradoSeleccionado, setGradoSeleccionado] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    fetch(`http://localhost:5000/api/profesor/${username}/materias`)
      .then(res => res.json())
      .then(data => setMaterias(data.materias || []))
      .catch(err => {
        console.error("❌ Error al obtener materias:", err);
        setError("Error al cargar tus materias.");
      });
  }, [username]);

  const enviarTarea = async (e) => {
    e.preventDefault();

    if (!materiaSeleccionada || !gradoSeleccionado) {
      alert("⚠️ Debes seleccionar una materia y un grado");
      return;
    }

    const tarea = {
      profesor: username,
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
    <div className="contenedor-profesor" style={{ display: "flex", justifyContent: "space-between", minHeight: "100vh", backgroundColor: "#4f65c7", color: "white", padding: "40px", position: "relative" }}>


      <div style={{ width: "35%", paddingRight: "30px" }}>
        <h2>Bienvenido, Profesor {username}</h2>
        <p>Aquí puedes gestionar clases, notas y tareas.</p>

        <h3>Materias asignadas</h3>
        {materias.map((materia, index) => (
          <button
            key={index}
            onClick={() => {
              const materiaNormalizada = materia
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, "-")
                .toLowerCase();

              navigate(`/profesor/materia/${materiaNormalizada}`);
            }}
            className="boton-materia"
            style={{
              display: "block",
              marginBottom: "10px",
              backgroundColor: "#10164d",
              color: "#fff",
              padding: "16px 24px",
              fontSize: "18px",
              width: "100%",
              borderRadius: "8px",
              fontWeight: "bold",
              border: "none",
              cursor: "pointer",
              textAlign: "center"
            }}
          >
            {materia.charAt(0).toUpperCase() + materia.slice(1)}
          </button>
        ))}


        <button
          onClick={() => {
            localStorage.clear();
            navigate("/"); 
          }}
          style={{
            marginTop: "30px",
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
      </div>


      <div style={{ width: "50%", backgroundColor: "#f9f9f9", color: "#000", padding: "30px", borderRadius: "10px" }}>
        <h2>📤 Crear recordatorio</h2>

        <form onSubmit={enviarTarea}>
          <label>Materia:</label><br />
          <select
            value={materiaSeleccionada || ""}
            onChange={(e) => setMateriaSeleccionada(e.target.value)}
            required
            style={{ width: "100%", marginBottom: "15px", padding: "10px" }}
          >
            <option value="">Selecciona una materia</option>
            {materias.map((materia, i) => (
              <option key={i} value={materia}>
                {materia.charAt(0).toUpperCase() + materia.slice(1)}
              </option>
            ))}
          </select>

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

          <label>Descripción de la tarea:</label><br />
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={5}
            placeholder="Escribe aquí los detalles de la tarea..."
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
        {error && <p style={{ marginTop: "20px", color: "red" }}>{error}</p>}
      </div>
    </div>
  );
}

export default Profesor;


