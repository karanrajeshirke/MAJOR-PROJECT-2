import Layout from "../../src/components/layout/Layout";
import AdminMenu from "../../src/components/layout/AdminMenu";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../src/context/Auth";
import Chart from "react-apexcharts";
import {Select} from "antd"
import moment from "moment"


const AdminProfile = () => {
  const [auth, setAuth] = useAuth();

  const [statusNames, setStatusNames] = useState([]);
  const [statusCount, setStatusCount] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [productCount, setProductCount] = useState([]);

  const [totalProducts, setTotalProducts] = useState("");
  const [ordersCount, setOrdersCount] = useState("");
  const [amount, setAmountCount] = useState("");

  const [options, setOptions] = useState({ labels: [],colors:[]});
  const [series, setSeries] = useState([]);

  const [categorySalesValue,setCategorySalesValue]=useState("");

  const [categoryDate,setCategoryDate]=useState(new Date().toISOString())





  const getStatusCount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/product/getcount",
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      setStatusNames(response.data.namesArr);
      setStatusCount(response.data.valuesArr);
    } catch (error) {
      console.log(error);
    }
  };

  const getProductCount = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/product/individualProductCount",
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );
      setProductNames(response.data.productNames);
      setProductCount(response.data.productCount);
    } catch (error) {
      console.log(error);
    }
  };

  const getAdminProfileOrder = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/product/admin-profile-details",
        {
          headers: {
            Authorization: auth.token,
          },
        }
      );

      setTotalProducts(response.data.productsCount);
      setOrdersCount(response.data.ordersCount);
      setAmountCount(response.data.amount);
    } catch (error) {
      console.log(error);
    }
  };

  const changetoINR = (amount) => {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  };
  useEffect(() => {
    getStatusCount();
    getProductCount();
    getAdminProfileOrder();
  }, []);

  const getCategoriesSales = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/product/individual/category-sales/${categoryDate}`,
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );

      const randomColors = response.data.catNamesArr.map(() => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      });

      let amt=0;
      for(let i=0;i<response.data.pricesArr.length;i++)
      {
          amt=amt+response.data.pricesArr[i];
          
      }

      setCategorySalesValue(amt);



      setOptions((prev) => {
        return {
          ...prev,
          labels: response.data.catNamesArr,colors:randomColors
        };
      });

      setSeries(response.data.pricesArr);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategoriesSales();

  }, [categoryDate]);


  

  return (
    <Layout>
      <div className="row  ">
        <div className="col-2">
          <AdminMenu />
        </div>
        <div className="col-10   p-5">
          <div className="row ">
            <div className="admin-cards-list">
              <div className="admin-card 1">
                <div
                  className="admin-card_title title-white d-flex justify-content-center align-items-center flex-column "
                  style={{ height: "100%" }}
                >
                  <h3>Products</h3>
                  <h1>{totalProducts}</h1>
                </div>
              </div>

              <div className="admin-card 1">
                <div
                  className="admin-card_title title-white d-flex justify-content-center align-items-center flex-column "
                  style={{ height: "100%" }}
                >
                  <h3>Orders</h3>
                  <h1>{ordersCount}</h1>
                </div>
              </div>

              <div className="admin-card 1">
                <div
                  className="admin-card_title title-white d-flex justify-content-center align-items-center flex-column "
                  style={{ height: "100%" }}
                >
                  {" "}
                  <h3>Amount</h3>
                  <h2>{changetoINR(amount)}</h2>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="d-flex  mt-3 justify-content-around ">
                <Chart
                  options={{
                    title: {
                      text: "Status of Orders",
                      align: "center",
                      style: {
                        fontSize: "20px",
                        fontWeight: "bold",
                        fontFamily: "Arial",
                        color: "#333",
                      },
                    },
                    labels: statusNames,
                  }}
                  series={statusCount}
                  type="pie"
                  width="500"
                />

                <Chart
                  options={{
                    chart: {
                      type: "bar",
                    },
                    xaxis: {
                      categories: productNames,
                      title: {
                        text: "Products",
                      },
                    },
                    yaxis: {
                      title: {
                        text: "Sales Count",
                      },
                    },
                    title: {
                      text: "Product Sales Count",
                      align: "center",
                      style: {
                        fontSize: "20px",
                        fontWeight: "bold",
                        fontFamily: "Arial",
                        color: "#333",
                      },
                    },
                    colors: ["#FF5733"],
                  }}
                  series={[
                    {
                      name: "Sales Count",
                      data: productCount,
                    },
                  ]}
                  type="bar"
                  width="600"
                />
              </div>

              <div className="d-flex  mt-3 justify-content-center ">
              
                <div className="donut-chart">

                <Chart
  options={{
    ...options, 
    title: {
      text: "Category Sales Distribution", 
      align: "center",
      style: {
        fontSize: "16px",
        fontWeight: "bold",
        fontFamily: "Arial",
        color: "#333"
      }
    }
  }}
  series={series}
  type="donut"
  width="500"
  height="500"
/>
<h1 style={{marginLeft:"90px"}}>{changetoINR(categorySalesValue)}</h1>

<div className="text-center">
<Select onChange={(val) => {
  console.log(val);
  setCategoryDate(moment(val).toISOString())}} className="w-75">
  <Select.Option value={moment().clone().subtract(1, 'day').format('MMMM DD, YYYY')} key={1}>1 day before</Select.Option>
  <Select.Option value={moment().clone().subtract(2, 'day').format('MMMM DD, YYYY')} key={2}>2 days before</Select.Option>
  <Select.Option value={moment().clone().subtract(3, 'day').format('MMMM DD, YYYY')} key={3}>3 days before</Select.Option>
  <Select.Option value={moment().clone().subtract(4, 'day').format('MMMM DD, YYYY')} key={4}>4 days before</Select.Option>
  <Select.Option value={moment().clone().subtract(5, 'day').format('MMMM DD, YYYY')} key={5}>5 days before</Select.Option>
  <Select.Option value={moment().clone().subtract(6, 'day').format('MMMM DD, YYYY')} key={6}>6 days before</Select.Option>
  <Select.Option value={moment().clone().subtract(7, 'day').format('MMMM DD, YYYY')} key={7}>1 week before</Select.Option>
  <Select.Option value={moment().clone().subtract(14, 'day').format('MMMM DD, YYYY')} key={8}>2 week before</Select.Option>
  <Select.Option value={moment().clone().subtract(28, 'day').format('MMMM DD, YYYY')} key={9}>3 week before</Select.Option>
  <Select.Option value={moment().clone().subtract(30, 'day').format('MMMM DD, YYYY')} key={10}>1 month before</Select.Option>
  <Select.Option value={moment().clone().subtract(60, 'day').format('MMMM DD, YYYY')} key={11}>2 month before</Select.Option>
</Select>

</div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminProfile;
