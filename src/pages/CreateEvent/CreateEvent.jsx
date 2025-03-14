import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Image,
  Info,
  FileText,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  X,
  Loader,
} from "lucide-react";
import { getLocationApi, postEventApi } from "../../services/eventApi";

const CreateEventPage = () => {
  // Current step tracker
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  // Form state
  const [formData, setFormData] = useState({
    eventName: "",
    eventDescription: "",
    eventDate: "",
    eventTime: "",
    city: "",
    district: "",
    address: "",
    eventImage: "",
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [locations, setLocations] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  // Load location data on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocationApi();
        setLocations(data);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        setError("Không thể tải dữ liệu địa điểm");
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  // Update districts when city changes
  useEffect(() => {
    if (formData.city) {
      const cityData = locations.find(
        (c) => c.code.toString() === formData.city,
      );
      if (cityData && cityData.districts) {
        setDistricts(cityData.districts);

        // Reset district if it's not valid in the new city
        const districtExists = cityData.districts.some(
          (d) => d.code.toString() === formData.district,
        );

        if (!districtExists) {
          setFormData((prev) => ({ ...prev, district: "" }));
        }
      }
    } else {
      setDistricts([]);
    }
  }, [formData.city, locations]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear errors when user makes changes
  };

  // Handle image URL validation
  const handleImageUrlValidation = (url) => {
    if (!url) return true;

    // Simple URL validation
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i",
    ); // fragment locator

    return pattern.test(url);
  };

  // Validate the current step
  const validateCurrentStep = () => {
    setError("");

    if (currentStep === 1) {
      if (!formData.eventName) {
        setError("Vui lòng nhập tên sự kiện");
        return false;
      }
      if (!formData.eventDescription) {
        setError("Vui lòng nhập mô tả sự kiện");
        return false;
      }
      if (
        formData.eventImage &&
        !handleImageUrlValidation(formData.eventImage)
      ) {
        setError("URL hình ảnh không hợp lệ");
        return false;
      }
      return true;
    }

    if (currentStep === 2) {
      if (!formData.eventDate) {
        setError("Vui lòng chọn ngày sự kiện");
        return false;
      }
      if (!formData.city) {
        setError("Vui lòng chọn tỉnh/thành phố");
        return false;
      }
      if (!formData.district) {
        setError("Vui lòng chọn quận/huyện");
        return false;
      }
      if (!formData.address) {
        setError("Vui lòng nhập địa chỉ cụ thể");
        return false;
      }
      return true;
    }

    return false;
  };

  // Navigate to next step
  const goToNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  // Navigate to previous step
  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Prepare date
      const eventDateTime = formData.eventTime
        ? new Date(`${formData.eventDate}T${formData.eventTime}:00`)
        : new Date(formData.eventDate);

      // Get names instead of codes
      const cityData = locations.find(
        (c) => c.code.toString() === formData.city,
      );
      const districtData = districts.find(
        (d) => d.code.toString() === formData.district,
      );

      const eventData = {
        eventName: formData.eventName,
        eventDescription: formData.eventDescription,
        eventDate: eventDateTime.toISOString(),
        city: cityData ? cityData.name : formData.city,
        district: districtData ? districtData.name : formData.district,
        address: formData.address,
        eventImage: formData.eventImage || "",
      };

      await postEventApi(eventData);
      setSuccess(true);

      // Reset form after success
      setTimeout(() => {
        setFormData({
          eventName: "",
          eventDescription: "",
          eventDate: "",
          eventTime: "",
          city: "",
          district: "",
          address: "",
          eventImage: "",
        });
        setCurrentStep(1);
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.message || "Lỗi khi tạo sự kiện. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if a field is filled
  const isFieldComplete = (fieldName) => {
    return formData[fieldName] && formData[fieldName].length > 0;
  };

  // Get city name from code
  const getCityName = (code) => {
    const city = locations.find((c) => c.code.toString() === code);
    return city ? city.name : "";
  };

  // Get district name from code
  const getDistrictName = (code) => {
    const district = districts.find((d) => d.code.toString() === code);
    return district ? district.name : "";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-primary py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Tạo Sự Kiện Mới
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Chia sẻ thông tin về sự kiện của bạn để bắt đầu bán vé
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Bước {currentStep}/{totalSteps}
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {currentStep === 1
                  ? "Thông tin sự kiện"
                  : "Thời gian & Địa điểm"}
              </div>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div
                className="h-full bg-primary-DEFAULT rounded-full transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Main Form */}
          <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-lg overflow-hidden">
            {success ? (
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Sự kiện đã được tạo thành công!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Sự kiện của bạn đã được tạo và đã sẵn sàng để bán vé.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-3 bg-primary-DEFAULT text-white rounded-lg shadow hover:bg-primary-dark transition-colors"
                >
                  Tạo sự kiện khác
                </button>
              </div>
            ) : (
              <div>
                {/* Error notification */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 m-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <X className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                        Thông tin sự kiện
                      </h2>

                      {/* Event Name */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tên sự kiện <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Info className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="eventName"
                            value={formData.eventName}
                            onChange={handleChange}
                            className={`block w-full pl-10 pr-3 py-3 border ${
                              isFieldComplete("eventName")
                                ? "border-green-300 dark:border-green-700"
                                : "border-gray-300 dark:border-gray-600"
                            } rounded-lg bg-white dark:bg-dark-accent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light`}
                            placeholder="Nhập tên sự kiện"
                          />
                          {isFieldComplete("eventName") && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <Check className="h-5 w-5 text-green-500" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Event Description */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Mô tả sự kiện <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute top-3 left-3 pointer-events-none">
                            <FileText className="h-5 w-5 text-gray-400" />
                          </div>
                          <textarea
                            name="eventDescription"
                            value={formData.eventDescription}
                            onChange={handleChange}
                            rows={5}
                            className={`block w-full pl-10 pr-3 py-3 border ${
                              isFieldComplete("eventDescription")
                                ? "border-green-300 dark:border-green-700"
                                : "border-gray-300 dark:border-gray-600"
                            } rounded-lg bg-white dark:bg-dark-accent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light`}
                            placeholder="Mô tả chi tiết về sự kiện..."
                          />
                          {isFieldComplete("eventDescription") && (
                            <div className="absolute top-3 right-3">
                              <Check className="h-5 w-5 text-green-500" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Event Image URL */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          URL hình ảnh sự kiện
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Image className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="url"
                            name="eventImage"
                            value={formData.eventImage}
                            onChange={handleChange}
                            className={`block w-full pl-10 pr-3 py-3 border ${
                              isFieldComplete("eventImage")
                                ? "border-green-300 dark:border-green-700"
                                : "border-gray-300 dark:border-gray-600"
                            } rounded-lg bg-white dark:bg-dark-accent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light`}
                            placeholder="https://example.com/image.jpg"
                          />
                          {isFieldComplete("eventImage") && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <Check className="h-5 w-5 text-green-500" />
                            </div>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Nhập URL hình ảnh đại diện cho sự kiện (không bắt
                          buộc)
                        </p>
                      </div>

                      {/* Image Preview */}
                      {isFieldComplete("eventImage") && (
                        <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Xem trước hình ảnh
                          </p>
                          <div className="aspect-video bg-gray-100 dark:bg-dark-accent rounded-lg overflow-hidden">
                            <img
                              src={formData.eventImage}
                              alt="Event preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/640x360?text=Image+not+available";
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Navigation */}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={goToNextStep}
                          className="px-6 py-3 bg-primary-DEFAULT text-white rounded-lg shadow hover:bg-primary-dark transition-colors flex items-center gap-2"
                        >
                          <span>Tiếp theo</span>
                          <ArrowRight className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Date & Location */}
                  {currentStep === 2 && (
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                        Thời gian & Địa điểm
                      </h2>

                      {/* Date and Time */}
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
                          Thời gian sự kiện
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Date */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Ngày sự kiện{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="date"
                                name="eventDate"
                                value={formData.eventDate}
                                onChange={handleChange}
                                className={`block w-full pl-10 pr-3 py-3 border ${
                                  isFieldComplete("eventDate")
                                    ? "border-green-300 dark:border-green-700"
                                    : "border-gray-300 dark:border-gray-600"
                                } rounded-lg bg-white dark:bg-dark-accent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light`}
                              />
                            </div>
                          </div>

                          {/* Time */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Thời gian bắt đầu
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Clock className="h-5 w-5 text-gray-400" />
                              </div>
                              <input
                                type="time"
                                name="eventTime"
                                value={formData.eventTime}
                                onChange={handleChange}
                                className={`block w-full pl-10 pr-3 py-3 border ${
                                  isFieldComplete("eventTime")
                                    ? "border-green-300 dark:border-green-700"
                                    : "border-gray-300 dark:border-gray-600"
                                } rounded-lg bg-white dark:bg-dark-accent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light`}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Location */}
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
                          Địa điểm sự kiện
                        </h3>

                        {/* City */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Tỉnh/Thành phố{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              className={`block w-full pl-10 pr-8 py-3 border ${
                                isFieldComplete("city")
                                  ? "border-green-300 dark:border-green-700"
                                  : "border-gray-300 dark:border-gray-600"
                              } rounded-lg bg-white dark:bg-dark-accent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light appearance-none`}
                            >
                              <option value="">Chọn tỉnh/thành phố</option>
                              {loadingLocations ? (
                                <option disabled>Đang tải...</option>
                              ) : (
                                locations.map((city) => (
                                  <option
                                    key={city.code}
                                    value={city.code.toString()}
                                  >
                                    {city.name}
                                  </option>
                                ))
                              )}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        {/* District */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Quận/Huyện <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <select
                              name="district"
                              value={formData.district}
                              onChange={handleChange}
                              disabled={
                                !formData.city || districts.length === 0
                              }
                              className={`block w-full pl-10 pr-8 py-3 border ${
                                isFieldComplete("district")
                                  ? "border-green-300 dark:border-green-700"
                                  : "border-gray-300 dark:border-gray-600"
                              } rounded-lg bg-white dark:bg-dark-accent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light appearance-none disabled:opacity-60 disabled:cursor-not-allowed`}
                            >
                              <option value="">Chọn quận/huyện</option>
                              {districts.map((district) => (
                                <option
                                  key={district.code}
                                  value={district.code.toString()}
                                >
                                  {district.name}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </div>

                        {/* Address */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Địa chỉ cụ thể{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <MapPin className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={handleChange}
                              className={`block w-full pl-10 pr-3 py-3 border ${
                                isFieldComplete("address")
                                  ? "border-green-300 dark:border-green-700"
                                  : "border-gray-300 dark:border-gray-600"
                              } rounded-lg bg-white dark:bg-dark-accent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light`}
                              placeholder="Số nhà, tên đường..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Event Summary */}
                      {(formData.eventName || formData.city) && (
                        <div className="mb-6">
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">
                            Tóm tắt sự kiện
                          </h3>
                          <div className="bg-gray-50 dark:bg-dark-accent/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col md:flex-row gap-4">
                              {formData.eventImage && (
                                <div className="md:w-1/3">
                                  <img
                                    src={formData.eventImage}
                                    alt="Event"
                                    className="w-full h-32 object-cover rounded-lg"
                                    onError={(e) => {
                                      e.target.src =
                                        "https://via.placeholder.com/640x360?text=Image+not+available";
                                    }}
                                  />
                                </div>
                              )}
                              <div
                                className={
                                  formData.eventImage ? "md:w-2/3" : "w-full"
                                }
                              >
                                {formData.eventName && (
                                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                                    {formData.eventName}
                                  </h4>
                                )}
                                {formData.eventDescription && (
                                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                                    {formData.eventDescription}
                                  </p>
                                )}
                                <div className="flex flex-wrap gap-2">
                                  {formData.eventDate && (
                                    <div className="inline-flex items-center text-xs bg-gray-200 dark:bg-dark-secondary px-2 py-1 rounded">
                                      <Calendar className="h-3 w-3 mr-1" />
                                      {new Date(
                                        formData.eventDate,
                                      ).toLocaleDateString()}
                                      {formData.eventTime &&
                                        ` ${formData.eventTime}`}
                                    </div>
                                  )}
                                  {formData.city && (
                                    <div className="inline-flex items-center text-xs bg-gray-200 dark:bg-dark-secondary px-2 py-1 rounded">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      {getCityName(formData.city)}
                                      {formData.district &&
                                        `, ${getDistrictName(
                                          formData.district,
                                        )}`}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Navigation */}
                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={goToPrevStep}
                          className="px-4 py-2 bg-white dark:bg-dark-accent text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-primary transition-colors flex items-center gap-2"
                        >
                          <ArrowLeft className="h-5 w-5" />
                          <span>Quay lại</span>
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-6 py-3 bg-primary-DEFAULT text-white rounded-lg shadow hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <Loader className="h-5 w-5 animate-spin" />
                              <span>Đang xử lý...</span>
                            </>
                          ) : (
                            <>
                              <span>Tạo sự kiện</span>
                              <Check className="h-5 w-5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;
