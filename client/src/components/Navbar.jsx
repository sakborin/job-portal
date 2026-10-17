import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="text-xl font-bold text-blue-600">
          JobPortal
        </Link>

        <div className="flex flex-wrap items-center gap-5 text-sm text-gray-700">
          <Link to="/" className="hover:text-blue-600">
            Jobs
          </Link>

          {user && user.role === "seeker" && (
            <Link to="/my-applications" className="hover:text-blue-600">
              My Applications
            </Link>
          )}

          {user && user.role === "employer" && (
            <>
              <Link to="/dashboard" className="hover:text-blue-600">
                Dashboard
              </Link>
              <Link to="/post-job" className="hover:text-blue-600">
                Post Job
              </Link>
            </>
          )}

          {!user && (
            <>
              <Link to="/login" className="hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              <span className="text-gray-500">{user.name}</span>
              <button
                onClick={handleLogout}
                className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;