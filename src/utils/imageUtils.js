/**
 * Converts a Base64 string to an image URL that can be used in <img> tags
 * @param {string} base64String - The Base64 string to convert
 * @param {string} contentType - The content type of the image (default: 'image/png')
 * @returns {string} - The data URL for the image
 */
export const base64ToImageUrl = (base64String, contentType = 'image/png') => {
  // Check if the base64String already has a data URL prefix
  if (base64String.startsWith('data:')) {
    return base64String;
  }
  
  // Create a data URL from the Base64 string
  return `data:${contentType};base64,${base64String}`;
};

/**
 * Downloads a Base64 image
 * @param {string} base64String - The Base64 string of the image
 * @param {string} fileName - The name to save the file as
 * @param {string} contentType - The content type of the image (default: 'image/png')
 */
export const downloadBase64Image = (base64String, fileName = 'qrcode', contentType = 'image/png') => {
  const imageUrl = base64ToImageUrl(base64String, contentType);
  
  // Create an anchor element for downloading
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = `${fileName}.png`;
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};