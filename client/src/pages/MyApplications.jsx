import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/applications/mine")
      .then((res) => setApplications(res.data))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  const statusStyle = (status) => {
    if (status === "accepted") return "bg-green-50 text-green-700";
    if (status === "rejected") return "bg-red-50 text-red-700";
    return "bg-yellow-50 text-yellow-700";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold">My Applications</h1>
      <p className="mt-1 text-gray-500">Track the jobs you applied for</p>

      {loading && <p className="mt-8 text-gray-500">Loading...</p>}

      {!loading && applications.length === 0 && (
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">You have not applied to any job yet.</p>
          <Link
            to="/"
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Browse jobs
          </Link>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              {app.job ? (
                <>
                  <h2 className="font-semibold">{app.job.title}</h2>
                  <p className="text-sm text-gray-600">
                    {app.job.company} · {app.job.location}
                  </p>
                </>
              ) : (
                <h2 className="font-semibold text-gray-500">
                  This job was removed
                </h2>
              )}
              <p className="mt-1 text-xs text-gray-400">
                Applied on {new Date(app.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={
                  "text-xs px-3 py-1 rounded-full capitalize " +
                  statusStyle(app.status)
                }
              >
                {app.status}
              </span>
              {app.job && (
                <Link
                  to={"/jobs/" + app.job._id}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View job
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyApplications;