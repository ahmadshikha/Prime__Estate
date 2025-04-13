import { Link, useLoaderData } from "react-router-dom";
import {  useContext, useState } from "react";
import axios from "axios";
import "./card.scss";
import { AuthContext } from "../../context/AuthContext";

function Card({ item }) {
const {currentUser}=useContext(AuthContext)
  const [saved,setSaved]=useState(item.isSaved)
  

  const handleSave = async () => {
    try {
      
      if(saved){
        alert("Dont saved post ")

      }
      else{
        alert("post is saved")

      }
      const response = await axios.post(
        'http://localhost:8800/api/users/save',
        { postId: item._id }, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
  
      console.log('Save response:', response.data);
      setSaved(response.data.saved);
    } catch (err) {
      console.error("Full error details:", {
        message: err.message,
        response: err.response?.data,
        code: err.code
      });
      alert(err.response?.data?.message || "Failed to save item");
    }
  };


  return (  
    <div className="card">
      <Link to={`/${item._id}`} className="imageContainer">
        <img src={item.images[0]||"/noavatar.jpg"} alt="" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item._id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
        </p>
        <p className="price">$ {item.price}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.bedroom} bedroom</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroom} bathroom</span>
            </div>
          </div>
          <div className="icons">
            <div className="icon">
           <button onClick={handleSave}>
            <img src="/save.png" alt="" />
            </button>
            </div>
            <div className="icon">
              <img src="/chat.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
