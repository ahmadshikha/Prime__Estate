import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

let onlineUsers = []; 

const addUser = (userId, socketId) => {
  const userExists = onlineUsers.find((user) => user.userId === userId);
  if (!userExists) {
    onlineUsers.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    console.log("Online users:", onlineUsers); // Debugging
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit("getMessage", data); // Fixed: socket.id → socketId
    } else {
      console.log(`Receiver ${receiverId} not found or offline`);
     
    }
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("A user disconnected:", socket.id);
  });
});

io.listen(4000, () => {
  console.log("Socket.IO server running on port 4000");
});