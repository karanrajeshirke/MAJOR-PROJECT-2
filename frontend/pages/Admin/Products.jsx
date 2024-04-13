import { useEffect, useState } from "react";
import AdminMenu from "../../src/components/layout/AdminMenu";
import Layout from "../../src/components/layout/Layout";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../src/context/Auth";
import { Card } from "antd";
const { Meta } = Card;

const Products = () => {
  const { adminId } = useParams();
  const [productsData, setProductsData] = useState([]);
  const [auth, setAuth] = useAuth();
  const getAllProducts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/product/get-products/${adminId}`,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      setProductsData(response.data.allproducts);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);
  return (
    <Layout>
      <div className="row">
        <div className="col-3 ">
          <AdminMenu></AdminMenu>
        </div>
        <div className="col-9  d-flex flex-wrap justify-content-between">
          {productsData &&
            productsData.map((item) => {
              return (
                <Link
                  to={`/dashboard/admin/product/${item.slug}`}
                  style={{ textDecoration: "none" }}
                  key={item._id}
                >
                  <Card
                    className="m-3"
                    hoverable
                    style={{
                      width: 250,
                    }}
                    cover={
                      item &&
                      item._id && (
                        <img
                          alt="example"
                          src={`http://localhost:8080/api/v1/product/get-product-photo/${item._id}`}
                        />
                      )
                    }
                  >
                    <Meta
                      title={item.name}
                      description={
                        <p
                          style={{
                            fontWeight: "bold",
                            fontSize: "1.5rem",
                            color: "#1ec51e",
                          }}
                        >
                          {item.price.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                            maximumFractionDigits: 0,
                          })}
                          Rs
                        </p>
                      }
                    />
                  </Card>
                </Link>
              );
            })}
        </div>
      </div>
    </Layout>
  );
};

export default Products;
