import { useEffect, useState } from "react";
import Layout from "../../src/components/layout/Layout";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminMenu from "../../src/components/layout/AdminMenu";
import { useAuth } from "../../src/context/Auth";
import { Card, Button } from "antd"; // Import Card and Button from antd

const SingleProduct = () => {
  const [auth, setAuth] = useAuth();
  const { slug } = useParams();
  const [singleUserData, setSingleUserData] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getSingleUser();
  }, []);

  const getSingleUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/product/get-single-product/${slug}`
      );
      setSingleUserData(response.data.product);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const deleteProduct = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/v1/product/delete-product/${singleUserData._id}`,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      alert("deleted ");
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error.response);
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="row p-2">
        <div className="col-3">
          <AdminMenu />
        </div>
        <div className="col-9">
          <div className="row">
            <div className="col-md-4 d-flex justify-content-center mt-3">
              <Card
                hoverable
                style={{ width: 350, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
                cover={
                  singleUserData &&
                  singleUserData._id && (
                    <img
                      alt="example"
                      src={`http://localhost:8080/api/v1/product/get-product-photo/${singleUserData._id}`}
                    />
                  )
                }
              ></Card>
            </div>
            <div className="col-md-8">
              <div
                className="ml-5"
                style={{
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  padding: "20px",
                  borderRadius: "8px",
                }}
              >
                <h2 className="mb-4">{singleUserData.name}</h2>
                <p className="mb-3">
                  <strong>Category:</strong>{" "}
                  {singleUserData.category && singleUserData.category.name}
                </p>
                <p className="mb-3">
                  <strong>Description:</strong> {singleUserData.description}
                </p>
                <p className="mb-3">
                  <strong>Price:</strong>{" "}
                  {singleUserData &&
                    singleUserData.price &&
                    singleUserData.price.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    })}
                </p>
                <p>
                  <strong>Stock</strong>:
                  <span className="mb-3">{singleUserData.inStock}</span>
                </p>
                <p>
                  <strong>Shipping:</strong>{" "}
                  {singleUserData.shipping ? "YES" : "NO"}
                </p>
                <p>
                  <strong>Seller : </strong>{" "}
                  {singleUserData.seller && singleUserData.seller.name}
                </p>
                <div className="mt-4">
                  <Link to={`/dashboard/admin/product/update/${slug}`}>
                    <Button className="mr-3" type="primary" size="large">
                      Edit
                    </Button>
                  </Link>
                  {/* <Button type="danger" size="large" onClick={deleteProduct}>Delete</Button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SingleProduct;
