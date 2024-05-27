const getPool = require("../../db/getPool");
const { validationResult } = require("express-validator");
const generateError = require("../../utils/generateError");

// Función para crear una cita.
const createAppointment = async (req, res, next) => {
  try {
    const { name, email, phone, date, time } = req.body;
    const userId = req.userId; // Usar req.userId en lugar de req.auth.id

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        errors: errors.array(),
      });
    }

    // Convertir la fecha a un objeto Date para verificar el día de la semana.
    const appointmentDate = new Date(date);
    const dayOfWeek = appointmentDate.getUTCDay(); // Domingo = 0, Lunes = 1, ..., Sábado = 6

    // Validar que la cita esté dentro de los intervalos permitidos y en los días correctos.
    const validTimesWeekdays = [
      "10:00:00",
      "10:30:00",
      "11:00:00",
      "11:30:00",
      "12:00:00",
      "12:30:00",
      "13:00:00",
      "13:30:00",
      "16:00:00",
      "16:30:00",
      "17:00:00",
      "17:30:00",
      "18:00:00",
      "18:30:00",
      "19:00:00",
      "19:30:00",
    ];
    const validTimesSaturday = [
      "10:00:00",
      "10:30:00",
      "11:00:00",
      "11:30:00",
      "12:00:00",
      "12:30:00",
      "13:00:00",
      "13:30:00",
    ];

    if (dayOfWeek === 0) {
      return res.status(400).json({
        status: "error",
        message: "Las citas no pueden ser agendadas los domingos.",
      });
    }

    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      // Lunes a Viernes
      if (!validTimesWeekdays.includes(time)) {
        return res.status(400).json({
          status: "error",
          message:
            "Las citas solo pueden ser agendadas en intervalos de 30 minutos entre las 10:00-13:30 y 16:00-20:00 de lunes a viernes.",
        });
      }
    } else if (dayOfWeek === 6) {
      // Sábado
      if (!validTimesSaturday.includes(time)) {
        return res.status(400).json({
          status: "error",
          message:
            "Las citas solo pueden ser agendadas en intervalos de 30 minutos entre las 10:00-13:30 los sábados.",
        });
      }
    }

    // Verificar que la hora sea un intervalo de 30 minutos.
    const [hours, minutes, seconds] = time.split(":").map(Number);
    if (minutes !== 0 && minutes !== 30) {
      return res.status(400).json({
        status: "error",
        message:
          "Las citas solo pueden ser agendadas cada media hora. Por favor, elija un horario en punto o y media.",
      });
    }

    const pool = getPool();

    // Verificar si ya existe una cita en el mismo horario.
    const [[existingAppointment]] = await pool.query(
      "SELECT * FROM appointments WHERE DATE(date) = ? AND TIME(date) = ?",
      [date, time]
    );

    if (existingAppointment) {
      return res.status(400).json({
        status: "error",
        message:
          "La cita a la hora seleccionada ya está ocupada. Por favor, elija otro horario disponible.",
      });
    }

    // Insertar una nueva cita en la base de datos.
    const [result] = await pool.query(
      "INSERT INTO appointments (name, email, phone, date, user_id, time) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, phone, `${date} ${time}`, userId, time]
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
