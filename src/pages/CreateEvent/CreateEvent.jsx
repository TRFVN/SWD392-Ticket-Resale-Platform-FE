import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Info,
  FileText,
  ChevronDown,
  Check,
  X,
  Loader,
} from "lucide-react";
import { getLocationApi, postEventApi } from "../../services/eventApi";
import { getAllCategoryApi } from "../../services/categoryApi";
import ImageUploader from "../../components/ImageUploader";

const CreateEventPage = () => {
  // Current step tracker - simplified to only 1 step
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 1; // Changed from 2 to 1

  // Form state
  const [formData, setFormData] = useState({
    eventName: "",
    eventDescription: "",
    eventDate: "",
    eventTime: "",
    categoryId: "",
    location: "",
    eventImage: "",
    city: "",
    district: "",
    address: "",
  });

  // UI states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [locations, setLocations] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categories, setCategories] = useState([]);

  // Load categories and location data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        setLoadingCategories(true);
        const categoryData = await getAllCategoryApi();
        if (categoryData && categoryData.length > 0) {
          setCategories(categoryData);
          // Set default category to the first one
          setFormData((prev) => ({
            ...prev,
            categoryId: categoryData[0].categoryId,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setError("Không thể tải danh mục sự kiện");
      } finally {
        setLoadingCategories(false);
      }

      try {
        // Fetch locations
        setLoadingLocations(true);
        const locationData = await getLocationApi();
        setLocations(locationData);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
        setError("Không thể tải dữ liệu địa điểm");
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchData();
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

  // Handle category change
  const handleCategoryChange = (e) => {
    setFormData((prev) => ({ ...prev, categoryId: e.target.value }));
    setError("");
  };

  // Handle event image upload
  const handleEventImageUploaded = (imageUrl) => {
    setFormData((prev) => ({ ...prev, eventImage: imageUrl }));
  };

  // Handle location changes - combined city, district, address into one location field
  const handleLocationChange = () => {
    const cityName = formData.city ? getCityName(formData.city) : "";
    const districtName = formData.district
      ? getDistrictName(formData.district)
      : "";
    const address = formData.address || "";

    // Combine all location information into one string
    const locationValue = [address, districtName, cityName]
      .filter(Boolean)
      .join(", ");

    setFormData((prev) => ({
      ...prev,
      location: locationValue,
    }));
  };

  // Update location whenever address, district or city changes
  useEffect(() => {
    handleLocationChange();
  }, [formData.city, formData.district, formData.address]);

  // Validate the form
  const validateForm = () => {
    setError("");

    if (!formData.eventName) {
      setError("Vui lòng nhập tên sự kiện");
      return false;
    }
    if (!formData.eventDescription) {
      setError("Vui lòng nhập mô tả sự kiện");
      return false;
    }
    if (!formData.categoryId) {
      setError("Vui lòng chọn loại sự kiện");
      return false;
    }
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
    if (!formData.location) {
      setError("Vui lòng nhập địa điểm đầy đủ");
      return false;
    }
    return true;
  };

  // Submit the event form
  const handleSubmitEvent = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Prepare date
      const eventDateTime = formData.eventTime
        ? new Date(`${formData.eventDate}T${formData.eventTime}:00`)
        : new Date(formData.eventDate);

      // Create payload for API - simplified to match the requested format
      const eventData = {
        eventName: formData.eventName,
        eventDescription: formData.eventDescription,
        eventDate: eventDateTime.toISOString(),
        categoryId: formData.categoryId,
        location: formData.location,
        eventImage: formData.eventImage || "",
      };

      // Call API to create event
      const result = await postEventApi(eventData);

      if (result) {
        setSuccess(true);

        // Reset form after success
        setTimeout(() => {
          setFormData({
            eventName: "",
            eventDescription: "",
            eventDate: "",
            eventTime: "",
            categoryId: categories.length > 0 ? categories[0].categoryId : "",
            location: "",
            eventImage: "",
            city: "",
            district: "",
            address: "",
          });
          setSuccess(false);
        }, 3000);
      } else {
        throw new Error("Không thể tạo sự kiện");
      }
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
          <div className="bg-light-primary dark:bg-dark-primary rounded-xl shadow-md p-6 mb-6 border border-gray-200/70 dark:border-dark-accent/30">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Tạo Sự Kiện Mới
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Chia sẻ thông tin về sự kiện của bạn
            </p>
          </div>

          {/* Progress Bar - simplified for 1 step */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Bước {currentStep}/{totalSteps}
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Thông tin sự kiện
              </div>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-DEFAULT dark:bg-primary-light rounded-full transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Main Form */}
          <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-lg overflow-hidden border border-gray-200/50 dark:border-dark-accent/20">
            {success ? (
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                  Sự kiện đã được tạo thành công!
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Sự kiện của bạn đã được tạo thành công.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-3 bg-primary-DEFAULT text-white rounded-lg shadow hover:bg-primary-dark focus:ring-2 focus:ring-primary-light/50 focus:outline-none transition duration-200"
                >
                  Tạo sự kiện khác
                </button>
              </div>
            ) : (
              <div>
                {/* Error notification */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 p-4 m-6">
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

                {/* Event Information Form */}
                <form onSubmit={handleSubmitEvent}>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                      <Info className="h-5 w-5 text-primary-DEFAULT dark:text-primary-light mr-2" />
                      Thông tin sự kiện
                    </h2>

                    {/* Event Name */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tên sự kiện <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Info className="h-5 w-5 text-gray-400 group-focus-within:text-primary-DEFAULT dark:group-focus-within:text-primary-light transition-colors" />
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
                          } rounded-lg bg-white dark:bg-dark-accent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light transition duration-200`}
                          placeholder="Nhập tên sự kiện"
                        />
                        {isFieldComplete("eventName") && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <Check className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Event Category */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Loại sự kiện <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Info className="h-5 w-5 text-gray-400 group-focus-within:text-primary-DEFAULT dark:group-focus-within:text-primary-light transition-colors" />
                        </div>
                        {loadingCategories ? (
                          <div className="flex items-center pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-accent text-gray-400">
                            <Loader className="h-4 w-4 animate-spin mr-2" />
                            Đang tải danh mục...
                          </div>
                        ) : (
                          <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleCategoryChange}
                            className={`block w-full pl-10 pr-8 py-3 border ${
                              isFieldComplete("categoryId")
                                ? "border-green-300 dark:border-green-700"
                                : "border-gray-300 dark:border-gray-600"
                            } rounded-lg bg-white dark:bg-dark-accent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light appearance-none transition duration-200`}
                          >
                            <option value="">Chọn loại sự kiện</option>
                            {categories.map((category) => (
                              <option
                                key={category.categoryId}
                                value={category.categoryId}
                              >
                                {category.categoryName}
                              </option>
                            ))}
                          </select>
                        )}
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Event Description */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mô tả sự kiện <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <div className="absolute top-3 left-3 pointer-events-none">
                          <FileText className="h-5 w-5 text-gray-400 group-focus-within:text-primary-DEFAULT dark:group-focus-within:text-primary-light transition-colors" />
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
                          } rounded-lg bg-white dark:bg-dark-accent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light transition duration-200`}
                          placeholder="Mô tả chi tiết về sự kiện..."
                        />
                        {isFieldComplete("eventDescription") && (
                          <div className="absolute top-3 right-3">
                            <Check className="h-5 w-5 text-green-500" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Event Image Upload */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Hình ảnh sự kiện
                      </label>
                      <ImageUploader
                        imageType="event"
                        onImageUploaded={handleEventImageUploaded}
                        existingImageUrl={formData.eventImage}
                        label="Tải lên hình ảnh sự kiện"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Tải lên hình ảnh đại diện cho sự kiện (không bắt buộc)
                      </p>
                    </div>

                    {/* Date and Time */}
                    <div className="mb-8 bg-gray-50 dark:bg-dark-accent/20 p-4 rounded-lg border border-gray-200/70 dark:border-dark-accent/30">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4 flex items-center">
                        <Calendar className="h-4 w-4 text-primary-DEFAULT dark:text-primary-light mr-2" />
                        Thời gian sự kiện
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Date */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Ngày sự kiện <span className="text-red-500">*</span>
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Calendar className="h-5 w-5 text-gray-400 group-focus-within:text-primary-DEFAULT dark:group-focus-within:text-primary-light transition-colors" />
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
                              } rounded-lg bg-white dark:bg-dark-accent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light transition duration-200`}
                            />
                          </div>
                        </div>

                        {/* Time */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Thời gian bắt đầu
                          </label>
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Clock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-DEFAULT dark:group-focus-within:text-primary-light transition-colors" />
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
                              } rounded-lg bg-white dark:bg-dark-accent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light transition duration-200`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="mb-8 bg-gray-50 dark:bg-dark-accent/20 p-4 rounded-lg border border-gray-200/70 dark:border-dark-accent/30">
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4 flex items-center">
                        <MapPin className="h-4 w-4 text-primary-DEFAULT dark:text-primary-light mr-2" />
                        Địa điểm sự kiện
                      </h3>

                      {/* City */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tỉnh/Thành phố <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-primary-DEFAULT dark:group-focus-within:text-primary-light transition-colors" />
                          </div>
                          <select
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className={`block w-full pl-10 pr-8 py-3 border ${
                              isFieldComplete("city")
                                ? "border-green-300 dark:border-green-700"
                                : "border-gray-300 dark:border-gray-600"
                            } rounded-lg bg-white dark:bg-dark-accent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light appearance-none transition duration-200`}
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
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-primary-DEFAULT dark:group-focus-within:text-primary-light transition-colors" />
                          </div>
                          <select
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            disabled={!formData.city || districts.length === 0}
                            className={`block w-full pl-10 pr-8 py-3 border ${
                              isFieldComplete("district")
                                ? "border-green-300 dark:border-green-700"
                                : "border-gray-300 dark:border-gray-600"
                            } rounded-lg bg-white dark:bg-dark-accent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light appearance-none disabled:opacity-60 disabled:cursor-not-allowed transition duration-200`}
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
                          Địa chỉ cụ thể <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-primary-DEFAULT dark:group-focus-within:text-primary-light transition-colors" />
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
                            } rounded-lg bg-white dark:bg-dark-accent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary-light transition duration-200`}
                            placeholder="Số nhà, tên đường..."
                          />
                        </div>
                      </div>

                      {/* Hidden Location Field (Automatically populated) */}
                      <input
                        type="hidden"
                        name="location"
                        value={formData.location}
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-primary-DEFAULT text-white rounded-lg shadow hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-light/50 disabled:hover:bg-primary-DEFAULT"
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
