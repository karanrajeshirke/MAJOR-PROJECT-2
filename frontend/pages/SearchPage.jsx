import Layout from "../src/components/layout/Layout";
import { useSearch } from "../src/context/Search";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Rate } from "antd";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBIcon,
} from "mdb-react-ui-kit";
const SearchPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useSearch();

  return (
    <Layout>
      {search && search.result && search.result.length ? (
        <h1 className="text-center mt-3">
          Products found : {search.result.length}
        </h1>
      ) : (
        <h1 className="text-center mt-3">No Products Found</h1>
      )}
      <div className="row  d-flex flex-wrap">
        {search &&
          search.result &&
          search.result.map((item) => {
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
    </Layout>
  );
};

export default SearchPage;
