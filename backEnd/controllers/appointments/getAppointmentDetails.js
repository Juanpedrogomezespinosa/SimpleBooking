const getPool = require("../../db/getPool");

// Función para obtener detalles de una cita.
const getAppointmentDetails = async (req, res, next) => {
  try {
    const { appointmentId } = req.params;

    const pool = getPool();

    // Consulta para obtener detalles de una cita.
    const [[appointment]] = await pool.query(
      "SELECT * FROM appointments WHERE id = ?",
      [appointmentId]
    );

    if (!appointment) {
      throw new Error("Cita no encontrada");
    }

    res.json({
      status: "ok",
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getAppointmentDetails;
