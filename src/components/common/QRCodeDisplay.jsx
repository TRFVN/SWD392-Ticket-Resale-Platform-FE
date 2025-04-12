import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { base64ToImageUrl, downloadBase64Image } from '../../utils/imageUtils';

/**
 * Component for displaying QR codes from Base64 data with download option
 * 
 * @param {Object} props - Component props
 * @param {string} props.base64Data - The Base64 string of the QR code
 * @param {string} props.altText - Alt text for the QR code image
 * @param {number} props.size - Size of the QR code image in pixels
 * @param {boolean} props.showDownloadButton - Whether to show the download button
 * @param {string} props.downloadFileName - File name for downloaded QR code
 * @returns {JSX.Element} QR Code display component
 */
const QRCodeDisplay = ({ 
  base64Data,
  altText = "QR Code",
  size = 200,
  showDownloadButton = true,
  downloadFileName = "qrcode"
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!base64Data) {
    return <div className="text-red-500">No QR code data available</div>;
  }

  const imageUrl = base64ToImageUrl(base64Data);
  
  const handleDownload = () => {
    downloadBase64Image(base64Data, downloadFileName);
  };
  
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  
  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="flex flex-col items-center">
      {isLoading && <div className="text-sm text-gray-500">Loading QR code...</div>}
      
      {hasError ? (
        <div className="text-red-500">Failed to load QR code</div>
      ) : (
        <img 
          src={imageUrl} 
          alt={altText}
          width={size} 
          height={size}
          className={`${isLoading ? 'hidden' : 'block'} border border-gray-200 rounded-md`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
      
      {showDownloadButton && !hasError && !isLoading && (
        <button 
          onClick={handleDownload}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Download QR Code
        </button>
      )}
    </div>
  );
};

QRCodeDisplay.propTypes = {
  base64Data: PropTypes.string.isRequired,
  altText: PropTypes.string,
  size: PropTypes.number,
  showDownloadButton: PropTypes.bool,
  downloadFileName: PropTypes.string
};

export default QRCodeDisplay;