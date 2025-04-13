import React, { useContext, useEffect, useState } from 'react';
import CardComponent from '../../components/card/Card';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './savedPost.css';

const SavedPost = () => {
  const [posts, setPosts] = useState([]);
  const [myposts, setmyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          'http://localhost:8800/api/users/profilePosts',
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setPosts(response.data.savedPosts);
        setmyPosts(response.data.userPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError(error.message);
        
        if (error.response?.status === 403) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.id && token) {
      fetchSavedPosts();
    }
  }, [currentUser?.id, token, navigate]);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="saved-posts-layout">
      <div className="posts-grid">
        <div className="posts-column">
          <h1 className="saved-posts-header">My Saved Posts</h1>
          <div className="posts-container">
            {posts?.length > 0 ? (
              posts.map((post) => (
                <CardComponent key={post._id} item={post} />
              ))
            ) : (
              <p className="no-posts-message">No saved posts found.</p>
            )}
          </div>
        </div>

        <div className="posts-column">
          <h1 className="saved-posts-header">My Posts</h1>
          <div className="posts-container">
            {myposts?.length > 0 ? (
              myposts.map((post) => (
                <CardComponent  item={post} />
              ))
            ) : (
              <p className="no-posts-message">No posts found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedPost;