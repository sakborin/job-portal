import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

function Home() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/jobs")
      .then((res) => setJobs(res.data))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.get("/jobs", { params: { search } });
      setJobs(res.data);
    } catch (error) {
      setJobs([]);
    }
    setLoading(false);
  };

  return (
    <div>
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-14 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">Find your next job</h1>
          <p className="mt-3 text-gray-500">
            Search jobs by title, company or location
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 max-w-xl mx-auto flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs"
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-600"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-xl font-semibold mb-6">Latest jobs</h2>

        {loading && <p className="text-gray-500">Loading jobs...</p>}

        {!loading && jobs.length === 0 && (
          <p className="text-gray-500">No jobs found.</p>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col"
            >
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{job.company}</p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  {job.location}
                </span>
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  {job.type}
                </span>
              </div>

              {job.salary && (
                <p className="mt-4 text-sm text-gray-700">{job.salary}</p>
              )}

              <Link
                to={"/jobs/" + job._id}
                className="mt-6 text-center border border-blue-600 text-blue-600 py-2 rounded-md hover:bg-blue-600 hover:text-white"
              >
                View job
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;