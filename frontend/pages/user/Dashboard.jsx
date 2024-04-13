import Layout from "../../src/components/layout/Layout";
import { useAuth } from "../../src/context/Auth";
import UserMenu from "../../src/components/layout/UserMenu";
import Profile from "./Profile";
import { useParams } from "react-router-dom";
import "../../src/profile.css";
import { useEffect, useState } from "react";
import axios from "axios";
const Dashboard = () => {
  const [auth] = useAuth();

  const [totalOrders, setTotalOrders] = useState("");
  useEffect(() => {
    const getAllOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/product/all-orders",
          {
            headers: {
              Authorization: auth.token,
            },
          }
        );
  
        if(!response.data)
        {
             setTotalOrders(0);
        }
        else
        setTotalOrders(response.data.productArr.length);
      } catch (error) {
        console.log(error);
      }
    };

    getAllOrders();
  }, []);

  return (
    <>
      <Layout>
        <div className="row">
          <div className="row">
            <div className="col-lg-3">
              <div className="usermenu">
                <UserMenu />
              </div>
            </div>

            <div className="col-lg-9">
              <div className="mainmenu">
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex flex-column align-items-center text-center">
                      <img
                        src={`http://localhost:8080/api/v1/auth/getphoto/${auth.user.id}`}
                        alt="Admin"
                        width={300}
                      />
                      <div className="mt-3">
                        <h4>{auth?.user?.name}</h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Full Name</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        {auth?.user?.name}
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Email</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        {auth?.user?.email}
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Phone</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        {auth?.user?.phone}
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Address</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        {auth?.user?.address}
                      </div>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Total Orders :</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        {totalOrders}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Dashboard;
