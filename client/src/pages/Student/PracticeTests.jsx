import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdSearch } from "react-icons/md";
import { useSelector } from "react-redux";
import Loading from '../../components/Loading/Loading'

function PracticeTests() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [examsPerPage] = useState(6);
  const language = useSelector((state) => state.language.language);

  useEffect(() => {
    async function fetchExams() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}student/publicexams`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setExams(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchExams();
  }, []);

  const handleSearchTerm = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading)
    return (
      <Loading/>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        Error: {error}
      </div>
    );

  // Lọc kỳ thi theo từ khóa tìm kiếm và ngày
  const filteredExams = exams.filter(
    (exam) =>
      (exam.titleExam.toLowerCase().includes(searchTerm) ||
        exam.description.toLowerCase().includes(searchTerm)) &&
      (searchDate
        ? new Date(exam.date).toISOString().split("T")[0] === searchDate
        : true)
  );

  // Tính toán phân trang
  const indexOfLastExam = currentPage * examsPerPage;
  const indexOfFirstExam = indexOfLastExam - examsPerPage;
  const currentExams = filteredExams.slice(indexOfFirstExam, indexOfLastExam);
  const totalPages = Math.ceil(filteredExams.length / examsPerPage);

  return (
    <div>
      <div className="container mx-auto p-6 bg-white shadow rounded-lg min-h-96 dark:bg-stone-800">
        <header className="flex flex-col sm:flex-row justify-between items-end pb-4 border-b border-stone-300 dark:border-stone-600">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold dark:text-white">
              {language === "vi"
                ? "BÀI KIỂM TRA THỰC HÀNH CÔNG KHAI"
                : "PUBLIC PRACTICE TEST"}
            </h1>
            <p className="text-sm text-stone-600 dark:text-white pr-4">
              {language === "vi"
                ? "Học sinh có thể tìm và làm bài tập cho các kỳ thi sắp tới."
                : "Students can find and do exercises for upcoming exams."}
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none p-1">
              <MdSearch className="w-5 h-5 text-stone-400 dark:text-stone-300" />
            </div>
            <input
              type="text"
              name="search_text"
              id="floating_text"
              className="block w-full p-2 ps-10 text-sm text-black border border-stone-600 rounded-lg bg-stone-100 focus:ring-blue-500 focus:border-blue-500 dark:bg-stone-800 dark:border-stone-600 dark:placeholder-stone-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder={
                language === "vi"
                  ? "Tìm kiếm bài kiểm tra ..."
                  : "Search for exams ..."
              }
              value={searchTerm}
              onChange={handleSearchTerm}
              required
            />
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          {currentExams.map((exam) => (
            <div
              key={exam._id}
              className="bg-white dark:bg-stone-800 dark:text-white p-6 text-sm rounded-lg border hover:shadow transition-shadow duration-300 ease-in-out transform hover:scale-105"
            >
              <h2 className="text-3xl font-bold mb-2 ">{exam.titleExam}</h2>
              <p className="flex flex-col sm:flex-row justify-between items-end border-b border-stone-300 dark:border-stone-600"></p>

              <p className="text-stone-600 dark:text-stone-300 pt-2 mb-2">
                <span className="font-semibold">
                  {language === "vi" ? "Trạng thái:" : "Status:"}
                </span>{" "}
                {exam.status}
              </p>
              <p className="text-stone-600 dark:text-stone-300 mb-2">
                <span className="font-semibold">
                  {language === "vi" ? "Lớp:" : "Class:"}
                </span>{" "}
                {exam.classExam}
              </p>
              <p className="text-stone-600 dark:text-stone-300 mb-2">
                <span className="font-semibold">
                  {language === "vi" ? "Thời gian:" : "Time:"}
                </span>{" "}
                {exam.time}
              </p>
              <p className="text-stone-600 dark:text-stone-300">
                <span className="font-semibold">
                  {language === "vi" ? "Mô tả:" : "Description:"}
                </span>{" "}
                {exam.description}
              </p>
              <p className="flex flex-col pt-2 sm:flex-row justify-between items-end border-b border-stone-300 dark:border-stone-600"></p>

              <div className="pt-4 text-center flex justify-between items-center">
                <Link
                  to={`/practicetests/${exam._id}`}
                  className="inline-block w-full justify-center items-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
                >
                  {language === "vi" ? "Đi đến bài kiểm tra" : "Go to Exam"}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-blue-600 text-xs text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {language === "vi" ? "Trang trước" : "Previous"}
            </button>
            <span className="text-sm dark:text-white">
              {language === "vi"
                ? `Trang ${currentPage} / ${totalPages}`
                : `Page ${currentPage} of ${totalPages}`}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-blue-600 text-xs text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {language === "vi" ? "Trang sau" : "Next"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PracticeTests;
