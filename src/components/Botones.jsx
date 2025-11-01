import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./Botones.css";

function Botones({ setUsuarioActivo }) {
  const navigate = useNavigate();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const abrirModal = () => {
    setMostrarModal(true);
    setError("");
    setUsername("");
    setPassword("");
  };

  const cerrarModal = () => {
    setMostrarModal(false);
  };

  const manejarLogin = (e) => {
  e.preventDefault();

  fetch("http://localhost:5000/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password })
})
  .then(res => {
    if (!res.ok) throw new Error("Usuario o contraseña incorrectos");
    return res.json();
  })
  .then(data => {
    setUsuarioActivo(data);
    localStorage.setItem("grado", data.grado);
    localStorage.setItem("username", data.username);
    cerrarModal(); // ✅ ahora está dentro del .then

    localStorage.setItem("username", data.username);
    localStorage.setItem("rol", data.rol);
    localStorage.setItem("grado", data.grado);

    const rol = data.rol.toLowerCase();
    if (rol === "estudiante") {
      navigate("/estudiante");
    } else if (rol === "profesor") {
      navigate("/profesor");
    } else if (rol === "admin" || rol === "administrador") {
      navigate("/admin");
    } else {
      alert(`Bienvenido ${data.username} (${data.rol})`);
    }
  })
  .catch(err => setError("Usuario o contraseña incorrectos."));
};
      
  return (
    <div className="contenedor-principal">
      <div className="contenido-texto">
        <img src="/image.png" alt="Logo" className="logo" />
        <h1>Bienvenido a SIREST</h1>
        <p>Por favor, inicia sesión para continuar</p>
        <button className="boton" onClick={abrirModal}>
          Inicio de Sesión
        </button>
      </div>

      <img
        src="/bienvenido.png"
        alt="Bienvenida"
        className="imagen-bienvenida"
      />

      {mostrarModal && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="cerrar-modal" onClick={cerrarModal}>&times;</span>
            <h2>Iniciar sesión</h2>
            <form className="form-login" onSubmit={manejarLogin}>
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="error">{error}</p>}
              <button type="submit" className="boton">
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Botones;