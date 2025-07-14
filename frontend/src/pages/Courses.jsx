import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BACKEND_URL } from '../../utils/util';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('user');
    setIsLoggedin(!!token);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data.courses);
        setFilteredCourses(response.data.courses);
      } catch (error) {
        toast.error('Failed to load courses');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${BACKEND_URL}/user/logout`, { withCredentials: true });
      toast.success('Logout successful!');
      setIsLoggedin(false);
      localStorage.removeItem('user');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const activeClass = (path) =>
    location.pathname === path
      ? 'bg-blue-600 text-white'
      : 'text-gray-700 hover:bg-gray-200';

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-gray-100 px-4 py-3 flex justify-between items-center shadow">
        <h2 className="text-xl font-bold">Dashboard</h2>
        <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
          {/* Hamburger Icon */}
          <svg
            className="w-6 h-6 text-gray-800"
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

      {/* Sidebar or Top Nav */}
      <aside
        className={`${
          menuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-gray-100 p-4 shadow md:min-h-screen`}
      >
        <nav className="flex flex-col md:gap-2 gap-4 md:items-start items-center mt-2 md:mt-0">
          <button onClick={() => navigate('/')} className={`px-4 py-2 rounded ${activeClass('/')}`}>Home</button>
          <button onClick={() => navigate('/courses')} className={`px-4 py-2 rounded ${activeClass('/courses')}`}>Courses</button>
          <button onClick={() => navigate('/purchases')} className={`px-4 py-2 rounded ${activeClass('/purchases')}`}>Purchases</button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded bg-white text-gray hover:bg-red-600"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-white overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold">Courses</h1>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={handleSearch}
            className="px-4 py-2 border rounded-lg w-full sm:w-64 outline-none"
          />
        </div>

        {isLoading ? (
          <p className="text-center text-gray-600">Loading courses...</p>
        ) : filteredCourses.length === 0 ? (
          <p className="text-center text-gray-600">No courses found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                <img
                  src={course.image?.url || 'https://via.placeholder.com/400x200?text=No+Image'}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-lg font-semibold mb-1">{course.title}</h2>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                  <div className="text-gray-800 font-medium mb-4">₹{course.price}</div>

                  {isLoggedin ? (
                    <Link
                      to={`/buy/${course._id}`}
                      className="mt-auto py-2 text-center rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                    >
                      Buy Now
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="mt-auto py-2 rounded-md bg-gray-400 text-white font-semibold cursor-not-allowed"
                    >
                      Login to Buy
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Courses;
