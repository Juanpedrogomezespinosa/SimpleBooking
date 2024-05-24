const getPool = require("../../db/getPool");
const { validationResult } = require("express-validator");

// Función para crear una cita.
const createAppointment = async (req, res, next) => {
  try {
    const { userId } = req; // Obtener el ID del usuario del token de autenticación

    const { name, email, phone, date, time } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        errors: errors.array(),
      });
    }

    const pool = getPool();

    // Insertar una nueva cita en la base de datos, asociada al usuario correspondiente
    const [result] = await pool.query(
      "INSERT INTO appointments (name, email, phone, date, time, user_id) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, phone, date, time, userId] // Añadir userId al insert
    );

    const newAppointmentId = result.insertId;

    res.status(201).json({
      status: "ok",
      message: "Cita creada",
      appointmentId: newAppointmentId,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = createAppointment;
