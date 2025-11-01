import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function MateriaGrados() {
  const { nombre } = useParams();
  const navigate = useNavigate();
  const [grados, setGrados] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const nombreProfesor = localStorage.getItem("username");
    const materiaNormalizada = nombre
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/-/g, " ")
      .toLowerCase();

    fetch(`http://localhost:5000/api/profesor/${nombreProfesor}/materia/${materiaNormalizada}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudieron cargar los grados");
        return res.json();
      })
      .then((data) => setGrados(data.grados || []))
      .catch((err) => {
        console.error("❌ Error al obtener grados:", err);
        setError("No se pudieron cargar los grados.");
      });
  }, [nombre]);

  const irAGrado = (grado) => {
    navigate(`/profesor/materia/${nombre}/grado/${grado}`);
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

      <h1 style={{ color: "#ffffffff" }}>
        {nombre.replace(/-/g, " ").charAt(0).toUpperCase() + nombre.replace(/-/g, " ").slice(1)} - Selecciona un grado
      </h1>
      <div style={{ marginTop: "20px" }}>
        {grados.length > 0 ? (
          grados.map((grado, index) => (
            <button
              key={index}
              onClick={() => irAGrado(grado)}
              style={{
                padding: "10px 20px",
                margin: "10px",
                fontSize: "16px",
                cursor: "pointer",
                backgroundColor: "#003366",
                color: "#fff",
                border: "none",
                borderRadius: "4px"
              }}
            >
              {grado}
            </button>
          ))
        ) : (
          <p style={{ color: "#fff" }}>{error || "Cargando grados..."}</p>
        )}
      </div>
    </div>
  );
}

export default MateriaGrados;


