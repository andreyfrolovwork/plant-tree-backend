const ApiError = require("../exceptions/api-error");

module.exports = function (err, req, res, next) {
  console.log(err);
  const stack = err.stack.split("/\n");
  stack.forEach((at) => {
    console.log(at);
  });
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: "Непредвиденная ошибка" });
};
