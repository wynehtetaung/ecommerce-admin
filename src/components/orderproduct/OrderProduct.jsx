import { useEffect, useState } from "react";
import "./orderprodut.css";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";

export const OrderProduct = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState([]);
  const [quantity, setQuantity] = useState();
  const [total, setTotal] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const res = await fetch(
        `https://ecommerce-project-api-s1c9.onrender.com/api/v1/product/order-list/${id}`
      );
      const data = await res.json();
      setOrder(data.order_products);
      const quantity = data.order_products
        .map((item) => item.quantity)
        .reduce((a, b) => a + b);
      setQuantity(quantity);
      const prices = data.order_products
        .map((item) => item.total_price)
        .reduce((a, b) => a + b);
      setTotal(prices);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deliveryHandler = async (id) => {
    const res = await fetch(
      `https://ecommerce-project-api-s1c9.onrender.com/api/v1/product/order/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderStatus: "delivery" }),
      }
    );
    const data = res.json();
    navigate("/orderlist");
    setOrder(data);
  };

  return (
    <div className="order-product">
      <div className="order-product-container">
        <div className="order-product-title">
          <p>Product Image</p>
          <p>Title</p>
          <p>Price</p>
          <p>Total Price</p>
          <p>Size</p>
          <p>Quantity</p>
        </div>
        <div className="order-product-content-container">
          {order.map((item) => {
            return (
              <div key={item.pid} className="order-product-content">
                <img src={item.image} alt="" />
                <p>{item.title}</p>
                <p>{item.new_price}</p>
                <p>{item.total_price}</p>
                <p>{item.size}</p>
                <p>{item.quantity}</p>
              </div>
            );
          })}
        </div>
        <div className="order-total">
          <div className="order-total-container">
            <p>Total Quantity : {quantity}</p>
            <p>Total Price : ${total}</p>
          </div>
        </div>
        <div className="btn-container">
          {searchParams.get("status") == "true" ? (
            <button
              onClick={() => deliveryHandler(id)}
              className="delivery-btn"
            >
              Delivery Now
            </button>
          ) : (
            <p className="order-done">This order has been shipped!</p>
          )}
        </div>
      </div>
    </div>
  );
};
