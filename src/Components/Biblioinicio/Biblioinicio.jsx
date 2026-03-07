import React, { useState } from "react";
import "./Biblioinicio.css";
import { useEffect } from "react";
import Select from "react-select";
export const Biblioinicio = () => {

  //GET

  const [editoriales, setEditoriales] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [autores, setAutores] = useState([]);
  const [estanterias, setEstanterias] = useState([]);
  //nueva vista
  const [modulo, setModulo] = useState("inicio");
  const [accion, setAccion] = useState("");
  const [busquedaUsuario, setBusquedaUsuario] = useState("");
  const [usuariosEncontrados, setUsuariosEncontrados] = useState([]);
  const [busquedaMulta, setBusquedaMulta] = useState("");
  const [usuariosMultas, setUsuariosMultas] = useState([]);
  // Estados
  const [usuarios, setUsuarios] = useState([]);
  const [ejemplaresDisponibles, setEjemplaresDisponibles] = useState([]);
  const [prestamosActivos, setPrestamosActivos] = useState([]);
  const [multas, setMultas] = useState([]);
  const [estanteria, setEstanteria] = useState({
    nombre: "",
    idCategoria: ""
  });
  const [estanteriasFiltradas, setEstanteriasFiltradas] = useState([]);
  const [usuarioMultaSeleccionado, setUsuarioMultaSeleccionado] = useState(null);

  // BUSQUEDA USUARIO PRESTAMO
  const [busquedaUsuarioPrestamo, setBusquedaUsuarioPrestamo] = useState("");
  const [usuariosEncontradosPrestamo, setUsuariosEncontradosPrestamo] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  // Búsqueda para eliminación
  const [busquedaAutor, setBusquedaAutor] = useState("");
  const [autoresFiltrados, setAutoresFiltrados] = useState([]);

  const [busquedaEditorial, setBusquedaEditorial] = useState("");
  const [editorialesFiltradas, setEditorialesFiltradas] = useState([]);

  const [busquedaCategoria, setBusquedaCategoria] = useState("");
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);

  // BUSQUEDA LIBRO PRESTAMO
  const [busquedaLibroPrestamo, setBusquedaLibroPrestamo] = useState("");
  const [librosEncontradosPrestamo, setLibrosEncontradosPrestamo] = useState([]);
  const [libroSeleccionadoPrestamo, setLibroSeleccionadoPrestamo] = useState(null);
  const [ejemplaresDisponiblesLibro, setEjemplaresDisponiblesLibro] = useState([]);
  // Filtrar autores
  const filtrarAutores = (texto) => {
    setBusquedaAutor(texto);
    if (!texto.trim()) {
      setAutoresFiltrados([]);
      return;
    }
    const filtrados = autores.filter((a) =>
      `${a.nombre} ${a.apellidoPaterno} ${a.apellidoMaterno}`
        .toLowerCase()
        .includes(texto.toLowerCase())
    );
    setAutoresFiltrados(filtrados);
  };

  // Filtrar editoriales
  const filtrarEditoriales = (texto) => {
    setBusquedaEditorial(texto);
    if (!texto.trim()) {
      setEditorialesFiltradas([]);
      return;
    }
    const filtrados = editoriales.filter((e) =>
      e.nombre.toLowerCase().includes(texto.toLowerCase())
    );
    setEditorialesFiltradas(filtrados);
  };

  // Filtrar categorías
  const filtrarCategorias = (texto) => {
    setBusquedaCategoria(texto);
    if (!texto.trim()) {
      setCategoriasFiltradas([]);
      return;
    }
    const filtrados = categorias.filter((c) =>
      c.nombre.toLowerCase().includes(texto.toLowerCase())
    );
    setCategoriasFiltradas(filtrados);
  };
  const buscarUsuariosPrestamo = async (texto) => {
    setBusquedaUsuarioPrestamo(texto);

    if (texto.length < 2) {
      setUsuariosEncontradosPrestamo([]);
      return;
    }

    const res = await fetch(
      `http://localhost:3001/usuarios/buscar?nombre=${texto}`
    );

    const data = await res.json();
    setUsuariosEncontradosPrestamo(data);
  };

  const [libro, setLibro] = useState({
    nombre: "",
    isbn: "",
    publicacion: "",
    idEditorial: "",
    idCategoria: "",
    idAutores: []//arreglo
  });


  const buscarLibrosPrestamo = async (texto) => {
    setBusquedaLibroPrestamo(texto);

    if (texto.length < 2) {
      setLibrosEncontradosPrestamo([]);
      return;
    }

    const res = await fetch(
      `http://localhost:3001/libros/buscar?titulo=${texto}`
    );

    const data = await res.json();
    setLibrosEncontradosPrestamo(data);
  };

  const seleccionarLibroPrestamo = async (libro) => {
    setLibroSeleccionadoPrestamo(libro);
    setBusquedaLibroPrestamo(libro.titulo);
    setLibrosEncontradosPrestamo([]);

    // 🔥 SOLO ejemplares disponibles
    const ejemplaresDisponibles = libro.ejemplares?.filter(
      (e) => e.idEstado === 1
    ) || [];

    setEjemplaresDisponiblesLibro(ejemplaresDisponibles);
  };
  const [categoria, setCategoria] = useState("");
  const [editorial, setEditorial] = useState("");

  const [autor, setAutor] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: ""
  });

  const [prestamo, setPrestamo] = useState({
    idUsuario: "",
    idEjemplar: ""
  });

  const [ejemplar, setEjemplar] = useState({
    codigoBarra: "",
    ubicacionFisica: "",
    idLibro: "",
    idEstado: ""
  });

  const [libros, setLibros] = useState([]);
  const [estados, setEstados] = useState([]);
  const token = localStorage.getItem("token");
  //usuarios-bloqueados
  const [usuarioBusqueda, setUsuarioBusqueda] = useState("");
  const [nombreBusqueda, setNombreBusqueda] = useState("");
  const buscarUsuarios = async () => {
    try {
      if (!usuarioBusqueda.trim() && !nombreBusqueda.trim()) {
        alert("Debes llenar el campo");
        return;
      }

      const res = await fetch(
        `http://localhost:3001/usuarios?usuario=${usuarioBusqueda}&nombre=${nombreBusqueda}`
      );

      if (!res.ok) {
        const error = await res.json();
        alert(error.message);
        return;
      }

      const data = await res.json();
      setUsuarios(data);

    } catch (error) {
      console.error("Error buscando usuarios:", error);
    }
  };
  // =============================
  // ELIMINAR AUTOR
  // =============================
  const eliminarAutor = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este autor?")) return;

    try {
      const res = await fetch(`http://localhost:3001/autor/${id}`, {
        method: "DELETE"
      });

      const data = await res.json();
      alert(data.message);

      cargarDatos();

    } catch (error) {
      console.error(error);
      alert("Error eliminando autor");
    }
  };

  // =============================
  // ELIMINAR LIBRO
  // =============================
  const eliminarLibro = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este libro?")) return;

    try {
      const res = await fetch(`http://localhost:3001/libro/${id}`, {
        method: "DELETE"
      });

      const data = await res.json();
      alert(data.message);

      cargarDatos();

    } catch (error) {
      console.error(error);
      alert("Error eliminando libro");
    }
  };

  // =============================
  // ELIMINAR EDITORIAL
  // =============================
  const eliminarEditorial = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta editorial?")) return;

    try {
      const res = await fetch(`http://localhost:3001/editorial/${id}`, {
        method: "DELETE"
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);
      cargarDatos();

    } catch (error) {
      console.error(error);
      alert("Error eliminando editorial");
    }
  };

  // =============================
  // ELIMINAR CATEGORIA
  // =============================
  const eliminarCategoria = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta categoría?")) return;

    try {
      const res = await fetch(`http://localhost:3001/categoria/${id}`, {
        method: "DELETE"
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);
      cargarDatos();

    } catch (error) {
      console.error(error);
      alert("Error eliminando categoría");
    }
  };

  // =============================
  // ELIMINAR ESTANTERIA
  // =============================
  const eliminarEstanteria = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/estanteria/${id}`, {
        method: "DELETE"
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);
      cargarEstanterias();

    } catch (error) {
      console.error(error);
      alert("Error al eliminar estantería");
    }
  };
  //BUSCAR LIBRO_EJEMPLAR
  const [busquedaLibro, setBusquedaLibro] = useState("");
  const [librosEncontrados, setLibrosEncontrados] = useState([]);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);
  const [ejemplares, setEjemplares] = useState([]);
  const buscarLibros = async (texto) => {
    setBusquedaLibro(texto);

    if (texto.length < 2) {
      setLibrosEncontrados([]);
      return;
    }

    const res = await fetch(
      `http://localhost:3001/libros/buscar?titulo=${texto}`
    );

    const data = await res.json();
    setLibrosEncontrados(data);
  };
  const seleccionarLibro = async (libro) => {
    setLibroSeleccionado(libro);
    setBusquedaLibro(libro.titulo);
    setLibrosEncontrados([]);

    const res = await fetch(
      `http://localhost:3001/ejemplares/${libro.idLibro}`
    );

    const data = await res.json();
    setEjemplares(data);
  };
  useEffect(() => {
    if (accion === "consultarEstanterias" || accion === "eliminarEstanteria") {
      cargarEstanterias();
    }
  }, [accion]);
  //buscar usuario
  const buscarUsuariosAuto = async (texto) => {
    setBusquedaUsuario(texto);

    if (texto.length < 2) {
      setUsuariosEncontrados([]);
      return;
    }

    const res = await fetch(
      `http://localhost:3001/usuarios/buscar?nombre=${texto}`
    );

    const data = await res.json();
    setUsuariosEncontrados(data);
  };
  //
  const cargarEstanterias = async () => {
    try {
      const res = await fetch("http://localhost:3001/estanterias");
      const data = await res.json();
      setEstanterias(data);
    } catch (err) {
      console.error("Error cargando estanterías:", err);
    }
  };
  const cargarUsuarios = async () => {
    try {
      const res = await fetch(
        "http://localhost:3001/usuarios/buscar?nombre="
      );

      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };
  const buscarMultasUsuario = async (texto) => {
    setBusquedaMulta(texto);
    setUsuarioMultaSeleccionado(null);

    if (texto.length < 2) {
      setUsuariosMultas([]);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3001/usuarios/buscar?nombre=${texto}`
      );

      const data = await res.json();
      setUsuariosMultas(data);

    } catch (error) {
      console.error("Error buscando usuarios:", error);
    }
  };
  //
  const seleccionarUsuarioMulta = async (usuario) => {

    setUsuarioMultaSeleccionado(usuario);
    setBusquedaMulta(usuario.nombre);
    setUsuariosMultas([]);

    try {

      const res = await fetch(
        `http://localhost:3001/multas/usuario/${usuario.idUsuario}`
      );

      const data = await res.json();
      setMultas(data);

    } catch (error) {
      console.error("Error cargando multas:", error);
    }
  };

  //OBTENER DATOS, EDITORIAL, CATEGORIAS,AUTORES
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [
        edRes,
        catRes,
        autRes,
        libRes,
        estRes,
        ejDispRes,
        prestRes,
        multasRes,
        estanteriasRes

      ] = await Promise.all([
        fetch("http://localhost:3001/editoriales"),
        fetch("http://localhost:3001/categorias"),
        fetch("http://localhost:3001/autores"),
        fetch("http://localhost:3001/libros"),
        fetch("http://localhost:3001/estados-ejemplar"),
        fetch("http://localhost:3001/ejemplares-disponibles"),
        fetch("http://localhost:3001/prestamos-activos"),
        fetch("http://localhost:3001/multas"),
        fetch("http://localhost:3001/estanterias")


      ]);

      setEditoriales(await edRes.json());
      setCategorias(await catRes.json());
      setAutores(await autRes.json());
      setLibros(await libRes.json());
      setEstados(await estRes.json());
      setEjemplaresDisponibles(await ejDispRes.json());
      setPrestamosActivos(await prestRes.json());
      setMultas(await multasRes.json());
      setEstanterias(await estanteriasRes.json());


    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };
  //devolucion
  const devolverPrestamo = async (idPrestamo) => {
    try {
      const res = await fetch(
        `http://localhost:3001/devolucion/${idPrestamo}`,
        { method: "PUT" }
      );

      const data = await res.json();
      alert(data.message);

      cargarDatos();

    } catch (err) {
      console.error(err);
      alert("Error en devolución");
    }
  };

  //pagar multa 
  const pagarMulta = async (idMulta, monto) => {
    try {
      const res = await fetch(`http://localhost:3001/pagar-multa/${idMulta}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ idMulta, monto })
      });

      const data = await res.json();
      alert(data.message);

      cargarDatos();

    } catch (err) {
      console.error(err);
      alert("Error pagando multa");
    }
  };
  //BLOQUEAR USUARIO
  const bloquearUsuario = async (idUsuario) => {
    try {
      const res = await fetch(
        `http://localhost:3001/bloquear-usuario/${idUsuario}`,
        { method: "PUT" }
      );

      const data = await res.json();
      alert(data.message);

      cargarDatos();

    } catch (err) {
      console.error(err);
      alert("Error bloqueando usuario");
    }
  };
  // =============================
  // REGISTRAR LIBRO
  // =============================
  const registrarLibro = async () => {
    try {
      const res = await fetch("http://localhost:3001/libro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(libro)
      });

      const data = await res.json();

      // 🔴 SI HAY ERRORES DE VALIDACIÓN
      if (!res.ok) {

        if (data.errores) {
          const mensajes = Object.values(data.errores).join("\n");
          alert(mensajes);
        } else {
          alert(data.msg || "Error registrando libro");
        }

        return;
      }

      alert(data.msg || "Libro registrado");

      await cargarDatos();

      setLibro({
        nombre: "",
        isbn: "",
        publicacion: "",
        idEditorial: "",
        idCategoria: "",
        idAutores: []
      });

    } catch (err) {
      console.error(err);
      alert("Error registrando libro");
    }
  };
  //============================
  //REGISTRAR EJEMPLAR
  //============================
  const registrarEjemplar = async () => {
    try {
      const res = await fetch("http://localhost:3001/ejemplar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(ejemplar)
      });

      const data = await res.json();
      alert(data.msg || "Ejemplar registrado");
      await cargarDatos();

      setEjemplar({
        codigoBarra: "",
        ubicacionFisica: "",
        idLibro: "",
        idEstado: ""
      });
    } catch (err) {
      console.error(err);
      alert("Error registrando ejemplar");
    }
  };


  // =============================
  // EDITORIAL
  // =============================
  const registrarEditorial = async () => {

    // 🔴 Validación frontend
    if (!editorial.trim()) {
      alert("El nombre de la editorial es obligatorio");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/editorial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nombre: editorial.trim() })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || data.message || "Error al registrar editorial");
        return;
      }

      alert(data.msg || "Editorial registrada correctamente");

      setEditorial("");
      await cargarDatos();

    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };
  // =============================
  // Categoria
  // =============================
  const registrarCategoria = async () => {

    // 🔴 VALIDACIÓN
    if (!categoria.trim()) {
      alert("El nombre de la categoría es obligatorio");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/categoria", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ nombre: categoria.trim() })
      });

      const data = await res.json();

      // 🔴 Si backend responde error
      if (!res.ok) {
        alert(data.msg || data.message || "Error al registrar categoría");
        return;
      }

      alert(data.msg || data.message || "Categoría registrada correctamente");

      setCategoria("");
      await cargarDatos();

    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };
  //estanterias 
  // =============================
  // ESTANTERIA
  // =============================
  const registrarEstanteria = async () => {

    if (!estanteria.nombre.trim() || !estanteria.idCategoria) {
      alert("Debes llenar todos los campos");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/estanteria", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(estanteria)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Error registrando estantería");
        return;
      }

      alert("Estantería registrada correctamente");

      setEstanteria({
        nombre: "",
        idCategoria: ""
      });

      await cargarEstanterias();

    } catch (err) {
      console.error(err);
      alert("Error de conexión con el servidor");
    }
  };

  // =============================
  // AUTOR
  // =============================
  const registrarAutor = async () => {

    if (
      !autor.nombre?.trim() ||
      !autor.apellidoPaterno?.trim() ||
      !autor.apellidoMaterno?.trim()
    ) {
      alert("Todos los campos del autor son obligatorios");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/autor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: autor.nombre.trim(),
          apellidoPaterno: autor.apellidoPaterno.trim(),
          apellidoMaterno: autor.apellidoMaterno.trim()
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Error al registrar autor");
        return;
      }

      alert("Autor registrado correctamente");

      // Resetear objeto
      setAutor({
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: ""
      });

      await cargarDatos();

    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    }
  };
  // =============================
  // PRESTAMO
  // =============================
  const generarPrestamo = async () => {

    if (!prestamo.idUsuario || !prestamo.idEjemplar) {
      alert("Debes seleccionar usuario y ejemplar");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/prestamo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(prestamo)
      });

      const data = await res.json();
      alert(data.message || "Préstamo generado");

      await cargarDatos();

      // 🔥 RESET COMPLETO DEL FORMULARIO
      setPrestamo({ idUsuario: "", idEjemplar: "" });
      setUsuarioSeleccionado(null);
      setLibroSeleccionadoPrestamo(null);
      setBusquedaUsuarioPrestamo("");
      setBusquedaLibroPrestamo("");
      setUsuariosEncontradosPrestamo([]);
      setLibrosEncontradosPrestamo([]);
      setEjemplaresDisponiblesLibro([]);

    } catch (err) {
      console.error(err);
      alert("Error generando préstamo");
    }
  };

  const verMultasUsuario = async (idUsuario) => {
    try {

      const res = await fetch(
        `http://localhost:3001/multas/usuario/${idUsuario}`
      );

      const data = await res.json();

      setMultas(data);

    } catch (error) {
      console.error("Error cargando multas:", error);
    }
  };


  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Biblioteca</h2>{/*cambiarModulo("libros")}>📚 Libros</button>*/}

        <button onClick={() => { setModulo("libros"); setAccion(""); }}>📚 Libros</button>
        <button onClick={() => { setModulo("autores"); setAccion(""); }}>✍️ Autores</button>
        <button onClick={() => { setModulo("editoriales"); setAccion(""); }}>🏢 Editoriales</button>
        <button onClick={() => { setModulo("categorias"); setAccion(""); }}>🏷 Categorías</button>
        <button onClick={() => { setModulo("estanterias"); setAccion(""); }}>🗄 Estanterías</button>
        <button onClick={() => { setModulo("prestamos"); setAccion(""); }}>📖 Préstamos</button>
        <button onClick={() => { setModulo("usuarios"); setAccion(""); }}>👤 Usuarios</button>
        <button onClick={() => { setModulo("multas"); setAccion(""); }}>💰 Multas</button>
      </div>
      <div className="submenu">

        {modulo === "libros" && (
          <>
            <button onClick={() => setAccion("agregarLibro")}>Agregar libro</button>
            <button onClick={() => setAccion("consultarLibros")}>Consultar libros</button>
            <button onClick={() => setAccion("ejemplar")}>Añadir ejemplar</button>
          </>
        )}

        {modulo === "autores" && (
          <>
            <button onClick={() => setAccion("agregarAutor")}>Agregar autor</button>
            <button onClick={() => setAccion("consultarAutores")}>Consultar autores</button>
            <button onClick={() => setAccion("eliminarAutor")}>Eliminar autor</button>
          </>
        )}

        {modulo === "editoriales" && (
          <>
            <button onClick={() => setAccion("agregarEditorial")}>Agregar editorial</button>
            <button onClick={() => setAccion("consultarEditorial")}>Consultar editoriales</button>
            <button onClick={() => setAccion("eliminarEditorial")}>Eliminar editorial</button>
          </>
        )}

        {modulo === "categorias" && (
          <>
            <button onClick={() => setAccion("agregarCategoria")}>Agregar categoría</button>
            <button onClick={() => setAccion("consultarCategoria")}>Consultar categorías</button>
            <button onClick={() => setAccion("eliminarCategoria")}>Eliminar categoría</button>
          </>
        )}

        {modulo === "estanterias" && (
          <>
            <button onClick={() => setAccion("agregarEstanteria")}>Agregar estantería</button>
            <button onClick={() => setAccion("consultarEstanterias")}>Consultar estanterías</button>

          </>
        )}

        {modulo === "prestamos" && (
          <>
            <button onClick={() => setAccion("generarPrestamo")}>Generar préstamo</button>
            <button onClick={() => setAccion("devolucion")}>Devolución</button>
          </>
        )}

      </div>
      <div className="contenido">
        {modulo === "inicio" && <h1>Bienvenido al sistema</h1>}


        {accion === "agregarLibro" && (
          <div className="card">
            <h2>Registrar un libro</h2>

            <input
              type="text"
              placeholder="Nombre del libro"
              value={libro.nombre}
              onChange={(e) =>
                setLibro({ ...libro, nombre: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="ISBN"
              value={libro.isbn}
              onChange={(e) =>
                setLibro({ ...libro, isbn: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Año de publicación"
              value={libro.publicacion}
              onChange={(e) =>
                setLibro({ ...libro, publicacion: e.target.value })
              }
            />

            {/* SELECT EDITORIALES */}
            <select
              value={libro.idEditorial}
              onChange={(e) =>
                setLibro({ ...libro, idEditorial: e.target.value })
              }
            >
              <option value="">Seleccione editorial</option>
              {editoriales.map((ed) => (
                <option key={ed.idEditorial} value={ed.idEditorial}>
                  {ed.nombre}
                </option>
              ))}
            </select>
            {/* SELECT CATEGORIAS */}
            <select
              value={libro.idCategoria}
              onChange={(e) =>
                setLibro({ ...libro, idCategoria: e.target.value })
              }
            >
              <option value="">Seleccione la categoria</option>
              {categorias.map((ed) => (
                <option key={ed.idCategoria} value={ed.idCategoria}>
                  {ed.nombre}
                </option>
              ))}
            </select>
            {/* SELECT AUTORES */}
            <div className="react-select-container">
              <Select
                isMulti
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Seleccione autores"
                options={autores.map((aut) => ({
                  value: aut.idAutor,
                  label: `${aut.nombre} ${aut.apellidoPaterno}`
                }))}
                value={autores
                  .filter((a) => libro.idAutores.includes(a.idAutor))
                  .map((a) => ({
                    value: a.idAutor,
                    label: `${a.nombre} ${a.apellidoPaterno}`
                  }))
                }
                onChange={(selected) =>
                  setLibro({
                    ...libro,
                    idAutores: selected ? selected.map((s) => s.value) : []
                  })
                }
              />
            </div>

            <button onClick={registrarLibro}>Guardar</button>
          </div>
        )}

        {/*EJEMPLAR*/}
        {accion === "ejemplar" && (
          <div className="card">
            <h2>Registrar Ejemplar</h2>

            <input
              type="text"
              placeholder="Código de barras"
              value={ejemplar.codigoBarra}
              onChange={(e) =>
                setEjemplar({ ...ejemplar, codigoBarra: e.target.value })
              }
            />

            <select
              value={ejemplar.ubicacionFisica}
              onChange={(e) =>
                setEjemplar({ ...ejemplar, ubicacionFisica: e.target.value })
              }
            >
              <option value="">Selecciona estantería</option>

              {estanterias.map((e) => (
                <option key={e.idEstanteria} value={e.nombre}>
                  {e.nombre}
                </option>
              ))}
            </select>

            <select
              value={ejemplar.idLibro}
              onChange={async (e) => {
                const libroId = e.target.value;

                setEjemplar({ ...ejemplar, idLibro: libroId });

                const libroSeleccionado = libros.find(
                  (l) => l.idLibro === parseInt(libroId)
                );

                if (!libroSeleccionado) return;

                const res = await fetch(
                  `http://localhost:3001/estanterias/${libroSeleccionado.idCategoria}`
                );

                const data = await res.json();
                setEstanteriasFiltradas(data);
              }}
            >

              <option value="">Seleccione libro</option>
              {libros.map((l) => (
                <option key={l.idLibro} value={l.idLibro}>
                  {l.titulo}
                </option>
              ))}
            </select>

            <select
              value={ejemplar.idEstado}
              onChange={(e) =>
                setEjemplar({ ...ejemplar, idEstado: e.target.value })
              }
            >
              <option value="">Seleccione estado</option>
              {estados.map((e) => (
                <option key={e.idEstado} value={e.idEstado}>
                  {e.nombre}
                </option>
              ))}
            </select>

            <button onClick={registrarEjemplar}>Guardar</button>
          </div>
        )}

        {/* CATEGORIA */}
        {accion === "agregarCategoria" && (
          <div className="card">
            <h2>Registrar una categoria</h2>
            <input
              type="text"
              placeholder="Nombre de la categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            />
            <button onClick={registrarCategoria}>Guardar</button>
          </div>
        )}


        {/* EDITORIAL */}
        {accion === "agregarEditorial" && (
          <div className="card">
            <h2>Registrar Editorial</h2>
            <input
              type="text"
              placeholder="Nombre de la editorial"
              value={editorial}
              onChange={(e) => setEditorial(e.target.value)}
            />
            <button onClick={registrarEditorial}>Guardar</button>
          </div>
        )}

        {/* AUTOR */}
        {accion === "agregarAutor" && (
          <div className="card">
            <h2>Registrar Autor</h2>

            <input
              type="text"
              placeholder="Nombre"
              value={autor.nombre}
              onChange={(e) =>
                setAutor({ ...autor, nombre: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Apellido Paterno"
              value={autor.apellidoPaterno}
              onChange={(e) =>
                setAutor({ ...autor, apellidoPaterno: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Apellido Materno"
              value={autor.apellidoMaterno}
              onChange={(e) =>
                setAutor({ ...autor, apellidoMaterno: e.target.value })
              }
            />

            <button onClick={registrarAutor}>Guardar</button>
          </div>
        )}

        {/* PRESTAMO */}
        {accion === "generarPrestamo" && (
          <div className="card">
            <h2>Generar Préstamo</h2>

            {/* ================= USUARIO ================= */}
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={busquedaUsuarioPrestamo}
              onChange={(e) => buscarUsuariosPrestamo(e.target.value)}
            />

            {usuariosEncontradosPrestamo.length > 0 && (
              <div className="dropdown-libros">
                {usuariosEncontradosPrestamo.map((u) => (
                  <div
                    key={u.idUsuario}
                    className="item-libro"
                    onClick={() => {
                      setUsuarioSeleccionado(u);
                      setPrestamo({ ...prestamo, idUsuario: u.idUsuario });
                      setBusquedaUsuarioPrestamo(u.nombre);
                      setUsuariosEncontradosPrestamo([]);
                    }}
                  >
                    {u.nombre} | @{u.usuario}
                  </div>
                ))}
              </div>
            )}

            {/* ================= LIBRO ================= */}
            <input
              type="text"
              placeholder="Buscar libro..."
              value={busquedaLibroPrestamo}
              onChange={(e) => buscarLibrosPrestamo(e.target.value)}
            />

            {librosEncontradosPrestamo.length > 0 && (
              <div className="dropdown-libros">
                {librosEncontradosPrestamo.map((l) => (
                  <div
                    key={l.idLibro}
                    className="item-libro"
                    onClick={() => seleccionarLibroPrestamo(l)}
                  >
                    {l.titulo}
                  </div>
                ))}
              </div>
            )}

            {/* ================= EJEMPLARES DISPONIBLES ================= */}
            {libroSeleccionadoPrestamo && (
              <div>
                <h4>Ejemplares disponibles:</h4>

                <div className="grid-ejemplares">
                  {ejemplaresDisponiblesLibro.map((e) => (
                    <div
                      key={e.idEjemplar}
                      className={`card-ejemplar ${prestamo.idEjemplar === e.idEjemplar ? "activo" : ""
                        }`}
                      onClick={() =>
                        setPrestamo({ ...prestamo, idEjemplar: e.idEjemplar })
                      }
                    >
                      <span className="codigo">📦 {e.codigoBarra}</span>
                      <span className="estado">Disponible</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button onClick={generarPrestamo}>
              Generar Préstamo
            </button>
          </div>
        )}

        {/*DEVOLUCION */}
        {accion === "devolucion" && (
          <div className="card">
            <h2>Préstamos Activos</h2>

            {prestamosActivos.map((p) => (
              <div key={p.idPrestamo}>
                <p>
                  Usuario: {p.usuarioNombre} |
                  Ejemplar: {p.codigoBarra}
                </p>

                <button onClick={() => devolverPrestamo(p.idPrestamo)}>
                  Devolver
                </button>
              </div>
            ))}
          </div>
        )}

        {/*MULTA */}
        {modulo === "multas" && (
          <div className="card">
            <h2>Consultar multas</h2>

            <input
              type="text"
              placeholder="Buscar usuario..."
              value={busquedaMulta}
              onChange={(e) => buscarMultasUsuario(e.target.value)}
            />

            {/* AUTOCOMPLETADO */}
            {usuariosMultas.length > 0 && (
              <div className="dropdown-libros">
                {usuariosMultas.map((u) => (
                  <div
                    key={u.idUsuario}
                    className="item-libro"
                    onClick={() => seleccionarUsuarioMulta(u)}
                  >
                    {u.nombre} | @{u.usuario}
                  </div>
                ))}
              </div>
            )}

            {/* RESULTADO MULTAS */}
            {usuarioMultaSeleccionado && (
              <div className="lista-multas">


                <h3>Multas de {usuarioMultaSeleccionado.nombre}</h3>

                {multas.length === 0 && (
                  <p>Este usuario no tiene multas.</p>
                )}

                {multas.map((m) => (
                  <div key={m.idMulta} className="item-multa">

                    <p><b>Libro:</b> {m.titulo}</p>

                    <p><b>Ejemplar:</b> {m.codigoBarra}</p>

                    <p><b>Monto:</b> ${m.monto}</p>

                    <p>
                      <b>Estado:</b> {m.pagada ? "Pagada" : "Pendiente"}
                    </p>

                    {!m.pagada && (
                      <button
                        onClick={() => pagarMulta(m.idMulta, m.monto)}
                      >
                        Pagar multa
                      </button>
                    )}

                  </div>
                ))}

              </div>
            )}
          </div>
        )}

        {/*USUARIOS BLOQUEADOS */}
        {/* USUARIOS BLOQUEADOS */}
        {modulo === "usuarios" && (
          <div className="card">
            <h2>Usuarios</h2>

            <input
              type="text"
              placeholder="Buscar usuario..."
              value={busquedaUsuario}
              onChange={(e) => buscarUsuariosAuto(e.target.value)}
            />
            {usuariosEncontrados.length > 0 && (
              <ul className="lista-usuarios">
                {usuariosEncontrados.map((u) => (
                  <li
                    key={u.idUsuario}
                    onClick={() => {
                      setBusquedaUsuario(u.nombre);
                      setUsuariosEncontrados([]);
                    }}
                  >
                    {u.nombre} | @{u.usuario}
                  </li>
                ))}
              </ul>
            )}
            <button onClick={buscarUsuarios}>
              Buscar
            </button>

            {usuarios.map((u) => (
              <div key={u.idUsuario}>
                <p>
                  <strong>{u.usuario}</strong> |{" "}
                  {u.nombre} {u.apellidoPaterno} {u.apellidoMaterno}
                  <br />
                  Estado: {u.activo ? "Activo" : "Bloqueado"}
                </p>

                {u.activo && (
                  <button onClick={() => bloquearUsuario(u.idUsuario)}>
                    Bloquear
                  </button>
                )}
              </div>
            ))}

            {usuarios.length === 0 && <p>No se encontraron usuarios.</p>}
          </div>
        )}

        {accion === "consultarLibros" && (
          <div className="card">
            <h2>Consulta de Libros</h2>

            <input
              type="text"
              placeholder="Buscar libro..."
              value={busquedaLibro}
              onChange={(e) => buscarLibros(e.target.value)}
            />

            {/* Dropdown autocompletado */}
            {librosEncontrados.length > 0 && (
              <div className="dropdown-libros">
                {librosEncontrados.map((l) => (
                  <div
                    key={l.idLibro}
                    onClick={() => seleccionarLibro(l)}
                    className="item-libro"
                  >
                    {l.titulo}
                  </div>
                ))}
              </div>
            )}
            {libroSeleccionado && (
              <div className="ejemplares">

                <h3>Información del libro</h3>

                <p><b>Título:</b> {libroSeleccionado.titulo}</p>
                <p><b>Autor:</b> {libroSeleccionado.autores}</p>
                <p><b>Editorial:</b> {libroSeleccionado.editorial}</p>
                <p><b>Categoría:</b> {libroSeleccionado.categoria}</p>
                <p><b>Año:</b> {libroSeleccionado.anioPublicacion}</p>

                <h3>Ejemplares de: {libroSeleccionado.titulo}</h3>

                {ejemplares.length === 0 && (
                  <p>No hay ejemplares registrados.</p>
                )}

                {Array.isArray(ejemplares) &&
                  ejemplares.map((e) => (
                    <div key={e.idEjemplar}>
                      Código: {e.codigoBarra} |
                      Ubicación: {e.ubicacionFisica} |
                      Estado: {e.idEstado === 1 ? "Disponible" : "No disponible"}
                    </div>
                  ))}

              </div>
            )}

            {/* Ejemplares 
            {libroSeleccionado && (
              <div className="ejemplares">
                <h3>Ejemplares de: {libroSeleccionado.titulo}</h3>

                {ejemplares.length === 0 && (
                  <p>No hay ejemplares registrados.</p>
                )}

                {Array.isArray(ejemplares) &&
                  ejemplares.map((e) => (
                    <div key={e.idEjemplar}>
                      Código: {e.codigoBarra} |{" "}
                      Ubicación: {e.ubicacionFisica} |{" "}
                      Estado: {e.idEstado === 1 ? "Disponible" : "No disponible"}
                    </div>
                  ))}
              </div>
            )}*/}
          </div>
        )}
        {/*estanteria*/}
        {accion === "agregarEstanteria" && (
          <div className="card">
            <h2>Registrar Estantería</h2>

            <input
              type="text"
              placeholder="Nombre de la estantería"
              value={estanteria.nombre}
              onChange={(e) =>
                setEstanteria({ ...estanteria, nombre: e.target.value })
              }
            />

            <select
              value={estanteria.idCategoria}
              onChange={(e) =>
                setEstanteria({ ...estanteria, idCategoria: e.target.value })
              }
            >
              <option value="">Seleccione categoría</option>
              {categorias.map((c) => (
                <option key={c.idCategoria} value={c.idCategoria}>
                  {c.nombre}
                </option>
              ))}
            </select>

            <button onClick={registrarEstanteria}>Guardar</button>
          </div>
        )}
        {accion === "consultarEstanterias" && (
          <div className="card">
            <h2>Estanterías Registradas</h2>

            {estanterias.length === 0 ? (
              <p>No hay estanterías registradas.</p>
            ) : (
              <ul>
                {estanterias.map((e) => (
                  <li key={e.idEstanteria}>
                    <strong>{e.nombre}</strong> | Categoría: {e.categoriaNombre}

                    <button
                      onClick={() => eliminarEstanteria(e.idEstanteria)}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {accion === "eliminarAutor" && (
          <div className="card">
            <h2>Buscar y eliminar autor</h2>
            <input
              type="text"
              placeholder="Buscar autor..."
              value={busquedaAutor}
              onChange={(e) => filtrarAutores(e.target.value)}
            />

            {autoresFiltrados.length > 0 && (
              <div className="dropdown-resultado">
                {autoresFiltrados.map((a) => (
                  <div key={a.idAutor} className="item-resultado">
                    {a.nombre} {a.apellidoPaterno} {a.apellidoMaterno}
                    <button onClick={() => eliminarAutor(a.idAutor)}>Eliminar</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {accion === "eliminarEditorial" && (
          <div className="card">
            <h2>Buscar y eliminar editorial</h2>
            <input
              type="text"
              placeholder="Buscar editorial..."
              value={busquedaEditorial}
              onChange={(e) => filtrarEditoriales(e.target.value)}
            />

            {editorialesFiltradas.length > 0 && (
              <div className="dropdown-resultado">
                {editorialesFiltradas.map((e) => (
                  <div key={e.idEditorial} className="item-resultado">
                    {e.nombre}
                    <button onClick={() => eliminarEditorial(e.idEditorial)}>Eliminar</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {accion === "eliminarCategoria" && (
          <div className="card">
            <h2>Buscar y eliminar categoría</h2>
            <input
              type="text"
              placeholder="Buscar categoría..."
              value={busquedaCategoria}
              onChange={(e) => filtrarCategorias(e.target.value)}
            />

            {categoriasFiltradas.length > 0 && (
              <div className="dropdown-resultado">
                {categoriasFiltradas.map((c) => (
                  <div key={c.idCategoria} className="item-resultado">
                    {c.nombre}
                    <button onClick={() => eliminarCategoria(c.idCategoria)}>Eliminar</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {accion === "consultarAutores" && (
          <div className="card">
            <h2>Autores registrados</h2>

            {autores.length === 0 ? (
              <p>No hay autores registrados.</p>
            ) : (
              <ul>
                {autores.map((a) => (
                  <li key={a.idAutor}>
                    {a.nombre} {a.apellidoPaterno} {a.apellidoMaterno}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {accion === "consultarEditorial" && (
          <div className="card">
            <h2>Editoriales registradas</h2>

            {editoriales.length === 0 ? (
              <p>No hay editoriales registradas.</p>
            ) : (
              <ul>
                {editoriales.map((e) => (
                  <li key={e.idEditorial}>
                    {e.nombre}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {accion === "consultarCategoria" && (
          <div className="card">
            <h2>Categorías registradas</h2>

            {categorias.length === 0 ? (
              <p>No hay categorías registradas.</p>
            ) : (
              <ul>
                {categorias.map((c) => (
                  <li key={c.idCategoria}>
                    {c.nombre}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}


      </div>
    </div>




  );
};

export default Biblioinicio;