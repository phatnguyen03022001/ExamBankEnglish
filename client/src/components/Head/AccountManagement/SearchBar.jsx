import React from "react";
import { useSelector } from "react-redux";


const SearchBar = ({ searchTerm, handleSearch }) => {
  const language = useSelector((state) => state.language.language);

  return (
    <div className="flex items-center space-x-2">
      <input
        type="search"
        id="search"
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="border border-gray-300 rounded-md p-2 w-full h-10"
        placeholder={language === "vi" ? "Tìm kiếm người dùng" : "Search Users"}
      />
    </div>
  );
};

export default SearchBar;