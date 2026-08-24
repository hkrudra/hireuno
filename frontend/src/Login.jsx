import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "./api";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/users/login?email=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(password)}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("name", data.name);
        localStorage.setItem("role", data.role);
        localStorage.setItem("email", email);

        if (onLogin) {
          onLogin();
        }

        setMessage("Login successful");

        navigate("/jobs");
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage("Server connection failed");
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h2>Welcome Back</h2>

        <p>Login to continue to Hireuno</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="form-button"
          >
            Login
          </button>
        </form>

        {message && (
          <p className="form-message">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;