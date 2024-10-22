import React, { useEffect, useState } from "react";
import Locations from '../Locations/Locations'; // Ensure correct path
import { FaCalendarAlt, FaUser, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useSelector } from "react-redux";

const EditProfile = ({ user, onSave, onCancel }) => {
  const [profileData, setProfileData] = useState({
    dateOfBirth: '',
    gender: '',
    address: '',
    contactNumber: ''
  });
  const [error, setError] = useState({});
  const language = useSelector((state) => state.language.language);

  useEffect(() => {
    if (user) {
      setProfileData({
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.slice(0, 10) : '', // Format date for input
        gender: user.gender || '',
        address: user.address || '',
        contactNumber: user.contactNumber || ''
      });
    }
  }, [user]);

  const formatPhoneNumber = (value) => {
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length > 3 && numericValue.length <= 6) {
      return numericValue.replace(/(\d{3})(\d{1,3})/, "$1-$2");
    } else if (numericValue.length > 6) {
      return numericValue.replace(/(\d{3})(\d{3})(\d{1,4})/, "$1-$2-$3");
    }
    return numericValue;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = name === "contactNumber" ? formatPhoneNumber(value) : value;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: formattedValue,
    }));

    const phoneNumberRegex = /^0\d{2}-\d{3}-\d{4}$/;
    if (name === "contactNumber" && !phoneNumberRegex.test(formattedValue)) {
      setError((prevError) => ({
        ...prevError,
        contactNumber: language === 'vi' ? "Số điện thoại không hợp lệ" : "Invalid phone number"
      }));
    } else {
      setError((prevError) => ({
        ...prevError,
        contactNumber: ""
      }));
    }
  };

  const handleAddressChange = (e) => {
    setProfileData((prevState) => ({
      ...prevState,
      address: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    let newError = {};
    const phoneNumberRegex = /^0\d{2}-\d{3}-\d{4}$/;
    if (!profileData.contactNumber) {
      newError.contactNumber = language === 'vi' ? "Vui lòng nhập số điện thoại của bạn" : "Please enter your contact number";
    } else if (!phoneNumberRegex.test(profileData.contactNumber)) {
      newError.contactNumber = language === 'vi' ? "Số điện thoại phải bắt đầu bằng 0 và theo định dạng 012-345-6789" : "Phone number must start with 0 and follow the format 012-345-6789";
    }
    setError(newError);
    if (Object.keys(newError).length > 0) return;

    try {
      const userId = localStorage.getItem("username");
      if (!userId) throw new Error("User ID not found in localStorage");

      const response = await fetch(`${process.env.REACT_APP_API_URL}auth/profile/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) throw new Error("Failed to update profile");

      alert(language === 'vi' ? "Hồ sơ đã được cập nhật thành công" : "Profile updated successfully");
      onSave(); // Notify parent component about the successful update
    } catch (error) {
      console.error("Error updating profile:", error);
      setError((prevError) => ({
        ...prevError,
        general: language === 'vi' ? "Cập nhật hồ sơ không thành công. Vui lòng thử lại." : "Failed to update profile. Please try again."
      }));
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto border bg-white dark:bg-stone-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-stone-900 dark:text-stone-100">
        {language === 'vi' ? 'Chỉnh sửa hồ sơ' : 'Edit Profile'}
      </h2>
      {error.general && <p className="text-red-500 mb-2">{error.general}</p>}
      {error.contactNumber && <p className="text-red-500 mb-2">{error.contactNumber}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col">
        {user && (
          <p className="mb-4 text-stone-700 dark:text-stone-300">
            {language === 'vi' ? 'Địa chỉ cũ: ' : 'Old Address: '} {user.address || (language === 'vi' ? 'Chưa cung cấp địa chỉ' : 'No address provided')}
          </p>
        )}
        <Locations address={profileData.address} onChange={handleAddressChange} />
        <label className="flex items-center mb-2">
          <FaCalendarAlt className="text-stone-400 mr-2" />
          <input
            type="date"
            name="dateOfBirth"
            value={profileData.dateOfBirth}
            onChange={handleChange}
            className="input flex-1"
          />
        </label>
        <label className="flex items-center mb-2">
          <FaUser className="text-stone-400 mr-2" />
          <select
            name="gender"
            value={profileData.gender}
            onChange={handleChange}
            className="input flex-1"
          >
            <option value="" disabled>{language === 'vi' ? 'Chọn giới tính' : 'Select Gender'}</option>
            <option value="Male">{language === 'vi' ? 'Nam' : 'Male'}</option>
            <option value="Female">{language === 'vi' ? 'Nữ' : 'Female'}</option>
            <option value="Other">{language === 'vi' ? 'Khác' : 'Other'}</option>
          </select>
        </label>
        <label className="flex items-center mb-2">
          <FaPhoneAlt className="text-stone-400 mr-2" />
          <input
            type="text"
            name="contactNumber"
            value={profileData.contactNumber}
            onChange={handleChange}
            placeholder={language === 'vi' ? "Số điện thoại" : "Contact Number"}
            className="input flex-1"
          />
        </label>
        <button type="submit" className="btn bg-stone-500 text-white p-2 rounded">
          {language === 'vi' ? 'Lưu thay đổi' : 'Save Changes'}
        </button>
        <button type="button" onClick={onCancel} className="btn bg-stone-500 text-white p-2 rounded mt-2">
          {language === 'vi' ? 'Hủy' : 'Cancel'}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
