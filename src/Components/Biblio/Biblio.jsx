import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './Biblio.css';

export const Biblio = () => {
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

    // ✅ VALIDACIONES
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
      const res = await fetch("http://localhost:3001/bibliotecario", {
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
      try { data = await res.json(); } catch {}

      if (res.ok) {
        setMensaje(data.msg || "Bibliotecario registrado correctamente");
        // ✅ Limpiar formulario
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
        setError(data.msg || "Error al registrar bibliotecario");
      }
    } catch (err) {
      console.error("Error fetch:", err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="biblio-wrapper">
      <form className="biblio-form" onSubmit={registrar} noValidate>
        <h2>Registrar Bibliotecario</h2>

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
      </form>
    </div>
  );
};

export default Biblio;