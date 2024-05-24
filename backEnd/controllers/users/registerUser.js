const getPool = require("../../db/getPool");
const bcrypt = require("bcrypt");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body; // Agrega phone aquí
    const pool = getPool();
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length > 0) {
      throw new Error("Ya existe un usuario con ese email");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, phone]
    );
    res.status(201).send({ status: "ok", message: "Usuario creado" });
  } catch (error) {
    next(error);
  }
};

module.exports = registerUser;
