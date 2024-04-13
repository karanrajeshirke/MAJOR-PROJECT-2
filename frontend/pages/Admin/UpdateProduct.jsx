import React, { useState, useEffect } from "react";
import { Select } from "antd";
import axios from "axios";
import Layout from "../../src/components/layout/Layout";
import AdminMenu from "../../src/components/layout/AdminMenu";
import { useAuth } from "../../src/context/Auth";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
const UpdateProduct = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [auth] = useAuth();
  const [allCategories, setAllCategories] = useState([]);
  const [productData, setProductData] = useState({
    id: "",
    name: "",
    category: { id: "", name: "" },
    description: "",
    price: "",
    inStock: "",
    shipping: "",
    photo: "",
  });

  const getAllCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/category/get-allcategory"
      );
      setAllCategories(response.data.allCategory);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getProductData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/product/get-single-product/${slug}`
      );
      const product = response.data.product;
      setProductData({
        id: product._id,
        name: product.name,
        category: { id: product.category._id, name: product.category.name },
        description: product.description,
        price: product.price,
        inStock: product.inStock,
        shipping: product.shipping,
      });
    } catch (error) {
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    getAllCategories();
    getProductData();
  }, []);

  const handleUpdateForm = async (event) => {
    event.preventDefault();

    if (productData.price <= 0) {
      return toast.error("Price should be greater than 0");
    }
    if (productData.inStock <= 0) {
      return toast.error("Stock should be greater than 0");
    }
    try {
      const formData = new FormData();
      for (const key in productData) {
        if (key === "category") {
          formData.append(key, productData.category.id);
        } else {
          formData.append(key, productData[key]);
        }
      }

      const response = await axios.put(
        `http://localhost:8080/api/v1/product/update-product/${productData.id}`,
        formData,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      alert("Updated");
      navigate(`/dashboard/admin/products/${auth.user.id}`);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    setProductData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  return (
    <Layout>
      <div className="row mt-3">
        <div className="col-3">
          <AdminMenu />
        </div>
        <div className="col-9 ">
          <div className="row">
            <div className="col-4 ">
              <div>
                {productData.photo ? (
                  <img
                    src={URL.createObjectURL(productData.photo)}
                    alt=""
                    style={{
                      marginTop: "35px",
                      width: "300px",

                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                ) : (
                  <img
                    src={
                      productData &&
                      productData.id &&
                      `http://localhost:8080/api/v1/product/get-product-photo/${productData.id}`
                    }
                    style={{
                      marginTop: "35px",
                      width: "300px",
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    }}
                    alt=""
                  />
                )}

                <div className="form-group mt-4">
                  <label className="btn btn-secondary col-lg-6 col-sm-4">
                    Update Photo
                    <input
                      type="file"
                      accept="image/*"
                      name="photo"
                      hidden
                      onChange={handleChange}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="col-8">
              <form
                className="form"
                onSubmit={handleUpdateForm}
                style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
              >
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <br />
                  <Select
                    name="category"
                    showSearch
                    placeholder="Select a category"
                    optionFilterProp="children"
                    className="w-100"
                    value={productData.category.name}
                    onChange={(value) =>
                      setProductData((prev) => ({
                        ...prev,
                        category: {
                          ...prev.category,
                          name: value,
                          id: allCategories.find((cat) => cat.name === value)
                            ._id,
                        },
                      }))
                    }
                  >
                    {allCategories &&
                      allCategories.map((cat) => (
                        <Select.Option key={cat._id} value={cat.name}>
                          {cat.name}
                        </Select.Option>
                      ))}
                  </Select>
                </div>

                <div className="form-group ">
                  <label htmlFor="name">Name</label>
                  <input
                    name="name"
                    type="text"
                    className="form-control w-100 "
                    placeholder="Product name"
                    value={productData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <input
                    name="description"
                    type="text"
                    className="form-control w-100"
                    placeholder="Product description"
                    value={productData.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="price">Price</label>
                  <input
                    name="price"
                    type="number"
                    className="form-control w-100"
                    placeholder="Product price"
                    value={productData.price}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="inStock">In Stock</label>
                  <input
                    name="inStock"
                    type="number"
                    className="form-control w-100"
                    placeholder="Product inStock"
                    value={productData.inStock}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="shipping">Shipping</label>
                  <br />

                  <Select
                    showSearch
                    placeholder="Select shipping"
                    optionFilterProp="children"
                    className="w-100"
                    name="shipping"
                    value={productData.shipping ? "YES" : "NO"}
                    onChange={(value) =>
                      setProductData((prev) => ({
                        ...prev,
                        shipping: value,
                      }))
                    }
                    required
                  >
                    <Select.Option value="1">YES</Select.Option>
                    <Select.Option value="0">NO</Select.Option>
                  </Select>
                </div>

                <button className="btn btn-outline-dark mt-3" type="submit">
                  Submit
                </button>
                <br />
                <br />
                <br />
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
