// src/App.jsx
import React, { useContext, useEffect, useState } from 'react';
import CardComponent from '../../components/card/Card';
import axios from 'axios';
import apiRequest from '../../lib/apiRequest';
import { AuthContext } from '../../context/AuthContext';
import './postUser.css'

const postUser = () => {
  const [posts, setPosts] = useState([]);
  const [savedposts, setsavedPosts] = useState([]);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`http://localhost:8800/api/posts/get/${currentUser.id}`)
      .then((response) => {
        setPosts(response.data.posts);
        console.log(response.data.posts);
      }) 
      
      
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });
  }, [currentUser.id]);

  return (
    <div className="postUser">
      <h1 style={{
        fontSize: '2.5rem',
        color: '#333',
        textAlign: 'center',
        marginBottom: '20px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        backgroundColor: '#f8f9fa',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}>
        My Posts
      </h1>
      <div className="posts-container">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <CardComponent key={post._id} item={post} />
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default postUser;