import { useEffect, useState } from "react";
import "./orderlist.css";
import { useNavigate } from "react-router-dom";
import { DeletePopUp } from "../alert_message/DeletePopUp";
import { DeleteDone } from "../alert_message/DeleteDone";

export const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await fetch(
        "https://ecommerce-project-api-s1c9.onrender.com/api/v1/product/order-list"
      );
      const data = await res.json();
      setOrders(data);
    })();
  }, []);
  const deleteHandler = async (id) => {
    await fetch(
      `https://ecommerce-project-api-s1c9.onrender.com/api/v1/product/order/${id}`,
      {
        method: "DELETE",
      }
    );
    const res = await fetch(
      "https://ecommerce-project-api-s1c9.onrender.com/api/v1/product/order-list"
    );
    const data = await res.json();
    setOrders(data);
  };
  return (
    <div className="order-list">
      <h1>Order List</h1>
      <div className="order-list-container">
        <div className="order-list-title">
          <p>UserName</p>
          <p>Address</p>
          <p>Email</p>
          <p>Order Date</p>
          <p>Order Status</p>
          <p>Action</p>
        </div>
        <div className="order-list-content-container">
          {orders.map((order) => {
            return (
              <div key={order._id} className="order-list-content">
                <p
                  onClick={() =>
                    navigate(
                      `/orderproduct/${order._id}?${
                        order.order_status === "request order"
                          ? "status=true"
                          : "status=false"
                      }`
                    )
                  }
                >
                  {order.user_name}
                </p>
                <p>{order.user_address}</p>
                <p>{order.user_email}</p>
                <p>{order.order_date}</p>
                <p>{order.order_status}</p>
                <button
                  onClick={async () => {
                    const result = await DeletePopUp();
                    if (result) {
                      deleteHandler(order._id);
                      DeleteDone();
                    } else {
                      return false;
                    }
                  }}
                  className="remove"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
