import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { singlePostData, userData } from "../../lib/dummydata";
import { Navigate, redirect, useLoaderData } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState } from "react";
import DOMPurify from 'dompurify'
import axios from "axios";
function SinglePage() {
  const post =useLoaderData()
  console.log(post);
  
  const {token,currentUser}=useContext(AuthContext);
  const [saved,setSaved]=useState(post.isSaved)
  

  const handleSave = async () => {
    try {
      console.log('Attempting to save post:', post._id); 
      console.log('user Id:', currentUser.id); 
      
      const response = await axios.post(
        'http://localhost:8800/api/users/save',
        { postId: post._id }, 
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
      alert(err.response?.data?.message || "Failed to save post");
    }
  };
  

  const handlesendmessage=async ()=>{
    console.log(post.userId);
    
    try{
    const response = await axios.post('http://localhost:8800/api/chats/',
      {receiverId:post.userId}, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }

    );
  console.log(response);
  Navigate('/profile')
  
  }
    catch(err){
      console.log(err.message);
      
    }
  }
  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">$ {post.price}</div>
              </div>
              <div className="user">
                <img src={currentUser.avatar} alt="" />
                <span>{currentUser.username}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                {post.postDetail.utilities === "owner" ? (
                  <p>Owner is responsible</p>
                ) : (
                  <p>Tenant is responsible</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                {post.postDetail.pet === "allowed" ? (
                  <p>Pets Allowed</p>
                ) : (
                  <p>Pets not Allowed</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{post.postDetail.income}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail.size} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} bathroom</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>
                  {post.postDetail.school > 999
                    ? post.postDetail.school / 1000 + "km"
                    : post.postDetail.school + "m"}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{post.postDetail.bus}m away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{post.postDetail.restaurant}m away</p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            <button onClick={handlesendmessage}>
              <img src="/chat.png" alt="" />
              Send a Message
            </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: saved ? "#fece51" : "white",
              }}
            > 
              <img src="/save.png" alt="" />
              {saved ? "Place Saved" : "Save the Place"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
