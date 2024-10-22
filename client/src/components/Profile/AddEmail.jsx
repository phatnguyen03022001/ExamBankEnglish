import React, { useState } from 'react';
import { FaEnvelope, FaCheck } from 'react-icons/fa';
import { useSelector } from "react-redux";

const AddEmail = ({ onSuccess, onCancel }) => {
  const [newEmail, setNewEmail] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [error, setError] = useState('');
  const [verificationError, setVerificationError] = useState('');

  const language = useSelector((state) => state.language.language);

  const handleSendCode = async () => {
    const userId = localStorage.getItem('username');
    if (!userId) {
      setError(language === 'vi' ? 'Không tìm thấy ID người dùng' : 'User ID not found');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}auth/send-verification-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId, email: newEmail })
      });

      if (!response.ok) {
        throw new Error(language === 'vi' ? 'Gửi mã xác thực thất bại' : 'Failed to send verification code');
      }

      alert(language === 'vi' ? 'Mã xác thực đã được gửi' : 'Verification code sent successfully');
      setIsCodeSent(true);
    } catch (error) {
      console.error('Error sending verification code:', error);
      setError(language === 'vi' ? 'Gửi mã xác thực thất bại. Vui lòng thử lại.' : 'Failed to send verification code. Please try again.');
    }
  };

  const handleVerifyCode = async () => {
    const userId = localStorage.getItem('username');
    if (!userId) {
      setError(language === 'vi' ? 'Không tìm thấy ID người dùng' : 'User ID not found');
      return;
    }
    if (!newEmail || !verificationCode) {
      setError(language === 'vi' ? 'Vui lòng nhập email và mã xác thực' : 'Please enter the email and verification code');
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}auth/verify-email-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userId, email: newEmail, code: verificationCode })
      });

      if (!response.ok) {
        throw new Error(language === 'vi' ? 'Xác thực mã thất bại' : 'Failed to verify code');
      }

      alert(language === 'vi' ? 'Email đã được xác thực' : 'Email verified successfully');
      setIsEmailVerified(true);
      onSuccess(); // Notify parent component
    } catch (error) {
      console.error('Error verifying code:', error);
      setVerificationError(language === 'vi' ? 'Xác thực mã thất bại. Vui lòng thử lại.' : 'Failed to verify code. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white dark:bg-stone-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-stone-900 dark:text-stone-100">
        {language === 'vi' ? 'Thêm email mới' : 'Add New Email'}
      </h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      
      {/* Email input and Send Code button */}
      {!isCodeSent && (
        <div className="mb-4">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder={language === 'vi' ? 'Email mới' : 'New Email'}
            className="input w-full mb-2 p-2 border border-stone-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleSendCode}
            disabled={!newEmail.trim()}
            className={`btn w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${!newEmail.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaEnvelope className="inline mr-2" />
            {language === 'vi' ? 'Gửi mã xác thực' : 'Send Verification Code'}
          </button>
        </div>
      )}
  
      {/* Verification input and Verify Code button */}
      {isCodeSent && (
        <div className="mb-4">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder={language === 'vi' ? 'Nhập mã xác thực' : 'Enter verification code'}
            className="input w-full mb-2 p-2 border border-stone-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleVerifyCode}
            disabled={!verificationCode.trim()}
            className={`btn w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${!verificationCode.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <FaCheck className="inline mr-2" />
            {language === 'vi' ? 'Xác thực mã' : 'Verify Code'}
          </button>
        </div>
      )}
  
      {/* Error message for verification */}
      {verificationError && <p className="text-red-500 mb-2">{verificationError}</p>}
  
      {/* Cancel button */}
      <button
        type="button"
        onClick={onCancel}
        className="btn w-full bg-red-500 text-white p-2 rounded mt-2 hover:bg-red-600"
      >
        {language === 'vi' ? 'Hủy bỏ' : 'Cancel'}
      </button>
    </div>
  );
  
};

export default AddEmail;