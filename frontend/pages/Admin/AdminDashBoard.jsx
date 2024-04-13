import React from "react";
import AdminMenu from "../../src/components/layout/AdminMenu";
import Layout from "../../src/components/layout/Layout";
import { useAuth } from "../../src/context/Auth";

const AdminDashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout>
      <div className="row">
        <div className="row">
          <div className="col-lg-3">
            <div className="adminmenu">
              <AdminMenu />
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
                  <div className="row"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
