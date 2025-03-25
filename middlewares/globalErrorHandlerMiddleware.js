// eslint-disable-next-line no-unused-vars
const globalErrorHandler = (error, req, res, next) => {
  if (error.name === "CastError") {
    error.statusCode = 400;
    error.message = "INVALID VALUE PASSED";
  }
  if (error.code === 11000) {
    error.statusCode = 400;
    error.message = "DUPLICATE VALUE ENTERED";
  }
  if (error.name === "ValidationError") {
    error.message = Object.values(error.errors)
      .map((value) => value.message)
      .join(", ");
    error.statusCode = 400;
  }
  if (error.name === "TypeError") {
    error.statusCode = 400; // or 500, depending on your use case
    error.message = "TYPE ERROR: Incorrect data type provided";
  }
  if (error.name === "JsonWebTokenError") {
    error.statusCode = 401;
    error.message = "Invalid token";
  }

  error.statusCode = error.statusCode || 500;
  error.message = error.message || "SOMETHING WENT WRONG";

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    stack: error.stack,
    error: error,
  });
};

export default globalErrorHandler;
