1. TÊN DỰ ÁN:
  XÂY DỰNG WEBSITE QUẢN LÝ NGÂN HÀNG ĐỀ THI TIẾNG ANH

2. CÀI ĐẶT:
  - b1: Tải source code về máy
  - b2: cài đặt cơ sở dữ liệu mongodb
	+ Thêm Collection User và Exam trong folder 'database' để có thể và import dữ liệu JSON để có thể xem những tính năng cơ bản nhất của hệ thống
	+ Với trường hợp xem hệ thống đầy đủ cần sử dụng data thay đổi MONGODB_URI với đường dẫn trong file .env của server: 
mongodb+srv://Cluster59773:bankexamenglish@cluster59773.dghmqtd.mongodb.net/EnglishExamBankDB
  - b3: Sử dụng terminal và di chuyển đến folder chứa source code EEB và thực hiện các câu lệnh sau:
	+ cd client
	+ npm install
	+ npm start
	+ cd ../server
	+ npm install
	+ npm start

  - b4: Sau khi cài đặt:
	+ Truy cập vào đường dẫn 'http://localhost:3000/' để đăng nhập với tư cách STUDENT
	+ Truy cập vào đường dẫn 'http://localhost:3000/teacher/login' để đăng nhập với tư cách TEACHER hoặc HEAD
	

