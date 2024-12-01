const { adminAuth } = require("../config/firebase");
const ApiError = require("../utils/ApiError");
const { status } = require("http-status");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      new ApiError(
        status.UNAUTHORIZED,
        "Authorization token missing or invalid"
      )
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodeValue = await adminAuth.verifyIdToken(token);
    if (decodeValue) {
      req.user = decodeValue;
      return next();
    }
  } catch (error) {
    console.error(error);
    next(new ApiError(status.UNAUTHORIZED, "Invalid or expired token"));
  }
};

module.exports = auth;
