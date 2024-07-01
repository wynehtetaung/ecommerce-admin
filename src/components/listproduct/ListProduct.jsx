/* eslint-disable no-case-declarations */
import { useEffect, useRef, useState } from "react";
import "./listproduct.css";
import delete_icon from "../../assets/cross_icon.png";
import firebaseService from "../../firebase/firebaseService";
import { DeleteDone } from "../alert_message/DeleteDone";
import { DeletePopUp } from "../alert_message/DeletePopUp";
import { Loading } from "../alert_message/Loading";

export default function ListProduct() {
  const [productList, setProductList] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const [alertMessage, setAlertMessage] = useState();
  const selectRef = useRef();
  useEffect(() => {
    (async () => {
      const res = await fetch(
        "https://ecommerce-project-api-s1c9.onrender.com/api/v1/product?admin=true"
      );
      const products = await res.json();
      setProductList(products.data);
    })();
  }, []);
  const deleteProduct = async (productId, image, images) => {
    const result = await DeletePopUp();
    if (result) {
      Loading("Deleting");
      await firebaseService.image_delete(image);
      await firebaseService.multiple_image_delete(images);
      (async () => {
        await fetch(
          `https://ecommerce-project-api-s1c9.onrender.com/api/v1/product/${productId}`,
          {
            method: "DELETE",
          }
        );
      })();
      DeleteDone();
      const filterProduct = productList.filter(
        (product) => product._id != productId
      );
      setProductList(filterProduct);
      setTimeout(() => {
        setAlertMessage("");
      }, 1000);
    }
  };
  const selectChangeHandler = async (status) => {
    if (status)
      switch (status) {
        case "popular":
          const res = await fetch(
            `https://ecommerce-project-api-s1c9.onrender.com/api/v1/product/popular`
          );
          const { data } = await res.json();
          setFilterProducts(data);
          break;
        case "unpopular":
          const res_1 = await fetch(
            "https://ecommerce-project-api-s1c9.onrender.com/api/v1/product?admin=true"
          );
          const res_data = await res_1.json();
          setFilterProducts(
            res_data.data.filter((product) => product.popular_action === false)
          );
          break;
        case "all":
          const res_2 = await fetch(
            "https://ecommerce-project-api-s1c9.onrender.com/api/v1/product?admin=true"
          );
          const res_data1 = await res_2.json();
          setFilterProducts(res_data1.data);
          break;
        case "available":
          const res_3 = await fetch(
            "https://ecommerce-project-api-s1c9.onrender.com/api/v1/product?admin=true"
          );
          const res_data2 = await res_3.json();
          setFilterProducts(
            res_data2.data.filter((product) => product.available === true)
          );
          break;
        case "unavailable":
          const res_4 = await fetch(
            "https://ecommerce-project-api-s1c9.onrender.com/api/v1/product?admin=true"
          );
          const res_data3 = await res_4.json();
          setFilterProducts(
            res_data3.data.filter((product) => product.available === false)
          );
          break;
        default:
          const res_5 = await fetch(
            `https://ecommerce-project-api-s1c9.onrender.com/api/v1/product/filter?category=${status}`
          );
          const data_5 = await res_5.json();
          setFilterProducts(data_5.data);
      }
  };

  const popularButtonHandler = (id, popular, filter_type, status) => {
    if (popular) {
      const filterProduct = productList.filter((product) => product._id === id);
      const defaultProduct = productList.filter(
        (product) => product._id !== id
      );
      filterProduct[0].popular_action = false;
      defaultProduct.push(filterProduct[0]);
      (async () => {
        await fetch(
          `https://ecommerce-project-api-s1c9.onrender.com/api/v1/product/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ action: false, date: Date.now() }),
          }
        );
      })();
      if (filter_type) {
        setFilterProducts(
          defaultProduct.filter((product) => product.category === status)
        );
      } else {
        setProductList(defaultProduct);
      }
    } else {
      const filterProduct = productList.filter((product) => product._id == id);
      const defaultProduct = productList.filter(
        (product) => product._id !== id
      );
      filterProduct[0].popular_action = true;
      defaultProduct.push(filterProduct[0]);
      (async () => {
        await fetch(
          `https://ecommerce-project-api-s1c9.onrender.com/api/v1/product/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ action: true, date: Date.now() }),
          }
        );
      })();
      if (filter_type) {
        setFilterProducts(
          defaultProduct.filter((product) => product.category === status)
        );
      } else {
        setProductList(defaultProduct);
      }
    }
  };

  const availableHandler = async (pid, value, status) => {
    const res = await fetch(
      `https://ecommerce-project-api-s1c9.onrender.com/api/v1/product/${pid}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ available_value: value }),
      }
    );
    const data = await res.json();
    if (status === "product-list") {
      setProductList(data);
    } else {
      setFilterProducts(data.filter((item) => item.category === status));
    }
  };

  return (
    <div className="list-product">
      <h1>All Products List</h1>
      <div className="list-product-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Popular</p>
        <p>Available</p>
        <p>Action</p>
        <select
          ref={selectRef}
          onChange={() => selectChangeHandler(selectRef.current.value)}
          className="filter"
        >
          <option value="all">All</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
          <option value="women">Women</option>
          <option value="popular">Popular</option>
          <option value="unpopular">Unpopular</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>
      {alertMessage ? <p className="alert">{alertMessage}</p> : ""}
      <div className="list-product-all-product">
        <hr />
        {filterProducts.length == 0
          ? productList.map((product) => {
              return (
                <div
                  key={product._id}
                  className="list-product-format-main list-product-format"
                >
                  <img src={product.image} className="list-product-image" />
                  <p>{product.title}</p>
                  <p>${product.old_price}</p>
                  <p>${product.new_price}</p>
                  <p>{product.category}</p>

                  {product.popular_action ? (
                    <div className="popular">
                      <button
                        onClick={() =>
                          popularButtonHandler(
                            product._id,
                            product.popular_action
                          )
                        }
                      >
                        popular
                      </button>
                    </div>
                  ) : (
                    <div className="popular">
                      <button
                        onClick={() =>
                          popularButtonHandler(
                            product._id,
                            product.popular_action
                          )
                        }
                      >
                        unpopular
                      </button>
                    </div>
                  )}
                  {product.available ? (
                    <button
                      onClick={() =>
                        availableHandler(product._id, false, "product-list")
                      }
                      className="available-btn"
                    >
                      Available
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        availableHandler(product._id, true, "product-list")
                      }
                      className="unavailable-btn"
                    >
                      Not Available
                    </button>
                  )}
                  <img
                    onClick={() => {
                      deleteProduct(
                        product._id,
                        product.image,
                        product.showcase
                      );
                    }}
                    src={delete_icon}
                    className="list-product-remove-icon"
                  />
                </div>
              );
            })
          : filterProducts.map((product) => {
              return (
                <div
                  key={product._id}
                  className="list-product-format-main list-product-format"
                >
                  <img src={product.image} className="list-product-image" />
                  <p>{product.title}</p>
                  <p>${product.old_price}</p>
                  <p>${product.new_price}</p>
                  <p>{product.category}</p>
                  {product.popular_action ? (
                    <div className="popular">
                      <button
                        onClick={() =>
                          popularButtonHandler(
                            product._id,
                            product.popular_action,
                            true,
                            selectRef.current.value
                          )
                        }
                      >
                        popular
                      </button>
                    </div>
                  ) : (
                    <div className="popular">
                      <button
                        onClick={() =>
                          popularButtonHandler(
                            product._id,
                            product.popular_action,
                            true,
                            selectRef.current.value
                          )
                        }
                      >
                        unpopular
                      </button>
                    </div>
                  )}
                  {product.available ? (
                    <button
                      onClick={() =>
                        availableHandler(
                          product._id,
                          false,
                          selectRef.current.value
                        )
                      }
                      className="available-btn"
                    >
                      Available
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        availableHandler(
                          product._id,
                          true,
                          selectRef.current.value
                        )
                      }
                      className="unavailable-btn"
                    >
                      Not Available
                    </button>
                  )}
                  <img
                    onClick={() => {
                      deleteProduct(
                        product._id,
                        product.image,
                        product.showcase
                      );
                    }}
                    src={delete_icon}
                    className="list-product-remove-icon"
                  />
                </div>
              );
            })}
        <hr />
      </div>
      <p>Total Products : {productList.length}</p>
    </div>
  );
}