3. CẤU TRÚC TỔNG QUAN CỦA DỰ ÁN
/Source
├── client
│   ├── public                      	# Thư mục chứa các file tĩnh cần thiết cho ứng dụng web
│   │   ├── index.html              	# File HTML chính của ứng dụng
│   │   └── manifest.json           	# File cấu hình ứng dụng web (PWA)
│   ├── src                         	# Thư mục chứa mã nguồn của ứng dụng React
│   │   ├── components              	# Thư mục chứa các thành phần (components) của giao diện người dùng
│   │   │   ├── Avata               	# Thành phần liên quan đến avatar
│   │   │   ├── DarkMode            	# Thành phần quản lý chế độ tối
│   │   │   ├── Head                	# Thành phần liên quan đến các phần quản lý và điều hướng chính
│   │   │   ├── Language            	# Thành phần liên quan đến lựa chọn ngôn ngữ
│   │   │   ├── Layout              	# Thành phần định dạng giao diện chính
│   │   │   ├── Locations           	# Thành phần hiển thị các địa điểm
│   │   │   ├── Message             	# Thành phần hiển thị thông báo
│   │   │   ├── Profile             	# Thành phần liên quan đến hồ sơ người dùng
│   │   │   ├── Sidebar             	# Thành phần thanh bên cho các menu
│   │   │   ├── Student             	# Thành phần liên quan đến giao diện người dùng học sinh
│   │   │   ├── Teacher             	# Thành phần liên quan đến giao diện người dùng giáo viên
│   │   │   └── Toast               	# Thành phần thông báo dạng pop-up
│   │   ├── pages                   	# Thư mục chứa các trang của ứng dụng
│   │   │   ├── Auth                	# Các trang liên quan đến xác thực (đăng nhập, quên mật khẩu, ...)
│   │   │   ├── Head                	# Các trang chính quản lý (Dashboard, ExamManagement, ...)
│   │   │   ├── Student             	# Các trang dành cho học sinh
│   │   │   └── Teacher             	# Các trang dành cho giáo viên
│   │   ├── Redux                   	# Thư mục chứa các file cấu hình Redux
│   │   │   ├── Auth                	# Redux slice và selector cho xác thực
│   │   │   ├── Language            	# Redux slice cho ngôn ngữ
│   │   │   └── store.js            	# Cấu hình store của Redux
│   │   ├── assets                  	# Thư mục chứa các tài nguyên (hình ảnh, phông chữ, ...)
│   │   ├── actions                 	# Thư mục chứa các action creators
│   │   ├── routes                  	# Thư mục chứa các định tuyến của ứng dụng
│   │   │   ├── HeadRoutes.jsx      	# Định tuyến cho các trang quản lý
│   │   │   ├── ProtectedRoute.jsx  	# Định tuyến cho các trang yêu cầu xác thực
│   │   │   ├── StudentRoutes.jsx   	# Định tuyến cho các trang học sinh
│   │   │   └── TeacherRoutes.jsx   	# Định tuyến cho các trang giáo viên
│   │   └── services                	# Thư mục chứa các dịch vụ kết nối API
│   └── tailwind.config.js          	# File cấu hình Tailwind CSS
└── server
    ├── config                      	# Thư mục chứa các cấu hình của server
    │   ├── cors.js                 	# Cấu hình CORS (Cross-Origin Resource Sharing)
    │   ├── database.js             	# Cấu hình kết nối cơ sở dữ liệu
    │   ├── mail.js                 	# Cấu hình gửi email
    │   └── socket.js               	# Cấu hình WebSocket
    └── scr                         	# Thư mục chứa mã nguồn của server
        ├── controllers             	# Thư mục chứa các controller xử lý logic của ứng dụng
        │   ├── authController.js   	# Xử lý xác thực người dùng
        │   ├── headControllers.js  	# Xử lý các yêu cầu liên quan đến quản lý chính
        │   ├── studentControllers.js 	# Xử lý các yêu cầu liên quan đến học sinh
        │   └── teacherControllers.js 	# Xử lý các yêu cầu liên quan đến giáo viên
        ├── middlewares             	# Thư mục chứa các middleware xử lý yêu cầu HTTP
        │   ├── authMiddleware.js   	# Middleware xác thực người dùng
        │   └── getCurrentSemester.js 	# Middleware lấy thông tin học kỳ hiện tại
        ├── models                  	# Thư mục chứa các mô hình cơ sở dữ liệu
        │   ├── ApprovedExam.js     	# Mô hình bài kiểm tra được phê duyệt
        │   ├── Chaptes.js          	# Mô hình chương học
        │   ├── Chat.js             	# Mô hình trò chuyện
        │   ├── Class.js            	# Mô hình lớp học
        │   ├── Exam.js             	# Mô hình bài kiểm tra
        │   ├── ExamSubmission.js   	# Mô hình nộp bài kiểm tra
        │   ├── QuestionRandom.js   	# Mô hình câu hỏi ngẫu nhiên
        │   ├── Questions.js        	# Mô hình câu hỏi
        │   ├── SchoolYear.js       	# Mô hình năm học
        │   ├── Score.js            	# Mô hình điểm số
        │   ├── Semester.js         	# Mô hình học kỳ
        │   └── User.js             	# Mô hình người dùng
        ├── routes                  	# Thư mục chứa các định tuyến của server
        │   ├── authRoutes.js       	# Định tuyến cho xác thực người dùng
        │   ├── headRoutes.js       	# Định tuyến cho quản lý chính
        │   ├── studentRoutes.js    	# Định tuyến cho học sinh
        │   └── teacherRoutes.js    	# Định tuyến cho giáo viên
        └── server.js               	# Điểm vào chính của ứng dụng server


4. TÀI KHOẢN VÀ MẬT KHẨU ĐĂNG NHẬP VỚI TƯ CÁCH HEAD, TEACHER, STUDENT:
  - HEAD (Trưởng bộ môn)
	+ TK: H20240001
	+ MK: admin

  - TEACHER (Giáo viên)
	+ TK: T20240001
	+ MK: admin

  - HEAD (Student)
	+ TK: 120240001
	+ MK: admin


