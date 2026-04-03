import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  findUserByEmail,
  createUser,
  storeRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
} from "../models/userModel.js";
import { verifyGoogleToken } from "../config/googleClient.js";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const SALT_ROUNDS = 12;                              // bcrypt cost factor
const ACCESS_TOKEN_EXPIRY = "15m";                   // Short-lived access token
const REFRESH_TOKEN_EXPIRY = "7d";                   // Long-lived refresh token
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/**
 * Validate email format using RFC-safe regex.
 */
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/**
 * Build a standardized success response.
 * All successful auth responses follow: { success, message, user, accessToken }
 */
const successResponse = (res, statusCode, message, data = {}) =>
  res.status(statusCode).json({ success: true, message, ...data });

/**
 * Build a standardized error response.
 * All error responses follow: { success: false, error }
 */
const errorResponse = (res, statusCode, message) =>
  res.status(statusCode).json({ success: false, error: message });

/**
 * Generate a signed JWT access token (short-lived: 15m).
 * Payload: { id, email } — never includes password.
 */
const generateAccessToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );

/**
 * Generate a signed JWT refresh token (long-lived: 7d).
 * Stored in the sessions table — allows issuing new access tokens.
 */
const generateRefreshToken = (user) =>
  jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );

/**
 * Set the refresh token as a secure httpOnly cookie.
 * httpOnly = JavaScript cannot read it (XSS protection)
 * sameSite = 'lax' works in Postman and same-origin browsers
 */
const setRefreshCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,                       // Cannot be accessed by JS — XSS safe
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "lax",                      // Works in Postman + same-site browsers
    maxAge: REFRESH_TOKEN_EXPIRY_MS,      // 7 days (in milliseconds)
  });
};

/**
 * Clear the refresh token cookie on logout.
 */
const clearRefreshCookie = (res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};


// ─────────────────────────────────────────────
// CONTROLLER: REGISTER
// POST /api/auth/register
// Body: { name, email, password }
// ─────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ── Input Validation ──────────────────────
    if (!name || !email || !password) {
      return errorResponse(res, 400, "Name, email, and password are required.");
    }

    if (!isValidEmail(email)) {
      return errorResponse(res, 400, "Invalid email format.");
    }

    if (password.length < 6) {
      return errorResponse(res, 400, "Password must be at least 6 characters.");
    }

    // ── Duplicate Check ───────────────────────
    const existing = await findUserByEmail(email.toLowerCase().trim());
    if (existing) {
      return errorResponse(res, 409, "An account with this email already exists.");
    }

    // ── Hash Password ─────────────────────────
    // bcrypt.hash is async — never block the event loop with sync hashing
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // ── Create User in DB ─────────────────────
    const newUser = await createUser(
      name.trim(),                       // $1 name
      email.toLowerCase().trim(),        // $2 email
      hashedPassword,                    // $3 password (bcrypt hashed)
      "local",                           // $4 provider
      null                               // $5 avatar_url (none on registration)
    );

    // ── Generate Tokens ───────────────────────
    const accessToken  = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    const expiresAt    = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);

    // Save refresh token to sessions table
    await storeRefreshToken(newUser.id, refreshToken, expiresAt);

    // Set refresh token as httpOnly cookie
    // In Postman: visible under Cookies tab after this request
    setRefreshCookie(res, refreshToken);

    // ── Respond ───────────────────────────────
    // accessToken goes in the body — store it in memory on the frontend
    // refreshToken is in the cookie — do NOT store it in localStorage
    return successResponse(res, 201, "Account created successfully.", {
      user: newUser,
      accessToken,
    });

  } catch (error) {
    console.error("[AUTH] Register error:", error.message);
    return errorResponse(res, 500, "Registration failed. Please try again.");
  }
};


// ─────────────────────────────────────────────
// CONTROLLER: LOGIN
// POST /api/auth/login
// Body: { email, password }
// ─────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ── Input Validation ──────────────────────
    if (!email || !password) {
      return errorResponse(res, 400, "Email and password are required.");
    }

    if (!isValidEmail(email)) {
      return errorResponse(res, 400, "Invalid email format.");
    }

    // ── Lookup User ───────────────────────────
    const user = await findUserByEmail(email.toLowerCase().trim());

    // Generic message prevents email enumeration attacks
    if (!user) {
      return errorResponse(res, 401, "Invalid email or password.");
    }

    // ── Block Google-Only Accounts ────────────
    if (user.provider === "google") {
      return errorResponse(
        res, 401,
        "This account uses Google Sign-In. Please login with Google."
      );
    }

    // ── Verify Password ───────────────────────
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, 401, "Invalid email or password.");
    }

    // ── Generate Tokens ───────────────────────
    const accessToken  = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const expiresAt    = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);

    // Save new session to DB
    await storeRefreshToken(user.id, refreshToken, expiresAt);

    // Set refresh token as httpOnly cookie
    setRefreshCookie(res, refreshToken);

    // Strip password before sending user object
    const { password: _removed, ...safeUser } = user;

    // ── Respond ───────────────────────────────
    return successResponse(res, 200, "Login successful.", {
      user: safeUser,
      accessToken,
      // refreshToken is in the cookie — not in the body
    });

  } catch (error) {
    console.error("[AUTH] Login error:", error.message);
    return errorResponse(res, 500, "Login failed. Please try again.");
  }
};


