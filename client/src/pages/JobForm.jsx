import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";

function JobForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
  });

  useEffect(() => {
    if (id) {
      api.get("/jobs/" + id).then((res) => {
        setForm({
          title: res.data.title,
          company: res.data.company,
          location: res.data.location,
          type: res.data.type,
          salary: res.data.salary || "",
          description: res.data.description,
        });
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (id) {
        await api.put("/jobs/" + id, form);
      } else {
        await api.post("/jobs", form);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const inputClass =
    "w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-600";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <h1 className="text-2xl font-bold">{id ? "Edit job" : "Post a job"}</h1>
        <p className="mt-1 text-sm text-gray-500">Fill in the job details</p>

        {error && (
          <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Job title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Company</label>
            <input
              name="company"
              value={form.company}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Job type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className={inputClass}
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Internship</option>
                <option>Contract</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Salary</label>
            <input
              name="salary"
              value={form.salary}
              onChange={handleChange}
              placeholder="Example: $500 - $800"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows="6"
              className={inputClass}
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            {id ? "Save changes" : "Post job"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default JobForm;