import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { getSemesters, getClass } from "../../services/gradeService";

import { Link } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { MdCircle } from "react-icons/md";

import Loading from "../../components/Loading/Loading";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

function GradeManagement() {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [classData, setClassData] = useState([]);
  const language = useSelector((state) => state.language.language);

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const data = await getSemesters();

        // Sắp xếp các học kỳ theo thứ tự giảm dần dựa trên năm học kỳ
        const sortedData = data.sort((a, b) =>
          b.schoolYear.localeCompare(a.schoolYear)
        );

        // Sắp xếp thứ tự của Semester giảm dần (III, II, I)
        const semesterOrder = { III: 3, II: 2, I: 1 };
        const sortedSemesters = sortedData.sort((a, b) => {
          if (a.schoolYear === b.schoolYear) {
            return semesterOrder[b.name] - semesterOrder[a.name];
          }
          return b.schoolYear.localeCompare(a.schoolYear);
        });

        setSemesters(sortedSemesters);
        setLoading(false);

        // Tự động chọn học kỳ đang active nếu tồn tại, nếu không chọn học kỳ đầu tiên
        const activeSemester = sortedSemesters.find(
          (semester) => semester.isActive
        );

        setSelectedSemester(activeSemester || sortedSemesters[0]);
      } catch (error) {
        console.log("Error fetching semesters:", error.message);
        setLoading(false);
      }
    };

    fetchSemesters();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        if (selectedSemester) {
          const classes = await getClass(selectedSemester._id);
          setClassData(classes);
        } else {
          setClassData([]);
        }
      } catch (error) {
        console.log("Error fetching classes:", error.message);
      }
    };

    fetchClasses();
  }, [selectedSemester]);

  const handleSelectSemester = (semester) => {
    setSelectedSemester(semester);
  };

  const renderPieChart = (grade) => {
    if (!classData || classData.length === 0) return null;

    const filteredClasses = classData.filter(
      (cls) => cls.grade === grade && cls.semester._id === selectedSemester._id
    );

    if (filteredClasses.length === 0) return null;

    const data = {
      labels: filteredClasses.map((cls) => cls.name),
      datasets: [
        {
          label: "Number of Students",
          data: filteredClasses.map((cls) => cls.students.length),
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: `Number of Students in Grade ${grade}`,
        },
      },
    };

    return <Pie data={data} options={options} width={150} height={150} />;
  };

  return (
    <div>
      <header className="flex flex-col sm:flex-row justify-between items-end">
        <h1 className="text-2xl font-bold dark:text-white">
          {language === "vi" ? "ĐIỂM SỐ" : "SCORES"}
        </h1>
      </header>

      {loading ? (
        <Loading />
      ) : (
        <div className="mt-4 space-y-6">
          {semesters.map((semester) => (
            <div
              key={semester._id}
              className="p-4 bg-white dark:bg-stone-800 rounded-lg shadow">
              <h1
                className="text-2xl font-bold mb-2 dark:text-white flex items-center"
                onClick={() => handleSelectSemester(semester)}>
                {language === "vi"
                  ? `HỌC KỲ ${semester.name} (${semester.schoolYear})`
                  : `SEMESTER ${semester.name} (${semester.schoolYear})`}

                {semester.isActive ? (
                  <span className="text-sm text-green-500 ml-2 flex justify-center items-center">
                    <MdCircle />
                  </span>
                ) : (
                  <span className="text-sm text-gray-500 ml-2 flex justify-center items-center">
                    <MdCircle />
                  </span>
                )}
              </h1>
              {selectedSemester && selectedSemester._id === semester._id && (
                <>
                  {["10", "11", "12"].map((grade) => {
                    const filteredClasses = classData.filter(
                      (cls) =>
                        cls.grade === grade && cls.semester._id === semester._id
                    );

                    if (filteredClasses.length === 0) return null;

                    return (
                      <motion.div
                        key={grade}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5 }}
                        className="mt-6 border-t border-stone-300 pt-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1">
                            <h3 className="text-2xl font-semibold text-stone-800 dark:text-white">
                              {language === "vi"
                                ? `Danh sách lớp ${grade}`
                                : `Grade ${grade} list`}
                            </h3>
                            <div className="overflow-x-auto mt-4 border rounded-lg">
                              <table className="min-w-full divide-y divide-stone-200 dark:divide-stone-700">
                                <thead className="bg-stone-50 dark:bg-stone-700">
                                  <tr className=" text-nowrap">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-300 uppercase tracking-wider">
                                      {language === "vi"
                                        ? "Tên lớp"
                                        : "Class Name"}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-300 uppercase tracking-wider">
                                      {language === "vi"
                                        ? "Giáo viên"
                                        : "Teacher"}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-300 uppercase tracking-wider">
                                      {language === "vi"
                                        ? "Số học sinh"
                                        : "Number of Students"}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-300 uppercase tracking-wider">
                                      {language === "vi"
                                        ? "Thao tác"
                                        : "Actions"}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-stone-800 divide-y divide-stone-200 dark:divide-stone-700">
                                  {filteredClasses.map((cls) => (
                                    <tr key={cls._id}>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900 dark:text-stone-300">
                                        <Link
                                          to={`/head/reports/class/${cls._id}`}
                                          className="hover:underline">
                                          {cls.name}
                                        </Link>
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">
                                        {cls.teacher
                                          ? `${cls.teacher.lastName} ${cls.teacher.firstName}`
                                          : "-"}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">
                                        {cls.students.length || 0}
                                      </td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 dark:text-stone-400">
                                        <Link
                                          to={`/head/reports/class/${cls._id}`}
                                          className="text-blue-500 hover:underline">
                                          {language === "vi"
                                            ? "Xem chi tiết"
                                            : "View Details"}
                                        </Link>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="flex-1 flex justify-center items-center">
                            {renderPieChart(grade)}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GradeManagement;
