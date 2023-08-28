import express from "express";
import fs from "fs";
import https from "https";
import {Server} from "socket.io";


const PORT = 9001
const CLIENT_URL = "https://localhost:3000"
const app = express()
const key = fs.readFileSync('../../cert/CA/localhost/localhost.decrypted.key');
const cert = fs.readFileSync('../../cert/CA/localhost/localhost.crt');
const server = https.createServer({key, cert}, app);

const io = new Server(server, {
    cors: {
        origin: CLIENT_URL
    }
});


let users = [];
const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push({userId, socketId});
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find((user) => user.userId === userId)
}

io.on("connection", (socket) => {
    socket.on("connectUser", async (userId) => {
        addUser(userId, socket.id);
        await socket.join(userId.toString());
    })

    socket.on("addUser", async (query) => {
        await socket.join((query.chatroomId).toString())
        io.emit("getUsers", socket.rooms)
    })

    socket.on("disconnect", () => {
        removeUser(socket.id)
    })

    socket.on("sendMessage", async({chatroomId, self, text, images, users}) => {
        let users_id = [];
        let self_user = '';
        for (const user of users) {
            if (user.user_id !== self) {
                users_id.push(user.user_id);
            } else {
                self_user = user.user_id;
            }
        }

       socket.to(chatroomId).emit("getMessage", {
           text, images
       });
        users_id.map((id, i) => {
            socket.to(id).emit("receiveNotification", {});
            socket.to([id, self_user]).emit("updateMessageBar", {});

        })
    })
})

server.listen(PORT, () => {
    console.log("socket listening on port", PORT);
})