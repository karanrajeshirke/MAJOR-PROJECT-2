import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Policy from "../pages/Policy";
import PageNotFound from "../pages/PageNotFound";
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import Dashboard from "../pages/user/Dashboard";
import { AuthProvider } from "./context/Auth";
import { UserRoute } from "./components/routes/UserRoute";
import CartPage from "../pages/user/CartPage";
import AdminDashBoard from "../pages/Admin/AdminDashBoard";
import { AdminRoute } from "./components/routes/AdminRoute";
import CreateCategory from "../pages/Admin/CreateCategory";
import CreateProduct from "../pages/Admin/CreateProduct";
import Users from "../pages/Admin/Users";
import Profile from "../pages/user/Profile";
import Order from "../pages/user/Order";
import Products from "../pages/Admin/Products";
import SingleProduct from "../pages/Admin/SingleProduct";
import UpdateProduct from "../pages/Admin/UpdateProduct";
import { SearchProvider } from "./context/Search";
import SearchPage from "../pages/SearchPage";
import ProductDetails from "../pages/ProductDetails";
import OrdersAdmin from "../pages/Admin/OrdersAdmin";
import AdminProfile from "../pages/Admin/AdminProfile";
import { CartProvider } from "./context/Cart";
import CheckOut from "../pages/user/CheckOut";
import InvoicePage from "../pages/user/All_Invoice_Pages";
import SingleInvoice from "../pages/user/SingleInvoice";
// import { CartProvider } from "./context/Cart";

function App() {
  return (
    <>
      <AuthProvider>
        <SearchProvider>
          <CartProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/policy" element={<Policy />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/product/:slug" element={<ProductDetails />} />   
              <Route path="/dashboard" element={<UserRoute />}>
                <Route path="user" element={<Dashboard />} />
                <Route path="user/profile" element={<Profile />} />
                <Route path="user/order" element={<Order />} />
                <Route path="user/cart" element={<CartPage />} />
                <Route path="user/checkout" element={<CheckOut/>} />
                <Route path="user/invoice-page" element={<InvoicePage/>} />
                <Route path="user/invoice-page/:orderNo" element={<SingleInvoice/>} />


              </Route>

              <Route path="/dashboard" element={<AdminRoute />}>
                <Route path="admin" element={<AdminDashBoard />} />
                <Route path="admin/profile" element={<AdminProfile />} />

                <Route
                  path="admin/create-category"
                  element={<CreateCategory />}
                />
                <Route path="admin/products/:adminId" element={<Products />} />
                <Route path="admin/product/:slug" element={<SingleProduct />} />
                <Route
                  path="admin/product/update/:slug"
                  element={<UpdateProduct />}
                />
                <Route
                  path="admin/create-product"
                  element={<CreateProduct />}
                />
                <Route path="admin/users" element={<Users />} />
                <Route path="admin/orders-received" element={<OrdersAdmin />} />
              </Route>

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
          </CartProvider>
        </SearchProvider>
      </AuthProvider>
    </>
  );
}

export default App;
