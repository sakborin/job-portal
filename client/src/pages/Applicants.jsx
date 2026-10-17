import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";

function Applicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadApplicants = () => {
    api
      .get("/applications/job/" + jobId)
      .then((res) => setApplicants(res.data))
      .catch(() => setApplicants([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadApplicants();
  }, [jobId]);

  const updateStatus = async (id, status) => {
    await api.put("/applications/" + id, { status });
    loadApplicants();
  };

  const cardStyle = (status) => {
    if (status === "accepted") return "bg-green-50 border-green-500";
    if (status === "rejected") return "bg-red-50 border-red-500";
    return "bg-white border-gray-200";
  };

  const badgeStyle = (status) => {
    if (status === "accepted") return "bg-green-600 text-white";
    if (status === "rejected") return "bg-red-600 text-white";
    return "bg-yellow-100 text-yellow-800";
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/dashboard" className="text-sm text-blue-600 hover:underline">
        Back to dashboard
      </Link>

      <h1 className="mt-4 text-2xl font-bold">Applicants</h1>

      {loading && <p className="mt-8 text-gray-500">Loading...</p>}

      {!loading && applicants.length === 0 && (
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600">No one has applied yet.</p>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {applicants.map((app) => (
          <div
            key={app._id}
            className={"border-2 rounded-lg p-6 " + cardStyle(app.status)}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{app.applicant?.name}</h2>
                <p className="text-sm text-gray-600">{app.applicant?.email}</p>
              </div>
              <span
                className={
                  "text-sm font-semibold px-4 py-2 rounded-md capitalize " +
                  badgeStyle(app.status)
                }
              >
                {app.status}
              </span>
            </div>

            {app.message && (
              <p className="mt-4 text-sm text-gray-700 bg-white border border-gray-200 rounded-md p-3">
                {app.message}
              </p>
            )}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => updateStatus(app._id, "accepted")}
                className="bg-green-600 text-white font-medium py-3 rounded-md hover:bg-green-700"
              >
                Accept
              </button>
              <button
                onClick={() => updateStatus(app._id, "rejected")}
                className="bg-red-600 text-white font-medium py-3 rounded-md hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Applicants;