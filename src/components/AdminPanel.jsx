import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function AdminPanel({ usuarioActivo }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [filtro, setFiltro] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("estudiante");
  const [usuarios, setUsuarios] = useState([]);
  const [opiniones, setOpiniones] = useState([]);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const cargarUsuarios = () => {
    fetch("http://localhost:5000/api/usuarios")
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error("❌ Error al cargar usuarios:", err));
  };

  const cargarOpiniones = () => {
    fetch("http://localhost:5000/api/opiniones")
      .then(res => res.json())
      .then(data => setOpiniones(data))
      .catch(err => console.error("❌ Error al cargar opiniones:", err));
  };

  useEffect(() => {
    cargarUsuarios();
    cargarOpiniones();
  }, []);

  const crearUsuario = () => {
    if (!username || !password) {
      alert("⚠️ Debes llenar todos los campos");
      return;
    }

    fetch("http://localhost:5000/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, rol })
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al crear usuario");
        return res.text();
      })
      .then(msg => {
        alert(msg);
        setUsername("");
        setPassword("");
        setRol("estudiante");
        cargarUsuarios();
      })
      .catch(err => alert("❌ No se pudo crear el usuario"));
  };

  const eliminarUsuario = (nombre) => {
    if (!window.confirm(`¿Eliminar a ${nombre}?`)) return;

    fetch(`http://localhost:5000/api/usuarios/${nombre}`, {
      method: "DELETE"
    })
      .then(res => res.text())
      .then(msg => {
        alert(msg);
        cargarUsuarios();
      })
      .catch(err => alert("❌ No se pudo eliminar el usuario"));
  };

  const vaciarOpiniones = () => {
    if (!window.confirm("¿Estás seguro de que quieres borrar TODAS las opiniones?")) return;

    fetch("http://localhost:5000/api/opiniones", {
      method: "DELETE"
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al borrar opiniones");
        return res.text();
      })
      .then(msg => {
        alert(msg);
        cargarOpiniones();
      })
      .catch(err => alert("❌ No se pudieron borrar las opiniones"));
  };

  const handleArchivoExcel = async (e) => {
    const archivo = e.target.files[0];
    const formData = new FormData();
    formData.append("archivo", archivo);

    const res = await fetch("http://localhost:5000/api/usuarios/carga-masiva", {
      method: "POST",
      body: formData
    });

    const resultado = await res.text();
    alert(resultado);
    cargarUsuarios();
  };

  const abrirModal = (usuario) => {
    setUsuarioEditando(usuario);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setUsuarioEditando(null);
    setMostrarModal(false);
  };

  const handleGuardarEdicion = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/usuarios/${usuarioEditando.username}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuarioEditando),
      });

      if (res.ok) {
        alert("✅ Usuario actualizado");
        cerrarModal();
      // Recargar usuarios si quieres
      } else {
       alert("❌ Error al actualizar usuario");
     }
   } catch (err) {
     console.error("❌ Error al guardar edición:", err);
   }
 };

  


  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            backgroundColor: "#FF3333",
            color: "white",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Cerrar sesión
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Gestión de Usuarios</h1>
        <input
          type="file"
          name="archivo"
          accept=".xlsx, .xls"
          onChange={handleArchivoExcel}
          style={{
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "16px"
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "40px", alignItems: "flex-start" }}>
        {location.pathname === "/admin" && (
          <div style={{ flex: "1" }}>
            <div style={{
              maxWidth: "450px",
              margin: "20px 0 30px 0",
              padding: "25px",
              backgroundColor: "#4f65c7",
              borderRadius: "10px",
              boxShadow: "0 0 15px rgba(0,0,0,0.1)",
              fontFamily: "Arial, sans-serif"
            }}>
              <h3 style={{ marginBottom: "20px", color: "#10164d", fontSize: "22px" }}>Añadir Usuario</h3>

              <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={e => setUsername(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "15px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "16px"
                }}
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "15px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "15px"
                }}
              />

              <select
                value={rol}
                onChange={e => setRol(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "20px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "15px",
                  backgroundColor: "#f0f0f0"
                }}
              >
                <option value="estudiante">Estudiante</option>
                <option value="profesor">Profesor</option>
                <option value="admin">Administrador</option>
              </select>

              <button
                onClick={crearUsuario}
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: "#10164d",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "background-color 0.3s"
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#0c1240"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#10164d"}
              >
                Crear usuario
              </button>
            </div>

            <button
              onClick={() => navigate("/admin/seguimiento-docentes")}
              style={{
                padding: "14px 28px",
                backgroundColor: "#10164d",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                marginTop: "20px"
              }}
            >
              📊 Seguimiento de docentes
            </button>
          </div>
        )}

        <div style={{ flex: "2" }}>
          {location.pathname === "/admin" && (
            <>
              <h3>Lista de Usuarios</h3>
              <input
                type="text"
                placeholder="Buscar estudiante..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "20px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "16px"
                }}
              />

              <table border="1" cellPadding="10" style={{ backgroundColor: "#10164dff", color: "white", width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ border: "1px solid white" }}>Usuario</th>
                    <th style={{ border: "1px solid white" }}>Rol</th>
                    <th style={{ border: "1px solid white" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios
                    .filter(u => u.username.toLowerCase().includes(filtro.toLowerCase()))
                    .map(u => (
                      <tr key={u.username}>
                        <td style={{ border: "1px solid white" }}>{u.username}</td>
                        <td style={{ border: "1px solid white" }}>{u.rol}</td>
                        <td style={{ border: "1px solid white" }}>
                          <button onClick={() => eliminarUsuario(u.username)}>Eliminar</button>
                          <button 
                            onClick={() => abrirModal(u)}
                            style={{
                              backgroundColor: "#6c757d", // 💙 Cambia este color al que tú quieras
                              color: "white",
                              border: "none",
                              padding: "8px 12px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontWeight: "bold",
                              marginLeft: "10px"
                              
                            }}
                          >
                            Editar
                          </button>

                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {usuarioEditando && (
                <form onSubmit={handleGuardarEdicion} style={{ marginTop: "20px" }}>
                  <h3>Editar usuario</h3>
                  <input
                    type="text"
                    value={usuarioEditando.username}
                    onChange={(e) =>
                      setUsuarioEditando({ ...usuarioEditando, username: e.target.value })
                    }
                    placeholder="Nuevo nombre"
                  />
                  <input
                    type="password"
                    value={usuarioEditando.password || ""}
                    onChange={(e) =>
                      setUsuarioEditando({ ...usuarioEditando, password: e.target.value })
                    }
                    placeholder="Nueva contraseña"
                  />
                  <select
                    value={usuarioEditando.rol}
                    onChange={(e) =>
                      setUsuarioEditando({ ...usuarioEditando, rol: e.target.value })
                    }
                  >
                    <option value="estudiante">Estudiante</option>
                    <option value="profesor">Profesor</option>
                    <option value="admin">Administrador</option>
                  </select>
                  <button type="submit" className="btn btn-success">Guardar</button>
                  <button type="button" onClick={() => setUsuarioEditando(null)} className="btn btn-secondary">Cancelar</button>
                </form>
              )}
            </>
          )}

          {location.pathname === "/admin/seguimiento-docentes" && (
            <>
              <h3>Opiniones de estudiantes</h3>
              {opiniones.length === 0 ? (
                <p style={{ color: "#ccc" }}>No hay opiniones registradas aún.</p>
              ) : (
                <table border="1" cellPadding="10" style={{ backgroundColor: "#f0f0f0", width: "100%", borderCollapse: "collapse", color: "#10164d" }}>
                  <thead>
                    <tr>
                      <th>Materia</th>
                      <th>Profesor</th>
                      <th>Comentario</th>
                      <th>Calificación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {opiniones.map((op, i) => (
                      <tr key={i}>
                        <td>{op.materia}</td>
                        <td>{op.profesor}</td>
                        <td>{op.comentario}</td>
                        <td>{op.calificacion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )} {/* ✅ Aquí se cerró correctamente el bloque */}


              <button
                onClick={() => navigate("/admin")}
                style={{
                  marginTop: "30px",
                  padding: "12px 24px",
                  backgroundColor: "#10164d",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                🔙 Volver al panel principal
              </button>
              <button
                onClick={vaciarOpiniones}
                style={{
                  marginTop: "15px",
                  padding: "12px 24px",
                  backgroundColor: "#c70000",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                Vaciar opiniones
              </button>
            </>
          )}
          {mostrarModal && (
            <div className="modal show d-block" tabIndex="-1" role="dialog" style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 9999,
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <form onSubmit={handleGuardarEdicion}>
                    <div className="modal-header">
                      <h5 className="modal-title">Editar usuario</h5>
                      <button type="button" className="close" onClick={cerrarModal}>
                        <span>&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <input
                        type="text"
                        value={usuarioEditando.username}
                        onChange={(e) =>
                          setUsuarioEditando({ ...usuarioEditando, username: e.target.value })
                        }
                        placeholder="Nuevo nombre"
                        className="form-control mb-2"
                      />
                      <input
                        type="password"
                        value={usuarioEditando.password || ""}
                        onChange={(e) =>
                          setUsuarioEditando({ ...usuarioEditando, password: e.target.value })
                        }
                        placeholder="Nueva contraseña"
                        className="form-control mb-2"
                      />
                      <select
                        value={usuarioEditando.rol}
                        onChange={(e) =>
                          setUsuarioEditando({ ...usuarioEditando, rol: e.target.value })
                        }
                        className="form-control"
                      >
                        <option value="estudiante">Estudiante</option>
                        <option value="profesor">Profesor</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                    <div className="modal-footer">
                      <button type="submit" className="btn btn-success">Aceptar</button>
                      <button type="button" className="btn btn-secondary" onClick={cerrarModal}>Cancelar</button>
                    </div>
                  </form>
                 </div>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
