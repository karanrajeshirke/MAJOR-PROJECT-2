import { NavLink } from "react-router-dom"

const UserMenu=()=>
{
return(
    <>
    <ul className="list-group">
  <NavLink className="list-group-item" to="/dashboard/user/profile">Profile</NavLink>
  <NavLink className="list-group-item" to="/dashboard/user/order">Order</NavLink>
  <NavLink className="list-group-item" to="/dashboard/user/invoice-page">Invoice Page</NavLink>

</ul>
    </>
)
}

export default UserMenu