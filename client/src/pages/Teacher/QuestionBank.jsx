// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { MdSearch } from "react-icons/md";
import AddQuestions from "./Questions/QuestionList";
import QuestionUpdate from "./QuestionsUpdate/QuestionUpdate";
import { HiPencilAlt } from "react-icons/hi";
import { MdDelete } from "react-icons/md";
import removeAccents from "remove-accents"; // Thư viên loại bỏ dấu khi search

import axios from "axios";
// URL de ket noi qua server
axios.defaults.baseURL = "http://localhost:8000/";

const QuestionBank = () => {
  // Search Exam
  const [searchQuery, setSearchQuery] = useState(""); // Search state
  const [filteredquestionRandomList, setFilteredquestionRandomList] = useState(
    []
  ); // Filtered list

  /*  const [isOpen, setIsOpen] = useState(false); */

  // Show questionRandomList
  const [questionRandomList, setQuestionRandomList] = useState([]);

  // Hàm lấy dữ liệu Exam từ server
  const getDataFromServer = async () => {
    const userId = localStorage.getItem("username"); // Sửa từ localStore thành localStorage
    try {
      // Gửi yêu cầu để lấy bài thi theo teacherID
      const response = await axios.get("/teacher/questionsList/random", {
        params: { teacherID: userId },
      });
      console.log("Full response:", response); // Log toàn bộ phản hồi

      const dataGetServer = response.data.data;
      /* console.log("Data from server:", dataGetServer); */ // Log dữ liệu từ server

      if (Array.isArray(dataGetServer) && dataGetServer.length > 0) {
        setQuestionRandomList(dataGetServer);
        setFilteredquestionRandomList(dataGetServer); // Tạo danh sách đã search
      } else {
        console.error(
          "Server response does not contain a valid exam list:",
          dataGetServer
        );
      }
    } catch (error) {
      console.error("Error fetching data from server:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
    }
  };

  useEffect(() => {
    getDataFromServer();
  }, []);

  // search
  useEffect(() => {
    // Filter Questions based on search query
    const normalizedSearchQuery = removeAccents(searchQuery.toLowerCase());
    const filtered = questionRandomList.filter(
      (questions) =>
        removeAccents(questions.titleQuestion.toLowerCase()).includes(
          normalizedSearchQuery
        ) ||
        removeAccents(questions.level.toLowerCase()).includes(
          normalizedSearchQuery
        ) ||
        removeAccents(questions.type.toLowerCase()).includes(
          normalizedSearchQuery
        )
    );
    setFilteredquestionRandomList(filtered);
  }, [searchQuery, questionRandomList]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Data cua tung ID Exam cần Update
  const [questionForID, setQuestionForID] = useState();

  // function lay id khi click chi tiet Exam
  const handleQuestionIDUpdate = async (id) => {
    console.log("id: ", id);

    const teacherID = localStorage.getItem("username"); // Lấy teacherID từ localStorage

    try {
      // Gửi yêu cầu GET để lấy thông tin câu hỏi theo ID và teacherID
      const response = await axios.get(`/teacher/questionsList/random`, {
        params: { teacherID }, // Thêm teacherID vào tham số yêu cầu
      });
      console.log("Question data:", response.data.data);

      const result = response.data.data.find((item) => item._id === id);
      console.log("result: ", result);
      // Cập nhật state với dữ liệu nhận được
      setQuestionForID(result);
    } catch (error) {
      console.error("Error fetching question data:", error);
      alert("Failed to fetch question data. Please try again.");
    }

    openModalUpdate();
  };

  // button delete
  const deteleQuestion = async (id) => {
    const dataDelete = await axios.delete("teacher/deleteQuestion/" + id);
    console.log(dataDelete);
    alert("Xoa thanh cong Exam!");
    getDataFromServer(); // reset lai table show
  };

  // model
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [questionFromChild, setQuestionFromChild] = useState("");

  // Hàm xử lý dữ liệu từ component con
  const handleQuestionFromChild = (data) => {
    console.log("data:", data);
    setQuestionFromChild(data);
  };

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to open the modalUpdate
  const openModalUpdate = () => {
    setIsModalUpdateOpen(true);
  };

  // Function to close the modalUpdate
  const closeModalUpdate = () => {
    setIsModalUpdateOpen(false);
  };

  console.log("questionFromChild: ", questionFromChild);

  // Tạo QUestion
  const sendDataToServer = async (e) => {
    e.preventDefault();

    const teacherID = localStorage.getItem("username"); // Get teacherID from localStorage

    // Assuming you have a state or prop containing the question data
    const {
      questionID,
      type,
      titleQuestion,
      options,
      answer,
      optionsDoc,
      answerDoc,
      level,
    } = questionFromChild;

    try {
      // Chuẩn bị dữ liệu để gửi đến server
      const data = {
        questionID,
        teacherID, // Bao gồm teacherID trong dữ liệu
        type,
        titleQuestion,
        options,
        answer,
        optionsDoc,
        answerDoc,
        level,
      };

      // Gửi yêu cầu POST đến server
      const response = await axios.post("/teacher/addQuestion", data); // Cập nhật URL nếu cần

      // Xử lý phản hồi từ server
      console.log("Question added:", response.data.data);
      alert("Question added successfully!");
      closeModal(); // Đóng modal sau khi gửi
      getDataFromServer(); // reset lai table show
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add question. Please try again.");
    }
  };

  const sendDataUpdateToServer = async (e) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định của form

    const teacherID = localStorage.getItem("username"); // Lấy teacherID từ localStorage

    // Lấy dữ liệu từ state questionForID hoặc các trường của form
    const {
      questionID,
      type,
      titleQuestion,
      options,
      answer,
      optionsDoc,
      answerDoc,
      level,
    } = questionFromChild || {}; // Nếu không có questionForID thì trả về đối tượng rỗng

    // Kiểm tra nếu questionForID không có dữ liệu
    if (!questionFromChild) {
      alert("No question data available for update.");
      return;
    }

    // Chuẩn bị dữ liệu để gửi đến server
    const data = {
      questionID,
      teacherID, // Bao gồm teacherID trong dữ liệu
      type,
      titleQuestion,
      options,
      answer,
      optionsDoc,
      answerDoc,
      level,
    };

    console.log(data);

    try {
      // Gửi yêu cầu PUT đến server
      const response = await axios.put(
        `/teacher/updateQuestion/${questionForID._id}`,
        data
      );

      // Xử lý phản hồi từ server
      console.log("Question updated:", response.data.data);
      alert("Question updated successfully!");
      closeModalUpdate(); // Đóng modal sau khi gửi
      getDataFromServer(); // Cập nhật lại danh sách câu hỏi
    } catch (error) {
      console.error("Error updating question:", error);
      alert("Failed to update question. Please try again.");
    }
  };

  return (
    <>
      <div className="container mx-auto p-6 bg-white shadow rounded-lg min-h-96 dark:bg-stone-800">
        <header className="flex flex-col sm:flex-row justify-between items-end pb-4 border-b border-stone-300">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl font-bold dark:text-white">
              Questions Table
            </h1>
            <p className="text-sm text-stone-600 dark:text-white pr-4">
              A list of all questions in your account.
            </p>
          </div>
          {/* <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} /> */}
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none p-1">
              <MdSearch className="w-5 h-5 text-stone-400 dark:text-stone-300" />
            </div>

            <input
              type="text"
              name="search_text"
              id="floating_text"
              className="block w-full p-2 ps-10 text-sm text-black border border-stone-600 rounded-lg bg-stone-100 focus:ring-red-900 focus:border-blue-500 dark:bg-stone-800 dark:border-stone-600 dark:placeholder-stone-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-red-500"
              placeholder="Search for exam"
              value={searchQuery}
              onChange={handleSearchChange}
              required
            />
          </div>
        </header>

        <div className="w-full flex justify-end mt-2">
          <button
            onClick={openModal}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Add Question
          </button>
        </div>

        {/* Table List Exam Teacher */}
        <p className="text-sm text-stone-600 dark:text-white pb-4">
          <span className="font-bold"></span> {}
        </p>
        <div className="relative overflow-x-auto shadow rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-black dark:text-white">
            <thead className="text-xs uppercase bg-stone-200 dark:bg-stone-700 dark:text-white">
              <tr>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  STT
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Tiêu đề câu hỏi
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Loại câu hỏi
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Cấp độ
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Đáp án
                </th>
                <th scope="col" className="px-6 py-3 whitespace-nowrap">
                  Tùy chỉnh
                </th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {filteredquestionRandomList.length !== 0 ? (
                filteredquestionRandomList.map((questions, indexQuestions) => (
                  <tr
                    key={indexQuestions}
                    className="even:bg-stone-100 odd:bg-white dark:even:bg-stone-800 dark:odd:bg-stone-900 border-b dark:border-stone-700"
                  >
                    <td className="px-6 py-1 text-xs whitespace-nowrap">
                      {indexQuestions + 1}
                    </td>
                    <td className="px-6 py-1 text-xs max-w-[250px] truncate whitespace-nowrap">
                      {questions.titleQuestion}
                    </td>
                    <td className="px-6 py-1 text-xs whitespace-nowrap">
                      {questions.type}
                    </td>
                    <td className="px-6 py-1 text-xs whitespace-nowrap">
                      {questions.level}
                    </td>
                    <td className="px-6 py-1 text-xs max-w-[250px] truncate whitespace-nowrap">
                      {questions.answer !== ""
                        ? questions.answer
                        : (Array.isArray(questions.answerDoc) && questions.answerDoc.length > 0 
                        ? questions.answerDoc.join(", ") 
                        : "Không có đáp án")}
                    </td>
                    <td className="px-6 py-1 text-xs whitespace-nowrap grid-center space-x-2">
                      {/* Button Update */}
                      <button
                        type="button"
                        onClick={() => handleQuestionIDUpdate(questions._id)}
                        className="text-white  bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 font-medium rounded-lg text-xs px-3 py-2 transition duration-200 ease-in-out dark:bg-yellow-400 dark:hover:bg-yellow-500 dark:focus:ring-yellow-600"
                      >
                        <HiPencilAlt size={18} />
                      </button>

                      {/* Button Delete */}
                      <button
                        type="button"
                        onClick={() => deteleQuestion(questions._id)}
                        className="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 font-medium rounded-lg text-xs px-3 py-2 transition duration-200 ease-in-out dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-700"
                      >
                        <MdDelete size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-4 text-stone-500 dark:text-stone-400"
                  >
                    No Data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center p-4">
          <div className="flex items-center border border-stone-300 rounded-lg shadow dark:border-stone-600 dark:shadow">
            <button
              type="button"
              className="px-4 py-2 text-sm font-semibold text-stone-700 bg-white border-r border-stone-300 rounded-l-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-stone-300 dark:bg-stone-800 dark:border-stone-600 dark:hover:bg-stone-700 dark:focus:ring-blue-500"
            >
              Previous
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-semibold text-stone-700 bg-white rounded-r-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-stone-300 dark:bg-stone-800 dark:border-stone-600 dark:hover:bg-stone-700 dark:focus:ring-blue-500"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal Update*/}
      <Modal
        isOpen={isModalUpdateOpen}
        onRequestClose={closeModalUpdate}
        contentLabel="Add Question Modal"
        className="bg-white p-6 rounded shadow-lg w-full max-w-3xl h-2xl max-h-screen mx-auto"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-lg font-bold mb-4">Update Question</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Question:</label>
            <QuestionUpdate
              sendDataToParent={handleQuestionFromChild}
              questionForID={questionForID}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModalUpdate}
              className="mr-2 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={sendDataUpdateToServer}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Cập nhật
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Question Modal"
        className="bg-white p-6 rounded shadow-lg w-full max-w-3xl h-2xl max-h-screen mx-auto"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-lg font-bold mb-4">Add New Question</h2>
        <form>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Question:</label>
            <AddQuestions sendDataToParent={handleQuestionFromChild} />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="mr-2 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={sendDataToServer}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Thêm
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default QuestionBank;
