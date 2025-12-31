import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.email === "admin@eco.com" && formData.password === "123") {
      navigate("/admin/dashboard");
    } else {
      setError("Invalid admin credentials");
    }
  };

  return (
    <div className="ad-login-container">
      <div className="ad-login-card">
        <h2 className="ad-login-heading">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          {/* Email field with bottom margin to separate from password */}
          <div className="ad-login-mb-15">
            <label className="ad-login-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className={`ad-login-input ${!!error && !formData.email ? 'has-error' : ''}`}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password field */}
          <div>
            <label className="ad-login-label" htmlFor="password">
              Password
            </label>
            <div className="ad-login-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className={`ad-login-input ${!!error && !formData.password ? 'has-error' : ''}`}
                placeholder="Enter your password"
                required
              />
              <span
                className="ad-login-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          {/* Error message */}
          {error && <p className="ad-login-error">{error}</p>}

          {/* Submit button */}
          <button type="submit" className="ad-login-button">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
