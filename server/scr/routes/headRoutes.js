const express = require("express");
const router = express.Router();


const headControllers = require("../controllers/headControllers.js");
const authMiddleware = require("../middlewares/authMiddleware");
const authController = require("../controllers/authController.js")

// USER
router.route("/profile").get(authMiddleware.authenticateJWT, authController.profile);
router.route("/login").post(authController.login);
router.route("/adduser").post(authMiddleware.authenticateJWT ,headControllers.adduser);
router.route("/blockusers").post(authMiddleware.authenticateJWT ,headControllers.blockusers);
router.route("/user/:id").put(authMiddleware.authenticateJWT ,headControllers.updateUser);
router.route("/userpass/:id").get(headControllers.getUserPassById); 
router.route("/users").get(authMiddleware.authenticateJWT, headControllers.users);

// SCHOOL YEARS
router.route("/classes").get( headControllers.classes);
router.route("/schoolyears").get(headControllers.schoolyears);
router.route("/deleteschoolyear").delete(headControllers.deleteschoolyear);
router.route("/semesters").get(headControllers.semesters);
router.route("/updatesemesterdates").put(headControllers.updatesemesterdates);
router.route("/getsemestersbyschoolyear").get(headControllers.getsemestersbyschoolyear);
router.route("/deletesemester").delete(headControllers.deletesemester);

// GRADE && SEMESTER
router.route("/addschoolyear").post( headControllers.addschoolyear);
router.route("/addsemester").post( headControllers.addsemester);
router.route("/setsemestersactive/:id").put( headControllers.setsemestersactive);
router.route("/getactivesemesters").get(headControllers.getactivesemesters);
router.route("/addclass").post( headControllers.addclass);
router.route("/getclasses/:id").get( headControllers.getclasses); 
router.route("/updateclass").put(headControllers.updateclass);
router.route("/deleteclass").delete(headControllers.deleteclass);

//CLASS
router.route('/class/:classId').get(headControllers.getclassdetails); 
router.route('/class/:classId/addteacher').post(headControllers.addteachertoclass); // Route để thêm giáo viên vào lớp học
router.route('/class/:classId/addstudent').post(headControllers.addstudenttoclass); // Route để thêm học sinh vào lớp học
router.route('/class/studentswithoutclass/:classId').get(headControllers.getstudentswithoutclass); // Route để lấy danh sách học sinh chưa có lớp học
router.route('/class/teacherswithoutclass/:classId').get(headControllers.getteacherswithoutclass); //Route để lấy danh sách giáo viên chưa có lớp học

router.route('/teachers').get(headControllers.getteachers); //Route để lấy danh sách giáo viên chưa có lớp học
router.route('/class/:classId/removestudent').delete(headControllers.deletecstudentfromclass);

//EXAM
router.route('/getexamrequests/:semesterId').get(headControllers.getExamRequests);
router.route('/examsubmissions').post(headControllers.postexamsubmissions);
router.route('/examsubmissions/semester/:semesterId').get(headControllers.getexamsubmissions);
router.route('/setexampassword/:examId').put(headControllers.setexampassword);
router.route('/removeexampassword/:examId').put(headControllers.removeexampassword);
router.route('/approvedexams/:examSubmissionId').get(headControllers.getapprovedexams);
router.route('/approvedexams/:examId').put(headControllers.putapprovedexams);
router.route('/setexamtime/:examId').put(headControllers.setExamTime);
router.route('/toggleexamstatus/:examId').put(headControllers.toggleExamStatus);






module.exports = router;
