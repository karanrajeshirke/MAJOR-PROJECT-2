import Layout from "../../src/components/layout/Layout";
import AdminMenu from "../../src/components/layout/AdminMenu";
import { useAuth } from "../../src/context/Auth";
import { useEffect, useState } from "react";
import { Select } from "antd";
import axios from "axios";
const OrdersAdmin = () => {
  const [auth, setAuth] = useAuth();
  const [adminOrders, setAdminOrders] = useState([]);
  useEffect(() => {
    getAllOrders();
  }, []);

  const getAllOrders = async (req, res) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/product/admin-orders",
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      setAdminOrders(response.data.productsArr);
    } catch (error) {
      console.log("Something  went wrong");
      console.log(error);
    }
  };

  const changeStatusOrder = async (pid, bid, stat, id) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/product/update-order-status/${pid}/${bid}/${stat}/${id}`,
        {},
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const getOrdersParticularStatus = async (status) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/product/${status}`,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      console.log(response.data.filteredData);
      setAdminOrders(response.data.filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  const formattedTotal = (total) => {
    const amount = total.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
    return amount;
  };

  return (
    <Layout>
      <div className="row mt-3">
        <div className="col-2">
          <AdminMenu />
        </div>
        <div className="col-10">
          <h1>Orders</h1>

          <div>
            <table className="table">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Product Id</th>
                  <th scope="col">Product Name</th>
                  <th scope="col">Product Price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Total</th>
                  <th scope="col">Customer Name</th>
                  <th scope="col">Date Ordered</th>
                  <th scope="col">
                    <Select
                      onChange={(val) => getOrdersParticularStatus(val)}
                      showSearch
                      placeholder="Select Status"
                      optionFilterProp="children"
                      className="w-100"
                      // onChange={onChange}
                      // onSearch={onSearch}
                      // filterOption={filterOption}
                      options={[
                        {
                          value: "Not Process",
                          label: "Not Process",
                        },
                        {
                          value: "Processing",
                          label: "Processing",
                        },
                        {
                          value: "Shipped",
                          label: "Shipped",
                        },
                        {
                          value: "Delivered",
                          label: "Delivered",
                        },
                        {
                          value: "Cancelled",
                          label: "Cancelled",
                        },
                      ]}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {adminOrders &&
                  adminOrders.map((item, index) => {
                    let statusIndicator;

                    switch (item.status) {
                      case "Delivered":
                        statusIndicator = (
                          <td className="text-success fw-bolder text-center fs-5">
                            DELIVERED
                          </td>
                        );
                        break;
                      case "Cancelled":
                        statusIndicator = (
                          <td className="text-danger fw-bolder text-center fs-5">
                            CANCELLED
                          </td>
                        );
                        break;
                      case "Shipped":
                        statusIndicator = (
                          <td className="text-primary fw-bolder text-center fs-5">
                            SHIPPED
                          </td>
                        );
                        break;
                      case "Processing":
                        statusIndicator = (
                          <td className="text-warning fw-bolder text-center fs-5">
                            PROCESSING
                          </td>
                        );
                        break;
                      default:
                        statusIndicator = (
                          <td className="" style={{ width: "250px" }}>
                            <Select
                              showSearch
                              optionFilterProp="children"
                              className="w-100"
                              onChange={(val) =>
                                changeStatusOrder(
                                  item.product._id,
                                  item.buyer._id,
                                  val,
                                  item._id
                                )
                              }
                            >
                              <Select.Option value="Processing">
                                Processing
                              </Select.Option>
                              <Select.Option value="Shipped">
                                Shipped
                              </Select.Option>
                              <Select.Option value="Delivered">
                                Delivered
                              </Select.Option>
                              <Select.Option value="Cancelled">
                                Cancelled
                              </Select.Option>
                            </Select>
                          </td>
                        );
                    }
                    return (
                      <tr key={item._id}>
                        <th scope="row">{index + 1}</th>
                        <td>{item.product._id}</td>
                        <td>{item.product.name}</td>
                        <td>{formattedTotal(item.product.price)}</td>
                        <td>{item.quantity}</td>
                        <td>
                          {formattedTotal(item.product.price * item.quantity)}
                        </td>

                        <td>{item.buyer.name}</td>
                        <td>{formatDate(item.orderReceivedDate)}</td>
                        {statusIndicator}
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrdersAdmin;
