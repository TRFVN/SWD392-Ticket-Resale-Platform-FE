import axios from "axios";

/**
 * Authenticates a user with Google by sending the token to the backend API
 * @param {string} tokenGoogle - The Google auth token
 * @returns {Promise<Object>} The authentication response from the backend
 */
export async function signInWithGoogle(tokenGoogle) {
  try {
    if (!tokenGoogle) {
      throw new Error("No Google token provided");
    }

    // Call the backend API
    const response = await axios.post(
      "https://tickethub-fpgfa9ara4b6czbe.southeastasia-01.azurewebsites.net/sign-in-by-google",
      { tokenGoogle },
      {
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        timeout: 10000, // 10 second timeout
      },
    );

    // Check if the response has the expected format
    if (response.data && typeof response.data === "object") {
      // Add success flag if it doesn't exist
      if (typeof response.data.isSuccess === "undefined") {
        response.data.isSuccess = !!response.data.result;
      }

      // Store tokens if login is successful
      if (response.data.isSuccess && response.data.result) {
        const { accessToken, refreshToken } = response.data.result;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Set default authorization header for future requests
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
      }

      return response.data;
    }

    throw new Error("Invalid response format from authentication server");
  } catch (error) {
    // Handle specific axios errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(
        "Authentication server error:",
        error.response.status,
        error.response.data,
      );
      throw (
        error.response.data || {
          message: `Authentication failed with status ${error.response.status}`,
          isSuccess: false,
        }
      );
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response from authentication server", error.request);
      throw {
        message:
          "Authentication server not responding. Please try again later.",
        isSuccess: false,
      };
    } else if (error.code === "ECONNABORTED") {
      // Timeout error
      console.error("Authentication request timed out");
      throw {
        message:
          "Authentication request timed out. Please check your connection and try again.",
        isSuccess: false,
      };
    }

    // For other errors, return the error or a default message
    console.error("Google authentication error:", error.message || error);
    throw {
      message: error.message || "Failed to authenticate with Google",
      isSuccess: false,
    };
  }
}
