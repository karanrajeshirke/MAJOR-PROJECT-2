import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/Auth";
import toast from "react-hot-toast";
import axios from "axios";
import { useSearch } from "../../context/Search";
import { useNavigate } from "react-router-dom";
import { Avatar, Badge, Space } from "antd";
const Header = () => {
  const [auth, setAuth] = useAuth();
  const [search, setSearch] = useSearch();
  const [cartSize, setCartSize] = useState();
  const navigate = useNavigate();

  function handleLogout() {
    setAuth((prevAuth) => {
      return {
        ...prevAuth,
        user: "",
        token: "",
      };
    });
    localStorage.removeItem("auth");
    alert("Logged Out");
  }

  async function handleSearchSubmit(event) {
    event.preventDefault();
    try {
      let response = await axios.get(
        `http://localhost:8080/api/v1/product/search-product/${search.query}`
      );
      setSearch({ ...search, result: response.data.searched_data });
      navigate("/search");
    } catch (error) {
      console.log(error.response.data);
    }
  }

  // const getcartSize = async () => {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:8080/api/v1/product/cartSize",
  //       {
  //         headers: {
  //           Authorization: auth.token,
  //         },
  //       }
  //     );
  //     setCartSize(response.data.length);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   const getcartSize = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:8080/api/v1/product/cartSize",
  //         {
  //           headers: {
  //             Authorization: auth.token,
  //           },
  //         }
  //       );
  //       setCartSize(response.data.length);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   getcartSize();
  // }, []);

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-light bg-light sticky-top p-3"
        style={{ boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)" }}
      >
        <a className="navbar-brand font-weight-bold text-dark" href="#"></a>

        <form
          className="form-inline my-2 my-lg-0"
          onSubmit={handleSearchSubmit}
        >
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={search.query}
            onChange={(event) =>
              setSearch({ ...search, query: event.target.value })
            }
            required
          />
          <button
            className="btn btn-outline-success my-2 my-sm-0"
            type="submit"
          >
            Search
          </button>
        </form>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link font-weight-bold text-dark" to="/">
                HOME
              </Link>
            </li>
            {!auth.user && (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link font-weight-bold text-dark"
                    to="/register"
                  >
                    REGISTER
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link font-weight-bold text-dark"
                    to="/login"
                  >
                    LOGIN
                  </Link>
                </li>
              </>
            )}

            {auth.user && (
              <>
                <li className="nav-item dropdown">
                  <NavLink
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <span className="font-weight-bold text-dark">
                      {" "}
                      {auth.user && auth.user.name.toUpperCase()}
                    </span>
                  </NavLink>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <NavLink
                      className="dropdown-item font-weight-bold text-dark"
                      to={`/dashboard/${
                        auth.user
                          ? auth.user.role == 1
                            ? "admin"
                            : "user"
                          : ""
                      }`}
                    >
                      DASHBOARD
                    </NavLink>
                    {auth.user && (
                      <NavLink
                        className="dropdown-item font-weight-bold text-dark"
                        to="/login"
                        onClick={handleLogout}
                      >
                        LOGOUT
                      </NavLink>
                    )}
                  </div>
                </li>
              </>
            )}

            <li className="nav-item">
              <Link
                className="nav-link font-weight-bold text-dark"
                to="/dashboard/user/cart"
              >
                {/* <Badge
                  size="large"
                  count={cartSize ? cartSize : 0}
                  offset={[10, 5]}
                >
                  <h5>CART</h5>
                </Badge> */}
                   <h5>CART</h5>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Header;
