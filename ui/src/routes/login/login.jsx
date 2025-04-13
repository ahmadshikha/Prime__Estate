// Login.js
import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'; 
import { AuthContext } from "../../context/AuthContext";

axios.defaults.withCredentials = true;

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const url = "http://localhost:8800/api";

  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await axios.post(`${url}/auth/Login`, {
        username,
        password,
      }, { withCredentials: true });

      updateUser(res.data);

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token); // Assuming your response has a token field
        
      navigate("/");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again later");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input
            name="username"
            required
            minLength={3}
            maxLength={20}
            type="text"
            placeholder="Username"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
          />
          <button disabled={isLoading}>Login</button>
          {error && <span>{error}</span>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;