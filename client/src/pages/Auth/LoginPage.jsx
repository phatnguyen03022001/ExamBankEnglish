import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../Redux/Auth/authSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/Image/logo.png";
import default_bg from "../../assets/Image/default_bg.png";

import { HiOutlineInformationCircle, HiX } from "react-icons/hi"; // Import icon

const TestAccountDialog = ({ isOpen, onClose }) => {
  const dialogRef = useRef(null);

  // Đóng dialog khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <div
        ref={dialogRef}
        className="bg-white w-96 p-6 rounded-xl shadow-2xl relative transition-transform transform scale-100 hover:scale-105">
        <button
          className="absolute top-3 right-3 text-stone-600 hover:text-red-500 transition-colors duration-200"
          onClick={onClose}>
          <HiX size={24} />
        </button>
        <h2 className="text-xl font-bold text-red-600 text-center border-b pb-2">
          Test Accounts
        </h2>
        <div className="mt-4 text-stone-700 text-sm space-y-2">
          <p className="flex justify-between bg-stone-100 p-2 rounded-lg">
            <span className="font-semibold">Student:</span>{" "}
            <span>120240001 | Pass: admin</span>
          </p>
          <p className="flex justify-between bg-stone-100 p-2 rounded-lg">
            <span className="font-semibold">Teacher:</span>{" "}
            <span>T20240001 | Pass: admin</span>
          </p>
          <p className="flex justify-between bg-stone-100 p-2 rounded-lg">
            <span className="font-semibold">Head:</span>{" "}
            <span>H20240001 | Pass: admin</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const notifyError = (message) => toast.error(message);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [isDialogOpen, setIsDialogOpen] = useState(true); // State for dialog visibility
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    let role = "Student"; // Mặc định là Student
    if (username.startsWith("T")) {
      role = "Teacher";
    } else if (username.startsWith("H")) {
      role = "Head";
    }
    const loginUser = { username, password, role };
    try {
      const url = `${process.env.REACT_APP_API_URL}${role}/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginUser),
      });

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();
      localStorage.setItem("token", data.token);
      dispatch(login({ token: data.token, role }));
      navigate(`/${role}/`);
    } catch (error) {
      console.error(role, "Login failed:", error.message);
      notifyError("Please check your username and password again!");
    }
  };

  return (
    <div className="min-h-screen bg-stone-800 shadow-white text-stone-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="text-center">
            <img src={logo} className="w-32 mx-auto" alt="English_GO_logo" />
          </div>
          <div className="mt-12 flex flex-col items-center">
            <form className="w-full flex-1 mt-8" onSubmit={handleLogin}>
              <div className="mx-auto max-w-xs">
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-stone-100 border border-stone-200 placeholder-stone-500 text-sm focus:outline-none focus:border-stone-400 focus:bg-white mt-5"
                  type="text"
                  placeholder="Username"
                  id="username"
                  value={username}
                  autoComplete="username"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />

                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  className="w-full px-8 py-4 rounded-lg font-medium bg-stone-100 border border-stone-200 placeholder-stone-500 text-sm focus:outline-none focus:border-stone-400 focus:bg-white mt-5"
                  type="password"
                  placeholder="Password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button className="mt-5 tracking-wide font-semibold bg-stone-500 text-stone-100 w-full py-4 rounded-lg hover:bg-stone-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                  <span className="ml-3">Login</span>
                </button>
              </div>
            </form>

            <span className="mt-8">
              <Link
                to="/forgotpassword"
                className="mt-3 text-sm text-stone-500 hover:text-stone-700 focus:text-stone-700 focus:outline-none">
                Forgot Password?
              </Link>
            </span>

            <div className="relative mt-36">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(true)}
                  className="text-red-300 hover:text-red-500">
                  <HiOutlineInformationCircle size={24} />
                </button>

                {/* Hiển thị dialog khi mở */}
                <TestAccountDialog
                  isOpen={isDialogOpen}
                  onClose={() => setIsDialogOpen(false)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-stone-100 text-center hidden lg:flex relative overflow-hidden rounded-r-lg">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat rounded-r-lg overflow-hidden relative transition-transform duration-300 ease-in-out transform hover:scale-105 "
            style={{
              backgroundImage: `url(${default_bg})`,
            }}>
            {/* Overlay */}
            <div className="absolute inset-0 bg-black opacity-50"></div>
            {/* Text content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-7xl">
              <h1 className="mb-4 text-3xl font-extrabold text-white md:text-5xl lg:text-6xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-red-300">
                  LEARNING
                  <br />
                  IS THE EYE
                </span>{" "}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r to-sky-200 from-red-300">
                  OF THE MIND
                </span>
              </h1>

              <blockquote className="text-xl italic font-semibold text-white">
                <p className="m-20">
                  "You will never cultivate courage without experiencing wounds.
                  You will never gain knowledge without making mistakes. You
                  will never achieve success without facing failure."
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
