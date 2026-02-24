import { useState } from 'react'
import './Bibliotecario.css'
import { Link, useNavigate } from "react-router-dom";

export const Bibliotecario = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [usuario, setUsuario] = useState("");

    const entrar = async () => {

        setError("");

        if (!usuario || !password) {
            setError("Todos los campos son obligatorios");
            return;
        }

        try {
            const res = await fetch("http://localhost:3001/bibliotecario", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    usuario: usuario,
                    password: password
                })
            });

            const data = await res.json();

            if (res.ok) {
                // 🔥 Si login es correcto
                navigate("/inicio");
            } else {
                // ❌ Si usuario no existe o contraseña incorrecta
                setError(data.msg);
            }

        } catch (err) {
            console.error("Error conexión:", err);
            setError("Error de conexión con el servidor");
        }
    };

    return (

         <div className="loginBiblio-wrapper">

      <div className="loginBiblio-card">

        <h2 className="loginBiblio-title">
          Panel de Bibliotecarios
        </h2>

        <p className="loginBiblio-subtitle">
          Accede a la gestión de la biblioteca
        </p>

        {error && (
          <div className="loginBiblio-error">
            {error}
          </div>
        )}

        <div className="loginBiblio-field">
          <label>Usuario</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Ingresa tu usuario"
          />
        </div>

        <div className="loginBiblio-field">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
          />
        </div>

        <button className="loginBiblio-button" onClick={entrar}>
          Iniciar sesión
        </button>

        <div className="loginBiblio-links">
          <Link to="/">Regresar al inicio</Link>
        </div>

      </div>

    </div>
    )
}
