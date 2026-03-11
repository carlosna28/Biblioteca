import { useState } from 'react'
import './Usuario.css'
import { Link, useNavigate } from "react-router-dom";

export const Usuario = () => {
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [user, setUser] = useState("");
    const [loading, setLoading] = useState(false);

    // =============================
    // LOGIN
    // =============================
    const entrar = async () => {
        setError("");


        if (!user || !password) {
            setError("Todos los campos son obligatorios");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("http://localhost:3001/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user,
                    pass: password
                })
            });

            const data = await res.json();

            if (res.ok) {
                const rol = data.usuario.rol;
                //  guardar sesión
                localStorage.setItem("usuario", JSON.stringify(data.usuario));

                //  REDIRECCIÓN POR ROL
                if (rol === 2) {
                    navigate("/biblioinicio");
                } else if (rol === 1) {
                    navigate("/administrador");
                } else {
                    navigate("/inicio");
                }

            } else {
                setError(data.msg || "Error al iniciar sesión");
            }

        } catch (err) {
            console.error("Error conexión:", err);
            setError("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    // =============================
    // JSX
    // =============================
    return (
        <div className="Usuario">

            <div className="Titulo-login">
                NG | Biblioteca Digital
            </div>

            <div className="lado-izquierdo">
                <h1 className="Titulo-Sesion">
                    Listo para empezar a leer
                </h1>

                {error && (
                    <p style={{ color: "red", marginBottom: "10px" }}>
                        {error}
                    </p>
                )}

                <div className="campo">
                    <label>Nombre de usuario:</label>
                    <input
                        type="text"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        placeholder="Escribe tu nombre de usuario"
                    />
                </div>

                <div className="campo">
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        onKeyDown={(e) => e.key === "Enter" && entrar()}
                    />
                </div>

                <div className="campo links">
                    <Link to="/Registro">Registrarse</Link>
                </div>

                <button
                    onClick={entrar}
                    className="btn"
                    disabled={loading}
                >
                    {loading ? "Ingresando..." : "Iniciar sesión"}
                </button>
            </div>

            <div className="lado-derecho">
                <div className="ima">
                    <img src="/Index.jpg" alt="imagen" />
                </div>
            </div>

        </div>

    );
};