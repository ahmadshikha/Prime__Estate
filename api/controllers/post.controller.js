// import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import Post from '../model/PostModel.js'
import SavedPost from '../model/SavedPostModel.js'

export const getPosts = async (req, res) => {
  const query = req.query;
 
  
  

  try {
  
    const filter = {};

   
    if (query.city && query.city.trim() !== '') {
      filter.city = query.city;
    }
    if (query.type && query.type.trim() !== '') {
      filter.type = query.type;
    }
    if (query.property && query.property.trim() !== '') {
      filter.property = query.property;
    }
    if (query.bedroom && !isNaN(query.bedroom)) {
      filter.bedroom = parseInt(query.bedroom);
    }

    if (query.minPrice && !isNaN(query.minPrice)) {
      filter.price = filter.price || {};
      filter.price.$gte = parseInt(query.minPrice);
    } 
    if (query.maxPrice && !isNaN(query.maxPrice)) {
      filter.price = filter.price || {};
      filter.price.$lte = parseInt(query.maxPrice);
    }

    const posts = await Post.find(filter)


  
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err.message || err);
    res.status(500).json({ message: "Failed to get posts" });
  }
}

export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    // Find the post by ID and populate user and post details
    const post = await Post.findById(id)
      .populate('userId', 'username avatar') // Populate user details
      .populate('postDetail'); // Populate post details

    if (!post) {
      console.log("post not found");
      
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the post is saved by the authenticated user
    const token = req.cookies?.token;
    let isSaved = false;

    if (token) {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const saved = await SavedPost.findOne({
        postId: id,
        userId: payload.id,
      });
      isSaved = !!saved; // Convert to boolean
    }

    // Send the response
    res.status(200).json({message:"get post", ...post.toObject(), isSaved });
  } catch (err) {
    console.error("Error fetching post:", err.message || err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId; 

  console.log("Adding post with data:", body);

  try {
   
    // if (!body.postData || !body.postDetails) {
    //   return res.status(400).json({ message: "Missing post data or post details" });
    // }

   
    const newPost = await Post.create({
      ...body.postData,
      userId: tokenUserId, 
      postDetail: body.postDetail, 
    });


    console.log("New post created:", newPost);

  
    res.status(201).json({ newPost, message: "Post created successfully" });
  } catch (err) {
    console.error("Error creating post:", err.message || err); // Log the full error message
    res.status(500).json({ message: "Failed to add post?" });
  }
};
export const updatePost = async (req, res) => {

};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
    
  try {
    const post = await Post.findById(id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    if (post.userId.toString() !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }
  
    const existing = await SavedPost.findOne({
      postId: id,
      
    });
   
    if (!existing) {

   console.log("post unsave");
    }

    await post.deleteOne();
    await existing.deleteOne();
    

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

export const getPostsByUserId = async (req, res) => {
  const userId = req.params.userId; 
    console.log(userId);
    
  try {
    const posts = await Post.find({ userId })
      .populate('userId', 'username avatar') 
      .populate('postDetail'); 
    console.log(posts);
    
    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "لم يتم العثور على أي بوستات لهذا المستخدم" });
    }

    res.status(200).json({ message: "تم جلب البوستات بنجاح", posts });
  } catch (err) {
    console.error("حدث خطأ أثناء جلب البوستات:", err.message || err);
    res.status(500).json({ message: "فشل في جلب البوستات" });
  }
};
