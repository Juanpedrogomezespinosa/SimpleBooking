const registerUser = async (req, res, next) => {
  try {
    const { name, phone, password } = req.body;
    const pool = getPool();

    // Verificar si el usuario ya existe
    const [users] = await pool.query("SELECT * FROM users WHERE phone = ?", [
      phone,
    ]);
    if (users.length > 0) {
      throw new Error("Ya existe un usuario con ese número de teléfono");
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    await pool.query(
      "INSERT INTO users (name, phone, password) VALUES (?, ?, ?)",
      [name, phone, hashedPassword]
    );

    res.status(201).send({ status: "ok", message: "Usuario creado" });
  } catch (error) {
    next(error);
  }
};

module.exports = registerUser;
