import React, { useState } from "react";
import "./Registro.css";
import { Link, useNavigate } from "react-router-dom";

export const Registro = () => {
  const [user, setUser] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [pass, setPass] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [idTipoUsuario, setIdTipoUsuario] = useState(0);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [numControl, setNumControl] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");
    //VALIDACION
    if (!user.trim() || !nombre.trim() || !apellidoPaterno.trim() || !apellidoMaterno.trim() || !pass || !passConfirm) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (pass.length < 6 || pass.length > 16) {
      setError("La contraseña debe tener entre 6 y 16 caracteres");
      return;
    }

    if (pass !== passConfirm) {
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

          nombre: nombre.trim(),
          apellidoPaterno: apellidoPaterno.trim(),
          apellidoMaterno: apellidoMaterno.trim(),
          pass,
          idTipoUsuario: Number(idTipoUsuario),
          user: user.trim(),
          numControl: idTipoUsuario === 1 ? numControl.trim() : null
        })
      });

      // 🔥 evitar crash si no viene json
      let data = {};
      try {
        data = await res.json();
      } catch { }

      if (res.ok) {
        setMensaje(data.msg || "Usuario registrado correctamente");

        // limpiar
        setNombre("");
        setApellidoPaterno("");
        setApellidoMaterno("");
        setPass("");
        setPassConfirm("");
        setIdTipoUsuario(1);
        setNumControl("");
        setUser("");

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
              value={user}
              onChange={(e) => setUser(e.target.value)}
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
            <select
              value={idTipoUsuario}
              onChange={(e) => setIdTipoUsuario(Number(e.target.value))}
            >
              <option value={0}>Selecciona tipo de usuario</option>
              <option value={1}>Estudiante</option>
              <option value={2}>Externo</option>
            </select>
          </div>

          {idTipoUsuario === 1 && (
            <div className="input-group">
              <input
                type="text"
                value={numControl}
                onChange={(e) => setNumControl(e.target.value)}
                placeholder="Número de control"
              />
            </div>
          )}

          <div className="input-row">
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Contraseña"
            />

            <input
              type="password"
              value={passConfirm}
              onChange={(e) => setPassConfirm(e.target.value)}
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
