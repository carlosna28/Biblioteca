import './Inicio.css'

import { Link, useNavigate } from "react-router-dom";

export const Inicio = () => {

  return (
    <div className="Inicio">

      <div className="Titulo-Inicio"> Biblioteca NG </div>
      {/* BARRA SUPERIOR */}
      <div className="barra-superior">
        <div className="menu">
          <Link to="/inicio" >Portada Biblioteca</Link>
          <Link to="/lista" >Lista A-Z</Link>
          <Link to="/devolucion" >Devolución</Link>
          <Link to="/prestamo" >Prestamo</Link>
        </div>
        <div className="buscador">
          <input
            type="text"
            placeholder="Buscar un libro"
          />
          <button>🔍😀</button>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="contenido">
        <h2 className="titulo-seccion">Libros destacados</h2>

        <div className="libros-grid">
          <div className="libro"></div>
          <div className="libro"></div>
          <div className="libro"></div>
          <div className="libro"></div>
          <div className="libro"></div>
        </div>
      </div>

    </div>
  )
}
