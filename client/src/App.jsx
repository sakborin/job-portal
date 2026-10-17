import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyApplications from "./pages/MyApplications";
import Dashboard from "./pages/Dashboard";
import JobForm from "./pages/JobForm";
import Applicants from "./pages/Applicants";

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/my-applications"
          element={
            <ProtectedRoute role="seeker">
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="employer">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-job"
          element={
            <ProtectedRoute role="employer">
              <JobForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-job/:id"
          element={
            <ProtectedRoute role="employer">
              <JobForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applicants/:jobId"
          element={
            <ProtectedRoute role="employer">
              <Applicants />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;