// ─────────────────────────────────────────────
// CONTROLLER: LOGOUT
// POST /api/auth/logout
// Reads refreshToken from cookie (preferred) or body (fallback)
// ─────────────────────────────────────────────
export const logout = async (req, res) => {
  try {
    // Read token from cookie first, fall back to request body
    // Cookie = normal frontend flow | Body = Postman / manual API call
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      return errorResponse(res, 400, "Refresh token is required.");
    }

    // Delete the session from DB — token can never be reused
    await deleteRefreshToken(token);

    // Clear the cookie from the browser
    clearRefreshCookie(res);

    return successResponse(res, 200, "Logged out successfully.");

  } catch (error) {
    console.error("[AUTH] Logout error:", error.message);
    return errorResponse(res, 500, "Logout failed. Please try again.");
  }
};


// ─────────────────────────────────────────────
// CONTROLLER: REFRESH TOKEN
// POST /api/auth/refresh
// Body: { refreshToken } OR cookie named 'refreshToken'
// ─────────────────────────────────────────────
export const refreshToken = async (req, res) => {
  try {
    // Cookie = normal flow | Body = Postman testing
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      return errorResponse(res, 400, "Refresh token is required.");
    }

    // ── Verify JWT Signature + Expiry ─────────
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      return errorResponse(res, 401, "Invalid or expired refresh token.");
    }

    // ── Check DB Session ──────────────────────
    // Ensures token hasn't been revoked (e.g., after logout)
    const session = await findRefreshToken(token);
    if (!session) {
      return errorResponse(res, 401, "Refresh token has been revoked.");
    }

    // Double-check DB-stored expiry as a second layer of validation
    if (new Date() > new Date(session.expires_at)) {
      await deleteRefreshToken(token); // Clean up expired session
      return errorResponse(res, 401, "Session expired. Please log in again.");
    }

    // ── Issue New Access Token ────────────────
    const accessToken = generateAccessToken({ id: decoded.id, email: decoded.email });

    return successResponse(res, 200, "Token refreshed successfully.", { accessToken });

  } catch (error) {
    console.error("[AUTH] Refresh error:", error.message);
    return errorResponse(res, 500, "Token refresh failed.");
  }
};


// ─────────────────────────────────────────────
// CONTROLLER: GOOGLE OAUTH LOGIN
// POST /api/auth/google
// Body: { idToken }  ← credential from Google Sign-In on the frontend
// ─────────────────────────────────────────────
export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return errorResponse(res, 400, "Google ID token is required.");
    }

    // ── Verify token with Google's servers ────
    // Throws if the token is expired, tampered, or issued for a different client
    let googlePayload;
    try {
      googlePayload = await verifyGoogleToken(idToken);
    } catch (err) {
      return errorResponse(res, 401, `Google token verification failed: ${err.message}`);
    }

    // Extract verified profile data from the Google payload
    const { sub: googleId, email, name, picture: avatar_url, email_verified } = googlePayload;

    if (!email_verified) {
      return errorResponse(res, 401, "Google account email is not verified.");
    }

    // ── Check if user exists ──────────────────
    let user = await findUserByEmail(email.toLowerCase());

    if (user) {
      // ── Existing user: block if registered locally ──
      // Allow if they previously signed in with Google
      if (user.provider === "local") {
        return errorResponse(
          res, 409,
          "An account with this email already exists. Please login with your password."
        );
      }
      // Google user exists → just issue new tokens (login flow)
    } else {
      // ── New user: auto-create account ────────
      // No password set — provider = 'google'
      user = await createUser(
        name || email.split("@")[0],  // $1 name (fallback to email prefix)
        email.toLowerCase(),          // $2 email
        null,                         // $3 password (Google users have no password)
        "google",                     // $4 provider
        avatar_url || null            // $5 avatar_url (Google profile photo)
      );
    }

    // ── Issue Tokens ──────────────────────────
    const accessToken  = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const expiresAt    = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);

    // Store refresh token in sessions table
    await storeRefreshToken(user.id, refreshToken, expiresAt);

    // Set refresh token as httpOnly cookie
    setRefreshCookie(res, refreshToken);

    // Strip password field if somehow present
    const { password: _removed, ...safeUser } = user;

    // ── Respond ───────────────────────────────
    return successResponse(res, 200, "Google login successful.", {
      user: safeUser,
      accessToken,
      // refreshToken is in the cookie
    });

  } catch (error) {
    console.error("[AUTH] Google login error:", error.message);
    return errorResponse(res, 500, "Google login failed. Please try again.");
  }
};
