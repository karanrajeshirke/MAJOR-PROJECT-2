import { useParams } from "react-router-dom";
import Layout from "../src/components/layout/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useCart } from "../src/context/Cart";
import { useAuth } from "../src/context/Auth";
import { Button, Card } from "antd";
import { Link } from "react-router-dom";
const { Meta } = Card;
import { Rate } from "antd";
import "./../src/reviewCard.css";

import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBIcon,
} from "mdb-react-ui-kit";
const ProductDetails = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [product, setProduct] = useState("");
  const [similarProduct, setSimilarProduct] = useState("");
  const [reviews, setReviews] = useState("");
  const [auth, setAuth] = useAuth();

  const getProductDetails = async () => {
    try {
      let response = await axios.get(
        `http://localhost:8080/api/v1/product/get-single-product/${slug}`
      );
      setReviews(response.data.product.reviews);
      setProduct(response.data.product);
      getSimilarProducts(
        response.data.product._id,
        response.data.product.category._id
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProducts = async (pid, cid) => {
    try {
      let response = await axios.get(
        `http://localhost:8080/api/v1/product/get-similar-products/${pid}/${cid}`
      );
      setSimilarProduct(response.data.simPro);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductDetails();
  }, [navigate]);

  //! we have added here navigate because when someone clicks on navigate we want the page to rendered

  const addToCart = async (pid) => {
    try {
      let response = await axios.get(
        `http://localhost:8080/api/v1/product/add-to-cart/${pid}`,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      // console.log(response.data.message)
      alert(response.data.message);
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      }

      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="row p-3   ">
        <h3>Product Details</h3>
        <div className="col-5   d-flex justify-content-center align-items-center mt-3">
          <Card
            hoverable
            style={{ width: 350, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
            cover={
              product &&
              product._id && (
                <img
                  alt="example"
                  src={`http://localhost:8080/api/v1/product/get-product-photo/${product._id}`}
                />
              )
            }
          ></Card>
        </div>
        <div
          className="col-6   d-flex flex-column justify-content-around ml-5"
          style={{
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h2 className="mb-4">{product.name}</h2>
          <p className="mb-3">
            <strong>Category:</strong>{" "}
            {product.category && product.category.name}
          </p>
          <p className="mb-3">
            <strong>Description:</strong> {product.description}
          </p>
          <p className="mb-3">
            <strong>Price:</strong>{" "}
            {product &&
              product.price &&
              product.price.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              })}
          </p>

          <p>
            <strong>Stock</strong>:
            <span className="mb-3">{product.inStock}</span>
          </p>

          <p>
            <strong>Shipping:</strong> {product.shipping ? "YES" : "NO"}
          </p>

          <p>
            <strong>Seller : </strong> {product.seller && product.seller.name}
          </p>

          <p>
            <strong>Rating : </strong>
            {product.averageRating && product.averageRating}{" "}
            <i
              className="fa fa-star "
              aria-hidden="true"
              style={{ color: "#fadb14" }}
            ></i>
          </p>
          <p>
            <strong>Total Reviews : </strong>
            {product.totalReviews && product.totalReviews}
          </p>
          {product.inStock !== 0 ? (
            auth.token ? (
              <button
                className="btn btn-primary col-3"
                onClick={() => {
                  addToCart(product._id);
                  // setisAddedToCart(true);
                }}
              >
                Add to Cart
              </button>
            ) : (
              <p style={{ color: "red", fontSize: "1.2rem" }}>
                You need to be logged in to add to cart
              </p>
            )
          ) : (
            <Button type="primary" className="col-3" danger>
              OUT OF STOCK
            </Button>
          )}
        </div>

        <hr className="mt-3" />

        <div className="col-12">
          {reviews.length ? (
            <>
              <h3>Reviews</h3>

              <div className="d-flex flex-wrap  justify-content-around">
                {reviews &&
                  reviews.map((item, index) => {
                    return (
                      <div className="review-container m-2 col-3" key={index}>
                        <div className="user-info">
                          <div className="user-avatar">
                            {item.author.name[0].toUpperCase()}
                          </div>
                          <span className="user-name">{item.author.name}</span>
                          <span className="review-rating">
                            <Rate disabled value={item.rating} />
                          </span>
                        </div>
                        <p>{item.comment}</p>
                      </div>
                    );
                  })}
              </div>
            </>
          ) : (
            <h5>No Reviews Yet</h5>
          )}
        </div>
        <hr className="mt-3" />
        <div className="col-12 mt-3 ">
          <h3>Similar Products...</h3>
          <div className=" d-flex justify-content-between flex-wrap ">
            {similarProduct &&
              similarProduct.map((item, index) => (
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
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
