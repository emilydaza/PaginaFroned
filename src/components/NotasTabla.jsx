import React from "react";

function NotasTabla({ materia, grado, editable, notas, onGuardarNota }) {
  if (!notas || notas.length === 0) {
    return <p style={{ color: "white" }}>No hay notas registradas.</p>;
  }
  const guardarTodasLasNotas = async () => {
  for (const fila of notas) {
    const campos = ["examen1", "examen2", "examen_final", "n1", "n2", "n3", "n4", "autoevaluacion", "heteroevaluacion"];
    for (let i = 0; i < campos.length; i++) {
      const campo = campos[i];
      const valor = fila.notas[i];

      try {
        await fetch("http://localhost:5000/api/guardar-nota", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            nombre: fila.estudiante,
            grado,
            materia,
            profesor: "Freddy Rosero", 
            campo,
            valor
          })
        });
      } catch (err) {
        console.error(`❌ Error al guardar ${campo} de ${fila.estudiante}:`, err);
      }
    }
  }

  alert("✅ Todas las notas fueron guardadas");
};

  return (
    <div style={{ overflowX: "auto", marginTop: "30px" }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: "#10164d",
        color: "#ccc",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }}>
        <thead style={{ backgroundColor: "#10164d", color: "white" }}>
          <tr>
            <th style={thStyle}>Estudiante</th>
            <th style={thStyle}>Examen 1</th>
            <th style={thStyle}>Examen 2</th>
            <th style={thStyle}>Examen Final</th>
            <th style={thStyle}>N1</th>
            <th style={thStyle}>N2</th>
            <th style={thStyle}>N3</th>
            <th style={thStyle}>N4</th>
            <th style={thStyle}>Autoevaluación</th>
            <th style={thStyle}>Heteroevaluación</th>
            <th style={thStyle}>Promedio</th>
          </tr>
        </thead>
        <tbody>
          {notas.map((fila, i) => (
            <tr key={i}>
              <td style={tdStyle}>{fila.estudiante}</td>
              {fila.notas.slice(0, 9).map((valor, j) => (
                <td key={j} style={tdStyle}>
                  {editable ? (
                    <input
                      type="number"
                      value={valor}
                      onChange={(e) => {
                        const nuevasNotas = [...fila.notas];
                        const entrada = e.target.value;

                        nuevasNotas[j] = entrada === "" ? null : Number(entrada);
                        onGuardarNota(fila.estudiante, nuevasNotas);
                      }}
                      style={inputStyle}
                    />

                  ) : (
                    valor
                  )}
                </td>
              ))}
              <td style={tdStyle}>
                {
                  (() => {
                    const nums = fila.notas.slice(0, 10).map(n => parseFloat(n)).filter(n => !isNaN(n));
                    if (nums.length === 0) return "";
                    const promedio = nums.reduce((a, b) => a + b, 0) / nums.length;
                    return promedio.toFixed(2);
                  })()
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  {editable && (
    <button
      onClick={() => guardarTodasLasNotas()}
      style={{
        marginTop: "20px",
        padding: "10px 20px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
      }}
    >
      Guardar todas las notas
    </button>
  )}

    </div>
  );
}

const thStyle = {
  padding: "12px",
  border: "1px solid #ccc",
  textAlign: "center"
};

const tdStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  textAlign: "center"
};

const inputStyle = {
  width: "60px",
  padding: "6px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  backgroundColor: "#f9f9f9",
  color: "#000"
};

export default NotasTabla;


