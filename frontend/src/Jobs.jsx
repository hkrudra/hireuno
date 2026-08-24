import { useEffect, useState } from "react";
import API_URL from "./api";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  const loadAllJobs = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/jobs`
      );

      const data = await response.json();

      if (response.ok) {
        setJobs(data);
        setMessage("");
      } else {
        setMessage("Jobs load nahi ho pa rahi");
      }
    } catch {
      setMessage("Jobs load nahi ho pa rahi");
    }
  };

  useEffect(() => {
    loadAllJobs();
  }, []);

  const searchJobs = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (title.trim()) {
      params.append("title", title.trim());
    }

    if (location.trim()) {
      params.append("location", location.trim());
    }

    try {
      const response = await fetch(
        `${API_URL}/api/jobs/search?${params.toString()}`
      );

      const data = await response.json();

      if (response.ok) {
        setJobs(data);

        setMessage(
          data.length === 0
            ? "No jobs found"
            : ""
        );
      } else {
        setMessage("Search failed");
      }
    } catch {
      setMessage("Server connection failed");
    }
  };

  const clearSearch = () => {
    setTitle("");
    setLocation("");
    setMessage("");

    loadAllJobs();
  };

  const applyForJob = async (jobId) => {
    const token =
      localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/applications`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            jobId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "Job applied successfully"
        );
      } else {
        setMessage(
          data.message ||
            "Application failed"
        );
      }
    } catch {
      setMessage(
        "Server connection failed"
      );
    }
  };

  const getCompanyLetter = (company) => {
    return company
      ? company.charAt(0).toUpperCase()
      : "C";
  };

  return (
    <div className="jobs-page premium-jobs-page">

      <div className="jobs-header">

        <span>
          Explore Opportunities
        </span>

        <h2>
          Find a job that fits your future
        </h2>

        <p>
          Search current openings by role
          or location and apply directly
          through Hireuno.
        </p>

      </div>

      <form
        className="job-search premium-job-search"
        onSubmit={searchJobs}
      >

        <div className="search-field">

          <span className="search-icon">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Job title or keyword"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

        </div>

        <div className="search-field">

          <span className="search-icon">
            ⌖
          </span>

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
          />

        </div>

        <button
          type="submit"
          className="search-button"
        >
          Search Jobs
        </button>

        <button
          type="button"
          className="clear-button"
          onClick={clearSearch}
        >
          Clear
        </button>

      </form>

      {message && (
        <p className="form-message">
          {message}
        </p>
      )}

      <div className="jobs-toolbar">

        <p>
          <strong>
            {jobs.length}
          </strong>{" "}
          {jobs.length === 1
            ? "job"
            : "jobs"}{" "}
          available
        </p>

      </div>

      {jobs.length > 0 && (

        <div className="jobs-grid premium-jobs-grid">

          {jobs.map((job) => (

            <article
              className="job-card premium-job-card"
              key={job.id}
            >

              <div className="job-card-top">

                <div className="company-avatar">
                  {getCompanyLetter(
                    job.company
                  )}
                </div>

                <div className="job-main-info">

                  <span className="job-type-badge">
                    Full Time
                  </span>

                  <h3>
                    {job.title}
                  </h3>

                  <p className="company-name">
                    {job.company}
                  </p>

                </div>

              </div>

              <div className="job-meta">

                <span>
                  📍 {job.location}
                </span>

                <span>
                  💰 {job.salary}
                </span>

              </div>

              <p className="job-description">
                {job.description}
              </p>

              <div className="job-card-footer">

                <span className="job-id">
                  Job #{job.id}
                </span>

                <button
                  className="apply-button premium-apply-button"
                  onClick={() =>
                    applyForJob(job.id)
                  }
                >
                  Apply Now
                </button>

              </div>

            </article>

          ))}

        </div>

      )}

      {jobs.length === 0 &&
        !message && (

          <div className="empty-state">

            <div>
              🔎
            </div>

            <h3>
              No jobs available
            </h3>

            <p>
              Please check again later
              for new opportunities.
            </p>

          </div>

        )}

    </div>
  );
}

export default Jobs;