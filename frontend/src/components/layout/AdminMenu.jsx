import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/Auth";

const AdminMenu = () => {
  const [auth, setAuth] = useAuth();

  return (
    <ul className="list-group">
      <NavLink className="list-group-item" to={`/dashboard/admin/profile`}>
        Profile
      </NavLink>
      <NavLink
        className="list-group-item"
        to="/dashboard/admin/create-category"
      >
        Create Category
      </NavLink>
      <NavLink className="list-group-item" to="/dashboard/admin/create-product">
        Create Product
      </NavLink>
      <NavLink
        className="list-group-item"
        to={`/dashboard/admin/products/${auth.user.id}`}
      >
        Products
      </NavLink>
      <NavLink
        className="list-group-item"
        to="/dashboard/admin/orders-received"
      >
        Orders Received
      </NavLink>
    </ul>
  );
};
export default AdminMenu;
