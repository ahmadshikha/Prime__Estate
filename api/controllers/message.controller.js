
import Chat from '../model/ChatModel.js'
import Message from '../model/MessageModel.js'



export const addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const text = req.body.text;

  try {
  
    const chat = await Chat.findOne({
      _id: chatId,
      userIDs: tokenUserId
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    const message = new Message({
      text,
      chatId,
      userId: tokenUserId
    });

    await message.save();

  

    const recipientIds = chat.userIDs.filter(id => !id.equals(tokenUserId));


    await Chat.findByIdAndUpdate(chatId, {
      $push: { messages: message._id }, 
      $pull: { seenBy: { $in: recipientIds } }, 
      lastMessage: text 
    });

    res.status(200).json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add message!" });
  }
};