import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = () => {
    api
      .get("/jobs/mine")
      .then((res) => setJobs(res.data))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDelete = async (id) => {
    const sure = window.confirm("Delete this job and its applicants?");
    if (!sure) return;
    await api.delete("/jobs/" + id);
    loadJobs();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-gray-500">Manage the jobs you posted</p>
        </div>
        <Link
          to="/post-job"
          className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
        >
          Post a job
        </Link>
      </div>

      {loading && <p className="mt-8 text-gray-500">Loading...</p>}

      {!loading && jobs.length === 0 && (
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">You have not posted any job yet.</p>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h2 className="font-semibold">{job.title}</h2>
              <p className="text-sm text-gray-600">
                {job.company} · {job.location} · {job.type}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Link
                to={"/applicants/" + job._id}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Applicants
              </Link>
              <Link
                to={"/edit-job/" + job._id}
                className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(job._id)}
                className="border border-red-300 text-red-600 px-4 py-2 rounded-md hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;