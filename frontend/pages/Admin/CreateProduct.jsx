import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select } from "antd";
import AdminMenu from "../../src/components/layout/AdminMenu";
import Layout from "../../src/components/layout/Layout";
import { useAuth } from "../../src/context/Auth";
import { useNavigate } from "react-router-dom";
import { Image } from "antd";
const CreateProduct = () => {
  const navigate = useNavigate();
  const [allCategories, setAllCategories] = useState([]);
  const [auth] = useAuth();
  const [productData, setProductData] = useState({
    category: "",
    name: "",
    description: "",
    price: "",
    inStock: "",
    shipping: "",
    photo: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/category/get-allcategory"
        );
        setAllCategories(response.data.allCategory);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchData();
  }, []);

  const handleInput = (event) => {
    const { name, value, files } = event.target;

    setProductData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleForm = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      for (const key in productData) {
        formData.append(key, productData[key]);
      }

      const response = await axios.post(
        "http://localhost:8080/api/v1/product/create-product",
        formData,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      console.log(response.data);
      navigate(`/dashboard/admin/products/${auth.user.id}`);
    } catch (error) {
      if (error.response.data.message) {
        alert(error.response.data.message);
      }
      console.error("Error creating product:", error);
    }
  };

  return (
    <Layout>
      <div className="row p-3">
        <div className="col-3">
          <AdminMenu />
        </div>
        <div
          className="col-8 ml-2 "
          style={{
            boxShadow:
              "0 7px 15px 0 rgba(0, 0, 0, .13), 0 1px 4px 0 rgba(0, 0, 0, .11)",
            borderRadius: "10px",
          }}
        >
          <div className="row justify-content-center">
            <div className="col-12 ">
              <div className="row">
                <div className="col-md-8 mt-5 p-5">
                  <form onSubmit={handleForm} className="text-center mt-3">
                    <div className="form-group row">
                      <label
                        htmlFor="category"
                        className="col-sm-4 col-form-label"
                      >
                        Category
                      </label>
                      <div className="col-sm-8">
                        <Select
                          id="category"
                          name="category"
                          showSearch
                          placeholder="Select a category"
                          optionFilterProp="children"
                          value={productData.category}
                          onChange={(value) => {
                            setProductData((prev) => ({
                              ...prev,
                              category: value,
                            }));
                          }}
                          className="w-100"
                        >
                          {allCategories.map((cat) => (
                            <Select.Option key={cat._id} value={cat._id}>
                              {cat.name}
                            </Select.Option>
                          ))}
                        </Select>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label htmlFor="name" className="col-sm-4 col-form-label">
                        Product Name
                      </label>
                      <div className="col-sm-8">
                        <input
                          id="name"
                          name="name"
                          type="text"
                          className="form-control"
                          placeholder="Product name"
                          onChange={handleInput}
                          value={productData.name}
                        />
                      </div>
                    </div>
                    {!productData.photo && (
                      <div className="form-group row">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-8  text-left">
                          <label className="btn btn-secondary w-50">
                            Upload Image
                            <input
                              type="file"
                              accept="image/*"
                              name="photo"
                              hidden
                              onChange={handleInput}
                            />
                          </label>
                        </div>
                      </div>
                    )}
                    <div className="form-group row">
                      <label
                        htmlFor="description"
                        className="col-sm-4 col-form-label"
                      >
                        Description
                      </label>
                      <div className="col-sm-8">
                        <textarea
                          id="description"
                          name="description"
                          className="form-control"
                          placeholder="Product description"
                          onChange={handleInput}
                          value={productData.description}
                          rows={6}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label
                        htmlFor="price"
                        className="col-sm-4 col-form-label"
                      >
                        Price
                      </label>
                      <div className="col-sm-8">
                        <input
                          id="price"
                          name="price"
                          type="number"
                          className="form-control"
                          placeholder="Product price"
                          onChange={handleInput}
                          value={productData.price}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label
                        htmlFor="quantity"
                        className="col-sm-4 col-form-label"
                      >
                        inStock
                      </label>
                      <div className="col-sm-8">
                        <input
                          id="inStock"
                          name="inStock"
                          type="number"
                          className="form-control"
                          placeholder="Product inStock"
                          onChange={handleInput}
                          value={productData.inStock}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label
                        htmlFor="shipping"
                        className="col-sm-4 col-form-label"
                      >
                        Shipping
                      </label>
                      <div className="col-sm-8 ">
                        <Select
                          id="shipping"
                          showSearch
                          placeholder="Select shipping"
                          optionFilterProp="children"
                          className="w-100"
                          name="shipping"
                          value={productData.shipping}
                          onChange={(value) =>
                            setProductData((prevData) => ({
                              ...prevData,
                              shipping: value,
                            }))
                          }
                        >
                          <Select.Option value="1">YES</Select.Option>
                          <Select.Option value="0">NO</Select.Option>
                        </Select>
                      </div>
                    </div>
                    <button className="btn btn-dark w-25 mr-5" type="submit">
                      Submit
                    </button>
                    {/* <div className="bg-danger">
                      <button className="btn btn-dark col-5" type="submit">
                        Submit
                      </button>
                    </div> */}
                  </form>
                </div>
                <div className="col-4 mt-3  d-flex justify-content-center align-items-center  ">
                  {productData.photo && (
                    <div>
                      <Image
                        style={{
                          boxShadow:
                            "0 7px 15px 0 rgba(0, 0, 0, .13), 0 1px 4px 0 rgba(0, 0, 0, .11)",
                          borderRadius: "10px",
                        }}
                        width={300}
                        height={300}
                        src={URL.createObjectURL(productData.photo)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
