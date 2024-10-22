import React, { useState } from "react";
import { FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector } from "react-redux";

const ChangePassword = ({ onSuccess, onCancel }) => {
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const language = useSelector((state) => state.language.language);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return language === 'vi' ? "Mật khẩu mới phải có ít nhất 8 ký tự" : "New password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return language === 'vi' ? "Mật khẩu mới phải chứa ít nhất một chữ cái viết hoa" : "New password must contain at least one uppercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return language === 'vi' ? "Mật khẩu mới phải chứa ít nhất một số" : "New password must contain at least one number";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validatePassword(passwordData.newPassword);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError(language === 'vi' ? "Mật khẩu mới và xác nhận mật khẩu không khớp" : "New password and confirm password do not match");
      return;
    }

    try {
      const userId = localStorage.getItem("username");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ userId, ...passwordData }),
        }
      );

      if (!response.ok) {
        throw new Error(language === 'vi' ? "Đổi mật khẩu thất bại" : "Failed to change password");
      }

      alert(language === 'vi' ? "Đổi mật khẩu thành công" : "Password changed successfully");
      onSuccess(); // Notify parent component about the successful change
    } catch (error) {
      console.error(language === 'vi' ? "Lỗi khi đổi mật khẩu:" : "Error changing password:", error);
      setError(language === 'vi' ? "Đổi mật khẩu thất bại. Vui lòng thử lại." : "Failed to change password. Please try again.");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white dark:bg-stone-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-stone-900 dark:text-stone-100">
        {language === 'vi' ? "Đổi mật khẩu" : "Change Password"}
      </h2>

      <p className="text-xs text-stone-600 dark:text-stone-400 mb-2">
        {language === 'vi' ? "- Mật khẩu phải có ít nhất 8 ký tự" : "- Password must be at least 8 characters long"}
      </p>
      <p className="text-xs text-stone-600 dark:text-stone-400 mb-2">
        {language === 'vi' ? "- Chứa ít nhất một chữ cái viết hoa và một số" : "- Contain at least one uppercase letter and one number"}
      </p>
      
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="relative my-4">
          <input
            type={showPassword ? "text" : "password"}
            name="oldPassword"
            value={passwordData.oldPassword}
            onChange={handleChange}
            placeholder={language === 'vi' ? "Mật khẩu cũ" : "Old Password"}
            className="input w-full p-2 border rounded dark:bg-stone-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute inset-y-0 end-0 px-3 flex items-center text-stone-500 dark:text-stone-400"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handleChange}
            placeholder={language === 'vi' ? "Mật khẩu mới" : "New Password"}
            className="input w-full p-2 border rounded dark:bg-stone-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute inset-y-0 end-0 px-3 flex items-center text-stone-500 dark:text-stone-400"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handleChange}
            placeholder={language === 'vi' ? "Xác nhận mật khẩu" : "Confirm Password"}
            className="input w-full p-2 border rounded dark:bg-stone-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="button"
            onClick={toggleShowPassword}
            className="absolute inset-y-0 end-0 px-3 flex items-center text-stone-500 dark:text-stone-400"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <button
          type="submit"
          className="btn bg-stone-500 text-white p-2 rounded"
        >
          <FaCheck className="inline mr-2" /> {language === 'vi' ? "Đổi mật khẩu" : "Change Password"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="btn bg-stone-500 text-white p-2 rounded mt-2"
        >
          {language === 'vi' ? "Hủy" : "Cancel"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;