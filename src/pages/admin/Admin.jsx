import { useRef } from "react";
import "./admin.css";
import Sidebar from "../../components/sidebar/Sidebar";
import { Routes, Route } from "react-router-dom";
import AddProduct from "../../components/addproduct/AddProduct";
import ListProduct from "../../components/listproduct/ListProduct";
import { OrderList } from "../../components/orderlist/OrderList";
import { OrderProduct } from "../../components/orderproduct/OrderProduct";
import { useState } from "react";
import Dashboard from "../../components/dashboard/Dashboard";

export default function Admin() {
  const [login, setLogin] = useState(false);
  const inputRef = useRef();

  const loginHandler = async () => {
    const res = await fetch(
      `https://ecommerce-project-api-s1c9.onrender.com/api/v1/user/admin-login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: inputRef.current.value }),
      }
    );
    const { success } = await res.json();
    setLogin(success);
  };
  return (
    <>
      {login ? (
        <div className="admin">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route path="/listproduct" element={<ListProduct />} />
            <Route path="/orderlist" element={<OrderList />} />
            <Route path="/orderproduct/:id" element={<OrderProduct />} />
          </Routes>
        </div>
      ) : (
        <div className="login">
          <label htmlFor="key">Enter Key</label>
          <input ref={inputRef} type="text" name="key" id="key" />
          <button onClick={loginHandler}>Login</button>
        </div>
      )}
    </>
  );
}
