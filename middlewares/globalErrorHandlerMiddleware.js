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
