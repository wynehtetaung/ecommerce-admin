import "./addproduct.css";
import { useRef, useState } from "react";
import upload_area from "../../assets/upload_area.svg";
import firebaseService from "../../firebase/firebaseService";
import { useNavigate } from "react-router-dom";
import { Toast } from "../alert_message/Toast";
import { Warning } from "../alert_message/Warning";
export default function AddProduct() {
  const [storeSize, setStoreSize] = useState([]);
  const [image, setImage] = useState(false);
  const [multipleImage, setMultipleImage] = useState([]);
  const [loading, setLoading] = useState();
  const navigate = useNavigate();
  const descriptionRef = useRef();
  const [productDetails, setProductDetails] = useState({
    title: "",
    image: "",
    showcase: [],
    old_price: "",
    new_price: "",
    category: "women",
    size: [],
    description: "",
    available: true,
  });
  const imageHandler = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile.size > 400000) {
      Warning("warning", "please select under 400kb image file!");
    } else {
      if (imageFile.type === "image/png") {
        setImage(imageFile);
      } else {
        Warning("warning", "please select png image file type!");
      }
    }
  };
  const multipleImageHandler = async (e) => {
    const imageFiles = e.target.files;
    if (imageFiles.length > 4 || imageFiles.length < 4) {
      Warning("warning", "please select four photo");
      return false;
    }
    let images = [];
    for (let i = 0; i < imageFiles.length; i++) {
      if (imageFiles[i].size > 300000) {
        Warning("warning", "please select under 300kb image file!");
        return false;
      }
      images.push(imageFiles[i]);
    }
    setMultipleImage(images);
  };
  const productHandler = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.value,
    });
  };
  const addProduct = async () => {
    if (
      !productDetails.title != "" ||
      !productDetails.old_price != "" ||
      !productDetails.new_price != "" ||
      !descriptionRef.current.value != "" ||
      !image != "" ||
      !multipleImage.length != 0 ||
      !storeSize.length != 0
    ) {
      Warning("warning", "please product data fill");
      return false;
    }
    setLoading(true);
    const url = await firebaseService.image_upload(image);
    const multiple_url = await firebaseService.multiple_upload(multipleImage);
    productDetails.image = url;
    productDetails.showcase = multiple_url;
    productDetails.size = storeSize;
    productDetails.description = descriptionRef.current.value;
    (async () => {
      const res = await fetch(
        "https://ecommerce-project-api-s1c9.onrender.com/api/v1/product/add",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            title: productDetails.title,
            old_price: productDetails.old_price,
            new_price: productDetails.new_price,
            category: productDetails.category,
            image: productDetails.image,
            showcase: productDetails.showcase,
            quantity: productDetails.quantity,
            size: productDetails.size,
            description: productDetails.description,
            available: productDetails.available,
          }),
        }
      );
      if (res.ok) {
        if (url && multiple_url && res.ok) setLoading(false);
        Toast("success", "Add Product Done!", 2000);
        setTimeout(() => {
          navigate("/listproduct");
        }, 2000);
      } else navigate("/addproduct");
    })();
  };

  const clickHandler = (e) => {
    if (e.target.classList == "") {
      e.target.classList = "click";
      setStoreSize([
        ...storeSize,
        {
          id: storeSize.length + 1,
          letter: e.target.value,
        },
      ]);
    } else {
      e.target.classList = "";
      const filterSize = storeSize.filter(
        (size) => size.letter !== e.target.value
      );
      setStoreSize(filterSize);
    }
  };

  return (
    <div className="add-product">
      <div className="add-product-item-field">
        <p>Product Title</p>
        <input
          value={productDetails.title}
          onChange={productHandler}
          type="text"
          name="title"
          placeholder="enter product name"
        />
      </div>
      <div className="add-product-price">
        <div className="add-product-item-field">
          <p>Old Price</p>
          <input
            value={productDetails.old_price}
            onChange={productHandler}
            type="number"
            name="old_price"
            placeholder="enter old price"
          />
        </div>
        <div className="add-product-item-field">
          <p>New Price</p>
          <input
            value={productDetails.new_price}
            onChange={productHandler}
            type="number"
            name="new_price"
            placeholder="enter new price"
          />
        </div>
      </div>
      <div className="description add-product-item-field">
        <p>Product Description</p>
        <textarea
          name="description"
          placeholder="enter description"
          ref={descriptionRef}
        ></textarea>
      </div>
      <div className="add-product-item-field-selected">
        <div className="selected">
          <p>Product Category</p>
          <select
            value={productDetails.category}
            onChange={productHandler}
            name="category"
            className="add-product-selector"
          >
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kid">Kid</option>
          </select>
        </div>
        <div className="selected">
          <p>Product Size</p>
          <div className="show-select-value">
            {storeSize.map((size) => {
              return <p key={size.id}>{size.letter}</p>;
            })}
          </div>
          <div className="select-container">
            <button onClick={clickHandler} value={"S"}>
              S
            </button>
            <button onClick={clickHandler} value={"M"}>
              M
            </button>
            <button onClick={clickHandler} value={"L"}>
              L
            </button>
            <button onClick={clickHandler} value={"XL"}>
              XL
            </button>
            <button onClick={clickHandler} value={"XXL"}>
              XXL
            </button>
          </div>
        </div>
      </div>
      <div className="add-product-item-field-upload-image">
        <div className="cover-image">
          <p>Select Cover Image</p>
          <label htmlFor="file-input">
            <img
              src={image ? URL.createObjectURL(image) : upload_area}
              className="add-product-thumbnail-image"
            />
          </label>
          <input
            onChange={imageHandler}
            type="file"
            name="image"
            id="file-input"
            accept="image/*"
            hidden
          />
        </div>
        <div className="multiple-image">
          <p>Select Showcase Image</p>
          <div className="show-image-name">
            <label htmlFor="files">
              {multipleImage.length != 0 ? (
                multipleImage.map((img) => (
                  <p key={img.lastModified}>{img.name}</p>
                ))
              ) : (
                <img
                  src={upload_area}
                  className="add-product-thumbnail-image"
                />
              )}
            </label>
          </div>
          <input
            onChange={multipleImageHandler}
            type="file"
            name="image"
            id="files"
            accept="image/*"
            multiple
            hidden
          />
        </div>
      </div>
      {loading ? (
        <button className={"add-product-btn loading"}>
          <svg>
            <circle cx={15} cy={15} r={10}></circle>
          </svg>
          Upload
        </button>
      ) : (
        <button onClick={addProduct} className={"add-product-btn"}>
          ADD
        </button>
      )}
    </div>
  );
}
