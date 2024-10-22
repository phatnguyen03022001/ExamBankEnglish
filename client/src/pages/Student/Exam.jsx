import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import moment from "moment";
import { useSelector } from "react-redux";

function ExamSubmissionManagement() {
  const [activeSemesters, setActiveSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [examSubmissions, setExamSubmissions] = useState([]);
  const [approvedExams, setApprovedExams] = useState([]);
  const [enteredPassword, setEnteredPassword] = useState({}); // Trạng thái lưu mật khẩu nhập vào
  const [passwordError, setPasswordError] = useState({});
  const language = useSelector((state) => state.language.language);

  console.log("approvedExams:: ", approvedExams);

  useEffect(() => {
    fetchActiveSemesters();
  }, []);

  useEffect(() => {
    if (selectedSemester) {
      fetchExamSubmissions(selectedSemester._id);
      // fetchTeacherExams(selectedSemester._id);
    }
  }, [selectedSemester]);

  useEffect(() => {
    if (selectedSemester) {
      const allExamIds = Object.values(
        examSubmissions[selectedSemester._id] || []
      ).map((exam) => exam._id);

      allExamIds.forEach((examId) => fetchApprovedExams(examId));
    }
  }, [examSubmissions, selectedSemester]);

  const handleSelectSemester = (semester) => {
    setSelectedSemester(semester);
  };

  const fetchActiveSemesters = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}student/getactivesemesters`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch active semesters");
      }
      const data = await response.json();
      setActiveSemesters(data);
      if (data.length > 0) {
        setSelectedSemester(data[0]);
      }
    } catch (error) {
      console.error("Error fetching active semesters:", error.message);
    }
  };

  const fetchExamSubmissions = async (semesterId) => {
    const studentId = localStorage.getItem("username");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}student/examsubmissions/semester/${semesterId}?studentId=${studentId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch exam submissions");
      }

      const data = await response.json();
      setExamSubmissions((prevState) => ({
        ...prevState,
        [semesterId]: data,
      }));
    } catch (error) {
      console.error("Error fetching exam submissions:", error.message);
    }
  };

  const fetchApprovedExams = async (submissionId) => {
    const studentId = localStorage.getItem("username");
    console.log("submissionId: ", submissionId);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}student/approvedexams/${studentId}/${submissionId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch approved exam");
      }
      const approvedExamData = await response.json();

      setApprovedExams((prevState) => ({
        ...prevState,
        [submissionId]: approvedExamData,
      }));
    } catch (error) {
      console.log("Error fetching approved exam:", error.message);
    }
  };

  const formatDateForInput = (dateString) => {
    return moment(dateString).format("YYYY-MM-DDTHH:mm");
  };

  const handlePasswordChange = (examId, event) => {
    setEnteredPassword((prevState) => ({
      ...prevState,
      [examId]: event.target.value,
    }));
  };
  const getRandomExamId = (exam) => {
    const approvedExamsForSubmission = approvedExams[exam._id] || [];

    if (approvedExamsForSubmission.length === 0) return null;

    // Lấy danh sách các examID đã được phê duyệt
    const approvedExamIds = approvedExamsForSubmission.map(
      (approvedExam) => approvedExam._id
    );

    if (approvedExamIds.length === 0) return null;

    // Chọn một examID ngẫu nhiên từ danh sách approvedExamIds
    const randomIndex = Math.floor(Math.random() * approvedExamIds.length);
    return approvedExamIds[randomIndex];
  };

  const handlePasswordSubmit = (exam) => {
    const correctPassword = exam.examPassword;

    if (enteredPassword[exam._id] === correctPassword) {
      const randomExamId = getRandomExamId(exam);
      if (randomExamId) {
        // Lấy _id của examSubmission hiện tại
        const examSubmissionId = exam._id;

        // Chuyển hướng đến URL với tham số examSubmissionId
        window.location.href = `${process.env.REACT_APP_URL}exam/${randomExamId}/submissionId/${examSubmissionId}`;
      } else {
        console.error("No approved exams available.");
      }
    } else {
      setPasswordError((prevState) => ({
        ...prevState,
        [exam._id]: "Mật khẩu không đúng",
      }));
    }
  };

  console.log("examSubmissions: ", examSubmissions);
  return (
    <div className="text-xs">
      <div className="mt-4 space-y-6">
        {activeSemesters.length === 0 ? (
          <p className="text-stone-500 dark:text-stone-400">
            {language === "vi"
              ? "Không có học kỳ nào đang hoạt động."
              : "No active semesters available."}
          </p>
        ) : (
          activeSemesters.map((semester) => (
            <div
              key={semester._id}
              className="p-4 bg-white dark:bg-stone-800 rounded-lg shadow"
            >
              <button
                className="text-2xl font-bold mb-2 dark:text-white hover:underline focus:outline-none flex items-center"
                onClick={() => handleSelectSemester(semester)}
              >
            
                {language === "vi"
                  ? `HỌC KỲ ${semester.name} (${semester.schoolYear})`
                  : `SEMESTER ${semester.name} (${semester.schoolYear})`}
              </button>

              {selectedSemester && selectedSemester._id === semester._id && (
                <>
                  {["10", "11", "12"].map((grade) => {
                    const examsForGrade =
                      examSubmissions[selectedSemester._id]?.filter(
                        (exam) => exam.grade === grade
                      ) || [];

                    return (
                      examsForGrade.length > 0 && (
                        <motion.div
                          key={grade}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.5 }}
                          className="mt-6 border-t border-stone-300 dark:border-stone-700 pt-6"
                        >
                          <h3 className="text-2xl font-semibold text-stone-800 dark:text-white">
                            {language === "vi"
                              ? `Khối lớp ${grade}`
                              : `Grade ${grade}`}
                          </h3>

                          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                            {examsForGrade.map((exam) => (
                              <div
                                key={exam._id}
                                className="p-4 border border-stone-500 dark:border-stone-100 bg-100 dark:bg-stone-800 rounded-lg"
                              >
                                <h4 className="text-lg font-semibold text-stone-800 dark:text-white">
                                  {language === "vi"
                                    ? `Kỳ Thi: ${exam.examType === "midterm" ? "Giữa kỳ" : exam.examType === "final" ? "Cuối kỳ" : exam.examType}`
                                    : `Exam: ${exam.examType === "midterm" ? "Midterm" : exam.examType === "final" ? "Final" : exam.examType}`}
                                </h4>

                                <div className="mt-2">
                                  <div className="flex sm:flex-row items-center space-y-4 sm:space-y-0">
                                    <div className="flex-1">
                                      <label className="block text-xs text-stone-600 dark:text-stone-400">
                                        {language === "vi"
                                          ? "Giờ & Ngày thi:"
                                          : "Time & Date:"}
                                        <input
                                          type="datetime-local"
                                          value={
                                            formatDateForInput(exam.examTime) ||
                                            ""
                                          }
                                          disabled
                                          className="w-full mt-1 bg-stone-200 dark:bg-stone-600 text-stone-800 dark:text-white p-2 rounded-lg border border-stone-300 dark:border-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                {/* <ExamDetails exam={approvedExams[exam._id]} /> */}

                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 sm:gap-6">
                                  {/* Status message and error message */}
                                  <div className="flex flex-col space-y-2 sm:col-span-2">
                                    {exam.examPassword !== "" &&
                                    approvedExams[exam._id]?.status !==
                                      "approved" &&
                                    approvedExams[exam._id]?.status !==
                                      "rejected" ? (
                                      <>
                                        <p className="text-green-500 font-medium">
                                          {language === "vi"
                                            ? "Kỳ thi đang diễn ra."
                                            : "Exam is in progress."}
                                        </p>
                                        <div className="flex items-center space-x-2">
                                          {/* Password input */}
                                          <input
                                            type="password"
                                            placeholder={
                                              language === "vi"
                                                ? "Nhập mật khẩu"
                                                : "Enter password"
                                            }
                                            value={
                                              enteredPassword[exam._id] || ""
                                            }
                                            onChange={(event) =>
                                              handlePasswordChange(
                                                exam._id,
                                                event
                                              )
                                            }
                                            className="flex-1 bg-stone-200 dark:bg-stone-600 text-stone-800 dark:text-white p-2 rounded-lg border border-stone-300 dark:border-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          />
                                          {/* Submit button */}
                                          <button
                                            onClick={() =>
                                              handlePasswordSubmit(exam)
                                            }
                                            className="bg-blue-500 text-xs text-white p-2 rounded-md hover:bg-blue-600 transition duration-300"
                                          >
                                            {language === "vi"
                                              ? "Vào thi"
                                              : "Enter Exam"}
                                          </button>
                                        </div>
                                        {/* Error message */}
                                        {passwordError[exam._id] && (
                                          <p className="text-red-500 text-xs mt-2">
                                            {passwordError[exam._id]}
                                          </p>
                                        )}
                                      </>
                                    ) : (
                                      <p className="text-red-500 font-medium">
                                        {language === "vi"
                                          ? "Kỳ thi chưa diễn ra."
                                          : "Exam has not started yet."}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )
                    );
                  })}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ExamSubmissionManagement;
