const express = require('express');
const router = express.Router();
const teacherControllers =  require("../controllers/teacherControllers.js");
const authMiddleware = require("../middlewares/authMiddleware");
const authController = require("../controllers/authController.js")

//Phung
const Exam = require("../models/Exam");
const ApprovedExam = require("../models/ApprovedExam");
const Score = require("../models/Score");
const User = require("../models/User");
const mongoose = require("mongoose");


// router.route("/login").post(teacherControllers.login);
router.route("/login").post(authController.login);
router.route("/users", authMiddleware.authenticateJWT).get(teacherControllers.users);

router.route("/semesters").get(teacherControllers.getSemesters);
router.route("/classes").get(teacherControllers.getClasses);


//Quản lý nộp đề thi
router.route("/getactivesemesters").get(teacherControllers.getactivesemesters);

router.route("/examsubmissions/semester/:semesterId").get(teacherControllers.getexamsubmissionsbyteacherid);

router.route("/exam/:examId/submit").put(teacherControllers.putexamsubmit);

router.get('/approvedexams/:teacherId/:submissionId', async (req, res) => {
  const { teacherId, submissionId } = req.params;

  try {
    // Tìm kiếm bài kiểm tra đã được phê duyệt dựa trên teacherId và ExamSubmissionID
    const approvedExam = await ApprovedExam.findOne({
      teacherID: teacherId,
      ExamSubmissionID: submissionId
    });

    if (!approvedExam) {
      // Nếu không tìm thấy bài kiểm tra nào, trả về thông báo không tìm thấy
      return res.status(404).json({ message: 'Approved exam not found' });
    }

    // Trả về bài kiểm tra đã được phê duyệt dưới dạng JSON
    res.json(approvedExam);
    console.log(approvedExam);
  } catch (error) {
    // Xử lý lỗi và gửi phản hồi lỗi
    console.error('Error fetching approved exam:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


//Quản lý nộp đề thi

router.post("/createexam", async (req, res) => {
  try {
    const { teacherID, ...examData } = req.body;

    // Kiểm tra xem teacherID có tồn tại trong User collection
    const user = await User.findById(teacherID);
    if (!user) {
      return res.status(400).send({ success: false, message: "Invalid teacher ID" });
    }

    // Tạo đối tượng exam với teacherID được liên kết
    const exam = new Exam({
      ...examData,
      teacherID: teacherID // Gán teacherID từ body
    });

    await exam.save();

    res.send({ success: true, message: "Data saved successfully!", data: exam });
  } catch (error) {
    console.error("Error saving exam data:", error);
    res.status(500).send({ success: false, message: "Error saving data" });
  }
});
  
// update data
router.put("/update", async (req, res) => {
  /* console.log(req.body); */
  
  const { _id, ...rest } = req.body;
  const dataUpdate = await Exam.updateOne({ _id: _id }, rest);
  

  res.send({
    success: true,
    message: "data update successfully!",
    dataUpdate: dataUpdate,
  });
});

// delete data
router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const dataDelete = await Exam.deleteOne({ _id: id });

  console.log(id);
  res.send({
    success: true,
    message: "data delete successfully!",
    dataDelete: dataDelete,
  });
});



router.get('/exam', async (req, res) => {
  try {
    // Lấy teacherID từ query parameters
    const teacherID = req.query.teacherID;

    if (!teacherID) {
      return res.status(400).json({ message: "Teacher ID is required" });
    }

    // Tìm các bài thi theo teacherID
    const exams = await Exam.find({ teacherID: teacherID });

    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get exam by ID
router.get('/exam/:id', getExam, (req, res) => {
  res.json(res.exam);
});

// Middleware to get exam by ID
async function getExam(req, res, next) {
  let exam;
  try {
    exam = await Exam.findById(req.params.id);
    if (exam == null) {
      return res.status(404).json({ message: 'Cannot find exam' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.exam = exam;
  next();
}


router.put('/updateexamstatus/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['public', 'private'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    // Cập nhật exam với id tương ứng
    const updatedExam = await Exam.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Trả về tài liệu đã được cập nhật
    );

    if (!updatedExam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.json(updatedExam);
  } catch (error) {
    console.error("Error updating exam status:", error);
    res.status(500).json({ message: 'Server error' });
  }
});


/////////////////////////////// Nhập điểm
// router.get('/scores', getScoresByClass);
router.route("/getclasses/:teacherId").get(teacherControllers.getclasses);
router.route("/getscores/:classId").get(teacherControllers.getScores);
// router.('//:', );


router.route("/getclassdetails/:classId").get(teacherControllers.getClassesById);
router.route("/savescore/:classId").post(teacherControllers.saveScores);
// router.route("/getscore/:classId").post(teacherControllers.getScore);
// router.route("/classes").get(teacherControllers.getClasses);


router.get('/class/:classId', async (req, res) => {
  try {
    const scores = await Score.find({ classId: req.params.classId });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cập nhật điểm số
router.put('/update/:id', async (req, res) => {
  try {
    const score = await Score.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(score);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



const Question = require("../models/QuestionRandom.js");

// Random question
// Get random questions
router.get("/questions/random", async (req, res) => {
  try {
    const { quantity, teacherID, type, ...level } = req.query;

    // Kiểm tra xem quantity có hợp lệ không
    if (!quantity || isNaN(quantity)) {
      return res.status(400).json({ message: "Số lượng không hợp lệ" });
    }

    const numQuestions = parseInt(quantity);

    // Kiểm tra xem level có được cung cấp và có phải là đối tượng không
    if (!level || typeof level !== 'object' || Array.isArray(level)) {
      return res.status(400).json({ message: "Định dạng mức độ không hợp lệ" });
    }

    // Ánh xạ các mức độ từ client sang các giá trị trong MongoDB
    const levelMapping = {
      easy: "Dễ",
      normal: "Trung bình",
      hard: "Khó"
    };

    // Xây dựng truy vấn để lấy câu hỏi dựa trên loại và teacherID
    let query = { type, teacherID };

    // Lấy tất cả các câu hỏi theo loại và teacherID đã chỉ định
    const allQuestions = await Question.find(query);
    console.log("Tất cả câu hỏi:", allQuestions);
    console.log("teacherID:", teacherID);

    
    // Tính số lượng câu hỏi theo từng mức độ dựa trên đối tượng level được cung cấp
    const difficulties = ["easy", "normal", "hard"];
    const levelQuantities = difficulties.reduce((acc, diff) => {
      acc[diff] = level[diff] ? parseInt(level[diff], 10) : 0;
      return acc;
    }, {});

    console.log("Số lượng câu hỏi theo mức độ:", levelQuantities);

    // Hàm để lấy một tập con ngẫu nhiên của một mảng
    const getRandomSubset = (arr, num) => {
      const shuffled = arr.slice().sort(() => 0.5 - Math.random());
      return shuffled.slice(0, num);
    };

    let filteredQuestions = [];

    // Lấy và lọc câu hỏi cho từng mức độ dựa trên số lượng được cung cấp
    for (const diff of difficulties) {
      if (levelQuantities[diff] > 0) {
        const mongoLevel = levelMapping[diff];
        const questionsForLevel = allQuestions.filter(q => q.level === mongoLevel);
        filteredQuestions = filteredQuestions.concat(getRandomSubset(questionsForLevel, levelQuantities[diff]));
      }
    }

    // Trộn kết quả và giới hạn số lượng câu hỏi trả về
    filteredQuestions = getRandomSubset(filteredQuestions, numQuestions);

    // Kiểm tra nếu số lượng câu hỏi đủ để trả về
    if (filteredQuestions.length < numQuestions) {
      return res.status(404).json({ message: "Không đủ câu hỏi để cung cấp. Vui lòng tạo thêm câu hỏi vào kho câu hỏi" });
    }

    res.json(filteredQuestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

// Get List random questions
router.get("/questionsList/random", async (req, res) => {
  try {
    // Lấy userId từ query params
    const userId = req.query.teacherID;
    console.log(userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu tham số teacherID.',
      });
    }

    // Sử dụng phương thức find() để lấy các câu hỏi có teacherID trùng với userId
    const questions = await Question.find({ teacherID: userId });

    // Trả về kết quả thành công cùng với danh sách câu hỏi
    res.status(200).json({
      success: true,
      data: questions,
      message: `Đã lấy ${questions.length} câu hỏi cho teacherID: ${userId}.`,
    });
  } catch (error) {
    console.error('Lỗi khi lấy câu hỏi theo teacherID:', error);
    // Trả về lỗi nếu có vấn đề khi lấy câu hỏi
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy câu hỏi theo teacherID.',
      error: error.message,
    });
  }
});

// Route to handle adding a new question
router.post('/addQuestion', async (req, res) => {
  try {
    const { 
      questionID, 
      teacherID, 
      type, 
      titleQuestion, 
      options, 
      answer, 
      optionsDoc, 
      answerDoc, 
      level 
    } = req.body;

    console.log("Question details received:", req.body);

    if (!teacherID) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu tham số teacherID',
      });
    }

    // Create a new question document with all the fields
    const newQuestion = new Question({
      questionID,
      teacherID,
      type,
      titleQuestion,
      options,
      answer,
      optionsDoc,
      answerDoc,
      level
    });

    // Save the new question to the database
    await newQuestion.save();

    res.status(201).json({
      success: true,
      message: 'Câu hỏi đã được thêm thành công.',
      data: newQuestion,
    });
  } catch (error) {
    console.error('Lỗi khi thêm câu hỏi:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi thêm câu hỏi.',
      error: error.message,
    });
  }
});

// delete questions 
router.delete("/deleteQuestion/:id", async (req, res) => {
  const id = req.params.id;
  const dataDelete = await Question.deleteOne({ _id: id });

  console.log(id);
  res.send({
    success: true,
    message: "data delete successfully!",
    dataDelete: dataDelete,
  });
});

// update questions
router.put("/updateQuestion/:id", async (req, res) => {
  try {
    const questionId = req.params.id;
    const updateData = req.body;
    console.log("updateData: ", updateData)

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      updateData,
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({ message: 'Question updated successfully', data: updatedQuestion });
  } catch (err) {
    console.error('Error updating question:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
