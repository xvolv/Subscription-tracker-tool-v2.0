class customError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.message = message || "SOMETHING WENT WRONG";
    Error.captureStackTrace(this, this.constructor);
  }
}
export default customError;