5. MỤC TIÊU CHÍNH CỦA WEBSITE:
  - Quản quản lý đề thi hiệu quả:
	+ Cung cấp công cụ cho giáo viên để tạo, lưu trữ, và quản lý các đề thi một cách dễ dàng và linh hoạt.
	+ Hỗ trợ nhiều phương pháp tạo đề thi (thông thường, từ file, và ngẫu nhiên) để đáp ứng nhu cầu và sở thích của giáo viên.
  - Tạo Điều Kiện Học Tập Tốt Hơn:
	+ Cho phép học sinh truy cập vào các đề thi thử và bài thi chính thức, từ đó cải thiện khả năng học tập và chuẩn bị cho các kỳ thi.
	+ Cung cấp thông tin chi tiết về kỳ thi sắp tới và báo cáo thống kê điểm số giúp học sinh theo dõi tiến bộ của mình.
  - Quản Lý Tài Nguyên Nhân Sự:
	+ Đảm bảo việc phân công giáo viên và học sinh vào các lớp học và kỳ thi một cách hợp lý.
	+ Cung cấp các công cụ cho trưởng bộ môn để quản lý niên khóa, học kỳ, lớp học, và các kỳ thi, bao gồm các chức năng như thêm, xóa, và thay đổi thông tin.
  - Tối Ưu Hóa Quản Lý Thông Tin:
	+ Cho phép quản lý tài khoản người dùng, bao gồm việc thay đổi thông tin, quản lý trạng thái tài khoản, và bảo mật thông tin cá nhân.
	+ Cung cấp chức năng báo cáo và thống kê để giúp quản lý và giáo viên theo dõi tình hình học tập và giảng dạy một cách hiệu quả.
  - Hỗ Trợ Người Dùng Toàn Diện:
	+ Cung cấp chức năng hỗ trợ cho việc đăng nhập, đăng xuất, thay đổi mật khẩu, và cập nhật thông tin cá nhân.
	+ Đảm bảo trải nghiệm người dùng thân thiện thông qua các tính năng như chuyển đổi chế độ giao diện và ngôn ngữ.
  - Đảm Bảo Tính Bảo Mật và Độ Tin Cậy:
	+ Cung cấp các chức năng xác thực và bảo mật, như xác thực OTP qua email, để bảo vệ tài khoản và thông tin cá nhân.


5.1 CHỨC NĂNG DÙNG CHUNG
  - Đăng nhập
  - Đăng xuất
  - Đổi mật khẩu
  - Cập nhật/Thêm Email vào tài khoản (Cần phải xác thực OTP qua Email)
  - Quên mật khẩu (Đối với các tài đối với các tài khoản đã được thêm Email)
  - Thay đổi thông tin tài khoản (Địa chỉ, số điện thoại, hiển thị giới tính)
  - Trao đổi thông tin qua đoạn hội thoại chung
  - Chuyển đổi chế độ Dark mode hoặc Light mode
  - Chuyển đổi ngôn ngữ Tiếng Anh và Tiếng Việt

