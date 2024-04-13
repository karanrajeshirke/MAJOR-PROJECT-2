import axios from "axios";
import Layout from "../src/components/layout/Layout";
import { useAuth } from "../src/context/Auth";
import { useEffect, useState } from "react";
import { Checkbox } from "antd";
import { Input, Radio, Space, Rate } from "antd";
import { Price } from "../src/components/Price";
import { Rating } from "../src/components/routes/RatingProducts";
import { Link, useNavigate } from "react-router-dom";

import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBIcon,
} from "mdb-react-ui-kit";

const HomePage = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [catFilter, setCatFilter] = useState([]);
  const [radioFilter, setRadioFilter] = useState([]);
  const [ratingFilter, setRatingFilter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [auth, setAuth] = useAuth();

  const getAllProducts = async () => {
    try {
      let response = await axios.get(
        "http://localhost:8080/api/v1/product/get-products"
      );
      setAllProducts(response.data.allproducts);
      setLoading(false);
    } catch (error) {
      console.log("error fetching in all products", error);
    }
  };

  // const caculateRating

  const getAllCategories = async () => {
    try {
      let response = await axios.get(
        "http://localhost:8080/api/v1/category/get-allcategory"
      );

      setAllCategories(response.data.allCategory);
    } catch (error) {
      console.log("error fetching in all categoires", error);
    }
  };

  useEffect(() => {
    getAllProducts();
    getAllCategories();
  }, []);

  // useEffect(() => {
  //   if (!catFilter.length || !radioFilter.length) getAllProducts();
  // }, [catFilter.length, radioFilter.length]);

  useEffect(() => {
    if (catFilter.length || radioFilter.length || ratingFilter.length) {
      filterProduct();
    }
  }, [catFilter, radioFilter, ratingFilter]);

  const filterProduct = async () => {
    try {
      let response = await axios.post(
        "http://localhost:8080/api/v1/product/product-filters",
        { catFilter, radioFilter, ratingFilter }
      );
      // console.log(response.data.filteredData);

      setAllProducts(response.data.filteredData);
    } catch (error) {
      console.log("error occurred while fetching the filterd data", error);
    }
  };

  return (
    <Layout>
      <div className="row">
        <div className="col-2 m-3 d-flex flex-column column-container ">
          <h3 style={{ textDecoration: "underline" }}>Category</h3>
          <Checkbox.Group onChange={(val) => setCatFilter(val)}>
            <Space direction="vertical">
              {allCategories.map((cat) => {
                return (
                  <Checkbox value={cat._id} key={cat._id}>
                    <span style={{ fontWeight: "bold", fontSize: "1rem" }}>
                      {cat.name}
                    </span>
                  </Checkbox>
                );
              })}
            </Space>
          </Checkbox.Group>

          <hr />
          <h3 style={{ textDecoration: "underline" }}>Price</h3>

          <Radio.Group onChange={(e) => setRadioFilter(e.target.value)}>
            <Space direction="vertical">
              {Price.map((pr) => {
                return (
                  <div key={pr._id}>
                    <Radio value={pr.array}>
                      <span style={{ fontWeight: "bold", fontSize: "1rem" }}>
                        {pr.name}
                      </span>
                    </Radio>
                    ;
                  </div>
                );
              })}
            </Space>
          </Radio.Group>

          <hr></hr>

          <h3 style={{ textDecoration: "underline" }}>Rating</h3>
          <br />
          <Radio.Group>
            <Space
              direction="vertical"
              onChange={(event) => {
                setRatingFilter(event.target.value);
                console.log(event.target.value);
              }}
            >
              <Radio value={1}>
                <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                  1
                </span>
                <MDBIcon fas icon="star" className="text-warning fa-2x " /> &
                <span style={{ fontSize: "1rem" }}>Above</span>
              </Radio>
              ;
              <Radio value={2}>
                <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                  2
                </span>
                <MDBIcon fas icon="star" className="text-warning fa-2x" />&
                <span style={{ fontSize: "1rem" }}>Above</span>
              </Radio>
              ;
              <Radio value={3}>
                <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                  3
                </span>
                <MDBIcon fas icon="star" className="text-warning fa-2x" />&
                <span style={{ fontSize: "1rem" }}>Above</span>
              </Radio>
              ;
              <Radio value={4}>
                <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                  4
                </span>
                <MDBIcon fas icon="star" className="text-warning fa-2x" />&
                <span style={{ fontSize: "1rem" }}>Above</span>
              </Radio>
              ;
              <Radio value={5}>
                <span style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                  5
                </span>
                <MDBIcon fas icon="star" className="text-warning fa-2x" />&
                <span style={{ fontSize: "1rem" }}>Above</span>
              </Radio>
              ;
            </Space>
          </Radio.Group>

          <button
            className="btn btn-dark mt-3 btn-small "
            onClick={() => window.location.reload()}
          >
            Reset Filters
          </button>
        </div>
        {loading ? (
          <div
            className="col-9 d-flex align-items-center justify-content-center"
            style={{ height: "100vh" }}
          >
            <div
              className="spinner-border text-primary"
              role="status"
              style={{ width: "3rem", height: " 3rem" }}
            ></div>
            <br />
            <div>
              <span style={{ fontSize: "30px" }}>Loading ...</span>
            </div>
          </div>
        ) : allProducts.length === 0 ? (
          <div
            className="col-9 d-flex align-items-center justify-content-center"
            style={{ height: "100vh" }}
          >
            <h2>No products found</h2>
          </div>
        ) : (
          <div className="col-9 next-column mr-4 p-3 d-flex flex-wrap  bg-light justify-content-around">
            {allProducts &&
              allProducts.map((item) => {
                return (
                  <MDBCol
                    md="12"
                    lg="4"
                    className="mb-4 mb-lg-0 m-4 "
                    key={item._id}
                    style={{ maxWidth: "300px", maxHeight: "400px" }}
                  >
                    <MDBCard className="h-100">
                      <MDBCardImage
                        src={`http://localhost:8080/api/v1/product/get-product-photo/${item._id}`}
                        position="top"
                        className="img-fluid" // Make the image responsive
                        style={{ maxHeight: "200px" }} // Set maximum height for the image
                      />
                      <MDBCardBody>
                        <div className="d-flex justify-content-between">
                          <p className="small">
                            <span> {item.category.name}</span>
                          </p>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                          <h5 className="mb-0">{item.name}</h5>
                          <h5 className="text-dark mb-0">
                            {item.price.toLocaleString("en-IN", {
                              style: "currency",
                              currency: "INR",
                              maximumFractionDigits: 0,
                            })}
                          </h5>
                        </div>

                        <div className="d-flex justify-content-between mb-2">
                          <p className="text-muted mb-0">
                            {item.inStock === 0 ? (
                              <span
                                style={{
                                  color: "red",
                                  textDecoration: "line-through",
                                }}
                              >
                                Unavailable
                              </span>
                            ) : (
                              <span className="fw-bold">
                                Available: {item.inStock}
                              </span>
                            )}
                          </p>
                          <div className="ms-auto text-warning">
                            <Rate
                              disabled
                              allowHalf
                              defaultValue={item.averageRating}
                            />
                          </div>
                        </div>
                        <Link
                          to={`/product/${item.slug}`}
                          style={{
                            textDecoration: "none",
                            color: "#007bff",
                            fontWeight: "bold",
                            borderBottom: "1px solid #007bff",
                            transition: "color 0.3s",
                          }}
                        >
                          View
                        </Link>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                );
              })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;
