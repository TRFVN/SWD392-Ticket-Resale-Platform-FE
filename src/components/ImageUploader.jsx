import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader } from "lucide-react";
import { uploadImageApi, validateImage } from "../services/uploadImage";

const ImageUploader = ({
  imageType,
  onImageUploaded,
  existingImageUrl = null,
  label = "Upload Image",
  className = "",
  maxSizeMB = 5,
}) => {
  const [preview, setPreview] = useState(existingImageUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    const validation = validateImage(file, maxSizeMB);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    // Clear previous errors
    setError("");

    // Show preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    try {
      setUploading(true);
      const imageUrl = await uploadImageApi(file, imageType);
      onImageUploaded(imageUrl);
      setUploading(false);
    } catch (error) {
      setError(error.message || "Failed to upload image");
      setUploading(false);
    }
  };

  const clearImage = () => {
    setPreview(null);
    onImageUploaded("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`relative ${className}`}>
      {error && (
        <div className="mb-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {!preview ? (
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-dark-accent/20 hover:bg-gray-100 dark:hover:bg-dark-accent/30 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Click to upload (max {maxSizeMB}MB)
          </p>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto object-cover"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            <X className="h-4 w-4" />
          </button>

          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Loader className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
        accept="image/jpeg,image/png,image/gif,image/webp"
      />
    </div>
  );
};

export default ImageUploader;
