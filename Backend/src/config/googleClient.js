import { OAuth2Client } from "google-auth-library";

/**
 * Google OAuth2 client — initialized once and reused.
 * GOOGLE_CLIENT_ID must match the client ID used on the frontend
 * when triggering the Google Sign-In button (via @react-oauth/google or gsi/client).
 */
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verify a Google ID token sent from the frontend.
 *
 * The frontend (after Google Sign-In) receives a credential (ID token string).
 * It sends that token to our backend, and we verify it here with Google's servers.
 *
 * @param {string} idToken - The raw Google ID token string from the client
 * @returns {object} Decoded payload: { sub, email, name, picture, email_verified }
 * @throws Will throw if the token is invalid, expired, or from a different client
 */
export const verifyGoogleToken = async (idToken) => {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID, // Must match the token's intended audience
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error("Invalid Google token: no payload returned.");
  }

  if (!payload.email_verified) {
    throw new Error("Google account email is not verified.");
  }

  return payload;
};
