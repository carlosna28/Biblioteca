import React, { useState } from "react";
import "./Registro.css";
import { Link } from "react-router-dom";

export const Registro = () => {
  const [usuario, setUsuario] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [correo, setCorreo] = useState("");
  const [contraseña, setcontraseña] = useState("");
  const [contraseñaconfirm, setContraseñaconfirm] = useState("");
  const [tipousuario, setTipousuario] = useState("");
  const [fecharegistro, setFecharegistro] = useState("");

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    // ✅ VALIDACIÓN
    if (
      !usuario.trim() ||
      !nombre.trim() ||
      !apellidoPaterno.trim() ||
      !apellidoMaterno.trim() ||
      !correo.trim() ||
      !contraseña ||
      !contraseñaconfirm ||
      !tipousuario ||
      !fecharegistro
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (contraseña.length < 6 || contraseña.length > 16) {
      setError("La contraseña debe tener entre 6 y 16 caracteres");
      return;
    }

    if (contraseña !== contraseñaconfirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuario: usuario.trim(),
          nombre: nombre.trim(),
          apellidoPaterno: apellidoPaterno.trim(),
          apellidoMaterno: apellidoMaterno.trim(),
          correo: correo.trim(),
          contraseña,
          
          tipousuario: Number(tipousuario),
         
          fecharegistro
        })
      });

      let data = {};
      try {
        data = await res.json(); // ✅ corregido
      } catch {}

      if (res.ok) {
        setMensaje(data.msg || "Usuario registrado correctamente");

        // ✅ limpiar correctamente
        setUsuario("");
        setNombre("");
        setApellidoPaterno("");
        setApellidoMaterno("");
        setCorreo("");
        setcontraseña("");
        setContraseñaconfirm("");
        setTipousuario("");
        setFecharegistro("");
      } else {
        setError(data.msg || "Error al registrar usuario");
      }
    } catch (err) {
      console.error("Error fetch:", err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="registro-wrapper">
      <div className="registro-left">
        <h1>Biblioteca Digital</h1>
        <p>
          Crea tu cuenta para acceder al sistema de préstamos,
          historial de lecturas y gestión académica.
        </p>
      </div>

      <div className="registro-right">
        <form className="registro-form" onSubmit={handleSubmit} noValidate>
          <h2>Crear cuenta</h2>

          {error && <div className="alert error">{error}</div>}
          {mensaje && <div className="alert success">{mensaje}</div>}

          <div className="input-group">
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Nombre de usuario"
            />
          </div>

          <div className="input-row">
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombres"
            />

            <input
              type="text"
              value={apellidoPaterno}
              onChange={(e) => setApellidoPaterno(e.target.value)}
              placeholder="Apellido paterno"
            />
          </div>

          <div className="input-group">
            <input
              type="text"
              value={apellidoMaterno}
              onChange={(e) => setApellidoMaterno(e.target.value)}
              placeholder="Apellido materno"
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Correo electrónico"
            />
          </div>

          <div className="input-group">
            <select
              value={tipousuario}
              onChange={(e) => setTipousuario(e.target.value)}
            >
              <option value="">Selecciona tipo de usuario</option>
              <option value="1">Estudiante</option>
              <option value="2">Docente</option>
              <option value="3">Externo</option>
            </select>
          </div>

          <div className="input-group">
            <input
              type="date"
              value={fecharegistro}
              onChange={(e) => setFecharegistro(e.target.value)}
            />
          </div>

          <div className="input-row">
            <input
              type="password"
              value={contraseña}
              onChange={(e) => setcontraseña(e.target.value)}
              placeholder="Contraseña"
            />

            <input
              type="password"
              value={contraseñaconfirm}
              onChange={(e) => setContraseñaconfirm(e.target.value)}
              placeholder="Confirmar contraseña"
            />
          </div>

          <div className="login-link">
            ¿Ya tienes cuenta? <Link to="/">Iniciar sesión</Link>
          </div>

          <button type="submit" className="registro-btn">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};