import React, { useState } from 'react';
import { useSelector } from 'react-redux';

function AddClass({ onClose, onAddClass }) {
  const [className, setClassName] = useState('');
  const language = useSelector((state) => state.language.language);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddClass(className); // Call the prop function with class name
    setClassName('');
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 dark:bg-opacity-50">
      <div className="bg-white dark:bg-stone-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-stone-800 dark:text-stone-200">
          {language === 'vi' ? 'Thêm lớp học' : 'Add Class'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="className"
              className="block text-sm font-medium text-stone-700 dark:text-stone-300"
            >
              {language === 'vi' ? 'Tên lớp' : 'Class Name'}
            </label>
            <input
              type="text"
              id="className"
              name="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder={language === 'vi' ? 'Nhập tên lớp học...' : 'Enter class name...'}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 focus:outline-none hover:bg-gray-600"
            >
              {language === 'vi' ? 'Hủy' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none hover:bg-blue-600"
            >
              {language === 'vi' ? 'Thêm' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddClass;
