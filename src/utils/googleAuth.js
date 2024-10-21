import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(import.meta.env.VITE_GOOGLE_CLIENT_ID);

export async function getGoogleIdToken(accessToken) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: accessToken,
      audience: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    // Payload chứa thông tin người dùng và ID token
    return {
      idToken: accessToken, // Trong trường hợp này, accessToken chính là ID token
      userData: {
        email: payload["email"],
        name: payload["name"],
        picture: payload["picture"],
      },
    };
  } catch (error) {
    console.error("Error verifying Google token:", error);
    throw error;
  }
}
