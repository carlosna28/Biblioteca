const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tanaka kun",
  database: "biblioteca",
  port: 3306
});

db.connect(err => {
  if (err) console.error("Error de conexión:", err);
  else console.log("Conectado a MySQL");
});


// =============================
// REGISTRO USUARIO
// =============================
app.post("/usuario", async (req, res) => {
  try {
    const {
      usuario,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      correo,
      contraseña,
      tipousuario,
      fecharegistro
    } = req.body;

    const idRol = 3;
    const activo = 1;

    if (!usuario || !nombre || !apellidoPaterno || !correo || !contraseña || !tipousuario) {
      return res.status(400).json({ msg: "Todos los campos obligatorios" });
    }

    if (contraseña.length < 6 || contraseña.length > 16) {
      return res.status(400).json({
        msg: "La contraseña debe tener entre 6 y 16 caracteres"
      });
    }

    const hashedPass = await bcrypt.hash(contraseña, 10);

    const sql = `
      INSERT INTO usuario 
      (usuario, nombre, apellidoPaterno, apellidoMaterno, correo, contraseña, idRol, idTipoUsuario, activo, fechaRegistro)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        usuario,
        nombre,
        apellidoPaterno,
        apellidoMaterno || null,
        correo || null,
        hashedPass,
        idRol,
        Number(tipousuario),
        activo,
        fecharegistro || new Date()
      ],
      (err, result) => {
        if (err) {
          console.error("ERROR SQL:", err);
          return res.status(500).json({
            msg: "Error al registrar usuario",
            error: err.sqlMessage
          });
        }

        res.status(201).json({
          msg: "Usuario registrado correctamente",
          id: result.insertId
        });
      }
    );
  } catch (error) {
    console.error("Error servidor:", error);
    res.status(500).json({ msg: "Error del servidor" });
  }
});


// =============================
// LOGIN
// =============================
// =============================
// LOGIN
// =============================
app.post("/login", async (req, res) => {
  try {
    const { user, pass } = req.body;

    if (!user || !pass) {
      return res.status(400).json({
        msg: "Todos los campos son obligatorios"
      });
    }

    const sql = `
      SELECT idUsuario, usuario, contraseña, idRol, activo
      FROM usuario
      WHERE usuario = ?
    `;

    db.query(sql, [user], async (err, results) => {
      if (err) {
        console.error("Error login:", err);
        return res.status(500).json({
          msg: "Error del servidor"
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          msg: "Usuario no encontrado"
        });
      }

      const usuarioDB = results[0];

      // 🔴 Validar si está activo
      if (usuarioDB.activo === 0) {
        return res.status(403).json({
          msg: "Usuario desactivado"
        });
      }

      // 🔐 Comparar contraseña encriptada
      const match = await bcrypt.compare(pass, usuarioDB.contraseña);

      if (!match) {
        return res.status(401).json({
          msg: "Contraseña incorrecta"
        });
      }

      // ✅ RESPUESTA EXACTA PARA TU FRONTEND
      return res.json({
        msg: "Login correcto",
        usuario: {
          id: usuarioDB.idUsuario,
          rol: usuarioDB.idRol
        }
      });
    });

  } catch (error) {
    console.error("Error servidor:", error);
    res.status(500).json({
      msg: "Error del servidor"
    });
  }
});
// =============================
// EDITORIAL
// =============================
app.post("/editorial", (req, res) => {
  const { nombre } = req.body;

  // 🔴 Validar vacío
  if (!nombre || nombre.trim() === "") {
    return res.status(400).json({
      msg: "El nombre de la editorial es obligatorio"
    });
  }

  const nombreNormalizado = nombre.trim().toLowerCase();

  // 🔍 Verificar duplicado (case insensitive)
  const sqlCheck = `
    SELECT * FROM editorial 
    WHERE LOWER(nombre) = ?
  `;

  db.query(sqlCheck, [nombreNormalizado], (err, result) => {
    if (err) {
      return res.status(500).json({ msg: "Error verificando editorial" });
    }

    if (result.length > 0) {
      return res.status(400).json({
        msg: "La editorial ya existe"
      });
    }

    // ✅ Insertar si no existe
    const sqlInsert = `
      INSERT INTO editorial (nombre)
      VALUES (?)
    `;

    db.query(sqlInsert, [nombre.trim()], (err2) => {
      if (err2) {
        return res.status(500).json({ msg: "Error insertando editorial" });
      }

      res.status(201).json({
        msg: "Editorial registrada correctamente"
      });
    });
  });
});

// =============================
// AUTOR
// =============================
app.post("/autor", (req, res) => {
  const { nombre, apellidoPaterno, apellidoMaterno } = req.body;

  if (
    !nombre?.trim() ||
    !apellidoPaterno?.trim() ||
    !apellidoMaterno?.trim()
  ) {
    return res.status(400).json({
      msg: "Todos los campos del autor son obligatorios"
    });
  }

  const sqlCheck = `
    SELECT * FROM autor 
    WHERE LOWER(nombre) = ?
    AND LOWER(apellidoPaterno) = ?
    AND LOWER(apellidoMaterno) = ?
  `;

  db.query(
    sqlCheck,
    [
      nombre.trim().toLowerCase(),
      apellidoPaterno.trim().toLowerCase(),
      apellidoMaterno.trim().toLowerCase()
    ],
    (err, result) => {
      if (err) return res.status(500).json({ msg: "Error verificando autor" });

      if (result.length > 0) {
        return res.status(400).json({
          msg: "El autor ya existe"
        });
      }

      const sqlInsert = `
        INSERT INTO autor (nombre, apellidoPaterno, apellidoMaterno)
        VALUES (?, ?, ?)
      `;

      db.query(
        sqlInsert,
        [
          nombre.trim(),
          apellidoPaterno.trim(),
          apellidoMaterno.trim()
        ],
        (err2) => {
          if (err2) return res.status(500).json({ msg: "Error insertando autor" });

          res.status(201).json({
            msg: "Autor registrado correctamente"
          });
        }
      );
    }
  );
});
// =============================
// CATEGORIA
// =============================
app.post("/categoria", (req, res) => {
  const { nombre } = req.body;

  if (!nombre || nombre.trim() === "") {
    return res.status(400).json({
      msg: "El nombre es obligatorio"
    });
  }

  const nombreNormalizado = nombre.trim().toLowerCase();

  // 🔍 Verificar si ya existe (sin importar mayúsculas)
  const sqlCheck = `
    SELECT * FROM categoria 
    WHERE LOWER(nombre) = ?
  `;

  db.query(sqlCheck, [nombreNormalizado], (err, result) => {
    if (err) {
      return res.status(500).json({ msg: "Error verificando categoría" });
    }

    if (result.length > 0) {
      return res.status(400).json({
        msg: "La categoría ya existe"
      });
    }

    // ✅ Insertar si no existe
    const sqlInsert = `
      INSERT INTO categoria (nombre)
      VALUES (?)
    `;

    db.query(sqlInsert, [nombre.trim()], (err2) => {
      if (err2) {
        return res.status(500).json({ msg: "Error insertando categoría" });
      }

      res.status(201).json({
        msg: "Categoría registrada correctamente"
      });
    });
  });
});


// =============================
// OBTENER DATOS
// =============================
app.get("/editoriales", (req, res) => {
  db.query("SELECT idEditorial, nombre FROM editorial", (err, rows) => {
    if (err) return res.status(500).json({ msg: "Error al obtener editoriales" });
    res.json(rows);
  });
});

app.get("/categorias", (req, res) => {
  db.query("SELECT idCategoria, nombre FROM categoria", (err, rows) => {
    if (err) return res.status(500).json({ msg: "Error al obtener categorias" });
    res.json(rows);
  });
});

app.get("/autores", (req, res) => {
  db.query(
    "SELECT idAutor, nombre, apellidoPaterno, apellidoMaterno FROM autor",
    (err, rows) => {
      if (err) return res.status(500).json({ msg: "Error al obtener autores" });
      res.json(rows);
    }
  );
});


app.post("/libro", (req, res) => {
  const {
    nombre,
    isbn,
    publicacion,
    idEditorial,
    idCategoria,
    idAutores
  } = req.body;

  if (!nombre || !isbn) {
    return res.status(400).json({ msg: "Nombre e ISBN son obligatorios" });
  }

  // 🔥 convertir fecha a YEAR
  let anio = null;
  if (publicacion) {
    anio = new Date(publicacion).getFullYear();
  }

  db.beginTransaction(err => {
    if (err) {
      console.error(err);
      return res.status(500).json({ msg: "Error iniciando transacción" });
    }

    const sqlLibro = `
      INSERT INTO libro 
      (isbn, titulo, anioPublicacion, idEditorial, idCategoria)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sqlLibro,
      [
        isbn,
        nombre,
        anio,
        idEditorial ? Number(idEditorial) : null,
        idCategoria ? Number(idCategoria) : null
      ],
      (err, result) => {
        if (err) {
          console.error("ERROR LIBRO:", err);
          return db.rollback(() =>
            res.status(500).json({ msg: "Error insertando libro" })
          );
        }

        const idLibro = result.insertId;

        // ✅ sin autores
        if (!idAutores || idAutores.length === 0) {
          return db.commit(() =>
            res.status(201).json({
              msg: "Libro registrado correctamente",
              idLibro
            })
          );
        }

        const valores = idAutores.map(idAutor => [
          idLibro,
          Number(idAutor)
        ]);

        db.query(
          "INSERT INTO libro_autor (idLibro, idAutor) VALUES ?",
          [valores],
          err => {
            if (err) {
              console.error("ERROR AUTORES:", err);
              return db.rollback(() =>
                res.status(500).json({ msg: "Error insertando autores" })
              );
            }

            db.commit(() =>
              res.status(201).json({
                msg: "Libro registrado correctamente",
                idLibro
              })
            );
          }
        );
      }
    );
  });
});

