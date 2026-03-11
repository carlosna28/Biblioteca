import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Admin.css';

export const Admin = () => {
  const [form, setForm] = useState({
    usuario: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    contraseña: "",
    contraseñaconfirm: ""
  });

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const registrar = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    // ✅ VALIDACIÓN
    if (
      !form.usuario.trim() ||
      !form.nombre.trim() ||
      !form.apellidoPaterno.trim() ||
      !form.correo.trim() ||
      !form.contraseña ||
      !form.contraseñaconfirm
    ) {
      setError("Todos los campos obligatorios deben completarse");
      return;
    }

    if (form.contraseña.length < 6 || form.contraseña.length > 16) {
      setError("La contraseña debe tener entre 6 y 16 caracteres");
      return;
    }

    if (form.contraseña !== form.contraseñaconfirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/administrador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario: form.usuario.trim(),
          nombre: form.nombre.trim(),
          apellidoPaterno: form.apellidoPaterno.trim(),
          apellidoMaterno: form.apellidoMaterno.trim(),
          correo: form.correo.trim(),
          contraseña: form.contraseña
        })
      });

      let data = {};
      try {
        data = await res.json();
      } catch { }

      if (res.ok) {
        setMensaje(data.msg || "Administrador registrado correctamente");
        // ✅ limpiar formulario
        setForm({
          usuario: "",
          nombre: "",
          apellidoPaterno: "",
          apellidoMaterno: "",
          correo: "",
          contraseña: "",
          contraseñaconfirm: ""
        });
      } else {
        setError(data.msg || "Error al registrar administrador");
      }
    } catch (err) {
      console.error("Error fetch:", err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="admin-wrapper">
      <form className="admin-form" onSubmit={registrar} noValidate>
        <h2>Registrar Administrador</h2>

        {error && <div className="alert error">{error}</div>}
        {mensaje && <div className="alert success">{mensaje}</div>}

        <input
          name="usuario"
          placeholder="Usuario"
          value={form.usuario}
          onChange={handleChange}
          required
        />
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          name="apellidoPaterno"
          placeholder="Apellido Paterno"
          value={form.apellidoPaterno}
          onChange={handleChange}
          required
        />
        <input
          name="apellidoMaterno"
          placeholder="Apellido Materno"
          value={form.apellidoMaterno}
          onChange={handleChange}
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo"
          value={form.correo}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="contraseña"
          placeholder="Contraseña"
          value={form.contraseña}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="contraseñaconfirm"
          placeholder="Confirmar Contraseña"
          value={form.contraseñaconfirm}
          onChange={handleChange}
          required
        />

        <button type="submit">Registrar</button>

        <div className="login-link">
          ¿Ya tienes cuenta? <Link to="/">Iniciar sesión</Link>
        </div>
      </form>
    </div>
  );
};

export default Admin;