5.2 CHỨC NĂNG CỦA HEAD (TRƯỞNG BỘ MÔN)
  - Quản lý Niên khóa:
	+ Thêm một niên khóa (Năm bắt đầu và kết thúc của niên khóa. VD: 2022-2023, 2023-2024, ...)
	+ Xóa niên khóa (Đối với các niên khóa chưa có học kỳ) 
  - Quản lý Học kỳ
	+ Thêm học kỳ (Học kỳ 1, Học kỳ 2, Học kỳ hè), hệ thống sẽ tự động tính toán ngày bắt đầu và kết thúc của một học kỳ thực tế.
	+ Thay đổi thời gian bắt đầu và kết thúc của một học kỳ
	+ Xóa học kỳ (đối với các học kỳ chưa có lớp học)
	+ Thay đổi trạng thái của học kỳ (Các học kỳ kích hoạt cho phép người dùng thực hiện các logic chức năng, nếu học kỳ ở trạng thái đống thì các thông tin của học kỳ chỉ được phép xem lại)
	
  - Quản lý Lớp học:
	+ Hiển thị danh sách lớp học hiện có.
	+ Thêm lớp học.
	+ Xóa lớp học (đối với các lớp học chưa có giáo viên hoặc học sinh).
	+ Thay đổi tên lớp học.
  - Quản lý Chi tiết lớp học:
	+ Thêm giáo viên Quản nhiệm môn.
	+ Thêm học sinh (Đảm bảo một học sinh chỉ được thêm vào một lớp trong một học kỳ).
	+ Xóa học sinh ra khỏi lớp học.
	+ Tìm kiếm giáo viên và học sinh trong danh sách chưa có lớp học.
  - Quản lý Kỳ thi:
	+ Hiển thị các kỳ thi đã được thêm cho từng khối lớp.
	+ Thêm kỳ thi (Kỳ thi Giữa kỳ hoặc Cuối kỳ).
	+ Cài đặt Ngày và giờ thi.
	+ Xem các đề thi giáo viên nộp: Có thể chấp nhận hoặc từ chối hoặc chấp nhận đề thi mà giáo viên gửi cho kỳ thi đó. Các đề thi giáo viên nộp lên thì trạng thái mặc định là 'pending'.
	+ Các đề thi mà giáo viên nộp lên sẽ được copy một phiên bản lưu trữ kể từ khi giáo viên nộp đề.
	+ Thời lượng thi (Thời gian thi của kỳ thi đó 45p, 90p và 120p).
	+ Kích hoạt kỳ thi (cho phép học sinh nhập Mật khẩu để vào làm bài thi).
	+ Thêm mật khẩu kỳ thi: sau khi kích hoạt, trưởng bộ môn có thể thêm mật khẩu cho Kỳ thi.
	+ Xóa mật khẩu kỳ thi đó, sau khi xóa thì học sinh không thể tham gia kỳ thi nữa.

  - Báo cáo thống kê:
	+ Xem lại số lượng học sinh phân bổ cho từng lớp học.
	+ Xem lại điểm của các học sinh trong một lớp học cụ thể.
  - Quản lý tài khoản người dùng
	+ Hiển thị thông tin của tất cả người dùng có trong hệ thống
	+ Tìm kiếm người dùng trong hệ thống (id, tên, email, chức vụ, ...).
 	+ Thay đổi thông tin người dùng: email, họ tên, số điện thoại, trạng thái tài khoản (active, block, completed).
	+ Xuất mật khẩu lần đầu cho tài khoản dưới dạng văn bản hoặc pdf (Mật khẩu bao gồm 6 ký tự ngẫu nhiên).

5.3 CHỨC NĂNG CỦA TEACHER (GIÁO VIÊN)
  - Quản lý lớp học:
	+ Hiển thị thông tin chi tiết các lớp học mà giáo viên đang dạy.
	+ Chấm điểm cho học sinh: Bao gồm các cột điểm Miệng, 15p, Giữa kỳ và Cuối kỳ.
	+ Sửa điểm của học sinh.
	+ Hệ thống tự động tính điểm trung bình.
  - Tạo đề thi thông qua 3 phương pháp:
	+ Tạo đề thông thường: Nhập các chương, loại câu hỏi và đáp án cho đề thi.
	+ Tạo đề thi từ file: tạo theo form theo một cấu trúc xác định (giáo viên có thể download file mẫu từ hệ thống bao gồm word và excel).
	+ Tạo đề ngẫu nhiên: lấy danh sách các đề thi có trong hệ thống của giáo viên và tạo theo cài đặt của giáo viên.
  - Kho lưu trữ đề thi:
	+ Tìm kiếm các đề thi mà giáo viên đã tạo.
	+ Giáo viên có thể chia sẻ các đề thi nhằm mục đích cho Học sinh thi thử và làm quen với các dạng đề thi.
	+ Xem chi tiết các đề thi cũng như cấu trúc đề.
	+ Tải đề thi xuống dưới dạng pdf.
	+ Sửa đề thi đã tạo.
	+ Xóa đề thi.
  - Nộp đề thi:
	+ Xem thông tin chi tiết của kỳ thi.
	+ Đối với các kỳ thi đang mở, giáo viên cần phải nộp đề để Trưởng bộ môn lấy danh sách để thi cho vào kỳ thi chung của khối lớp đó.
	+ Xem thông tin chi tiết mà đề thi đã nộp.
	+ Lấy mật khẩu kỳ thi đang diễn ra, cung cấp cho học sinh nhằm mục đính xác thực tại phòng thi.
  - Báo cáo thống kê: Xem điểm cũng như biểu đồ điểm của các học sinh trong lớp học.
	

