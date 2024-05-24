const getPool = require("../../db/getPool");

// Función para obtener la lista de citas.
const listAppointments = async (req, res, next) => {
  try {
    const pool = getPool();

    const [appointments] = await pool.query(
      "SELECT * FROM appointments WHERE date >= CURDATE() ORDER BY date ASC"
    );

    res.json({ status: "ok", data: appointments });
  } catch (error) {
    next(error);
  }
};

module.exports = listAppointments;
