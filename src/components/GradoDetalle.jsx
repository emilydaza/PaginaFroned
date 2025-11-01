import React from "react";
import { useParams } from "react-router-dom";
import NotasTabla from "./NotasTabla";

function GradoDetalle() {
  const { nombre, grado } = useParams();

  return (
    <div style={{ padding: "40px", fontFamily: "Arial, sans-serif" }}>
      <h1>
        {nombre.charAt(0).toUpperCase() + nombre.slice(1)} - Grado {grado}
      </h1>
      <NotasTabla materia={nombre} grado={grado} role="profesor" />
    </div>
  );
}

export default GradoDetalle;
