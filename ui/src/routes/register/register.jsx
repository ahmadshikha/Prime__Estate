import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
function Register() {
  const url = "http://localhost:8800/api";

  const [isloading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setEror] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEror("");

    const formdata = new FormData(e.target);

    const username = formdata.get("username");
    const password = formdata.get("password");
    const email = formdata.get("email");
    console.log(username, password);
    try {
      const res = await axios.post(`${url}/auth/register`, {
        username,
        password,
        email,
      });
      console.log(res.data);
      navigate("/login");
    } catch (err) {
      setEror(err.response.data.message);
    } finally {
      setLoading(false);
    }
  }
    return (
      <div className="register">
        <div className="formContainer">
          <form onSubmit={handleSubmit}>
            <h1>Create an Account</h1>
            <input name="username" type="text" placeholder="Username" />
            <input name="email" type="text" placeholder="Email" />
            <input name="password" type="password" placeholder="Password" />
            <button>Register</button>
                   {error&&<span >{error} </span>}

            <Link to="/login">Do you have an account?</Link>
          </form>
        </div>
        <div className="imgContainer">
          <img src="/bg.png" alt="" />
        </div>
      </div>
    );
  };

export default Register;
