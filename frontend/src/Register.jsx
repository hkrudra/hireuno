import { useState } from "react";
import API_URL from "./api";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful");

        setFormData({
          name: "",
          email: "",
          password: "",
        });
      } else {
        setMessage(
          data.message || "Registration failed"
        );
      }
    } catch (error) {
      setMessage("Server connection failed");
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h2>Create Account</h2>

        <p>
          Register to start your journey with Hireuno
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="form-button"
          >
            Register
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

export default Register;