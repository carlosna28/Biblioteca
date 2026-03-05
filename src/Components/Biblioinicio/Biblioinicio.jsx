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
  const [vista, setVista] = useState("inicio");
  const [busquedaUsuario, setBusquedaUsuario] = useState("");
  const [usuariosEncontrados, setUsuariosEncontrados] = useState([]);

  // Estados
  const [usuarios, setUsuarios] = useState([]);
  const [ejemplaresDisponibles, setEjemplaresDisponibles] = useState([]);
  const [prestamosActivos, setPrestamosActivos] = useState([]);
  const [multas, setMultas] = useState([]);
  const [estanteria, setEstanteria] = useState({
    nombre: "",
    idCategoria: ""
  });

  // BUSQUEDA USUARIO PRESTAMO
  const [busquedaUsuarioPrestamo, setBusquedaUsuarioPrestamo] = useState("");
  const [usuariosEncontradosPrestamo, setUsuariosEncontradosPrestamo] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  // BUSQUEDA LIBRO PRESTAMO
  const [busquedaLibroPrestamo, setBusquedaLibroPrestamo] = useState("");
  const [librosEncontradosPrestamo, setLibrosEncontradosPrestamo] = useState([]);
  const [libroSeleccionadoPrestamo, setLibroSeleccionadoPrestamo] = useState(null);
  const [ejemplaresDisponiblesLibro, setEjemplaresDisponiblesLibro] = useState([]);

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
    if (vista === "consultaEstanterias") {
      cargarEstanterias();
    }
  }, [vista]);
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

      ] = await Promise.all([
        fetch("http://localhost:3001/editoriales"),
        fetch("http://localhost:3001/categorias"),
        fetch("http://localhost:3001/autores"),
        fetch("http://localhost:3001/libros"),
        fetch("http://localhost:3001/estados-ejemplar"),
        fetch("http://localhost:3001/ejemplares-disponibles"),
        fetch("http://localhost:3001/prestamos-activos"),
        fetch("http://localhost:3001/multas"),


      ]);

      setEditoriales(await edRes.json());
      setCategorias(await catRes.json());
      setAutores(await autRes.json());
      setLibros(await libRes.json());
      setEstados(await estRes.json());
      setEjemplaresDisponibles(await ejDispRes.json());
      setPrestamosActivos(await prestRes.json());
      setMultas(await multasRes.json());


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
        method: "POST",
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



  return (
    <div className="dashboard">
      <div className="sidebar">
        <h2>Biblioteca</h2>
        <button onClick={() => setVista("libro")}>Añadir libro</button>
        <button onClick={() => setVista("ejemplar")}>Añadir ejemplar</button>
        <button onClick={() => setVista("editorial")}>Añadir editorial</button>
        <button onClick={() => setVista("autor")}>Añadir autor</button>
        <button onClick={() => setVista("prestamo")}>Generar préstamo</button>
        <button onClick={() => setVista("categoria")}>Añadir categoria</button>
        <button onClick={() => setVista("devolucion")}>Hacer una devolucion</button>
        <button onClick={() => setVista("multas")}>Multas</button>
        <button onClick={() => setVista("usuarios")}>Usuarios</button>
        <button onClick={() => setVista("consultaLibros")}> Consultar libros</button>
        <button onClick={() => setVista("estanteria")}>Estanterías</button>
        <button onClick={() => setVista("consultaEstanterias")}>Consultar Estanterías</button>
      </div>

      <div className="contenido">
        {vista === "inicio" && <h1>Bienvenido al sistema</h1>}


        {vista === "libro" && (
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
        {vista === "ejemplar" && (
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

            <select value={ejemplar.ubicacionFisica} onChange={(e) => setEjemplar({ ...ejemplar, ubicacionFisica: e.target.value })}>
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
                setEstanterias(data);
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
        {vista === "categoria" && (
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
        {vista === "editorial" && (
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
        {vista === "autor" && (
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
        {vista === "prestamo" && (
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
        {vista === "devolucion" && (
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
        {vista === "multas" && (
          <div className="card">
            <h2>Multas</h2>

            {multas.map((m) => (
              <div key={m.idMulta}>
                <p>
                  Usuario: {m.usuarioNombre} |
                  Monto: ${m.monto} |
                  Estado: {m.pagada ? "Pagada" : "Pendiente"}
                </p>

                {!m.pagada && (
                  <button onClick={() => pagarMulta(m.idMulta, m.monto)}>
                    Pagar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/*USUARIOS BLOQUEADOS */}
        {/* USUARIOS BLOQUEADOS */}
        {vista === "usuarios" && (
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

        {vista === "consultaLibros" && (
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

            {/* Ejemplares */}
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
            )}
          </div>
        )}
        {/*estanteria*/}
        {vista === "estanteria" && (
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
        {vista === "consultaEstanterias" && (
          <div className="card">
            <h2>Estanterías Registradas</h2>

            {estanterias.length === 0 ? (
              <p>No hay estanterías registradas.</p>
            ) : (
              <ul>
                {estanterias.map((e) => (
                  <li key={e.idEstanteria}>
                    <strong>{e.nombre}</strong> | Categoría: {e.categoriaNombre}
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