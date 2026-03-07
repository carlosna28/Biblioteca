import { useEffect, useState } from "react";
import "./inicio.css";

export const Inicio = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const [libros, setLibros] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [multas, setMultas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [vistaPrestamos, setVistaPrestamos] = useState("prestamos"); // activa por defecto al ingresar
  const [busqueda, setBusqueda] = useState(""); // estado para el buscador de libros
  const [resultados, setResultados] = useState([]);
  const usuarioBloqueado = multas.some(m => !m.pagada);

  // ===============================
  // 📚 OBTENER LIBROS
  // ===============================
  const obtenerLibros = async () => {
    try {
      const res = await fetch("http://localhost:3001/libros");
      const data = await res.json();
      setLibros(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ===============================
  // 📦 MIS PRÉSTAMOS
  // ===============================
  const obtenerPrestamos = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/mis-prestamos/${usuario.id}`
      );
      const data = await res.json();
      setPrestamos(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ===============================
  // 💸 MIS MULTAS
  // ===============================
  const obtenerMultas = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/mis-multas/${usuario.id}`
      );
      const data = await res.json();
      setMultas(data);
    } catch (err) {
      console.error(err);
    }
  };
  //reserva
  const obtenerReservas = async () => {
    try {
      const res = await fetch(
        `http://localhost:3001/mis-reservas/${usuario.id}`
      );
      const data = await res.json();
      setReservas(data);
    } catch (err) {
      console.error(err);
    }
  };
  //reserva
  const reservarLibro = async (idLibro) => {
    try {
      const res = await fetch("http://localhost:3001/reserva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idUsuario: usuario.id,
          idLibro
        })
      });

      const data = await res.json();
      setMensaje(data.message);
      obtenerReservas();
    } catch (err) {
      console.error(err);
    }
  };
  //multas
  const revisarMultas = async () => {
    try {
      await fetch("http://localhost:3001/revisar-multas", {
        method: "POST"
      });

      obtenerMultas();
    } catch (err) {
      console.error(err);
    }
  };
  // ===============================
  // 💳 PAGAR MULTA
  // ===============================
  const pagarMulta = async (idMulta) => {
    try {
      const res = await fetch(
        `http://localhost:3001/pagar-multa/${idMulta}`,
        { method: "PUT" }
      );

      const data = await res.json();
      setMensaje(data.message);

      obtenerMultas();
      obtenerPrestamos(); // 🔥 por si desbloquea préstamos
    } catch (err) {
      console.error(err);
    }
  };
  //ACEPTAR RESERVA
  const aceptarReserva = async (idReserva) => {
    try {
      const res = await fetch(
        `http://localhost:3001/reserva/aceptar/${idReserva}`,
        { method: "POST" }
      );

      const data = await res.json();
      setMensaje(data.message);

      obtenerReservas();
      obtenerPrestamos();
    } catch (err) {
      console.error(err);
    }
  };
  // ===============================
  // 🔄 CARGA INICIAL
  // ===============================
  useEffect(() => {
    revisarMultas();   // 🔥 genera multas si hay retrasos
    obtenerLibros();
    obtenerPrestamos();
    obtenerMultas();
    obtenerReservas();
  }, []);

  //buscar libro 
  const buscarLibros = async (titulo) => {
    if (!titulo) {
      setResultados([]);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3001/libros/buscar?titulo=${titulo}`
      );
      const data = await res.json();
      setResultados(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Buscar cada vez que cambie el input
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      buscarLibros(busqueda);
    }, 300); // debounce de 300ms

    return () => clearTimeout(delayDebounce);
  }, [busqueda]);

  return (
    <div className="upx-wrapper">
      <div className="upx-header">
        <h2 className="upx-title">Mi Biblioteca</h2>
        <p className="upx-subtitle">Gestiona tus libros, préstamos y multas</p>
      </div>

      {mensaje && <div className="upx-alert">{mensaje}</div>}
      {usuarioBloqueado && (
        <div className="upx-alert" style={{ background: "#7f1d1d" }}>
          ⚠ Tu cuenta está bloqueada por multas pendientes.
          Debes acudir con el bibliotecario para pagar la multa.
        </div>
      )}
      {usuarioBloqueado && (
        <div className="upx-alert"style={{ background: "#7f1d1d" }} >
          ⚠ Cuenta bloqueada por {multas.filter(m => !m.pagada).length} multa(s)
        </div>
      )}

      <div className="upx-container">

        {/* LIBROS */}

        {/* LIBROS CON BUSCADOR */}
        <section className="upx-section">
          <h3 className="upx-section-title">Libros Disponibles</h3>

          {/* Buscador */}
          <input
            type="text"
            placeholder="Buscar libro..."
            className="upx-search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <div className="upx-list">
            {busqueda === "" ? (
              <div className="upx-empty">
                Escribe el nombre del libro para buscar
              </div>
            ) : resultados.length === 0 ? (
              <div className="upx-empty">No se encontraron libros</div>
            ) : (
              resultados.map((l) => (
                <div key={l.idLibro} className="upx-row">
                  <div>
                    <span className="upx-main-text">{l.titulo}</span>
                    <br />
                    <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                      Autor: {l.autor} | Año: {l.anioPublicacion}
                    </span>

                    {/* Mostrar ejemplares */}
                    <div style={{ marginTop: "10px", fontSize: "13px" }}>

                      {(() => {
                        const ejemplares = l.ejemplares || [];

                        const disponibles = ejemplares.filter(e => e.idEstado === 1);
                        const noDisponibles = ejemplares.filter(e => e.idEstado !== 1);

                        // 🔹 Si hay ejemplares disponibles
                        if (disponibles.length > 0) {
                          return (
                            <>
                              {disponibles.map((e) => (
                                <div
                                  key={e.idEjemplar}
                                  style={{
                                    background: "#064e3b",
                                    padding: "8px",
                                    borderRadius: "6px",
                                    marginTop: "6px",
                                    color: "#d1fae5"
                                  }}
                                >
                                  <strong>Disponible</strong><br />
                                  📌 Código: {e.codigoBarra || "N/A"} <br />
                                  📍 Ubicación: {e.ubicacionFisica || "No registrada"}
                                </div>
                              ))}
                            </>
                          );
                        }

                        // 🔹 Si NO hay disponibles pero sí existen ejemplares
                        if (ejemplares.length > 0) {
                          return (
                            <>
                              <div style={{ color: "#f87171", marginTop: "6px" }}>
                                Todos los ejemplares están prestados
                              </div>

                              <button
                                className="upx-reserve-btn"
                                onClick={() => {
                                  if (usuarioBloqueado) {
                                    setMensaje("⚠ No puedes realizar reservas porque tienes multas pendientes.");
                                    return;
                                  }

                                  reservarLibro(l.idLibro);
                                }}
                              >
                                Reservar Libro
                              </button>
                            </>
                          );
                        }

                        // 🔹 Si no hay ningún ejemplar registrado
                        return (
                          <div style={{ marginTop: "5px", color: "#94a3b8" }}>
                            No hay ejemplares registrados
                          </div>
                        );
                      })()}

                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* PRÉSTAMOS / DEVOLUCIONES */}
        <section className="upx-section">
          <h3 className="upx-section-title">Mis Préstamos y Devoluciones</h3>

          {/* Botones de filtro */}
          <div className="upx-filter-buttons">
            <button
              className={vistaPrestamos === "prestamos" ? "active" : ""}
              onClick={() => setVistaPrestamos("prestamos")}
            >
              Préstamos
            </button>
            <button
              className={vistaPrestamos === "devoluciones" ? "active" : ""}
              onClick={() => setVistaPrestamos("devoluciones")}
            >
              Devoluciones
            </button>
          </div>

          <div className="upx-list">
            {prestamos
              .filter((p) =>
                vistaPrestamos === "prestamos"
                  ? p.estado === "activo"
                  : p.estado === "devuelto"
              )
              .map((p) => (
                <div key={p.idPrestamo} className="upx-row">
                  <span className="upx-main-text">{p.titulo}</span>
                  <span className="upx-badge upx-badge-blue">
                    {vistaPrestamos === "prestamos"
                      ? `Devolver antes: ${p.fechaLimite
                        ? new Date(p.fechaLimite).toLocaleDateString()
                        : "No disponible"
                      }`
                      : `Devuelto el: ${p.fechaDevolucion
                        ? new Date(p.fechaDevolucion).toLocaleDateString()
                        : "No disponible"
                      }`}
                  </span>
                </div>
              ))}
            {prestamos.filter((p) =>
              vistaPrestamos === "prestamos"
                ? p.estado === "activo"
                : p.estado === "devuelto"
            ).length === 0 && <div className="upx-empty">No hay registros</div>}
          </div>
        </section>

        {/* MULTAS */}
        <section className="upx-section">
          <h3 className="upx-section-title">Mis Multas</h3>
          <div className="upx-list">
            {multas.length === 0 ? (
              <div className="upx-empty">No tienes multas</div>
            ) : (
              multas.map((m) => (
                <div key={m.idMulta} className="upx-row">
                  <span className="upx-main-text">${m.monto}</span>
                  {m.pagada ? (
                    <span className="upx-badge upx-badge-green">Pagada</span>
                  ) : (
                    <span className="upx-badge upx-badge-red">
                      Pendiente (pagar en biblioteca)
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* RESERVAS */}
        <section className="upx-section">
          <h3 className="upx-section-title">Mis Reservas</h3>

          <div className="upx-list">
            {reservas.length === 0 ? (
              <div className="upx-empty">No tienes reservas</div>
            ) : (
              reservas.map((r) => (
                <div key={r.idReserva} className="upx-row">
                  <span className="upx-main-text">{r.titulo}</span>

                  {r.estado === "notificada" ? (
                    <button
                      className="upx-pay-btn"
                      onClick={() => aceptarReserva(r.idReserva)}
                    >
                      Aceptar préstamo
                    </button>
                  ) : (
                    <span className="upx-badge upx-badge-blue">
                      {r.estado}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
};