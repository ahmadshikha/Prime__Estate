import { useContext, useRef, useState, useEffect } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { format } from 'timeago.js';
import { SocketContext } from "../../context/SocketContext";
import { FiSend } from "react-icons/fi"; // أيقونة إرسال بسيطة

import { FaPaperPlane } from "react-icons/fa";
import { useNotificationStore } from "../../lib/notificationStore";

function Chat({ chats }) {
  const [chat, setChat] = useState(null);
  const { currentUser, token } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const messageEndRef = useRef();
  const decrease = useNotificationStore((state) => state.decrease);

  useEffect(() => {
    const markAsRead = async (chatId) => {
      try {
        await axios.put(
          `http://localhost:8800/api/chats/read/${chatId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
      } catch (err) {
        console.error("Error marking as read:", err);
      }
    };

    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat._id === data.chatId) {
          setChat((prev) => ({
            ...prev,
            messages: [...prev.messages, data],
          }));
          markAsRead(chat._id);
        }
      });
    }

    return () => {
      if (socket) socket.off("getMessage");
    };
  }, [socket, chat, token]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value.trim();
    if (!text || !chat) return;
  
    // 1. إنشاء رسالة مؤقتة
    const tempMessage = {
      _id: Date.now().toString(),
      text,
      userId: { _id: currentUser._id }, // استخدم `_id` وليس `id`
      createdAt: new Date(),
    };
  
    // 2. تحديث الواجهة فورًا
    setChat((prev) => ({
      ...prev,
      messages: [...prev.messages, tempMessage],
    }));
  
    e.target.reset();
  
    try {
      // 3. إرسال الرسالة للخادم
      const res = await axios.post(
        `http://localhost:8800/api/messages/${chat._id}`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
  
      // 4. استبدال الرسالة المؤقتة بالحقيقية
      setChat((prev) => ({
        ...prev,
        messages: prev.messages.map((msg) =>
          msg._id === tempMessage._id ? res.data : msg
        ),
      }));
  
     
      socket.emit("sendMessage", {
        receiverId: chat.receiver._id,
        data: {
          ...res.data,
          chatId: chat._id, 
        },
      });
    } catch (err) {
      setChat((prev) => ({
        ...prev,
        messages: prev.messages.filter((msg) => msg._id !== tempMessage._id),
      }));
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await axios.get(`http://localhost:8800/api/chats/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease();
      }
      setChat({ ...res.data, receiver });
    } catch (err) {
      console.error("Error opening chat:", err);
    }
  };

  return (
    <div className="chat">
      <div className="messages">
        <h1>Messages</h1>
        {chats?.map((c) => (
          <div
            className="message"
            key={c._id}
            style={{
              backgroundColor:
                c.seenBy.includes(currentUser._id) || chat?._id === c._id
                  ? "white"
                  : "#fecd514e",
            }}
            onClick={() => handleOpenChat(c._id, c.receiver)}
          >
            <img src={c.receiver.avatar || "/noavatar.jpg"} alt="" />
            <span>{c.receiver.username}</span>
            <p>{c.lastMessage}</p>
          </div>
        ))}
      </div>

      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img src={chat.receiver.avatar || "/noavatar.jpg"} alt="" />
              <span>{chat.receiver.username}</span>
            </div>
            <span className="close" onClick={() => setChat(null)}>
              X
            </span>
          </div>

          <div className="center">
            {chat.messages.map((message) => (
              <div
                className="chatMessage"
                style={{
                  alignSelf:
                    message.userId._id === currentUser.id
                      ? "flex-start"
                      : "flex-end",
                  textAlign:
                    message.userId._id === currentUser.id ? "right" : "left",
                  backgroundColor:
                    message.userId._id === currentUser.id
                      ? "#A5D6A750"
                      : "#white",
                  borderRadius: "12px",
                  padding: "8px 12px",
                  margin: "4px 0",
                  maxWidth: "70%",
                }}
                key={message._id}
              >
                <p>{message.text}</p>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text" placeholder="Type a message..." />
            <button type="submit" className="send-button">
  <FaPaperPlane className="send-icon" />

</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;