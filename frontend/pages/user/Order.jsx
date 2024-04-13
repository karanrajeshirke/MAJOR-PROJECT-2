import UserMenu from "../../src/components/layout/UserMenu";
import Layout from "../../src/components/layout/Layout";
import axios from "axios";
import { useAuth } from "../../src/context/Auth";
import { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { Rate } from "antd";
const Order = () => {
  const [auth, setAuth] = useAuth();
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [productReviewToGive, setProductReviewToGive] = useState("");
  const [comment, setUserComment] = useState("");
  const [isLoading, setisLoading] = useState(true);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
      setOrders(response.data.productArr);
      setisLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

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

  const giveRating = (value) => {
    setRating(value);
  };

  const giveReview = (item) => {
    console.log(item);
    setProductReviewToGive(item);
    showModal();
  };
  const submitReview = async (event) => {
    try {
      if (rating === 0) {
        alert("Please provide a rating before submitting.");
        return;
      }
      event.preventDefault();

      const response = await axios.post(
        "http://localhost:8080/api/v1/review/create-review",
        {
          pid: productReviewToGive.product._id,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      alert("review marked");
      setRating(0);
      setUserComment("");
      window.location.reload();
    } catch (error) {
      if (error?.response?.data?.message) {
        alert(error?.response?.data?.message);
      }

      console.log(error);
      handleCancel();
      setRating(0);
      setUserComment("");
    }

    // console.log(productReviewToGive.product._id);
  };

  const isReviewGiven = (reviewArray) => {
    const isPresent = reviewArray.find((item) => {
      return item.author._id === auth.user.id;
    });

    console.log(isPresent);

    if (isPresent) {
      return true;
    }
    return false;
  };
  return (
    <>
      <Layout>
        <div className="row">
          <div className="col-2 ">
            <UserMenu />
          </div>
          {!isLoading ? (
            <div className="col-10 bg-body-tertiary d-flex flex-column">
              <h1>Order</h1>

              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">SR </th>
                    <th scope="col">Product Photo</th>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Total</th>
                    <th scope="col">Purchased Date</th>
                    <th scope="col">Status</th>
                    <th scope="col"> Review</th>
                  </tr>
                </thead>
                <tbody>
                  {orders &&
                    orders.map((item, index) => {
                      return (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          {item && item.product && item.product._id && (
                            <td className="text-center ">
                                         <div className="image-container-order-page">
      <img  src={`http://localhost:8080/api/v1/product/get-product-photo/${item.product._id}`} alt="" className="product-image-order" />
    </div>

                            </td>
                          )}
                          <td>{item.product.name}</td>
                          <td>{formattedTotal(item.product.price)}</td>
                          <td>{item.quantity}</td>
                          <td>
                            {formattedTotal(item.product.price * item.quantity)}
                          </td>

                          <td>{formatDate(item && item.createdAt)}</td>
                          {/* 2024-02-17T17:19:37.128Z */}
                          <td>{item.status}</td>

                          <td>
                            {isReviewGiven(item.product.reviews) ? (
                              <i
                                className="fa-solid fa-check"
                                style={{
                                  color: "green",
                                  fontSize: "50px",
                                  fontWeight: "bolder",
                                }}
                              ></i>
                            ) : (
                              <button
                                className="btn btn-primary"
                                onClick={() => giveReview(item)}
                              >
                                Give Review
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          ) : (
            <div
              className=" d-flex flex-column  justify-content-center align-items-center "
              style={{ height: "50vh", width: "200vh" }}
            >
              <div
                className="spinner-border text-primary"
                role="status"
                style={{ width: "3rem", height: "3rem" }}
              >
                <span className="sr-only">Loading...</span>
              </div>
              <br />
              <h3>Loading</h3>
            </div>
          )}
        </div>
        <Modal
          title="Your Review "
          footer={null}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <form onSubmit={submitReview}>
            <h6>Rating :</h6>
            <Rate onChange={giveRating} value={rating} />
            <br />
            <h6>Comment :</h6>
            <textarea
              className="form-control"
              id=""
              cols="30"
              rows="10"
              name="comment"
              onChange={(event) => setUserComment(event.target.value)}
              value={comment}
              required
            ></textarea>
            <button className="btn btn-primary mt-3">Submit</button>
          </form>
        </Modal>
      </Layout>
    </>
  );
};

export default Order;
