import { useState, useEffect } from "react";
import { useAuth } from "../../context/Auth";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../Spinner";
function AdminRoute() {
  const [auth, setAuth] = useAuth();
  const [customError, setCustomError] = useState();
  const [ok, setOk] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const authCheck = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/auth/admin-auth",
          {
            headers: {
              Authorization: auth.token,
            },
          }
        );
        if (response.data.ok === true) setOk(true);
      } catch (error) {
        if (error.response) {
          console.log(error);
          // navigate('/')

          setCustomError(401);
          console.log(customError);
          //! we are actually doing an complex way to tackle the problem of a user accessing a admin dashboard
        } else console.log(error);
      }
    };

    if (auth.token) {
      authCheck();
    }
  }, [auth.token]);

  //!any error  then please pass auth.token here

  return ok === true ? (
    <Outlet />
  ) : (
    <Spinner path={`${customError == 401 ? "" : "login"}`} />
  );
}

//! if any error happens then make the path as ""

export { AdminRoute };