import { useEffect, useState } from "react";
import API_URL from "./api";

function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");
  const [editingJobId, setEditingJobId] = useState(null);

  const emptyJobForm = {
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
  };

  const [jobForm, setJobForm] = useState(emptyJobForm);

  const token = localStorage.getItem("token");

  const loadJobs = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/jobs`
      );

      const data = await response.json();

      if (response.ok) {
        setJobs(data);
      } else {
        setMessage("Jobs load nahi ho pa rahi");
      }
    } catch {
      setMessage("Jobs load nahi ho pa rahi");
    }
  };

  const loadApplications = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        setApplications(data);
      } else {
        setApplications([]);
        setMessage(
          data.message || "Applications load failed"
        );
      }
    } catch {
      setApplications([]);
      setMessage("Server connection failed");
    }
  };

  const handleJobChange = (e) => {
    setJobForm({
      ...jobForm,
      [e.target.name]: e.target.value,
    });
  };

  const createJob = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/jobs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(jobForm),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Job created successfully");
        setJobForm(emptyJobForm);
        loadJobs();
      } else {
        setMessage(
          data.message || "Job creation failed"
        );
      }
    } catch {
      setMessage("Server connection failed");
    }
  };

  const updateJob = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/jobs/${editingJobId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(jobForm),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Job updated successfully");
        setEditingJobId(null);
        setJobForm(emptyJobForm);
        loadJobs();
      } else {
        setMessage(
          data.message || "Job update failed"
        );
      }
    } catch {
      setMessage("Server connection failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingJobId) {
      await updateJob();
    } else {
      await createJob();
    }
  };

  const startEdit = (job) => {
    setEditingJobId(job.id);

    setJobForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      salary: job.salary || "",
      description: job.description || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEdit = () => {
    setEditingJobId(null);
    setJobForm(emptyJobForm);
    setMessage("");
  };

  const deleteJob = async (jobId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/jobs/${jobId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Job deleted successfully");

        if (editingJobId === jobId) {
          setEditingJobId(null);
          setJobForm(emptyJobForm);
        }

        loadJobs();
      } else {
        setMessage(
          data.message || "Delete failed"
        );
      }
    } catch {
      setMessage("Server connection failed");
    }
  };

  const updateStatus = async (
    applicationId,
    status
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/api/applications/${applicationId}/status?status=${status}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          `Application ${status.toLowerCase()}`
        );

        loadApplications();
      } else {
        setMessage(
          data.message || "Status update failed"
        );
      }
    } catch {
      setMessage("Server connection failed");
    }
  };

  useEffect(() => {
    loadJobs();
    loadApplications();
  }, []);

  const selectedApplications =
    applications.filter(
      (application) =>
        application.status === "SELECTED"
    ).length;

  const pendingApplications =
    applications.filter(
      (application) =>
        application.status === "APPLIED"
    ).length;

  return (
    <div className="admin-page">

      <div className="admin-header">
        <span className="admin-badge">
          Admin Panel
        </span>

        <h2>Admin Dashboard</h2>

        <p>
          Manage jobs and track candidate applications
          from one place.
        </p>
      </div>

      <div className="dashboard-stats">

        <div className="dashboard-stat-card">
          <div className="stat-icon">💼</div>

          <div>
            <span>Total Jobs</span>
            <h3>{jobs.length}</h3>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon">📄</div>

          <div>
            <span>Applications</span>
            <h3>{applications.length}</h3>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon">✓</div>

          <div>
            <span>Selected</span>
            <h3>{selectedApplications}</h3>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon">⏳</div>

          <div>
            <span>Pending</span>
            <h3>{pendingApplications}</h3>
          </div>
        </div>

      </div>

      {message && (
        <p className="form-message">
          {message}
        </p>
      )}

      <section className="admin-section">
        <div className="admin-job-form">

          <h3>
            {editingJobId
              ? "Edit Job"
              : "Post New Job"}
          </h3>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={jobForm.title}
              onChange={handleJobChange}
              required
            />

            <input
              type="text"
              name="company"
              placeholder="Company"
              value={jobForm.company}
              onChange={handleJobChange}
              required
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={jobForm.location}
              onChange={handleJobChange}
              required
            />

            <input
              type="text"
              name="salary"
              placeholder="Salary e.g. 8 LPA"
              value={jobForm.salary}
              onChange={handleJobChange}
              required
            />

            <textarea
              name="description"
              placeholder="Job Description"
              value={jobForm.description}
              onChange={handleJobChange}
              required
            />

            <button
              type="submit"
              className="form-button"
            >
              {editingJobId
                ? "Update Job"
                : "Post Job"}
            </button>

            {editingJobId && (
              <button
                type="button"
                className="cancel-button"
                onClick={cancelEdit}
              >
                Cancel Edit
              </button>
            )}
          </form>

        </div>
      </section>

      <section className="admin-section">
        <h3>Manage Jobs</h3>

        <div className="jobs-grid">
          {jobs.map((job) => (
            <div
              className="job-card"
              key={job.id}
            >
              <h3>{job.title}</h3>

              <p>
                <strong>Company:</strong>{" "}
                {job.company}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {job.location}
              </p>

              <p>
                <strong>Salary:</strong>{" "}
                {job.salary}
              </p>

              <p>{job.description}</p>

              <div className="job-action-buttons">
                <button
                  className="edit-button"
                  onClick={() =>
                    startEdit(job)
                  }
                >
                  Edit Job
                </button>

                <button
                  className="delete-button"
                  onClick={() =>
                    deleteJob(job.id)
                  }
                >
                  Delete Job
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <h3>Applications</h3>

        <div className="jobs-grid">
          {applications.map((application) => (
            <div
              className="job-card"
              key={application.applicationId}
            >
              <h3>
                {application.candidateName ||
                  "Candidate"}
              </h3>

              <p>
                <strong>Email:</strong>{" "}
                {application.candidateEmail || "N/A"}
              </p>

              <p>
                <strong>Job:</strong>{" "}
                {application.jobTitle || "N/A"}
              </p>

              <p>
                <strong>Company:</strong>{" "}
                {application.company || "N/A"}
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {application.location || "N/A"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {application.status}
              </p>

              <div className="status-buttons">
                <button
                  className="select-button"
                  onClick={() =>
                    updateStatus(
                      application.applicationId,
                      "SELECTED"
                    )
                  }
                >
                  Select
                </button>

                <button
                  className="reject-button"
                  onClick={() =>
                    updateStatus(
                      application.applicationId,
                      "REJECTED"
                    )
                  }
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default AdminDashboard;