import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import './styles.css';


import Botones from "./components/Botones";


import AdminPanel from "./components/AdminPanel";
import Profesor from "./components/Profesor";
import EstudiantePanel from "./components/EstudiantePanel";
import CalificarProfesor from "./components/CalificarProfesor";


import MateriaDetalle from "./components/MateriaDetalle";
import MateriaGrados from "./components/MateriaGrados";
import CrearTarea from "./components/CrearTarea";
import PanelProfesor from "./components/PanelProfesor";
import ProfesorGrado from "./components/ProfesorGrado";
import NotasTabla from "./components/NotasTabla";
import NotasEstudianteMateria from "./components/NotasEstudianteMateria";



function App() {
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  return (
    <Router>
      <div>
        <center><h1>SIREST</h1></center>
        <Routes> 
          <Route path="/" element={<Botones setUsuarioActivo={setUsuarioActivo} />} />
          <Route path="/admin/*" element={<AdminPanel usuarioActivo={usuarioActivo} />} />

          <Route path="/profesor" element={<Profesor usuarioActivo={usuarioActivo} />} />
          <Route path="/estudiante" element={<EstudiantePanel usuarioActivo={usuarioActivo} />} />
          <Route path="/profesor/materia/:nombre" element={<MateriaGrados usuarioActivo={usuarioActivo} />} />
          <Route path="/profesor/materia/:nombre/grado/:grado" element={<MateriaDetalle />} />
          <Route path="/profesor/materia/:nombre/grado/:grado/tarea" element={<CrearTarea usuarioActivo={usuarioActivo} />} />
          <Route path="/estudiante/materia/:nombre" element={<MateriaDetalle usuarioActivo={usuarioActivo} />} />
          <Route path="/estudiante/materia/:nombre/grado/:grado" element={<MateriaDetalle usuarioActivo={usuarioActivo} />} />
          <Route path="/estudiante/:username/calificar" element={<CalificarProfesor usuarioActivo={usuarioActivo} />} />
          <Route path="/profesor/panel" element={<PanelProfesor usuarioActivo={usuarioActivo} />} />
          <Route path="/profesor/materia/:materia/grado/:grado" element={<ProfesorGrado />} />
          <Route path="/profesor/:materia/:grado" element={<NotasTabla />} />
          <Route path="/estudiante/:username/materia/:nombreMateria" element={<NotasEstudianteMateria />} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