5.4 CHỨC NĂNG CỦA STUDENT (HỌC SINH)
  - Tìm kiểm các đề thi phù hợp để làm bài thi thử (các đề thi được giáo viên chia sẽ dưới dạng public):
  - Làm bài thi thử:
	+ Cảnh báo các câu mà học sinh làm sai.
	+ Thông báo những câu hỏi đã làm chính xác.
	+ Thống kê số câu đúng và sai học sinh đã làm
  - Hiển thị chi tiết thông tin kỳ thi sắp tới.
  - Làm bài thi (Từ các đề thi mà Giáo viên nộp cho Trường bộ môn đã được chấp nhận):
	+ Lấy các đề thi được 
	+ Nhập chính xác mật khẩu trước khi làm bài thi.
	+ Không được nộp bài với trường hợp chưa hết thời gian nếu chưa điền đầy đủ các câu trả lời.
	+ Tự động lưu kết quả vào hệ thống.
  - Báo cáo thống kê: Xem lại điểm và biều đồ điểm của học sinh.

	
	
6. CÁC CÔNG NGHỆ ĐÃ SỬ DỤNG 
  Hệ thống sử dụng 4 công nghệ chính của MERN STACK: MONGODB, EXPRESSJS, REACTJS, NODEJS.

6.1. Client (Front-end) 
 * Dependencies do `npx create-react-app` tạo ra:
  - react: ^18.3.1 							# Thư viện JavaScript để xây dựng giao diện người dùng
  - react-dom: ^18.3.1 							# Điểm vào của các đường dẫn kết xuất liên quan đến DOM
  - react-scripts: 5.0.1 						# Các tập lệnh và cấu hình được sử dụng bởi Create React App
  - web-vitals: ^2.1.4 							# Thư viện để đo lường các chỉ số web quan trọng

 * Dependencies thêm vào sau:
  - @babel/plugin-proposal-private-property-in-object: ^7.21.11 	# Plugin Babel cho các thuộc tính riêng tư trong đối tượng
  - @reduxjs/toolkit: ^2.2.5 						# Bộ công cụ chính thức, có ý kiến, bao gồm pin cho phát triển Redux hiệu quả
  - @testing-library/jest-dom: ^5.17.0 					# Bộ so khớp jest tùy chỉnh để kiểm tra trạng thái của DOM
  - @testing-library/react: ^13.4.0 					# Tiện ích kiểm tra DOM React đơn giản và đầy đủ
  - @testing-library/user-event: ^13.5.0 				# Mô phỏng các sự kiện người dùng để kiểm tra
  - axios: ^1.7.2 							# HTTP dựa trên Promise cho trình duyệt và node.js
  - chart.js: ^4.4.3 							# Thư viện biểu đồ JavaScript đơn giản nhưng linh hoạt
  - date-fns: ^3.6.0 							# Thư viện tiện ích ngày hiện đại cho JavaScript
  - docx: ^8.5.0 							# Thư viện để tạo và thao tác các tệp DOCX
  - exceljs: ^4.4.0 							# Trình phân tích và xây dựng tệp Excel
  - file-saver: ^2.0.5 							# Thư viện để lưu tệp trên phía Client
  - framer-motion: ^11.3.2 						# Thư viện chuyển động cho React
  - fs: ^0.0.1-security 						# Mô-đun hệ thống tệp của Node.js
  - html2canvas: ^1.4.1 						# Kết xuất các phần tử HTML thành canvas
  - jspdf: ^2.5.1 							# Thư viện để tạo tệp PDF
  - jspdf-autotable: ^3.8.2 						# Plugin cho jsPDF để tạo bảng
  - jwt-decode: ^4.0.0 							# Thư viện để giải mã JSON Web Tokens (JWT)
  - mammoth: ^1.8.0 							# Chuyển đổi tài liệu DOCX sang HTML
  - moment: ^2.30.1 							# Phân tích, xác thực, thao tác và hiển thị ngày và giờ trong JavaScript
  - pdfjs-dist: ^4.5.136 						# Thư viện PDF.js để kết xuất PDF trong các ứng dụng web
  - react-chartjs-2: ^5.2.0 						# Gói bọc React cho Chart.js
  - react-hook-form: ^7.52.0 						# Biểu mẫu hiệu suất cao, linh hoạt và có thể mở rộng với xác thực dễ sử dụng
  - react-icons: ^5.2.1 						# Bao gồm các biểu tượng phổ biến trong các dự án React của bạn một cách dễ dàng
  - react-redux: ^9.1.2 						# Liên kết chính thức của React cho Redux
  - react-router: ^6.25.1 						# Định tuyến khai báo cho React
  - react-router-dom: ^6.25.1 						# Liên kết DOM cho React Router
  - react-slick: ^0.30.2 						# Thành phần carousel được xây dựng với React
  - react-to-print: ^2.15.1 						# In các thành phần React trong trình duyệt
  - react-toastify: ^10.0.5 						# Thư viện thông báo React
  - remove-accents: ^0.5.0 						# Loại bỏ dấu/diacritics khỏi chuỗi
  - socket.io-client: ^4.7.5 						# Giao tiếp sự kiện hai chiều thời gian thực
  - util: ^0.12.5 							# Mô-đun tiện ích của Node.js
  - webfontloader: ^1.6.28 						# Tải phông chữ web không đồng bộ

 * DevDependencies
  - autoprefixer: ^10.4.19 						# Plugin PostCSS để phân tích CSS và thêm tiền tố nhà cung cấp
  - postcss: ^8.4.38 							# Công cụ để chuyển đổi các kiểu với các plugin JS
  - tailwindcss: ^3.4.4 						# Khung CSS đầu tiên tiện ích


