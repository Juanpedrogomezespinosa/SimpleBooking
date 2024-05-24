const notFoundHandler = (err, req, res, next) => {
  res.status(404).json({
    status: "error",
    message: "Ruta no encontrada",
  });
};

module.exports = notFoundHandler;
