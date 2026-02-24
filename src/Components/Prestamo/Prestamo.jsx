import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import './Prestamo.css'

export const Prestamo = () => {

  return (
  <div> 
    <div className="Prestamo">

      <div className="Titulo-Prestamo"> Biblioteca NG </div>
      {/* BARRA SUPERIOR */}
      <div className="barra">
        <div className="menu">
          <Link to="/inicio" >Portada Biblioteca</Link>
          <Link to="/lista" >Lista A-Z</Link>
          <Link to="/devolucion" >Devolución</Link>
          <Link to="/prestamo" >Prestamo</Link>
        </div>
      </div>

    </div>
    </div>
  )
}
