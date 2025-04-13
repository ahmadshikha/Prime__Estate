import HomePage from "./routes/homePage/homePage";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ListPage from "./routes/listPage/listPage";
import Layout from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
import NewPostPage from "./routes/newPostPage/newPostPage";
import GetPostUser from './routes/postUser/postUser'
import SavedPost from './routes/SavedPost/savedPost'
import axios from 'axios'; 
import { singlePageLoader,listPageLoader,profilePageLoader } from "./lib/loaders";

axios.defaults.withCredentials = true;
function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children:[
        {
          path:"/",
          element:<HomePage/>
        },
        {
          path:"/list",
          element:<ListPage/>,
          loader: listPageLoader,
        },
        {
          path:"/:id",
          element:<SinglePage/>,
          loader:singlePageLoader
        },
        {
          path:"/profile",
          element:<ProfilePage/>,
          loader:profilePageLoader
            
        },
        {
          path:"/login",
          element:<Login/>
        },
        {
          path:"/register",
          element:<Register/>
        },
        {
          path:"/updateProfile",
          element:<ProfileUpdatePage/>
        
        },
        {
          path:"/GetPostUser",
          element:<GetPostUser/>
        
        },
         {
          path:"/savedPost",
          element:<SavedPost/>
        
        },
        {
          path:"/newPostPage",
          element:<NewPostPage/>
        
        }
      ]
    }
  ]);

  return (
    
    <RouterProvider router={router}/>
  );
}

export default App;
