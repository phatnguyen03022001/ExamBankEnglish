/* eslint-disable jsx-a11y/heading-has-content */
import React, { useState, useEffect } from "react";
import Mulchoise from "./TypeQuestion/Mulchoise";
import FillTheValue from "./TypeQuestion/FillTheValue";
import ShortDocument from "./TypeQuestion/ShortDocument";
import Listenning from "./TypeQuestion/Listenning";
import Stress from "./TypeQuestion/Stress";
import ShortAnswer from "./TypeQuestion/ShortAnswer";

const QuestionList = ({sendDataToParent, questionForID}) => {
  const [question, setQuestion] = useState({
    questionID: 1,
    type: "",
    titleQuestion: "",
    options: ["", "", "", ""],
    answer: "",
    optionsDoc: [],
    answerDoc: [],
    level: "",
  });

  const handleSelectTypeQuestion = (e) => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      type: e.target.value,
    }));
  };

  const getLevel = (value) => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      level: value,
    }));
  };

  //type question
  // Cập nhật thuộc tính câu hỏi
  const handleChangeQuestion = (e) => {
    const { name, value } = e.target;
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      [name]: value,
    }));
  };

  // Cập nhật đáp án đúng
  const handleCorrectAnswerChange = (e) => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      answer: e.target.value,
    }));
  };

  // Cập nhật các tùy chọn câu hỏi
  const handleChangeOptionsQuestion = (index, value) => {
    setQuestion((prevQuestion) => {
      const newOptions = [...prevQuestion.options];
      newOptions[index] = value;
      return {
        ...prevQuestion,
        options: newOptions,
      };
    });
  };

  // duc lo
  // Cập nhật đáp án đúng cho loại câu hỏi "đục lỗ"
  const handleCorrectAnswerChangeDoc = (e, index) => {
    setQuestion((prevQuestion) => {
      const newAnswerDoc = [...prevQuestion.answerDoc];
      newAnswerDoc[index] = e.target.value; // Cập nhật giá trị tại vị trí index

      return {
        ...prevQuestion,
        answerDoc: newAnswerDoc,
      };
    });
  };

  // Cập nhật tùy chọn cho câu hỏi "đục lỗ"
  const handleChangeOptionsDocQuestion = (arrayIndex, optionIndex, value) => {
    setQuestion((prevQuestion) => {
      // Tạo bản sao của mảng optionsDoc
      const newOptionsDoc = [...prevQuestion.optionsDoc];

      // Kiểm tra xem mảng con tại arrayIndex có tồn tại và có phải là mảng không
      const optionsArray = Array.isArray(newOptionsDoc[arrayIndex])
        ? [...newOptionsDoc[arrayIndex]]
        : Array(4).fill(""); // Tạo mảng mới với 4 phần tử rỗng nếu không tồn tại

      // Cập nhật giá trị tùy chọn
      optionsArray[optionIndex] = value;

      // Cập nhật mảng con trong optionsDoc
      newOptionsDoc[arrayIndex] = optionsArray;

      return {
        ...prevQuestion,
        optionsDoc: newOptionsDoc,
      };
    });
  };

  const addOptionsDoc = () => {
    setQuestion((prevQuestion) => ({
      ...prevQuestion,
      optionsDoc: [...prevQuestion.optionsDoc, Array(4).fill("")],
      answerDoc: [...prevQuestion.answerDoc, ""],
    }));
  };

  // Xóa một mảng con trong optionsDoc
  const deleteOptionsDoc = (index) => {
    setQuestion((prevQuestion) => {
      const newOptionsDoc = prevQuestion.optionsDoc.filter(
        (_, i) => i !== index
      );
      const newAnswerDoc = prevQuestion.answerDoc.filter((_, i) => i !== index);

      return {
        ...prevQuestion,
        optionsDoc: newOptionsDoc,
        answerDoc: newAnswerDoc,
      };
    });
  };

  useEffect(() => {
    // Gửi dữ liệu lên component cha khi component con được render
    sendDataToParent(question);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, sendDataToParent]);

  /* console.log("Question object:", JSON.stringify(question, null, 2)); */

  return (
    <div className="text-sm bg-white dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700 p-6 mb-6 hover:border-stone-400 dark:hover:border-stone-400 transition-border duration-300 ease-in-out">
      <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          <label
            htmlFor="type-question"
            className="text-sm font-medium text-black dark:text-white mr-3"
          >
            Chọn loại câu hỏi:{" "}
          </label>
          <select
            id="type-question"
            className={`flex flex-wrap text-sm border rounded-md p-2 dark:bg-stone-900 dark:text-white`}
            value={question.type}
            onChange={handleSelectTypeQuestion}
          >
            <option value="">---------------</option>
            <option value="trắc nghiệm">trắc nghiệm</option>
            <option value="điền khuyết">điền khuyết</option>
            <option value="đục lỗ">đục lỗ</option>
            <option value="nghe">nghe</option>
            <option value="trọng âm">trọng âm</option>
            <option value="shortAnswer">câu hỏi ngắn</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        {/* Conditional rendering based on question type */}
        {question.type === "trắc nghiệm" && (
          <Mulchoise
            question={question}
            handleChangeQuestion={handleChangeQuestion}
            handleCorrectAnswerChange={handleCorrectAnswerChange}
            handleChangeOptionsQuestion={handleChangeOptionsQuestion}
          />
        )}
        {question.type === "điền khuyết" && (
          <FillTheValue
            question={question}
            handleChangeQuestion={handleChangeQuestion}
            handleCorrectAnswerChange={handleCorrectAnswerChange}
            handleChangeOptionsQuestion={handleChangeOptionsQuestion}
          />
        )}
        {question.type === "đục lỗ" && (
          <ShortDocument
            question={question}
            handleChangeQuestion={handleChangeQuestion}
            handleCorrectAnswerChangeDoc={handleCorrectAnswerChangeDoc}
            handleChangeOptionsDocQuestion={handleChangeOptionsDocQuestion}
            addOptionsDoc={addOptionsDoc}
            deleteOptionsDoc={deleteOptionsDoc}
          />
        )}
        {question.type === "nghe" && (
          <Listenning
            question={question}
            handleChangeQuestion={handleChangeQuestion}
            handleCorrectAnswerChange={handleCorrectAnswerChange}
            handleChangeOptionsQuestion={handleChangeOptionsQuestion}
          />
        )}
        {question.type === "trọng âm" && (
          <Stress
            question={question}
            handleCorrectAnswerChange={handleCorrectAnswerChange}
            handleChangeOptionsQuestion={handleChangeOptionsQuestion}
          />
        )}
        {question.type === "shortAnswer" && (
          <ShortAnswer
            question={question}
            handleChangeQuestion={handleChangeQuestion}
          />
        )}
      </div>

      <div className="flex flex-wrap justify-between items-center">
        <div className="flex flex-col mt-2">
          <div className="flex flex-col sm:flex-row items-start ">
            <h2 className="font-bold text-sm text-stone-900 dark:text-stone-100 mb-4 sm:mb-0 sm:mr-4 text-nowrap"></h2>
            <div className="flex flex-wrap gap-4 w-full">
              {["Dễ", "Trung bình", "Khó"].map((level) => (
                <div
                  key={level}
                  className="flex items-center mb-2 w-full sm:w-auto"
                >
                  <input
                    id={`radio-${level}`}
                    type="radio"
                    value={level}
                    name={`level`}
                    onChange={(e) => getLevel(e.target.value)}
                    className="w-4 h-4 text-blue-600 bg-stone-100 border-stone-300 focus:ring-blue-500 dark:bg-stone-700 dark:border-stone-600"
                    required
                  />
                  <label
                    htmlFor={`radio-${level}`}
                    className="ml-2 text-sm font-medium text-stone-900 dark:text-stone-300"
                  >
                    {level}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionList;
