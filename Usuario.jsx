import { useState } from 'react'
import './Usuario.css'
import { Link, useNavigate } from "react-router-dom";

export const Usuario = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [user, setUser] = useState("");

    const entrar = async () => {

        setError("");

        if (!user || !password) {
            setError("Todos los campos son obligatorios");
            return;
        }

        try {
            const res = await fetch("http://localhost:3001/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user: user,
                    pass: password
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

        <div className="Usuario">

            <div className="Titulo-login">NG | Biblioteca Digital</div>

            <div className='lado-izquierdo'>

                <h1 className='Titulo-Sesion'>Listo para empezar a leer</h1>

                {error && (
                    <p style={{ color: "red", marginBottom: "10px" }}>
                        {error}
                    </p>
                )}

                <div className='campo'>
                    <label>Nombre de usuario:</label>
                    <input
                        type="text"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                        placeholder='Escribe tu nombre de usuario'
                    />
                </div>

                <div className='campo'>
                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Contraseña'
                    />
                </div>

                <div className='campo'>
                    <Link to="/Registro">Registrarse</Link>
                    <Link to="/bibliotecario">Inicar sesion para bibliotecarios</Link>
                </div>

                <button onClick={entrar} className='btn'>
                    Iniciar sesión
                </button>

            </div>

            <div className='lado-derecho'>
                <div >                    
                </div>
                <div className='ima'>
                    <img src="/Index.jpg" alt="imagen" />
                </div>
            </div>

        </div>
    )
}
