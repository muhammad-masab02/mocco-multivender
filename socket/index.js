import { Server } from "socket.io";
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(cors());

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
// Initialize Socket.IO server with CORS configuration
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

app.get("/", (req, res) => {
    res.send("Socket server is running");
});

const messages = {}; // Object to store messages
const users = []; // Array to store connected users [{ userId, socketId }]

// add user
const addUser = (userId, socketId) => {
    if (!userId) return;
    const existingUser = users.find((user) => String(user.userId) === String(userId));
    if (existingUser) {
        existingUser.socketId = socketId;
    } else {
        users.push({ userId, socketId });
    }
};

// remove user
const removeUser = (socketId) => {
    const index = users.findIndex((user) => user.socketId === socketId);
    if (index !== -1) {
        users.splice(index, 1);
    }
};

// get user
const getUser = (userId) => {
    return users.find((user) => String(user.userId) === String(userId));
};

// define message object
const createMessage = ({ senderId, receiverId, text, conversationId, createdAt, _id }) => ({
    _id: _id || Date.now().toString(),
    senderId,
    sender: senderId,
    receiverId,
    conversationId,
    text,
    // images,
    createdAt: createdAt || new Date().toISOString(),
    seen: false,
});

// Handle Socket.IO connections
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Take userId from the client and add the user to the users array
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", users); // Emit updated list of connected users
    });

    // Handle sending messages
    socket.on("sendMessage", ({ senderId, receiverId, text, conversationId, createdAt, _id }) => {
        const message = createMessage({ senderId, receiverId, text, conversationId, createdAt, _id });

        const targetUser = getUser(receiverId);

        if (targetUser) {
            io.to(targetUser.socketId).emit("getMessage", message);
        }
    });

    // Handle marking messages as seen
    socket.on("markAsSeen", ({ senderId, receiverId, messageId }) => {
        const user = getUser(senderId);

        if (user && messages[senderId]) {
            const message = messages[senderId].find(
                (msg) => msg.receiverId === receiverId && msg.id === messageId
            );

            if (message) {
                message.seen = true;
                io.to(user.socketId).emit("messageSeen", {
                    senderId, receiverId, messageId
                });
            }
        }
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});

server.listen(PORT, () => {
    console.log(`Socket server is running on port ${PORT}`);
});