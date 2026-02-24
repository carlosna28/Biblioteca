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
// REGISTRO
// =============================
app.post("/usuario", async (req, res) => {
  try {
    const { nombre, apellidoPaterno, apellidoMaterno, pass, idTipoUsuario,user,numControl } = req.body;

    if (!nombre || !apellidoPaterno || !apellidoMaterno || !pass || !idTipoUsuario || !user) {
      return res.status(400).json({ msg: "Todos los campos obligatorios" });
    }

    if (pass.length < 6 || pass.length > 16) {
      return res.status(400).json({ msg: "La contraseña debe tener entre 6 y 16 caracteres" });
    }

    const hashedPass = await bcrypt.hash(pass, 10);

    const sql = `
      INSERT INTO usuario 
      (idTipoUsuario, nombre, apellidoPaterno, apellidoMaterno, contrasena,user,numControl)
      VALUES (?, ?, ?, ?, ?,?,?)
    `;

    db.query(
      sql,
      [idTipoUsuario, nombre, apellidoPaterno, apellidoMaterno, hashedPass,user,numControl],
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
// LOGIN-USUARIO
// =============================
app.post("/login", (req, res) => {
  const { user, pass } = req.body;

  if (!user || !pass) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios" });
  }

  const sql = `
    SELECT idUsuario, user, contrasena  
    FROM usuario
    WHERE user = ?
  `;

  db.query(sql, [user], async (err, results) => {
    if (err) {
      console.error("Error login:", err);
      return res.status(500).json({ msg: "Error del servidor" });
    }

    if (results.length === 0) {
      return res.status(401).json({ msg: "Usuario no encontrado" });
    }

    const usuarioDB = results[0];

    const match = await bcrypt.compare(pass, usuarioDB.contrasena);

    if (!match) {
      return res.status(401).json({ msg: "Contraseña incorrecta" });
    }

    res.json({
      msg: "Login correcto",
      usuario: {
        id: usuarioDB.idUsuario
      }
    });
  });
});

// =============================
// LOGIN-Bibliotecario
// =============================
app.post("/bibliotecario", (req, res) => {
  const { usuario, password } = req.body;
  
  if (!usuario || !password) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios" });
  }

  const sql = `
    SELECT * FROM bibliotecario 
    WHERE usuario = ? 
  `;

  db.query(sql, [usuario], async (err, results) => {
    if (err) {
      console.error("Error login:", err);
      return res.status(500).json({ msg: "Error del servidor" });
    }

    if (results.length === 0) {
      return res.status(401).json({ msg: "Usuario no encontrado" });
    }

    const usuarioDB = results[0];

   const match = password === usuarioDB.password;

    if (!match) {
      return res.status(401).json({ msg: "Contraseña incorrecta" });
    }

    res.json({
      msg: "Login correcto",
      usuario: {
        id: usuarioDB.idBibliotecario,
        nombre: usuarioDB.nombre
      }
    });
  });
});




// =============================
const PORT = 3001;
app.listen(PORT, () =>
  console.log(`Servidor corriendo en puerto ${PORT}`)
);
