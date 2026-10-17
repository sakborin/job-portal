import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/jobs/" + id)
      .then((res) => setJob(res.data))
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/applications", { jobId: id, message });
      setSuccess("Your application was sent");
      setMessage("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) {
    return <p className="max-w-3xl mx-auto px-4 py-10 text-gray-500">Loading...</p>;
  }

  if (!job) {
    return <p className="max-w-3xl mx-auto px-4 py-10 text-gray-500">Job not found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/" className="text-sm text-blue-600 hover:underline">
        Back to jobs
      </Link>

      <div className="mt-4 bg-white border border-gray-200 rounded-lg p-8">
        <h1 className="text-2xl font-bold">{job.title}</h1>
        <p className="mt-1 text-gray-600">{job.company}</p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
            {job.location}
          </span>
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
            {job.type}
          </span>
          {job.salary && (
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
              {job.salary}
            </span>
          )}
        </div>

        <h2 className="mt-8 font-semibold">Description</h2>
        <p className="mt-2 text-gray-700 whitespace-pre-line">{job.description}</p>
      </div>

      <div className="mt-6 bg-white border border-gray-200 rounded-lg p-8">
        <h2 className="text-lg font-semibold">Apply for this job</h2>

        {!user && (
          <p className="mt-3 text-sm text-gray-600">
            Please{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              login
            </Link>{" "}
            as a job seeker to apply.
          </p>
        )}

        {user && user.role === "employer" && (
          <p className="mt-3 text-sm text-gray-600">
            Employer accounts cannot apply for jobs.
          </p>
        )}

        {user && user.role === "seeker" && (
          <form onSubmit={handleApply} className="mt-4 space-y-4">
            {success && (
              <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                {success}
              </p>
            )}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
                placeholder="Tell the employer why you are a good fit"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-600"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Apply now
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default JobDetail;