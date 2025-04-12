import axiosInstance from "../config/axiosConfig";

/**
 * Uploads an image file to the server
 * @param {File} file - The file object to upload
 * @param {string} imageType - Type of image (event, ticket, user, resale)
 * @returns {Promise<string>} - URL of the uploaded image
 */
export const uploadImageApi = async (file, imageType) => {
  try {
    // Create form data for multipart/form-data request
    const formData = new FormData();
    formData.append("file", file);
    formData.append("imageType", imageType);

    const response = await axiosInstance.post("/Upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200 || response.status === 201) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || "Failed to upload image");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error(error.message || "Failed to upload image");
  }
};

/**
 * Replaces an existing image with a new one
 * @param {File} file - The new file to upload
 * @param {string} imageType - Type of image (event, ticket, user, resale)
 * @param {string} oldImageUrl - URL of the image to replace
 * @returns {Promise<string>} - URL of the new uploaded image
 */
export const replaceImageApi = async (file, imageType, oldImageUrl) => {
  try {
    // Create form data for multipart/form-data request
    const formData = new FormData();
    formData.append("file", file);
    formData.append("imageType", imageType);
    formData.append("oldImageUrl", oldImageUrl);

    const response = await axiosInstance.post("/Upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200 || response.status === 201) {
      return response.data.result;
    } else {
      throw new Error(response.data.message || "Failed to replace image");
    }
  } catch (error) {
    console.error("Error replacing image:", error);
    throw new Error(error.message || "Failed to replace image");
  }
};

/**
 * Deletes an image from the server
 * @param {string} imageUrl - URL of the image to delete
 * @returns {Promise<Object>} - Response data
 */
export const deleteImageApi = async (imageUrl) => {
  try {
    const response = await axiosInstance.delete("/Upload", {
      data: { imageUrl },
    });

    if (response.status === 200 || response.status === 204) {
      return response.data;
    } else {
      throw new Error(`Failed to delete image at ${imageUrl}`);
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    throw new Error(error.message || "Failed to delete image");
  }
};

/**
 * Helper function to determine folder based on imageType
 * @param {string} imageType - Type of image (event, ticket, user, resale)
 * @returns {string} - Folder name for the image type
 */
export const getImageFolder = (imageType) => {
  const folderMap = {
    user: "UserAvatars",
    ticket: "TicketImages",
    event: "EventImages",
    resale: "ResaleListings",
  };

  return folderMap[imageType.toLowerCase()] || "OtherImages";
};

/**
 * Validates an image file before upload
 * @param {File} file - The file to validate
 * @param {number} maxSizeMB - Maximum file size in MB (default: 5)
 * @returns {Object} - { valid: boolean, message: string }
 */
export const validateImage = (file, maxSizeMB = 5) => {
  // Check if file exists
  if (!file) {
    return { valid: false, message: "No file selected" };
  }

  // Check file type
  const acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!acceptedTypes.includes(file.type)) {
    return {
      valid: false,
      message:
        "Invalid file type. Please upload a JPG, PNG, GIF, or WebP image",
    };
  }

  // Check file size (convert MB to bytes)
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { valid: false, message: `File size exceeds ${maxSizeMB}MB limit` };
  }

  return { valid: true, message: "File is valid" };
};
