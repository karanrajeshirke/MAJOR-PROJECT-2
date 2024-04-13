import Layout from "../../src/components/layout/Layout";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../src/context/Auth";
import "../../src/login.css";
import { Input } from "antd";

const Login = () => {
  const location = useLocation();
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  function handleInput(event) {
    setUser((prevUser) => {
      return {
        ...prevUser,
        [event.target.name]: event.target.value,
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      let response = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        user
      );

      setAuth((prevAuth) => {
        return {
          ...prevAuth,
          user: response.data.user,
          token: response.data.token,
        };
      });

      localStorage.setItem("auth", JSON.stringify(response.data));

      alert("Logged In");

      // navigate('/')
      navigate(location.state || "/");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  }

  return (
    <Layout>
      <div
        className="row d-flex justify-content-center"
        style={{
          backgroundImage:
            "url(https://t3.ftcdn.net/jpg/01/17/33/22/360_F_117332203_ekwDZkViF6M3itApEFRIH4844XjJ7zEb.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh", 
        }}
      >
        <div
          className="form login col-4 text-center"
          style={{
            marginTop: "150px",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "20px",
          }} 
        >
          <div className="form-content">
            <header>Login</header>
            <form onSubmit={handleSubmit}>
              <div className="field input-field">
                <input
                  type="email"
                  placeholder="Email"
                  className="input"
                  name="email"
                  onChange={handleInput}
                  value={user.email}
                  required
                />
              </div>
              <div className="field input-field">
                <Input.Password
                  type="password"
                  placeholder="Password"
                  className="password"
                  name="password"
                  onChange={handleInput}
                  value={user.password}
                  style={{ height: "50px" }}
                    visibilityToggle
                  required
                />
                <i className="bx bx-hide eye-icon" />
              </div>
              <div className="field button-field">
                <button>Login</button>
              </div>
            </form>
            <div className="form-link">
              <span>
                Don't have an account? <Link to="/register">Sign Up</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;

