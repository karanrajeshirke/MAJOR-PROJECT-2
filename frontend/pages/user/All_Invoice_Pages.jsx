import UserMenu from "../../src/components/layout/UserMenu";
import Layout from "../../src/components/layout/Layout";
import { Avatar } from "antd"; // Remove List, Radio, Space imports
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../../src/context/Auth";
import { Link } from "react-router-dom";

const InvoicePage = () => {
  const [auth, setAuth] = useAuth();
  const [orderdata, setorderData] = useState([]);

  const getOrder = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/product/bill",
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      setorderData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  return (
    <>
      <Layout>
        <div className="row">
          <div className="col-3">
            <UserMenu />
          </div>
          <div className="col-9">
            <table className="table">
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>View Order</th>
                </tr>
              </thead>
              <tbody>
                {orderdata.map((order, index) => {
                  return (
                    <tr key={index}>
                      <td className="fa-2x">{index + 1}</td>
                      <td>
                        <Link
                          to={`/dashboard/user/invoice-page/${index}`}
                          state={{ data: order }}
                        >
                          <i className="fa-solid fa-file-invoice fa-2x"></i>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default InvoicePage;
