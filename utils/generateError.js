const generateError = (msg, code) => {
  const err = new Error(msg);
  err.status = code;
  throw err;
};

module.exports = generateError;
