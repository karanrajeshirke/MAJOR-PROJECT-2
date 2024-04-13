import UserMenu from "../../src/components/layout/UserMenu";
import Layout from "../../src/components/layout/Layout";
import { useAuth } from "../../src/context/Auth";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import "../../src/reviewCard.css";
import { Rate } from "antd";
const Profile = () => {
  const [auth] = useAuth();
  const [totalOrders, setTotalOrders] = useState("");
  const [totalReviews, setTotalReviews] = useState("");
  const [allReviews, setAllReviews] = useState("");

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

      if (response.data?.productArr?.length) {
        setTotalOrders(response.data?.productArr?.length);
      } else setTotalOrders(0);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllOrders();
    getReviewAuthor();
  }, []);

  const getReviewAuthor = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/review/review/${auth.user.id}`,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      console.log(response.data.allUserReviews);
      setAllReviews(response.data.allUserReviews);
      if (response?.data?.allUserReviews?.length) {
        setTotalReviews(response.data.allUserReviews.length);
      } else setTotalReviews(0);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container-fluid">
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
                    <div className="col-sm-9 text-secondary">{totalOrders}</div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">Total Review Given :</h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      {totalReviews}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4>Your Reviews Given</h4>
                <div className=" row d-flex flex-column flex-wrap ">
                  {allReviews &&
                    allReviews.map((item, index) => {
                      return (
                        <div
                          className="review-container m-2 col-9  "
                          key={index}
                        >
                          <div className="row">
                            <div className="col-3 ">
                              <img
                                src={`http://localhost:8080/api/v1/product/get-product-photo/${item.productId}`}
                                className="img-fluid rounded-4"
                                style={{
                                  width: "150px",
                                  height: "150px",
                                }}
                              />
                            </div>
                            <div className="col">
                              <div className="user-info">
                                <div className="user-avatar">
                                  {auth.user.name[0].toUpperCase()}
                                </div>
                                <span className="user-name ">
                                  {auth.user.name}
                                </span>
                                <span className="review-rating">
                                  <Rate disabled value={item.review.rating} />
                                </span>
                              </div>
                              <p>{item.review.comment}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
