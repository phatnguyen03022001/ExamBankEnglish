import React from 'react';
import { useSelector } from 'react-redux';
import ActionButton from './ActionButton';

const UserActions = ({ selectedUsers, onBlock }) => {
  const language = useSelector((state) => state.language.language);

  const handleDelete = () => {
    // Thực hiện xóa các người dùng đã chọn
    onBlock(selectedUsers);
  };

  const getButtonText = () => {
    if (language === 'vi') {
      return 'Khóa';
    }
    return 'Block';
  };

  return (
    <div className="flex justify-end space-x-2 m-4 rounded-md">
      <ActionButton
        onClick={handleDelete}
        text={getButtonText()}
        colorClass="bg-red-500"
      />
    </div>
  );
};

export default UserActions;
