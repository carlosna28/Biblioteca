import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import './Admin.css'

export const Admin = () => {

const [form,setForm] = useState({
usuario:"",
nombre:"",
apellidoPaterno:"",
apellidoMaterno:"",
correo:"",
contraseña:""
});

const handleChange = (e)=>{
setForm({
...form,
[e.target.name]:e.target.value
});
};

const registrar = async (e)=>{
e.preventDefault();

const res = await fetch("http://localhost:3001/administrador",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(form)
});

const data = await res.json();

alert(data.msg);
};

return(

<div style={{display:"flex",justifyContent:"center",marginTop:"50px"}}>

<form onSubmit={registrar} style={{width:"300px"}}>

<h2>Registrar Administrador</h2>

<input name="usuario" placeholder="Usuario" onChange={handleChange} required/>
<input name="nombre" placeholder="Nombre" onChange={handleChange} required/>
<input name="apellidoPaterno" placeholder="Apellido Paterno" onChange={handleChange} required/>
<input name="apellidoMaterno" placeholder="Apellido Materno" onChange={handleChange}/>
<input type="email" name="correo" placeholder="Correo" onChange={handleChange} required/>
<input type="password" name="contraseña" placeholder="Contraseña" onChange={handleChange} required/>

<button type="submit">Registrar</button>

</form>

</div>

);

}
export default Admin;