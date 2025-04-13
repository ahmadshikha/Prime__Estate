import { defer } from "react-router-dom";
import axios from "axios";

export const singlePageLoader = async ({ request, params }) => {
console.log("loader");

  const res = await axios.get("http://localhost:8800/api/posts/" + params.id);
  
  return res.data;
};
export const listPageLoader = async ({ request, params }) => {
 
  
  const query = request.url.split("?")[1];
  console.log(query);
  
  const postPromise = await axios.get("http://localhost:8800/api/posts?" + query);
    console.log(postPromise)
  return defer({
    postResponse: postPromise,
  });
};

export const profilePageLoader = async () => {
  const token = localStorage.getItem("token");
  const chatPromise = axios.get("http://localhost:8800/api/chats",{
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',

    },
    withCredentials:true,
  
  });
 
  
  return defer({
    chatResponse: chatPromise,
  });
};