6.2. Server (Back-end)
 * Dependencies:
  - axios: ^1.7.2 							# HTTP dựa trên Promise cho trình duyệt và node.js
  - bcrypt: ^5.1.1 							# Thư viện để mã hóa và xác thực mật khẩu
  - body-parser: ^1.20.2 						# Middleware để phân tích body của các yêu cầu HTTP
  - cors: ^2.8.5 							# Middleware để xử lý CORS (Cross-Origin Resource Sharing)
  - crypto: ^1.0.1 							# Mô-đun mã hóa cho các thao tác an toàn
  - dotenv: ^16.4.5 							# Thư viện để tải biến môi trường từ tệp .env
  - ejs: ^3.1.10 							# Hệ thống mẫu HTML động cho Express
  - express: ^4.19.2 							# Khung ứng dụng web cho Node.js
  - express-validator: ^7.1.0 						# Middleware cho xác thực và làm sạch dữ liệu yêu cầu
  - http: ^0.0.1-security 						# Mô-đun HTTP cơ bản của Node.js
  - jsonwebtoken: ^9.0.2 						# Thư viện để tạo và xác thực JSON Web Tokens (JWT)
  - mongodb: ^6.7.0 							# Thư viện MongoDB cho Node.js
  - mongoose: ^8.4.1 							# ODM (Object Data Modeling) cho MongoDB và Node.js
  - node-fetch: ^3.3.2 							# Client HTTP dựa trên Promise cho Node.js
  - nodemailer: ^6.9.14 						# Thư viện để gửi email từ Node.js
  - path: ^0.12.7 							# Mô-đun để làm việc với các đường dẫn tệp
  - socket.io: ^4.7.5 							# Thư viện cho giao tiếp sự kiện hai chiều thời gian thực

 * DevDependencies:
  - nodemon: ^2.0.22 							# Công cụ giám sát các thay đổi trong ứng dụng và tự động khởi động lại


7. DANH SÁCH SINH VIÊN THAM GIA DỰ ÁN
  - 51900167 - Nguyễn Tiến Phát 
  - 51900178 - Phạm Ngọc Phụng

8. Một số lưu ý trước khi chạy dự án:
  - Cần phải tải các tài nguyên node_modules cho client và server trước khi chạy.
  - Cần phải thêm được tối thiều Collection User vào MongoDB.

9. Link Project: 
  - Link drive chính: https://drive.google.com/file/d/1Z5iYJcgLOLgLqK6w_xt6ymcC1HtT_Il8/view?usp=drive_link
  - Link dự phòng: https://drive.google.com/drive/folders/1Ew7mpjcEuo43073BChZoJIPqmG5_-t29
