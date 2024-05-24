const getPool = require("../../db/getPool");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateError = require("../../utils/generateError");

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const pool = getPool();

    const [[user]] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (!user) {
      generateError("Email o contraseña incorrectos", 401);
    }

    const isPasswordOk = await bcrypt.compare(password, user.password);

    if (!isPasswordOk) {
      generateError("Email o contraseña incorrectos", 401);
    }

    const tokenData = {
      id: user.id,
    };

    const token = jwt.sign(tokenData, process.env.SECRET, {
      expiresIn: "7d",
    });

    res.json({
      status: "ok",
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = loginUser;