// =============================
// REGISTRAR EJEMPLAR
// =============================
app.post("/ejemplar", (req, res) => {
  const { codigoBarra, ubicacionFisica, idLibro, idEstado } = req.body;

  if (!idLibro || !idEstado) {
    return res.status(400).json({ msg: "Libro y estado son obligatorios" });
  }

  const sql = `
    INSERT INTO ejemplar
    (codigoBarra, ubicacionFisica, idLibro, idEstado)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      codigoBarra || null,
      ubicacionFisica || null,
      Number(idLibro),
      Number(idEstado)
    ],
    (err, result) => {
      if (err) {
        console.error("ERROR EJEMPLAR:", err);
        return res.status(500).json({
          msg: "Error al registrar ejemplar",
          error: err.sqlMessage
        });
      }

      res.status(201).json({
        msg: "Ejemplar registrado correctamente",
        idEjemplar: result.insertId
      });
    }
  );
});
// =============================
// OBTENER para ejemplar DATOS EJEMPLAR
// =============================
app.get("/estados-ejemplar", (req, res) => {
  db.query(
    "SELECT idEstado, nombre FROM estado_ejemplar",
    (err, rows) => {
      if (err) {
        return res.status(500).json({ msg: "Error obteniendo estados" });
      }
      res.json(rows);
    }
  );
});

app.get("/libros", (req, res) => {
  db.query(
    "SELECT idLibro, titulo, idCategoria FROM libro",
    (err, rows) => {
      if (err) {
        return res.status(500).json({ msg: "Error obteniendo libros" });
      }
      res.json(rows);
    }
  );
});

//PRESTAMO
app.post("/prestamo", async (req, res) => {
  const { idUsuario, idEjemplar } = req.body;

  if (!idUsuario || !idEjemplar) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  const connection = db.promise();

  try {
    await connection.beginTransaction();

    // 🚫 1️⃣ verificar si usuario tiene multas
    const [multasUsuario] = await connection.query(
      `SELECT m.idMulta
       FROM multa m
       JOIN prestamo p ON m.idPrestamo = p.idPrestamo
       WHERE p.idUsuario = ?
       AND m.pagada = FALSE`,
      [idUsuario]
    );

    if (multasUsuario.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        message: "Usuario tiene multas pendientes"
      });
    }

    // 2️⃣ Verificar estado del ejemplar
    const [ejemplar] = await connection.query(
      "SELECT idEstado FROM ejemplar WHERE idEjemplar = ? FOR UPDATE",
      [idEjemplar]
    );

    if (ejemplar.length === 0) {
      await connection.rollback();
      return res.status(404).json({ message: "Ejemplar no existe" });
    }

    if (ejemplar[0].idEstado !== 1) {
      await connection.rollback();
      return res.status(400).json({ message: "Ejemplar no disponible" });
    }

    // 3️⃣ Fecha límite (7 días)
   const fechaLimite = new Date();
//fechaLimite.setDate(fechaLimite.getDate() + 7); // suma 7 días
fechaLimite.setMinutes(fechaLimite.getMinutes() + 1); // suma 1 minutos

    // 4️⃣ Insertar préstamo
    await connection.query(
      `INSERT INTO prestamo 
       (idUsuario, idEjemplar, fechaLimite, estado)
       VALUES (?, ?, ?, 'activo')`,
      [idUsuario, idEjemplar, fechaLimite]
    );

    // 5️⃣ Actualizar ejemplar
    await connection.query(
      "UPDATE ejemplar SET idEstado = 2 WHERE idEjemplar = ?",
      [idEjemplar]
    );

    await connection.commit();

    res.json({ message: "Préstamo generado correctamente" });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: "Error generando préstamo" });
  }
});

//EJEMPLARES DISPONIBLES
app.get("/ejemplares-disponibles", (req, res) => {
  db.query(
    `SELECT idEjemplar, codigoBarra 
     FROM ejemplar 
     WHERE idEstado = 1`,
    (err, rows) => {
      if (err) return res.status(500).json({ msg: "Error" });
      res.json(rows);
    }
  );
});

// USUARIOS-Bloqueados
// BUSCAR USUARIOS CON FILTROS
app.get("/usuarios", (req, res) => {
  const { usuario, nombre } = req.query;

  // 🔥 VALIDACIÓN NUEVA
  if (
    (!usuario || usuario.trim() === "") &&
    (!nombre || nombre.trim() === "")
  ) {
    return res.status(400).json({
      message: "Debes ingresar al menos un campo de búsqueda"
    });
  }

  let sql = `
    SELECT 
      idUsuario,
      usuario,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      activo
    FROM usuario
    WHERE 1=1
  `;

  let valores = [];

  if (usuario && usuario.trim() !== "") {
    sql += " AND usuario LIKE ?";
    valores.push(`%${usuario}%`);
  }

  if (nombre && nombre.trim() !== "") {
    sql += `
      AND CONCAT(nombre, ' ', apellidoPaterno, ' ', apellidoMaterno) LIKE ?
    `;
    valores.push(`%${nombre}%`);
  }

  db.query(sql, valores, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error en búsqueda" });
    }
    res.json(rows);
  });
});

//DEVOLUCION 
app.put("/devolucion/:idPrestamo", async (req, res) => {
  const { idPrestamo } = req.params;

  try {
    const connection = db.promise();

    const [prestamo] = await connection.query(
      "SELECT * FROM prestamo WHERE idPrestamo = ? AND estado = 'activo'",
      [idPrestamo]
    );

    if (prestamo.length === 0) {
      return res.status(404).json({ message: "Préstamo no válido" });
    }

    await connection.query(
      `UPDATE prestamo
       SET fechaDevolucion = NOW(), estado = 'devuelto'
       WHERE idPrestamo = ?`,
      [idPrestamo]
    );

    await connection.query(
      `UPDATE ejemplar
       SET idEstado = 1
       WHERE idEjemplar = ?`,
      [prestamo[0].idEjemplar]
    );
    // 🔎 Obtener idLibro del ejemplar devuelto
    const [ejemplarLibro] = await connection.query(
      "SELECT idLibro FROM ejemplar WHERE idEjemplar = ?",
      [prestamo[0].idEjemplar]
    );

    const idLibro = ejemplarLibro[0].idLibro;

    // 🔎 Buscar la reserva activa más antigua
    const [reserva] = await connection.query(
      `SELECT * FROM reserva
   WHERE idLibro = ?
   AND estado = 'activa'
   ORDER BY fechaReserva ASC
   LIMIT 1`,
      [idLibro]
    );

    if (reserva.length > 0) {
      await connection.query(
        `UPDATE reserva
     SET estado = 'notificada'
     WHERE idReserva = ?`,
        [reserva[0].idReserva]
      );
    }
    res.json({ message: "Libro devuelto correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en devolución" });
  }
});
//GENERAR MULTAS
app.post("/revisar-multas", async (req, res) => {
  try {
    const connection = db.promise();

    const [prestamos] = await connection.query(`
      SELECT p.idPrestamo, p.fechaLimite
      FROM prestamo p
      LEFT JOIN multa m ON p.idPrestamo = m.idPrestamo
      WHERE p.estado = 'activo'
      AND p.fechaLimite < NOW()
      AND m.idMulta IS NULL
    `);

    for (const p of prestamos) {
      const fechaLimite = new Date(p.fechaLimite);
      const ahora = new Date();

      const diasRetraso = Math.ceil(
        (ahora - fechaLimite) / (1000 * 60 * 60 * 24)
      );

      const monto = diasRetraso * 10; // $10 por día

      await connection.query(
        `INSERT INTO multa (idPrestamo, monto)
         VALUES (?, ?)`,
        [p.idPrestamo, monto]
      );
    }

    res.json({ message: "Multas revisadas correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error revisando multas" });
  }
});
// PAGAR MULTA
app.put("/pagar-multa/:idMulta", async (req, res) => {
  const { idMulta } = req.params;

  try {
    const connection = db.promise();

    // Buscar multa no pagada
    const [multa] = await connection.query(
      "SELECT * FROM multa WHERE idMulta = ? AND pagada = 0",
      [idMulta]
    );

    if (multa.length === 0) {
      return res.status(404).json({ message: "Multa no válida o ya pagada" });
    }

    const monto = multa[0].monto;

    // Registrar pago
    await connection.query(
      "INSERT INTO pago (idMulta, monto) VALUES (?, ?)",
      [idMulta, monto]
    );

    // Marcar multa como pagada
    await connection.query(
      "UPDATE multa SET pagada = 1 WHERE idMulta = ?",
      [idMulta]
    );

    res.json({
      message: "Multa pagada correctamente",
      monto: monto
    });

  } catch (error) {
    console.error("Error pagando multa:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
});




// =============================
// VALIDAR USUARIO CON MULTAS
// =============================
app.get("/usuario-con-multas/:idUsuario", async (req, res) => {
  const { idUsuario } = req.params;

  try {
    const connection = db.promise();

    const [multas] = await connection.query(
      `SELECT m.idMulta
       FROM multa m
       JOIN prestamo p ON m.idPrestamo = p.idPrestamo
       WHERE p.idUsuario = ?
       AND m.pagada = FALSE`,
      [idUsuario]
    );

    res.json({
      tieneMultas: multas.length > 0
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error verificando multas" });
  }
});

//PRESTAMOS ACTIVOS
app.get("/prestamos-activos", (req, res) => {
  db.query(
    `SELECT 
        p.idPrestamo,
        u.nombre AS usuarioNombre,
        e.codigoBarra
     FROM prestamo p
     JOIN usuario u ON p.idUsuario = u.idUsuario
     JOIN ejemplar e ON p.idEjemplar = e.idEjemplar
     WHERE p.estado = 'activo'`,
    (err, rows) => {
      if (err) return res.status(500).json({ msg: "Error" });
      res.json(rows);
    }
  );
});
//OBTENER MULTAS
app.get("/multas", (req, res) => {
  db.query(
    `SELECT 
        m.idMulta,
        m.monto,
        m.pagada,
        u.nombre AS usuarioNombre
     FROM multa m
     JOIN prestamo p ON m.idPrestamo = p.idPrestamo
     JOIN usuario u ON p.idUsuario = u.idUsuario`,
    (err, rows) => {
      if (err) return res.status(500).json({ msg: "Error" });
      res.json(rows);
    }
  );
});
//prestamos usuarios
app.get("/mis-prestamos/:idUsuario", (req, res) => {
  const { idUsuario } = req.params;

  db.query(
    `SELECT 
        p.idPrestamo,
        l.titulo,
        e.codigoBarra,
        p.fechaPrestamo,
        p.fechaLimite,
        p.fechaDevolucion,
        p.estado
     FROM prestamo p
     JOIN ejemplar e ON p.idEjemplar = e.idEjemplar
     JOIN libro l ON e.idLibro = l.idLibro
     WHERE p.idUsuario = ?
     ORDER BY p.fechaPrestamo DESC
     LIMIT 5`,
    [idUsuario],
    (err, rows) => {
      if (err) return res.status(500).json({ msg: "Error" });
      res.json(rows);
    }
  );
});

//multas prestamos 
app.get("/mis-multas/:idUsuario", (req, res) => {
  const { idUsuario } = req.params;

  db.query(
    `SELECT 
        m.idMulta,
        m.monto,
        m.pagada
     FROM multa m
     JOIN prestamo p ON m.idPrestamo = p.idPrestamo
     WHERE p.idUsuario = ?`,
    [idUsuario],
    (err, rows) => {
      if (err) return res.status(500).json({ msg: "Error" });
      res.json(rows);
    }
  );
});

app.get("/ejemplares/:idLibro", (req, res) => {
  const { idLibro } = req.params;

  const sql = `
    SELECT idEjemplar, codigoBarra, ubicacionFisica, idEstado
    FROM ejemplar
    WHERE idLibro = ?
  `;

  db.query(sql, [idLibro], (err, results) => {
    if (err) {
      console.error("Error consultando ejemplares:", err);
      return res.status(500).json({ error: "Error en ejemplares" });
    }

    res.json(results);
  });
});
// ESTANTERIA
// Obtener TODAS las estanterías
app.get("/estanterias", (req, res) => {
  const sql = `
    SELECT 
      e.idEstanteria,
      e.nombre,
      c.nombre AS categoriaNombre
    FROM estanteria e
    LEFT JOIN categoria c ON e.idCategoria = c.idCategoria
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.get("/estanterias/:idCategoria", (req, res) => {
  const { idCategoria } = req.params;

  const sql = `
    SELECT 
      e.idEstanteria,
      e.nombre,
      c.nombre AS categoriaNombre
    FROM estanteria e
    JOIN categoria c ON e.idCategoria = c.idCategoria
    WHERE e.idCategoria = ?
  `;

  db.query(sql, [idCategoria], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// REGISTRAR ESTANTERÍA
app.post("/estanteria", (req, res) => {
  let { nombre, idCategoria } = req.body;

  if (!nombre || nombre.trim() === "") {
    return res.status(400).json({
      msg: "El nombre es obligatorio"
    });
  }

  if (!idCategoria || Number(idCategoria) <= 0) {
    return res.status(400).json({
      msg: "Debes seleccionar una categoría"
    });
  }

  const sql = `
    INSERT INTO estanteria (nombre, idCategoria)
    VALUES (?, ?)
  `;

  db.query(sql, [nombre.trim(), Number(idCategoria)], (err, result) => {
    if (err) {

      // 🔥 ERROR POR DUPLICADO
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          msg: "Ya existe una estantería con ese nombre en esa categoría"
        });
      }

      console.error(err);
      return res.status(500).json({ msg: "Error SQL" });
    }

    res.status(201).json({
      msg: "Estantería registrada correctamente"
    });
  });
});
//buscar libro usuario
// RUTA DE BUSQUEDA DE LIBROS
app.get("/libros/buscar", (req, res) => {
  const { titulo } = req.query;

  const sql = `
    SELECT 
      l.idLibro,
      l.titulo,
      l.anioPublicacion,

      GROUP_CONCAT(
        DISTINCT CONCAT(a.nombre, ' ', a.apellidoPaterno, ' ', a.apellidoMaterno)
        SEPARATOR ', '
      ) AS autor,

      e.idEjemplar,
      e.codigoBarra,
      e.ubicacionFisica,
      e.idEstado

    FROM libro l
    LEFT JOIN libro_autor la ON l.idLibro = la.idLibro
    LEFT JOIN autor a ON la.idAutor = a.idAutor
    LEFT JOIN ejemplar e ON l.idLibro = e.idLibro

    WHERE l.titulo LIKE ?
    GROUP BY l.idLibro, e.idEjemplar
    LIMIT 20
  `;

  db.query(sql, [`${titulo}%`], (err, results) => {
    if (err) {
      console.error("ERROR BUSQUEDA:", err);
      return res.status(500).json(err);
    }

    // 🔥 AGRUPAR EJEMPLARES POR LIBRO
    const libros = {};

    results.forEach(row => {
      if (!libros[row.idLibro]) {
        libros[row.idLibro] = {
          idLibro: row.idLibro,
          titulo: row.titulo,
          anioPublicacion: row.anioPublicacion,
          autor: row.autor,
          ejemplares: []
        };
      }

      if (row.idEjemplar) {
        libros[row.idLibro].ejemplares.push({
          idEjemplar: row.idEjemplar,
          codigoBarra: row.codigoBarra,
          ubicacionFisica: row.ubicacionFisica,
          idEstado: row.idEstado
        });
      }
    });

    res.json(Object.values(libros));
  });
});

app.get("/usuarios/buscar", (req, res) => {
  const { nombre } = req.query;

  if (!nombre || nombre.trim().length < 2) {
    return res.json([]);
  }

  const sql = `
    SELECT idUsuario, nombre, usuario
    FROM usuario
    WHERE nombre LIKE ? OR usuario LIKE ?
    LIMIT 10
  `;

  db.query(sql, [`%${nombre}%`, `%${nombre}%`], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});
app.post("/reserva/aceptar/:idReserva", async (req, res) => {
  const { idReserva } = req.params;
  const connection = db.promise();

  try {
    await connection.beginTransaction();

    // 1️⃣ Obtener reserva
    const [reserva] = await connection.query(
      "SELECT * FROM reserva WHERE idReserva = ? AND estado = 'notificada'",
      [idReserva]
    );

    if (reserva.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: "Reserva no válida" });
    }

    const r = reserva[0];

    // 2️⃣ Buscar ejemplar disponible
    const [ejemplar] = await connection.query(
      `SELECT * FROM ejemplar
       WHERE idLibro = ?
       AND idEstado = 1
       LIMIT 1 FOR UPDATE`,
      [r.idLibro]
    );

    if (ejemplar.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        message: "Ya no hay ejemplares disponibles"
      });
    }

    // 3️⃣ Crear préstamo
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + 7);

    await connection.query(
      `INSERT INTO prestamo
       (idUsuario, idEjemplar, fechaLimite, estado)
       VALUES (?, ?, ?, 'activo')`,
      [r.idUsuario, ejemplar[0].idEjemplar, fechaLimite]
    );

    // 4️⃣ Cambiar ejemplar a prestado
    await connection.query(
      "UPDATE ejemplar SET idEstado = 2 WHERE idEjemplar = ?",
      [ejemplar[0].idEjemplar]
    );

    // 5️⃣ Marcar reserva completada
    await connection.query(
      "UPDATE reserva SET estado = 'completada' WHERE idReserva = ?",
      [idReserva]
    );

    await connection.commit();

    res.json({ message: "Préstamo generado correctamente" });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: "Error al aceptar reserva" });
  }
});
app.get("/mis-reservas/:idUsuario", (req, res) => {
  const { idUsuario } = req.params;

  db.query(
    `SELECT r.idReserva, r.estado, l.titulo
     FROM reserva r
     JOIN libro l ON r.idLibro = l.idLibro
     WHERE r.idUsuario = ?
     AND r.estado != 'completada'`,
    [idUsuario],
    (err, rows) => {
      if (err) return res.status(500).json({ msg: "Error" });
      res.json(rows);
    }
  );
});
// =============================
// CREAR RESERVA
// =============================
app.post("/reserva", async (req, res) => {
  const { idUsuario, idLibro } = req.body;

  if (!idUsuario || !idLibro) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  try {
    const connection = db.promise();

    // 🔎 Verificar que no tenga reserva activa
    const [existe] = await connection.query(
      `SELECT * FROM reserva
       WHERE idUsuario = ?
       AND idLibro = ?
       AND estado IN ('activa', 'notificada')`,
      [idUsuario, idLibro]
    );

    if (existe.length > 0) {
      return res.status(400).json({
        message: "Ya tienes una reserva activa de este libro"
      });
    }

    // ✅ Insertar reserva
    await connection.query(
      `INSERT INTO reserva (idUsuario, idLibro, estado)
       VALUES (?, ?, 'activa')`,
      [idUsuario, idLibro]
    );

    res.json({ message: "Reserva creada correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando reserva" });
  }
});

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en puerto ${PORT}`)

);