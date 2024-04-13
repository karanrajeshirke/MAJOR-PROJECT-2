import { useState } from "react";
import Layout from "../../src/components/layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import { Input } from "antd";
const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "",
    photo: "",
  });

  function checkPassword(password) {
    let len = password.length;

    if (len < 8) {
      return false;
    }

    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSpecial = false;

    const specialChars = "!@#$%^&*()-_=+{};:,<.>?";
    for (let i = 0; i < len; i++) {
      if (password[i] >= "a" && password[i] <= "z") {
        hasLower = true;
      } else if (password[i] >= "A" && password[i] <= "Z") {
        hasUpper = true;
      } else if (password[i] >= "0" && password[i] <= "9") {
        hasNumber = true;
      } else if (specialChars.includes(password[i])) {
        hasSpecial = true;
      }
    }

    return hasLower && hasUpper && hasNumber && hasSpecial;
  }

  function handleInput(event) {
    setUser((prevUser) => {
      return {
        ...prevUser,
        [event.target.name]: event.target.files
          ? event.target.files[0]
          : event.target.value,
      };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (user.phone.length !== 10) {
      return toast.error("Phone number should be of 10 digits");
    }

    if (user.role !== "1" && user.role !== "0") {
      return toast.error("Role should be either 1 or 0");
    }

    if (!checkPassword(user.password)) {
      return toast.error("Password not meet the following requirements");
    }

    try {
      const formData = new FormData();

      for (const key in user) {
        formData.append(key, user[key]);
      }

      let response = await axios.post(
        "http://localhost:8080/api/v1/auth/register",
        formData
      );
      alert("Registered");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
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
            marginTop: "15px",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "20px",
          }}
        >
          <div className="form-content">
            <header>Register</header>
            <form onSubmit={handleSubmit}>
              <div className="field input-field">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter your Name"
                  name="name"
                  onChange={handleInput}
                  value={user.name}
                  required
                />
              </div>
              <div className="field input-field">
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="input"
                  name="email"
                  onChange={handleInput}
                  value={user.email}
                  required
                />
              </div>
              <div className="field input-field">
                <Tooltip title="Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one special character, and one number.">
                  <Input.Password
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    id="password"
                    onChange={handleInput}
                    value={user.password}
                    required
                    style={{ height: "50px" }}
                    visibilityToggle
                  />
                </Tooltip>
              </div>
              <div className="field input-field">
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  id="photo"
                  name="photo"
                  onChange={handleInput}
                  required
                />
              </div>
              <div className="field input-field">
                <input
                  type="number"
                  className="form-control"
                  name="phone"
                  placeholder="Enter your Phone Number (should be of 10 digits )"
                  id="phone"
                  onChange={handleInput}
                  value={user.phone}
                  required
                />
              </div>
              <div className="field input-field">
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  placeholder="Enter your Address"
                  id="address"
                  onChange={handleInput}
                  value={user.address}
                  required
                />
              </div>
              <div className="field input-field">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter Role (0 -> customer or 1 ->seller)"
                  id="role"
                  name="role"
                  onChange={handleInput}
                  value={user.role}
                  required
                />
              </div>
              <div className="field button-field">
                <button>Register</button>
              </div>
            </form>
            <div className="form-link">
              <span>
                Already have an account ? <Link to="/login">Login</Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
