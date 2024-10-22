import React from 'react';
import { Link } from 'react-router-dom';
import { MdLogout, MdAccountCircle } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { logout } from '../../Redux/Auth/authSlice';
import { useSelector } from "react-redux";

const ProfileMenu = ({ onClose }) => {
  const dispatch = useDispatch();
  const language = useSelector((state) => state.language.language);

  // Lấy vai trò từ localStorage
  const role = localStorage.getItem('userRole'); 

  const handleLogout = () => {
    dispatch(logout()); // Gọi action logout từ Redux
    onClose(); // Đóng menu sau khi nhấn Đăng xuất
  };

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-stone-800 rounded-md shadow z-10">
      <Link
        to={`/${role}/profile`} // Sử dụng vai trò để xác định liên kết
        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-stone-700"
        onClick={onClose}
      >
        <MdAccountCircle className="inline mr-2" />
        {language === 'vi' ? 'Quản lý tài khoản' : 'Manage Account'}
      </Link>

      <Link
        to="/login"
        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-stone-700"
        onClick={handleLogout}
      >
        <MdLogout className="inline mr-2" />
        {language === 'vi' ? 'Đăng xuất' : 'Logout'}
      </Link>
    </div>
  );
};

export default ProfileMenu;
