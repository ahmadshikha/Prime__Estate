import bcryptjs from "bcryptjs";
import User from '../model/UserModel.js'
import SavedPost from '../model/SavedPostModel.js'
import Post from '../model/PostModel.js'
import Chat from '../model/ChatModel.js'

export const getUsers = async (req, res) => {
  try{

const Users=await User.find()
res.status(200).json(Users)

}
catch(err){
  console.log(err);
  res.status(400).json({message: err.message})
  
}
};

export const getUser = async (req, res) => {
  console.log("Test");
  
  const id=req.params.id

  try{
  const user=await User.findById(id)
  res.status(200).json(user)
    
  }
  catch(err){
    res.json({message: err.message})
    
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, ...inputs } = req.body;
  console.log(id)
  console.log(tokenUserId)

  if (id !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
  }

  let updatedPassword = null;
  try {
      if (password) {
          updatedPassword = await bcryptjs.hash(password, 10);
      }

      const updatedUser = await User.findByIdAndUpdate(
          id,
          {
              ...inputs,
              ...(updatedPassword && { password: updatedPassword }),
              ...(avatar && { avatar }),
          },
          { new: true }
      );

      if (!updatedUser) {
          return res.status(404).json({ message: "User not found!" });
      }

      const { password: userPassword, ...rest } = updatedUser;

      res.status(200).json({ message: "User updated successfully", user: rest,tokenUserId });
  } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to update user!" });
  }
}


export const deleteUser = async (req, res) => {
 const id=req.params.id;
 const tokenUserId=req.userId;
 if(id!==tokenUserId) 
 return res.status(403).json({ message: "User token Invalid"})
 try{
  const finduser= await User.findByIdAndDelete(id);
  res.status(200).json({ message: "User deleted successfully"})

 }
 catch(err){
  res.status(403).json({message:
    "Failed to delete user!"
  })
 }
};

export const savePost = async (req, res) => {
  const { postId } = req.body;
  const userId = req.userId;
  console.log("test savefun");
  
  try {
    const existing = await SavedPost.findOne({ userId, postId });
    
    if (existing) {
      await SavedPost.deleteOne({ _id: existing._id });
  console.log("test unsave");

      return res.json({ saved: false });
    } else {
      await SavedPost.create({ userId, postId });
  console.log("test save");

      return res.json({ saved: true });
    }
  } catch (err) {
    if (err.code === 11000) {
      console.log(err.message);
      
      return res.status(400).json({ message: "This post is already saved" });
    }
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;
  console.log("test prfilePost");
  
  try {
    const userPosts = await Post.find({ userId: tokenUserId });

    const saved = await SavedPost.find({ userId: tokenUserId }).populate('postId');

    const savedPosts = saved.map((item) => item.postId);

    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get profile posts!" });
  }
};


export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;
  console.log("test notification ");


  try {
    const number = await Chat.countDocuments({
      userIDs: tokenUserId,
      seenBy: { $nin: [tokenUserId] },
    });
    console.log("number");
    console.log(number);
    
    res.status(200).json(number);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get notification number!" });
  }
};