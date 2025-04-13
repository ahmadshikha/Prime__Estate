import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import { AuthContext } from "../../context/AuthContext";
import axios from 'axios';
import { Suspense, useContext, useState,useEffect } from "react";
import { useNavigate,Link, Await, useLoaderData } from "react-router-dom";

function ProfilePage() {
const {currentUser,token,logout} = useContext(AuthContext)
const navigate=useNavigate()
const data=useLoaderData()





  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8800/api/auth/Logout', {}); // No need for withCredentials
      logout()
        console.log('logged out succefuly');
       navigate('/')

    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to='/updateProfile'>
            <button >Update Profile</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img
                src={currentUser.avatar||"/noavatar.jpg"}
                alt=""
              />
            </span>
            <span>
              Username: <b>{currentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            <button onClick={handleLogout}>Logout</button>
           
            <Link to='/savedPost'>
            <button>My SavedPost</button>
            
            </Link>
          </div>
          <div className="title">
            <h1>My List</h1>
            <Link to='/newPostPage'>
            <button>Create New Post</button>
            </Link>
          </div>
          <List />
      
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
        <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.chatResponse}
              errorElement={<p>Error loading chats!</p>}
            >
              {(chatResponse) => <Chat chats={chatResponse.data}/>}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
