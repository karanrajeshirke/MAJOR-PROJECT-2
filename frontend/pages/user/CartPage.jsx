import { useEffect, useState } from "react";
import Layout from "../../src/components/layout/Layout";
import { useAuth } from "../../src/context/Auth";
import { useCart } from "../../src/context/Cart";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const [cartGlobal, setCartGlobal] = useCart();
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getItemsFromCart();
  }, []);

  const placeOrder = async () => {
    try {
    
      const orderData = cart.map((item) => ({
        productId: item._id,
        quantity: item.quantity,
      }));

      setCartGlobal((prev) => {
        const updatedCart = {
          ...prev,
          frontendCart: cart,
          backendCart: orderData,
        };
        localStorage.setItem("Globalcart", JSON.stringify(updatedCart));
        return updatedCart;
      });

      navigate("/dashboard/user/checkout");
      // const response = await axios.post(
      //   "http://localhost:8080/api/v1/product/place-order",
      //   { orderData },
      //   {
      //     headers: {
      //       Authorization: auth.token,
      //     },
      //   }
      // );
      // alert(response.data.message);
      // window.location.reload();
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const calculateTotal = (cart) => {
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.quantity;
    });
    const formattedTotal = total.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
    setTotal(formattedTotal);
  };

  const getItemsFromCart = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/product/cart",
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      const initialCart = response.data.products.map((item) => {
        const { photo, ...rest } = item.seller;
        return {
          ...item,
          seller: rest,
          quantity: 1,
        };
      });
      setCart(initialCart);
      calculateTotal(initialCart);
    } catch (error) {
      console.log(error);
    }
  };

  const handleIncrement = (itemId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item._id === itemId && item.quantity < item.inStock) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      calculateTotal(updatedCart);
      return updatedCart;
    });
  };

  const handleDecrement = (itemId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (item._id === itemId && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
      calculateTotal(updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/v1/product/deleteCart/${id}`,
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      alert(response.data.message);

      getItemsFromCart();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <section className="pt-5 pb-5">
        <div className="checkout-container">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-12 ">
              <p className="mb-5 text-center">
                <i className="text-info font-weight-bold ">{cart.length}</i>{" "}
                items in your cart
              </p>
              <table
                id="shoppingCart"
                className="table table-condensed table-responsive"
              >
                <thead>
                  <tr>
                    <th style={{ width: "50%" }}>Product</th>
                    <th style={{ width: "15%" }}>Price</th>
                    <th style={{ width: "15%" }}>Total</th>
                    <th style={{ width: "30%" }}>Quantity</th>
                    <th style={{ width: "15%" }} />
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item._id}>
                      <td data-th="Product">
                        <div className="row">
                          <div className="col-md-3 text-left">
                            <img
                              src={`http://localhost:8080/api/v1/product/get-product-photo/${item._id}`}
                              alt="Product Image"
                              className="img-fluid d-none d-md-block rounded mb-2 shadow"
                            />
                          </div>
                          <div className="col-md-9 text-left mt-sm-2">
                            <h4>{item.name}</h4>
                            <p className="font-weight-light">
                              Brand &amp; Name
                            </p>
                          </div>
                        </div>
                      </td>
                      <td data-th="Price">
                        {item.price.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td data-th="Total">
                        {(item.price * item.quantity).toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                          maximumFractionDigits: 0,
                        })}
                      </td>
                      <td data-th="&nbsp  &nbsp Quantity" className="">
                        <div className="quantity-controls  ">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            style={{ marginRight: "15px" }}
                            onClick={() => handleDecrement(item._id)}
                          >
                            -
                          </button>
                          <span className="quantity-value text-center  w-100">
                            {item.quantity}
                          </span>
                          <button
                            className="btn btn-sm btn-outline-secondary ml-3"
                            onClick={() => handleIncrement(item._id)}
                            disabled={item.quantity >= item.inStock}
                          >
                            +
                          </button>
                        </div>
                        {item.quantity >= item.inStock && (
                          <div className="text-danger">
                            Maximum stock reached
                          </div>
                        )}
                      </td>
                      <td className="actions" data-th>
                        <button
                          className="btn btn-danger"
                          onClick={() => removeFromCart(item._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="float-right text-right">
                <h4>Subtotal:</h4>
                <h1>{total}</h1>
              </div>
            </div>
          </div>
          <div className="row mt-4 d-flex align-items-center">
            <div className="col-sm-6 order-md-2 text-right">
              {cart.length != 0 && (
                <button
                  onClick={placeOrder}
                  className="btn btn-primary mb-4 btn-lg pl-5 pr-5"
                >
                  Checkout
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Cart;
