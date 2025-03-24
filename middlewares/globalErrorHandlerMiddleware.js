const globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "Something went wrong";
  res.status(error.statusCode || 500).json({
    status: "FAIL",
    message: error.message,
    stack: error.stack,
    error: error,
  });
};

export default globalErrorHandler;
