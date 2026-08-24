import { useEffect, useState } from "react";
import API_URL from "./api";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please login first");
      return;
    }

    fetch(`${API_URL}/api/applications/my`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setApplications(data);
        } else {
          setMessage(
            data.message || "Applications load nahi ho pa rahi"
          );
        }
      })
      .catch(() => {
        setMessage("Server connection failed");
      });
  }, []);

  const getStatusClass = (status) => {
    if (status === "SELECTED") {
      return "status-badge selected";
    }

    if (status === "REJECTED") {
      return "status-badge rejected";
    }

    return "status-badge applied";
  };

  return (
    <div className="my-applications-page">
      <div className="applications-header">
        <span>Application Tracker</span>

        <h2>My Applications</h2>

        <p>
          Track every job you have applied for and follow the latest
          application status.
        </p>
      </div>

      {message && (
        <p className="form-message">
          {message}
        </p>
      )}

      <div className="applications-summary">
        <div>
          <span>Total Applications</span>
          <strong>{applications.length}</strong>
        </div>

        <div>
          <span>Selected</span>
          <strong>
            {
              applications.filter(
                (application) =>
                  application.status === "SELECTED"
              ).length
            }
          </strong>
        </div>

        <div>
          <span>Pending</span>
          <strong>
            {
              applications.filter(
                (application) =>
                  application.status === "APPLIED"
              ).length
            }
          </strong>
        </div>
      </div>

      {applications.length > 0 ? (
        <div className="applications-grid">
          {applications.map((application) => (
            <article
              className="application-card"
              key={application.applicationId}
            >
              <div className="application-card-header">
                <div>
                  <span className="application-company">
                    {application.company || "Company"}
                  </span>

                  <h3>
                    {application.title || "Job"}
                  </h3>
                </div>

                <span
                  className={getStatusClass(
                    application.status
                  )}
                >
                  {application.status}
                </span>
              </div>

              <div className="application-meta">
                <span>
                  📍 {application.location || "N/A"}
                </span>

                <span>
                  💰 {application.salary || "N/A"}
                </span>
              </div>

              {application.description && (
                <p className="application-description">
                  {application.description}
                </p>
              )}

              <div className="application-footer">
                <span>
                  Application #{application.applicationId}
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        !message && (
          <div className="empty-state">
            <div>📄</div>

            <h3>No applications yet</h3>

            <p>
              Browse available jobs and start applying.
            </p>
          </div>
        )
      )}
    </div>
  );
}

export default MyApplications;