import { useEffect, useState } from "react";
import Layout from "../../src/components/layout/Layout";
import { useAuth } from "../../src/context/Auth";
import axios from "axios";
import { useCart } from "../../src/context/Cart";
import { Select } from "antd";
import DropIn from "braintree-web-drop-in-react";

const CheckOut = () => {
  const [cartGlobal, setCartGlobal] = useCart();
  const [orderData, setOrderData] = useState();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [total, setTotal] = useState(0);
  const [auth] = useAuth();

  const [orderDropDetails, setOrderDropDetails] = useState({
    country: "",
    houseadd: "",
    city: "",
    state: "",
    postcode: "",
  });

  const handleInput = (event) => {
    setOrderDropDetails((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  };

  useEffect(() => {
    setOrderData(cartGlobal);
    if (cartGlobal) {
      calculateTotal(cartGlobal.frontendCart);
    }
  }, []);

  useEffect(() => {
    const fetchClientToken = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/product/braintree/token"
        );
        setClientToken(response.data.clientToken);
      } catch (error) {
        console.error("Error fetching client token:", error);
      }
    };

    fetchClientToken();
  }, []);

  const handleInstance = (newInstance) => {
    setInstance(newInstance);
  };

  const PlaceOrder = async (event) => {
    try {
      event.preventDefault();

      if (!orderDropDetails.country) {
        return alert("country is required");
      }
      if (!orderDropDetails.houseadd) {
        return alert("houseadd is required");
      }
      if (!orderDropDetails.city) {
        return alert("city is required");
      }
      if (!orderDropDetails.state) {
        return alert("state is required");
      }
      if (!orderDropDetails.postcode) {
        return alert("postcode is required");
      }
      const { nonce } = await instance.requestPaymentMethod();

      const response = await axios.post(
        "http://localhost:8080/api/v1/product/place-order",
        { orderData: orderData.backendCart, orderDropDetails, nonce },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      alert(response.data.message);

      //! we have done this to clear our local Storage
      localStorage.removeItem("Globalcart");
      localStorage.removeItem("__paypal_storage__");

      window.location.reload();
    } catch (error) {
      if (error?.response?.data?.message) {
        alert(error.response.data.message);
      }
    }
  };

  const calculateTotal = (itemsArray) => {
    let totalAmount = 0;
    for (const item of itemsArray) {
      totalAmount += parseInt(item.price) * parseInt(item.quantity);
    }
    setTotal(totalAmount);
  };

  const getINR = (amount) => {
    const price = amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });

    return price;
  };

  return (
    <Layout>
      <div className="checkout-container">
        <div className="checkout-title">
          <h2>Product Order Form</h2>
        </div>
        <div className="checkout-d-flex" style={{ height: "800px" }}>
          <form className="checkout-form">
            <label className="checkout-label">
              <span>
                Country <span className="checkout-required">*</span>
              </span>

              <Select
                name="country"
                showSearch
                className="w-50"
                optionFilterProp="children"
                onChange={(val) =>
                  setOrderDropDetails((prev) => {
                    return {
                      ...prev,
                      country: val,
                    };
                  })
                }
              >
              <Select.Option value="Afghanistan">Afghanistan</Select.Option>
<Select.Option value="Albania">Albania</Select.Option>
<Select.Option value="Algeria">Algeria</Select.Option>
<Select.Option value="Andorra">Andorra</Select.Option>
<Select.Option value="Angola">Angola</Select.Option>
<Select.Option value="Antigua and Barbuda">Antigua and Barbuda</Select.Option>
<Select.Option value="Argentina">Argentina</Select.Option>
<Select.Option value="Armenia">Armenia</Select.Option>
<Select.Option value="Australia">Australia</Select.Option>
<Select.Option value="Austria">Austria</Select.Option>
<Select.Option value="Azerbaijan">Azerbaijan</Select.Option>
<Select.Option value="Bahamas">Bahamas</Select.Option>
<Select.Option value="Bahrain">Bahrain</Select.Option>
<Select.Option value="Bangladesh">Bangladesh</Select.Option>
<Select.Option value="Barbados">Barbados</Select.Option>
<Select.Option value="Belarus">Belarus</Select.Option>
<Select.Option value="Belgium">Belgium</Select.Option>
<Select.Option value="Belize">Belize</Select.Option>
<Select.Option value="Benin">Benin</Select.Option>
<Select.Option value="Bhutan">Bhutan</Select.Option>
<Select.Option value="Bolivia">Bolivia</Select.Option>
<Select.Option value="Bosnia and Herzegovina">Bosnia and Herzegovina</Select.Option>
<Select.Option value="Botswana">Botswana</Select.Option>
<Select.Option value="Brazil">Brazil</Select.Option>
<Select.Option value="Brunei">Brunei</Select.Option>
<Select.Option value="Bulgaria">Bulgaria</Select.Option>
<Select.Option value="Burkina Faso">Burkina Faso</Select.Option>
<Select.Option value="Burundi">Burundi</Select.Option>
<Select.Option value="Cabo Verde">Cabo Verde</Select.Option>
<Select.Option value="Cambodia">Cambodia</Select.Option>
<Select.Option value="Cameroon">Cameroon</Select.Option>
<Select.Option value="Canada">Canada</Select.Option>
<Select.Option value="Central African Republic">Central African Republic</Select.Option>
<Select.Option value="Chad">Chad</Select.Option>
<Select.Option value="Chile">Chile</Select.Option>
<Select.Option value="China">China</Select.Option>
<Select.Option value="Colombia">Colombia</Select.Option>
<Select.Option value="Comoros">Comoros</Select.Option>
<Select.Option value="Congo (Brazzaville)">Congo (Brazzaville)</Select.Option>
<Select.Option value="Congo (Kinshasa)">Congo (Kinshasa)</Select.Option>
<Select.Option value="Costa Rica">Costa Rica</Select.Option>
<Select.Option value="Croatia">Croatia</Select.Option>
<Select.Option value="Cuba">Cuba</Select.Option>
<Select.Option value="Cyprus">Cyprus</Select.Option>
<Select.Option value="Czech Republic">Czech Republic</Select.Option>
<Select.Option value="Denmark">Denmark</Select.Option>
<Select.Option value="Djibouti">Djibouti</Select.Option>
<Select.Option value="Dominica">Dominica</Select.Option>
<Select.Option value="Dominican Republic">Dominican Republic</Select.Option>
<Select.Option value="Ecuador">Ecuador</Select.Option>
<Select.Option value="Egypt">Egypt</Select.Option>
<Select.Option value="El Salvador">El Salvador</Select.Option>
<Select.Option value="Equatorial Guinea">Equatorial Guinea</Select.Option>
<Select.Option value="Eritrea">Eritrea</Select.Option>
<Select.Option value="Estonia">Estonia</Select.Option>
<Select.Option value="Eswatini">Eswatini</Select.Option>
<Select.Option value="Ethiopia">Ethiopia</Select.Option>
<Select.Option value="Fiji">Fiji</Select.Option>
<Select.Option value="Finland">Finland</Select.Option>
<Select.Option value="France">France</Select.Option>
<Select.Option value="Gabon">Gabon</Select.Option>
<Select.Option value="Gambia">Gambia</Select.Option>
<Select.Option value="Georgia">Georgia</Select.Option>
<Select.Option value="Germany">Germany</Select.Option>
<Select.Option value="Ghana">Ghana</Select.Option>
<Select.Option value="Greece">Greece</Select.Option>
<Select.Option value="Grenada">Grenada</Select.Option>
<Select.Option value="Guatemala">Guatemala</Select.Option>
<Select.Option value="Guinea">Guinea</Select.Option>
<Select.Option value="Guinea-Bissau">Guinea-Bissau</Select.Option>
<Select.Option value="Guyana">Guyana</Select.Option>
<Select.Option value="Haiti">Haiti</Select.Option>
<Select.Option value="Holy See">Holy See</Select.Option>
<Select.Option value="Honduras">Honduras</Select.Option>
<Select.Option value="Hungary">Hungary</Select.Option>
<Select.Option value="Iceland">Iceland</Select.Option>
<Select.Option value="India">India</Select.Option>
<Select.Option value="Indonesia">Indonesia</Select.Option>
<Select.Option value="Iran">Iran</Select.Option>
<Select.Option value="Iraq">Iraq</Select.Option>
<Select.Option value="Ireland">Ireland</Select.Option>
<Select.Option value="Israel">Israel</Select.Option>
<Select.Option value="Italy">Italy</Select.Option>
<Select.Option value="Jamaica">Jamaica</Select.Option>
<Select.Option value="Japan">Japan</Select.Option>
<Select.Option value="Jordan">Jordan</Select.Option>
<Select.Option value="Kazakhstan">Kazakhstan</Select.Option>
<Select.Option value="Kenya">Kenya</Select.Option>
<Select.Option value="Kiribati">Kiribati</Select.Option>
<Select.Option value="Korea, North">Korea, North</Select.Option>
<Select.Option value="Korea, South">Korea, South</Select.Option>
<Select.Option value="Kosovo">Kosovo</Select.Option>
<Select.Option value="Kuwait">Kuwait</Select.Option>
<Select.Option value="Kyrgyzstan">Kyrgyzstan</Select.Option>
<Select.Option value="Laos">Laos</Select.Option>
<Select.Option value="Latvia">Latvia</Select.Option>
<Select.Option value="Lebanon">Lebanon</Select.Option>
<Select.Option value="Lesotho">Lesotho</Select.Option>
<Select.Option value="Liberia">Liberia</Select.Option>
<Select.Option value="Libya">Libya</Select.Option>
<Select.Option value="Liechtenstein">Liechtenstein</Select.Option>
<Select.Option value="Lithuania">Lithuania</Select.Option>
<Select.Option value="Luxembourg">Luxembourg</Select.Option>
<Select.Option value="Madagascar">Madagascar</Select.Option>
<Select.Option value="Malawi">Malawi</Select.Option>
<Select.Option value="Malaysia">Malaysia</Select.Option>
<Select.Option value="Maldives">Maldives</Select.Option>
<Select.Option value="Mali">Mali</Select.Option>
<Select.Option value="Malta">Malta</Select.Option>
<Select.Option value="Marshall Islands">Marshall Islands</Select.Option>
<Select.Option value="Mauritania">Mauritania</Select.Option>
<Select.Option value="Mauritius">Mauritius</Select.Option>
<Select.Option value="Mexico">Mexico</Select.Option>
<Select.Option value="Micronesia">Micronesia</Select.Option>
<Select.Option value="Moldova">Moldova</Select.Option>
<Select.Option value="Monaco">Monaco</Select.Option>
<Select.Option value="Mongolia">Mongolia</Select.Option>
<Select.Option value="Montenegro">Montenegro</Select.Option>
<Select.Option value="Morocco">Morocco</Select.Option>
<Select.Option value="Mozambique">Mozambique</Select.Option>
<Select.Option value="Myanmar">Myanmar</Select.Option>
<Select.Option value="Namibia">Namibia</Select.Option>
<Select.Option value="Nauru">Nauru</Select.Option>
<Select.Option value="Nepal">Nepal</Select.Option>
<Select.Option value="Netherlands">Netherlands</Select.Option>
<Select.Option value="New Zealand">New Zealand</Select.Option>
<Select.Option value="Nicaragua">Nicaragua</Select.Option>
<Select.Option value="Niger">Niger</Select.Option>
<Select.Option value="Nigeria">Nigeria</Select.Option>
<Select.Option value="North Macedonia">North Macedonia</Select.Option>
<Select.Option value="Norway">Norway</Select.Option>
<Select.Option value="Oman">Oman</Select.Option>
<Select.Option value="Pakistan">Pakistan</Select.Option>
<Select.Option value="Palau">Palau</Select.Option>
<Select.Option value="Palestine">Palestine</Select.Option>
<Select.Option value="Panama">Panama</Select.Option>
<Select.Option value="Papua New Guinea">Papua New Guinea</Select.Option>
<Select.Option value="Paraguay">Paraguay</Select.Option>
<Select.Option value="Peru">Peru</Select.Option>
<Select.Option value="Philippines">Philippines</Select.Option>
<Select.Option value="Poland">Poland</Select.Option>
<Select.Option value="Portugal">Portugal</Select.Option>
<Select.Option value="Qatar">Qatar</Select.Option>
<Select.Option value="Romania">Romania</Select.Option>
<Select.Option value="Russia">Russia</Select.Option>
<Select.Option value="Rwanda">Rwanda</Select.Option>
<Select.Option value="Saint Kitts and Nevis">Saint Kitts and Nevis</Select.Option>
<Select.Option value="Saint Lucia">Saint Lucia</Select.Option>
<Select.Option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</Select.Option>
<Select.Option value="Samoa">Samoa</Select.Option>
<Select.Option value="San Marino">San Marino</Select.Option>
<Select.Option value="Sao Tome and Principe">Sao Tome and Principe</Select.Option>
<Select.Option value="Saudi Arabia">Saudi Arabia</Select.Option>
<Select.Option value="Senegal">Senegal</Select.Option>
<Select.Option value="Serbia">Serbia</Select.Option>
<Select.Option value="Seychelles">Seychelles</Select.Option>
<Select.Option value="Sierra Leone">Sierra Leone</Select.Option>
<Select.Option value="Singapore">Singapore</Select.Option>
<Select.Option value="Slovakia">Slovakia</Select.Option>
<Select.Option value="Slovenia">Slovenia</Select.Option>
<Select.Option value="Solomon Islands">Solomon Islands</Select.Option>
<Select.Option value="Somalia">Somalia</Select.Option>
<Select.Option value="South Africa">South Africa</Select.Option>
<Select.Option value="South Sudan">South Sudan</Select.Option>
<Select.Option value="Spain">Spain</Select.Option>
<Select.Option value="Sri Lanka">Sri Lanka</Select.Option>
<Select.Option value="Sudan">Sudan</Select.Option>
<Select.Option value="Suriname">Suriname</Select.Option>
<Select.Option value="Sweden">Sweden</Select.Option>
<Select.Option value="Switzerland">Switzerland</Select.Option>
<Select.Option value="Syria">Syria</Select.Option>
<Select.Option value="Taiwan">Taiwan</Select.Option>
<Select.Option value="Tajikistan">Tajikistan</Select.Option>
<Select.Option value="Tanzania">Tanzania</Select.Option>
<Select.Option value="Thailand">Thailand</Select.Option>
<Select.Option value="Timor-Leste">Timor-Leste</Select.Option>
<Select.Option value="Togo">Togo</Select.Option>
<Select.Option value="Tonga">Tonga</Select.Option>
<Select.Option value="Trinidad and Tobago">Trinidad and Tobago</Select.Option>
<Select.Option value="Tunisia">Tunisia</Select.Option>
<Select.Option value="Turkey">Turkey</Select.Option>
<Select.Option value="Turkmenistan">Turkmenistan</Select.Option>
<Select.Option value="Tuvalu">Tuvalu</Select.Option>
<Select.Option value="Uganda">Uganda</Select.Option>
<Select.Option value="Ukraine">Ukraine</Select.Option>
<Select.Option value="United Arab Emirates">United Arab Emirates</Select.Option>
<Select.Option value="United Kingdom">United Kingdom</Select.Option>
<Select.Option value="United States">United States</Select.Option>
<Select.Option value="Uruguay">Uruguay</Select.Option>
<Select.Option value="Uzbekistan">Uzbekistan</Select.Option>
<Select.Option value="Vanuatu">Vanuatu</Select.Option>
<Select.Option value="Vatican City">Vatican City</Select.Option>
<Select.Option value="Venezuela">Venezuela</Select.Option>
<Select.Option value="Vietnam">Vietnam</Select.Option>
<Select.Option value="Yemen">Yemen</Select.Option>
<Select.Option value="Zambia">Zambia</Select.Option>
<Select.Option value="Zimbabwe">Zimbabwe</Select.Option>

              </Select>
            </label>
            <label className="checkout-label">
              <span>
                Street Address <span className="checkout-required">*</span>
              </span>
              <input
                className="checkout-input"
                type="text"
                name="houseadd"
                placeholder="House number and street name"
                required
                onChange={(event) => handleInput(event)}
              />
            </label>
            <label className="checkout-label">
              <span>&nbsp;</span>
              <input
                className="checkout-input"
                type="text"
                name="apartment"
                placeholder="Apartment, suite, unit etc"
              />
            </label>
            <label className="checkout-label">
              <span>
                Town / City <span className="checkout-required">*</span>
              </span>
              <input
                className="checkout-input"
                type="text"
                name="city"
                onChange={(event) => handleInput(event)}
              />
            </label>
            <label className="checkout-label">
              <span>
                State <span className="checkout-required">*</span>
              </span>
              <input
                className="checkout-input"
                type="text"
                name="state"
                onChange={(event) => handleInput(event)}
              />
            </label>
            <label className="checkout-label">
              <span>
                Postcode / ZIP <span className="checkout-required">*</span>
              </span>
              <input
                className="checkout-input"
                type="text"
                name="postcode"
                onChange={(event) => handleInput(event)}
              />
            </label>
          </form>
          <div className="checkout-Yorder" style={{ height: "100%" }}>
            <table className="checkout-table">
              <tbody>
                <tr>
                  <th className="checkout-th" colSpan={2}>
                    Your order
                  </th>
                </tr>
                {orderData &&
                  orderData.frontendCart &&
                  orderData.frontendCart.map((item) => {
                    return (
                      <tr key={item._id}>
                        <td className="checkout-td">
                          {item.name} x {item.quantity}(Qty)
                        </td>
                        <td className="checkout-td">
                          {getINR(item.price * item.quantity)}
                        </td>
                      </tr>
                    );
                  })}

                <tr>
                  <td className="checkout-td">Subtotal</td>
                  <td className="checkout-td">{getINR(total)}</td>
                </tr>
                <tr>
                  <td className="checkout-td">Shipping</td>
                  <td className="checkout-td">Free shipping</td>
                </tr>
              </tbody>
            </table>

            <br />

            <div className="d-flex flex-column justify-content-between">
              <div>
                {clientToken && (
                  <DropIn
                    options={{
                      authorization: clientToken,
                      // paypal: {
                      //   flow: "vault",
                      // },
                    }}
                    onInstance={handleInstance}
                  />
                )}
              </div>
              <button
                className="checkout-button"
                type="button"
                onClick={(event) => PlaceOrder(event)}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckOut;
