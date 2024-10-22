import React, { useState, useEffect } from "react";
import EditProfile from "./EditProfile";
import ChangePassword from "./ChangePassword";
import AddEmail from "./AddEmail";
import { FaEdit, FaLock, FaEnvelope } from "react-icons/fa";
import {
  MdEmail,
  MdDateRange,
  MdPerson,
  MdLocationOn,
  MdPhone,
} from "react-icons/md";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import Loading from "../Loading/Loading"

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [addingEmail, setAddingEmail] = useState(false);
  const language = useSelector((state) => state.language.language);

  const fetchUserProfile = async () => {
    try {
      const userId = localStorage.getItem("username");
      if (!userId) throw new Error("User ID not found in localStorage");

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}auth/profile/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch user profile");

      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleProfileSave = () => {
    setEditingProfile(false);
    fetchUserProfile(); // Re-fetch user data after profile update
  };

  const handleProfileCancel = () => {
    setEditingProfile(false);
  };

  const handlePasswordSuccess = () => {
    setChangingPassword(false);
    fetchUserProfile(); // Re-fetch user data after password change
  };

  const handleEmailSuccess = () => {
    setAddingEmail(false);
    fetchUserProfile(); // Re-fetch user data after adding new email
  };

  const ProfileField = ({ icon, label, value }) => (
    <div className="flex items-center space-x-2 text-stone-700 dark:text-stone-300">
      <span className="text-stone-400 dark:text-stone-500">{icon}</span>
      <span className="font-medium">{label}:</span>
      <span>{value}</span>
    </div>
  );

  const ActionButton = ({ onClick, icon, label }) => (
    <button
      onClick={onClick}
      className="flex items-center px-4 py-2 bg-stone-500 hover:bg-stone-600 text-white rounded-full transition-colors duration-300">
      {React.cloneElement(icon, { className: "mr-2" })}
      <span>{label}</span>
    </button>
  );

  // Format dateOfBirth to display only day, month, and year
  const formattedDateOfBirth = user?.dateOfBirth
    ? format(new Date(user.dateOfBirth), "dd MMMM yyyy")
    : "N/A";

  return (
    <section className="p-6 max-w-4xl mx-auto bg-white dark:bg-stone-800 rounded-lg shadow transition-all duration-300">
      {loading ? (
         <Loading />
      ) : (
        <>
          {editingProfile ? (
            <EditProfile
              user={user}
              onSave={handleProfileSave}
              onCancel={handleProfileCancel}
            />
          ) : changingPassword ? (
            <ChangePassword
              onSuccess={handlePasswordSuccess}
              onCancel={() => setChangingPassword(false)}
            />
          ) : addingEmail ? (
            <AddEmail
              onSuccess={handleEmailSuccess}
              onCancel={() => setAddingEmail(false)}
            />
          ) : (
            <article className="text-center">
              <div className="relative inline-block">
                <img
                  src={`${process.env.REACT_APP_API_URL}${user.avatar}`}
                  alt={language === 'vi' ? "Ảnh đại diện" : "Avatar"}
                  className="m-4 w-60 h-60 rounded-full object-cover mx-auto border-4 border-stone-200 dark:border-stone-600 shadow"
                />
              </div>
              <h2 className="text-stone-600 dark:text-stone-400 mt-2 text-lg font-medium">
                {language === 'vi' ? 'Vai trò:' : 'Role:'} {user.role}
              </h2>
              <h2 className="text-3xl font-bold mt-2 text-stone-800 dark:text-stone-100">
                {user.lastName} {user.firstName}
              </h2>
              <p className="text-stone-600 dark:text-stone-400 mt-4 text-lg font-medium">
                {language === 'vi' ? 'Tên người dùng:' : 'Username:'} {user.username}
              </p>

              <div className="relative inline-block text-center text-stone-600 dark:text-stone-400 mt-2 text-lg font-medium">
                <ProfileField
                  icon={<MdEmail className="text-stone-400" />}
                  label={language === 'vi' ? 'Email' : 'Email'}
                  value={user.email}
                />
                <ProfileField
                  icon={<MdDateRange className="text-stone-400" />}
                  label={language === 'vi' ? 'Ngày sinh' : 'Date of Birth'}
                  value={formattedDateOfBirth}
                />
                <ProfileField
                  icon={<MdPerson className="text-stone-400" />}
                  label={language === 'vi' ? 'Giới tính' : 'Gender'}
                  value={user.gender}
                />
                <ProfileField
                  icon={<MdLocationOn className="text-stone-400" />}
                  label={language === 'vi' ? 'Địa chỉ' : 'Address'}
                  value={user.address}
                />
                <ProfileField
                  icon={<MdPhone className="text-stone-400" />}
                  label={language === 'vi' ? 'Số điện thoại' : 'Contact Number'}
                  value={user.contactNumber}
                />
              </div>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <ActionButton
                  onClick={() => setEditingProfile(true)}
                  icon={<FaEdit />}
                  label={language === 'vi' ? 'Chỉnh sửa hồ sơ' : 'Edit Profile'}
                />
                <ActionButton
                  onClick={() => setChangingPassword(true)}
                  icon={<FaLock />}
                  label={language === 'vi' ? 'Đổi mật khẩu' : 'Change Password'}
                />
                <ActionButton
                  onClick={() => setAddingEmail(true)}
                  icon={<FaEnvelope />}
                  label={language === 'vi' ? 'Thêm email mới' : 'Add New Email'}
                />
              </div>
            </article>
          )}
        </>
      )}
    </section>
  );
};

export default Profile;
