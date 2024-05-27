const jwt = require("jsonwebtoken");
const generateError = require("../utils/generateError");

const validateAuth = (req, res, next) => {
  try {
    const { authorization: token } = req.headers;

    if (!token) {
      return next(generateError("Falta la cabecera de autorización", 401));
    }

    let tokenData;

    try {
      tokenData = jwt.verify(token, process.env.SECRET);
      req.userId = tokenData.id; // Asigna el ID de usuario al campo userId en req
      next();
    } catch (err) {
      console.error(err);
      return next(generateError("Token inválido", 401));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = validateAuth;
