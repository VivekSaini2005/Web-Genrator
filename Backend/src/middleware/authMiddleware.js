import jwt from "jsonwebtoken";

// ─────────────────────────────────────────────
// MIDDLEWARE: verifyToken  (strict — 401 if missing)
// ─────────────────────────────────────────────
/**
 * Protects routes that require a valid, authenticated user.
 *
 * Usage:  router.get("/protected", verifyToken, controller)
 *
 * Expects request header:
 *   Authorization: Bearer <access_token>
 *
 * On success → attaches decoded payload to req.user and calls next()
 * On failure → returns standardized 401 { success: false, error }
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Header must exist and follow "Bearer <token>" format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized. No access token provided.",
    });
  }

  const token = authHeader.split(" ")[1];

  // Guard against empty token after splitting
  if (!token || token.trim() === "") {
    return res.status(401).json({
      success: false,
      error: "Unauthorized. Malformed authorization header.",
    });
  }

  try {
    // Verify signature and expiry — throws if either fails
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user payload { id, email, iat, exp } to request
    req.user = decoded;

    next();
  } catch (error) {
    // TokenExpiredError: token is valid but past its expiry time
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "TOKEN_EXPIRED",
      });
    }

    // JsonWebTokenError: signature mismatch, malformed token, etc.
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "INVALID_TOKEN",
      });
    }

    // Catch-all for any other unexpected JWT errors
    return res.status(401).json({
      success: false,
      error: "Authentication failed.",
    });
  }
};

