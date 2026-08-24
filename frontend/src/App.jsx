import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import "./App.css";

import Login from "./Login";
import Register from "./Register";
import Jobs from "./Jobs";
import MyApplications from "./MyApplications";
import AdminDashboard from "./AdminDashboard";


// ================= HOME =================

function Home() {
  return (
    <div className="page">

      {/* HERO */}

      <section className="hero premium-hero">

        <div className="hero-badge">
          🚀 Build Your Career With The Right Opportunity
        </div>

        <h1>
          Find the right job.
          <span className="hero-highlight">
            Build your future.
          </span>
        </h1>

        <p>
          Discover opportunities from leading companies,
          apply in seconds, and track your application
          journey from one simple dashboard.
        </p>

        <div className="hero-buttons">

          <Link
            to="/jobs"
            className="btn primary"
          >
            Explore Jobs
          </Link>

          <Link
            to="/register"
            className="btn secondary"
          >
            Create Free Account
          </Link>

        </div>

        <div className="hero-stats">

          <div className="stat-card">
            <strong>Smart</strong>
            <span>Job Search</span>
          </div>

          <div className="stat-card">
            <strong>Secure</strong>
            <span>Role Based Access</span>
          </div>

          <div className="stat-card">
            <strong>Live</strong>
            <span>Application Tracking</span>
          </div>

        </div>

      </section>


      {/* WHY HIREUNO */}

      <section className="home-section">

        <div className="section-heading">

          <span>Why Hireuno?</span>

          <h2>
            Everything you need for your job search
          </h2>

          <p>
            Hireuno makes it simple to discover jobs,
            apply for opportunities and track your
            application status from one place.
          </p>

        </div>


        <div className="feature-grid">

          <div className="feature-card">

            <div className="feature-icon">
              🔍
            </div>

            <h3>Smart Job Search</h3>

            <p>
              Search jobs by title and location
              to quickly discover opportunities
              that match your interests.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              ⚡
            </div>

            <h3>Quick Apply</h3>

            <p>
              Login once and apply directly to
              available opportunities with a
              simple application process.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              📊
            </div>

            <h3>Track Applications</h3>

            <p>
              Follow your application journey
              and see whether your status is
              applied, selected or rejected.
            </p>

          </div>

        </div>

      </section>


      {/* HOW IT WORKS */}

      <section className="how-section">

        <div className="section-heading">

          <span>How It Works</span>

          <h2>
            Your next opportunity in 3 simple steps
          </h2>

        </div>


        <div className="steps-grid">

          <div className="step-card">

            <div className="step-number">
              01
            </div>

            <h3>Create Account</h3>

            <p>
              Register on Hireuno and create
              your candidate account.
            </p>

          </div>


          <div className="step-card">

            <div className="step-number">
              02
            </div>

            <h3>Find & Apply</h3>

            <p>
              Browse available jobs and apply
              to opportunities that interest you.
            </p>

          </div>


          <div className="step-card">

            <div className="step-number">
              03
            </div>

            <h3>Track Status</h3>

            <p>
              Check My Applications to follow
              the latest status of every application.
            </p>

          </div>

        </div>

      </section>


      {/* CTA */}

      <section className="cta-section">

        <div>

          <span>
            Ready to get started?
          </span>

          <h2>
            Your next opportunity could be
            one application away.
          </h2>

        </div>

        <Link
          to="/jobs"
          className="btn primary"
        >
          Browse Open Jobs
        </Link>

      </section>

    </div>
  );
}


// ================= PROFILE =================

function Profile() {
  const name =
    localStorage.getItem("name") || "User";

  const email =
    localStorage.getItem("email") ||
    "Email not available";

  const role =
    localStorage.getItem("role") || "USER";

  const firstLetter =
    name.charAt(0).toUpperCase();

  return (
    <div className="profile-page">

      <div className="profile-card">

        <div className="profile-avatar">
          {firstLetter}
        </div>

        <h2>{name}</h2>

        <p className="profile-email">
          {email}
        </p>

        <span className="profile-role">
          {role}
        </span>


        <div className="profile-info-grid">

          <div className="profile-info-box">

            <span>
              Account Type
            </span>

            <strong>
              {role}
            </strong>

          </div>


          <div className="profile-info-box">

            <span>
              Status
            </span>

            <strong>
              Active
            </strong>

          </div>

        </div>

      </div>

    </div>
  );
}


// ================= FOOTER =================

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-brand">

        <div className="logo footer-logo">
          Hireuno
        </div>

        <p>
          Connecting talented candidates with
          better career opportunities.
        </p>

      </div>


      <div className="footer-links">

        <Link to="/">
          Home
        </Link>

        <Link to="/jobs">
          Jobs
        </Link>

        <Link to="/login">
          Login
        </Link>

        <Link to="/register">
          Register
        </Link>

      </div>


      <div className="footer-copy">
        © 2026 Hireuno. All rights reserved.
      </div>

    </footer>
  );
}


// ================= APP CONTENT =================

function AppContent() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] =
    useState(
      !!localStorage.getItem("token")
    );

  const role =
    localStorage.getItem("role");


  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    setIsLoggedIn(false);

    navigate("/");
  };


  return (
    <>

      {/* NAVBAR */}

      <nav className="navbar">

        <Link
          to="/"
          className="logo"
        >
          Hireuno
        </Link>


        <div className="nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/jobs">
            Jobs
          </Link>


          {isLoggedIn &&
            role === "USER" && (

              <Link to="/my-applications">
                My Applications
              </Link>

            )}


          {isLoggedIn &&
            role === "ADMIN" && (

              <Link to="/admin">
                Admin Dashboard
              </Link>

            )}


          {isLoggedIn ? (
            <>

              <Link to="/profile">
                Profile
              </Link>

              <button
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>

            </>
          ) : (
            <>

              <Link to="/login">
                Login
              </Link>

              <Link
                to="/register"
                className="register-link"
              >
                Register
              </Link>

            </>
          )}

        </div>

      </nav>


      {/* ROUTES */}

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/my-applications"
          element={<MyApplications />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/login"
          element={
            <Login
              onLogin={() =>
                setIsLoggedIn(true)
              }
            />
          }
        />

        <Route
          path="/register"
          element={<Register />}
        />

      </Routes>


      {/* FOOTER */}

      <Footer />

    </>
  );
}


// ================= MAIN APP =================

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;