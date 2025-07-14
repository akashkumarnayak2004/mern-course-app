import React, { useState } from "react";
import Coursecreate from "./Coursecreate";
import Ourcourses from "./Ourcourses";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div>
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-lg text-gray-600">
              Welcome to the admin dashboard. Here you can manage courses, view statistics, and more.
            </p>
          </div>
        );
      case "create":
        return <Coursecreate />;
      case "courses":
        return <Ourcourses />;
      default:
        return <h2 className="text-xl text-gray-500">Select an option</h2>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Top Navbar for mobile */}
      <div className="md:hidden bg-gray-900 text-white flex justify-between items-center px-4 py-3 shadow">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          menuOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-gray-900 text-white p-5 space-y-4`}
      >
        <button
          onClick={handleHomeClick}
          className="block w-full text-left p-2 rounded hover:bg-gray-700"
        >
          Home Page
        </button>

        <button
          onClick={() => {
            setActiveTab("dashboard");
            setMenuOpen(false);
          }}
          className={`block w-full text-left p-2 rounded hover:bg-gray-700 ${
            activeTab === "dashboard" ? "bg-gray-700" : ""
          }`}
        >
          Dashboard
        </button>

        <button
          onClick={() => {
            setActiveTab("create");
            setMenuOpen(false);
          }}
          className={`block w-full text-left p-2 rounded hover:bg-gray-700 ${
            activeTab === "create" ? "bg-gray-700" : ""
          }`}
        >
          Create Course
        </button>

        <button
          onClick={() => {
            setActiveTab("courses");
            setMenuOpen(false);
          }}
          className={`block w-full text-left p-2 rounded hover:bg-gray-700 ${
            activeTab === "courses" ? "bg-gray-700" : ""
          }`}
        >
          All Courses
        </button>

        <button
          onClick={handleLogout}
          className="block w-full text-left p-2 mt-8 bg-red-600 hover:bg-red-700 rounded"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto bg-white">{renderContent()}</div>
    </div>
  );
};

export default AdminDashboard;
