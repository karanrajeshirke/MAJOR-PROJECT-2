import React, { useEffect, useState } from "react";
import Layout from "../../src/components/layout/Layout";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import { useAuth } from "../../src/context/Auth";
import { NavLink } from "react-router-dom";
const SingleInvoice = () => {
  const [auth, setAuth] = useAuth();
  const pdfRef = useRef();
  const location = useLocation();
  const { data } = location.state || {};

  const [orders, setOrders] = useState("");
  const [userActive, setUserActive] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  useEffect(() => {
    setOrders(data);
    console.log(orders);
    setUserActive(auth.user);
    let total = 0;
    for (const item of data) {
      total += item.product.price * item.quantity;
    }
    setTotalAmount(total);
  }, [orders]);

  const downloadPdf = () => {
    const input = pdfRef.current;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("invoice.pdf");
    });
  };

  const toINR = (amount) => {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  return (
    <>
      <Layout>
        <div className="row">
          <div className="col-12  text-center mt-4 d-flex justify-content-center">
            <NavLink
              className="list-group-item mr-4"
              to="/dashboard/user/profile"
            >
              Profile
            </NavLink>
            <NavLink
              className="list-group-item mr-4"
              to="/dashboard/user/order"
            >
              Order
            </NavLink>
            <NavLink
              className="list-group-item mr-4"
              to="/dashboard/user/invoice-page"
            >
              Invoice Page
            </NavLink>
          </div>
          <div className="main-container  d-flex justify-content-center p-4">
            <div className="invoice-container col-9 p-5  " ref={pdfRef}>
              <div className="row pad-top-botm client-info">
                <div className="col-lg-6 col-md-6 col-sm-6">
                  <h4>
                    <strong>Client Information</strong>
                  </h4>
                  <strong>{userActive.name}</strong>
                  <br />
                  <b>Address :</b> {orders[0]?.houseadd}
                  <br />
                  {orders[0]?.country}
                  <br />
                  <b>Call :</b>
                  {userActive.phone}
                  <br />
                  <b>E-mail :</b> {userActive.email}
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6">
                  <h4>
                    <strong>Payment Details </strong>
                  </h4>
                  <b>Bill Amount : {toINR(totalAmount * 1.1)}</b>
                  <br />
                  <b>Payment Status : Paid </b>
                  <br />
                  Purchase Date : {formatDate(orders[0]?.date)}
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered table-hover">
                      <thead>
                        <tr>
                          <th>Product Name</th>
                          <th>Bought From</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>Sub Total</th>
                        </tr>
                      </thead>
                      {orders && (
                        <tbody>
                          {orders &&
                            orders.map((item) => (
                              <tr key={item.product._id}>
                                <td>{item.product.name}</td>
                                <td>{item.product.seller.name}</td>
                                <td>{item.quantity}</td>
                                <td>{toINR(item.product.price)}</td>
                                <td>
                                  {toINR(item.product.price * item.quantity)}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      )}
                    </table>
                  </div>
                  <hr />
                  <div className="ttl-amts">
                    <h5>Total Amount : {toINR(totalAmount)}</h5>
                  </div>
                  <hr />
                  <div className="ttl-amts">
                    <h5>Tax : {toINR(totalAmount * 0.1)}( by 10 % on bill )</h5>
                  </div>
                  <hr />
                  <div className="ttl-amts">
                    <h4>
                      <strong>Bill Amount : {toINR(totalAmount * 1.1)}</strong>
                    </h4>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <strong> Important: </strong>
                  <ol>
                    <li>
                      This is an electronic generated invoice so doesn't require
                      any signature.
                    </li>
                    <li>
                      Please read all terms and polices on www.yourdomaon.com
                      for returns, replacement and other issues.
                    </li>
                  </ol>
                </div>
              </div>
              <div className="row pad-top-botm">
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <hr />
                  <button className="btn btn-success" onClick={downloadPdf}>
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default SingleInvoice;
