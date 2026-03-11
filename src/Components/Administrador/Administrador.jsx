import React, { useState, useEffect } from "react";
import "./administrador.css";

export const Administrador = () => {

  const [modulo, setModulo] = useState("inicio");
  const [bitacora, setBitacora] = useState([]);


  const cargarBitacora = async () => {
    try {
      const res = await fetch("http://localhost:3001/bitacora");
      const data = await res.json();
      setBitacora(data);
    } catch (error) {
      console.error("Error cargando bitácora:", error);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token"); // elimina token
    window.location.href = "/"; // redirige al login
  };

  useEffect(() => {
    if (modulo === "bitacora") {
      cargarBitacora();
    }
  }, [modulo]);

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>Administrador</h2>

        <button onClick={() => setModulo("bitacora")}>
          📜 Ver Bitácora
        </button>
        <button onClick={cerrarSesion}>🚪 Cerrar sesión</button>
      </div>

      {/* CONTENIDO */}
      <div className="contenido">

        {modulo === "inicio" && (
          <div className="card">
            <h2>Panel de administrador</h2>
            <p>Selecciona una opción del menú.</p>
          </div>
        )}

        {modulo === "bitacora" && (
          <div className="card">

            <h2>Bitácora del sistema</h2>

            {bitacora.length === 0 ? (
              <p>No hay registros.</p>
            ) : (
              <table className="tabla-bitacora">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Acción</th>
                    <th>Tabla</th>
                    <th>Detalle</th>
                    <th>Fecha</th>
                  </tr>
                </thead>

                <tbody>
                  {bitacora.map((b) => (
                    <tr key={b.idBitacora}>
                      <td>{b.idBitacora}</td>
                      <td>{b.idUsuario}</td>
                      <td>{b.accion}</td>
                      <td>{b.tablaAfectada}</td>
                      <td>{b.detalle}</td>
                      <td>{new Date(b.fecha).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default Administrador;