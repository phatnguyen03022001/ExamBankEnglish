import React, { useState, useEffect } from "react";
import TitleExam from "./TitleExam/TitleExam";
import ChapterList from "./Chapter/ChapterList";
import { useNavigate } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/";

const QuestionsExam = () => {
  const [showForm, setShowForm] = useState(false);
  const [prevChaptersCount, setPrevChaptersCount] = useState(0);
  const [examForm, setExamForm] = useState({
    examID: 1,
    idForTeacher: "",
    titleExam: "",
    classExam: "",
    time: "",
    score: "",
    description: "",
    chapters: [],
  });

  const [chaptersDataRandom, setChaptersDataRandom] = useState([]);

  // useEffect để xử lý khi chaptersDataRandom thay đổi
  useEffect(() => {
    // Khi chaptersDataRandom thay đổi, cập nhật examForm.chapters
    const updatedChapters = chaptersDataRandom.map((chapter, index) => {
      const existingChapter = examForm.chapters.find(
        (ch) => ch.titleChapter === chapter.titleChapterRandom
      );

      if (existingChapter) {
        return {
          ...existingChapter,
          chapterID: index + 1,
          quantityQuestionRandom: chapter.quantityQuestionRandom,
          questions: existingChapter.questions.map((q, qIndex) => ({
            ...q,
            level: chapter.levels,
            // Cập nhật các thuộc tính khác nếu cần
          })),
        };
      }

      return {
        chapterID: index + 1,
        titleChapter: chapter.titleChapterRandom,
        questions: Array.from(
          { length: parseInt(chapter.quantityQuestionRandom, 10) },
          (_, i) => ({
            questionID: i + 1,
            type: chapter.typeQuestionRandom,
            titleQuestion: "",
            options: ["", "", "", ""],
            answer: "",
            level: chapter.levels,
            optionsDoc: [],
            answerDoc: [],
          })
        ),
        quantityQuestionRandom: chapter.quantityQuestionRandom,
      };
    });

    setExamForm((prevExamForm) => ({
      ...prevExamForm,
      chapters: updatedChapters,
    }));

    setPrevChaptersCount(chaptersDataRandom.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chaptersDataRandom]);

  const handleChangeExamForm = (e) => {
    setExamForm({
      ...examForm,
      [e.target.name]: e.target.value,
    });
  };

  const addChapterToChapters = () => {
    setExamForm({
      ...examForm,
      chapters: [
        ...examForm.chapters,
        {
          chapterID: examForm.chapters.length + 1,
          titleChapter: "",
          questions: [],
        },
      ],
    });
  };

  const addQuestionToQuestions = (indexChapter, contentQuestion) => {
    setExamForm((prevExamForm) => {
      const updatedChapters = [...prevExamForm.chapters];
      updatedChapters[indexChapter] = {
        ...updatedChapters[indexChapter],
        questions: contentQuestion,
      };

      return {
        ...prevExamForm,
        chapters: updatedChapters,
      };
    });
  };

  const addDataUploadToChapters = (dataFromUpload) => {
    const newChapters = dataFromUpload.chapters;
    if (!Array.isArray(newChapters)) {
      console.error("Dữ liệu tải lên không phải là một mảng.");
      return;
    }

    setExamForm({
      ...examForm,
      chapters: [...examForm.chapters, ...newChapters],
    });
  };

  const clickContinue = async () => {
    const currentNumberOfChapters = chaptersDataRandom.length;

    if (currentNumberOfChapters !== prevChaptersCount) {
      const newChapters = chaptersDataRandom.map((chapter, index) => {
        const questions = Array.from(
          { length: parseInt(chapter.quantityQuestionRandom, 10) },
          (_, i) => ({
            questionID: i + 1,
            type: chapter.typeQuestionRandom,
            titleQuestion: "",
            options: ["", "", "", ""],
            answer: "",
            level: chapter.levels,
            optionsDoc: [],
            answerDoc: [],
          })
        );

        return {
          chapterID: index + 1,
          titleChapter: chapter.titleChapterRandom,
          questions: questions,
          quantityQuestionRandom: chapter.quantityQuestionRandom,
        };
      });

      // Cập nhật hoặc thêm các chương mới vào danh sách chương
      const updatedChapters = examForm.chapters.map((chapter) => {
        const randomChapter = chaptersDataRandom.find(
          (ch) => ch.titleChapterRandom === chapter.titleChapter
        );
        if (randomChapter) {
          return {
            ...chapter,
            titleChapter: randomChapter.titleChapterRandom,
            quantityQuestionRandom: randomChapter.quantityQuestionRandom,
          };
        }
        return chapter;
      });

      const chaptersToAdd = newChapters.filter(
        (chapter) =>
          !examForm.chapters.some(
            (existingChapter) => existingChapter.chapterID === chapter.chapterID
          )
      );

      const finalChapters = [...updatedChapters, ...chaptersToAdd];

      setExamForm((prevExamForm) => ({
        ...prevExamForm,
        chapters: finalChapters,
      }));

      setPrevChaptersCount(currentNumberOfChapters);
    }

    setShowForm(true);
    await handleRandomQuestions();
  };

  const navigation = useNavigate(); // Dùng thử viện để điều hướng page
  const handleSendExamForm = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("username"); // Lấy userId từ localStorage

    // Thêm teacherID vào examForm
    const updatedExamForm = {
      ...examForm,
      teacherID: userId, // Thêm teacherID vào form dữ liệu
    };

    console.log("Data send: ", updatedExamForm);

    try {
      // Gửi updatedExamForm lên server bằng axios
      const dataExam = await axios.post("/teacher/createexam", updatedExamForm);
      console.log("dataExam", dataExam.status);
      if (dataExam.status === 200) {
        alert("Đã tạo bài thi thành công!");
        navigation("/teacher/repository"); // điều hướng ra lại /teacher/exam
      }
    } catch (error) {
      console.error("Error creating exam:", error);
      alert("Đã xảy ra lỗi khi tạo bài thi!");
    }
  };

  const getRandomQuestions = async (quantity, type, levels) => {
    const teacherID = localStorage.getItem("username");
    try {
      // Chuyển đổi đối tượng levels thành tham số truy vấn
      const levelParams = { ...levels };

      const response = await axios.get("/teacher/questions/random", {
        params: { teacherID, quantity, type, ...levelParams },
      });
      console.log("Dữ liệu trả về:", response.data);
      return response.data;
    } catch (error) {
      setShowForm(false);

      alert(
        "Vui lòng chọn mức độ các câu hỏi tổng phải bằng 'Số lượng câu hỏi hoặc không đủ câu hỏi trong kho câu hỏi!'"
      );

      console.error("Lỗi khi lấy câu hỏi:", error);
      return [];
    }
  };

  const handleRandomQuestions = async () => {
    const totalQuantity = chaptersDataRandom.reduce((sum, chapter) => {
      return sum + parseInt(chapter.quantityQuestionRandom || 0, 10);
    }, 0);

    console.log("Tổng số lượng câu hỏi yêu cầu:", totalQuantity);

    const updatedChapters = [...examForm.chapters];

    for (let i = 0; i < updatedChapters.length; i++) {
      const chapter = updatedChapters[i];
      const chapterData = chaptersDataRandom.find(
        (c) => c.titleChapterRandom === chapter.titleChapter
      );

      if (!chapterData) {
        console.warn(
          `Dữ liệu chương không tìm thấy cho: ${chapter.titleChapter}`
        );
        continue;
      }

      const quantity = parseInt(chapterData.quantityQuestionRandom || 0, 10);
      const type = chapterData.typeQuestionRandom;
      const levels = chapterData.levels || {};

      if (quantity <= 0) {
        console.warn(
          `Số lượng không hợp lệ cho chương: ${chapter.titleChapter}`
        );
        continue;
      }

      const chapterQuestions = await getRandomQuestions(quantity, type, levels);

      if (chapterQuestions.length === 0) {
        console.warn(`Không có câu hỏi nào cho chương ${chapter.titleChapter}`);
        continue;
      }

      // Cập nhật câu hỏi cho chương cụ thể
      const updatedChapter = {
        ...chapter,
        questions: chapterQuestions,
      };

      updatedChapters[i] = updatedChapter;
    }

    setExamForm((prevExamForm) => ({
      ...prevExamForm,
      chapters: updatedChapters,
    }));

    const totalFetchedQuestions = updatedChapters.reduce((sum, chapter) => {
      return sum + (chapter.questions ? chapter.questions.length : 0);
    }, 0);

    if (totalFetchedQuestions < totalQuantity) {
      console.warn(
        `Số lượng câu hỏi lấy được (${totalFetchedQuestions}) ít hơn số lượng yêu cầu (${totalQuantity})`
      );
    }
  };

  return (
    <div className="exam">
      <div className="border-2 px-5 pt-5 pb-2 rounded-md">
        <TitleExam
          examForm={examForm}
          handleChangeExamForm={handleChangeExamForm}
          onChaptersData={setChaptersDataRandom}
        />

        <button
          onClick={() => clickContinue()}
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Tiếp tục
        </button>

        <div className="relative w-full mx-auto mt-10 h-full">
          {showForm && (
            <>
              <ChapterList
                examForm={examForm}
                setExamForm={setExamForm}
                addChapterToChapters={addChapterToChapters}
                addQuestionToQuestions={addQuestionToQuestions}
                addDataUploadToChapters={addDataUploadToChapters}
                chaptersDataRandom={chaptersDataRandom}
                handleRandomQuestions={handleRandomQuestions}
              />

              <button
                type="button"
                onClick={handleSendExamForm}
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                CREATE EXAM
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionsExam;
