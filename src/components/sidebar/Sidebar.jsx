import "./sidebar.css";
import { Link } from "react-router-dom";
import add_product_icon from "../../assets/Product_Cart.svg";
import list_product_icon from "../../assets/Product_list_icon.svg";

export default function Sidebar() {
  return (
    <div className="side-bar">
      <Link to={"/addproduct"} style={{ textDecoration: "none" }}>
        <div className="side-bar-item">
          <img src={add_product_icon} />
          <p>Add Product</p>
        </div>
      </Link>
      <Link to={"/listproduct"} style={{ textDecoration: "none" }}>
        <div className="side-bar-item">
          <img src={list_product_icon} />
          <p>Product List</p>
        </div>
      </Link>
      <Link to={"/orderlist"} style={{ textDecoration: "none" }}>
        <div className="side-bar-item">
          <img src={add_product_icon} />
          <p>Order List</p>
        </div>
      </Link>
    </div>
  );
}
