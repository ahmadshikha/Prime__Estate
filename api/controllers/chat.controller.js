import Chat from '../model/ChatModel.js'
import Message from '../model/MessageModel.js'
import User from '../model/UserModel.js'

// export const getChats = async (req, res) => {
//  const tokenUserid=req.userId
//   try{
//     const chats=await Chat.findOne({userIDs:tokenUserid})

//     for(const chat of chats){
//       const resiverId=chat.userIDs.find((id)=>{
//         id!==tokenUserid
//       })
//       const resiver=await Chat.findOne(resiverId,"id username avatar")
//       chat.resiver=resiver;

//     }
//     res.status(200).json(chats)

//   }
//   catch(err){
//     console.log(err);
//     res.json({message: err.message});
    
//   }
  
// };

// export const getChat = async (req, res) => {
//   const tokenUserId = req.userId;

//   try {
//     // const chat = await prisma.chat.findUnique({
//     //   where: {
//     //     id: req.params.id,
//     //     userIDs: {
//     //       hasSome: [tokenUserId],
//     //     },
//     //   },
//     //   include: {
//     //     messages: {
//     //       orderBy: {
//     //         createdAt: "asc",
//     //       },
//     //     },
//     //   },
//     // });

//     // await prisma.chat.update({
//     //   where: {
//     //     id: req.params.id,
//     //   },
//     //   data: {
//     //     seenBy: {
//     //       push: [tokenUserId],
//     //     },
//     //   },
//     // });
//     res.status(200).json(chat);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get chat!" });
//   }
// };

// export const addChat = async (req, res) => {
//   const tokenUserId = req.userId;
//   try {
//     // const newChat = await prisma.chat.create({
//     //   data: {
//     //     userIDs: [tokenUserId, req.body.receiverId],
//     //   },
//     // });
//     res.status(200).json(newChat);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to add chat!" });
//   }
// };

// export const readChat = async (req, res) => {
//   const tokenUserId = req.userId;

  
//   try {
//     // const chat = await prisma.chat.update({
//     //   where: {
//     //     id: req.params.id,
//     //     userIDs: {
//     //       hasSome: [tokenUserId],
//     //     },
//     //   },
//     //   data: {
//     //     seenBy: {
//     //       set: [tokenUserId],
//     //     },
//     //   },
//     // });
//     res.status(200).json(chat);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to read chat!" });
//   }
// };









export const getChats = async (req, res) => {
  // 6782a99e068a87b9984f60d8
  // Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ODJhOTllMDY4YTg3Yjk5ODRmNjBkOCIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3MzY2NzQzMDUsImV4cCI6MjM0MTQ3NDMwNX0.gmnwUz_Ex1Xs_mVuRbNNK4ALKgsNK3yS9xvRnDiH2Co
  // Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZGRkYzZlYWY4NjM1ZDE4OTMzN2QzNiIsImlhdCI6MTc0MjgyMzcxNSwiZXhwIjoxNzQzNDI4NTE1fQ.qnbWsc3nIDQARA8O3f26o3S3M-tjqVD3iNKYwAcStwA
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZGRkYzZlYWY4NjM1ZDE4OTMzN2QzNiIsImlhdCI6MTc0MzkzNjI5OSwiZXhwIjoxNzQ0NTQxMDk5fQ.EpR6OtkuAwOn3dOelCFu2SxqJEGn8-gbyNkNPHHLHtU
  const tokenUserId = req.userId;
  console.log(tokenUserId);
  
  console.log("test chat")
  if(!tokenUserId){
    console.log("dont have token")
  }
  try {
    const chats = await Chat.find({ userIDs: tokenUserId })
      .sort({ createdAt: -1 })
      .lean(); 

    const chatsWithReceiver = await Promise.all(chats.map(async (chat) => {
      const receiverId = chat.userIDs.find(id => id.toString() !== tokenUserId.toString());
      
      if (!receiverId) {
        return chat; 
      }

      const receiver = await User.findById(receiverId, 'id username avatar');
      return {
        ...chat,
        receiver
      };
    }));
    console.log(chatsWithReceiver);
    

    res.status(200).json(chatsWithReceiver);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;

  try {
    const chat = await Chat.findOne({
      _id: chatId,
      userIDs: tokenUserId
    }).populate({
      path: 'messages', 
      options: { sort: { createdAt: 1 } },
      populate: {
        path: 'userId', 
        select: 'username avatar'
      }
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    await Chat.findByIdAndUpdate(chatId, {
      $addToSet: { seenBy: tokenUserId }
    });

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const { receiverId } = req.body;

  try {
    const existingChat = await Chat.findOne({
      userIDs: { $all: [tokenUserId, receiverId], $size: 2 }
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const newChat = new Chat({
      userIDs: [tokenUserId, receiverId]
    });
    await newChat.save();

    res.status(200).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.id;

  try {
    const chat = await Chat.findOneAndUpdate(
      {
        _id: chatId,
        userIDs: tokenUserId
      },
      {
        $addToSet: { seenBy: tokenUserId } 
      },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};















// const Message = require('../models/Message');
// const Chat = require('../models/Chat');

// export const addMessage = async (req, res) => {
//   const tokenUserId = req.userId;
//   const chatId = req.params.chatId;
//   const text = req.body.text;

//   try {
//     // Check if chat exists and user is part of it
//     const chat = await Chat.findOne({
//       _id: chatId,
//       userIDs: tokenUserId
//     });

//     if (!chat) {
//       return res.status(404).json({ message: "Chat not found!" });
//     }

//     // Create new message
//     const message = new Message({
//       text,
//       chatId,
//       userId: tokenUserId
//     });
//     await message.save();

//     // Update chat with last message and seen status
//     await Chat.findByIdAndUpdate(chatId, {
//       $addToSet: { seenBy: tokenUserId }, // Add user to seenBy array if not already present
//       lastMessage: text
//     });

//     res.status(200).json(message);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to add message!" });
//   }
// };
