

import { Link, useNavigate } from "react-router-dom";
const Nav = () => {
    const navigate = useNavigate()
    const auth = localStorage.getItem("user")

    const Logout = () => {
        localStorage.clear()
        navigate("/signup")
    }
    return (
        <div>

            {auth ? <ul className="Navbar">

                <li><Link className="nav-items" to={"/"}>Product</Link></li>
                <li><Link className="nav-items" to={"add"}>Add</Link></li>
                <li><Link className="nav-items" to={"/update"}>Update Product</Link></li>
                <li><Link className="nav-items" to={"/profile"}>Profile</Link></li>
                <li><Link className="nav-items" onClick={Logout} to={"/login"}>Logout ({JSON.parse(auth).name})</Link></li>
            </ul >
                :
                <ul className="Navbar right">
                    <li>  <Link className="nav-items" to={"/signup"}>signup</Link></li>
                    <li><Link className="nav-items" to={"/login"}>Login</Link></li>
                </ul>
            }
        </div>

    );
};

export default Nav;
