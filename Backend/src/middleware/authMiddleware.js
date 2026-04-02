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
        error: "Token has expired. Please refresh your session.",
      });
    }

    // JsonWebTokenError: signature mismatch, malformed token, etc.
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        error: "Invalid token. Please log in again.",
      });
    }

    // Catch-all for any other unexpected JWT errors
    return res.status(401).json({
      success: false,
      error: "Authentication failed.",
    });
  }
};


// ─────────────────────────────────────────────
// MIDDLEWARE: optionalAuth  (soft — does not block if missing)
// ─────────────────────────────────────────────
/**
 * Silently attaches req.user if a valid token is provided.
 * Does NOT block the request if the token is absent or invalid.
 *
 * Useful for routes that work for both guests and logged-in users,
 * where you want to personalize the response when authenticated.
 *
 * Usage:  router.get("/public", optionalAuth, controller)
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null; // Explicitly mark as unauthenticated
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    // Token is present but invalid — treat as unauthenticated (don't throw)
    req.user = null;
  }

  next();
};
