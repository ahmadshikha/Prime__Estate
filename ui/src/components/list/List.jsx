import './list.scss';
import Card from "../card/Card";
import { useState, useEffect } from 'react'; 
import axios from 'axios';

function List() {
  const [posts, setPosts] = useState([]); 
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8800/api/posts/');
        setPosts(response.data); 
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []); 

  return (
    <div className='list'>
      {posts.length > 0 ? ( 
        posts.map((item) => (
          <Card key={item._id} item={item} />
        ))
      ) : (
        <p>No posts found.</p> 
      )}
    </div>
  );
}

export default List;