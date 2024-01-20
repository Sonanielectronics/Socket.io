const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors({
    origin: '*'
}));

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});

require("./db/conn");

var MessageSchema = new mongoose.Schema({
    Sender: {
      type: String,
    },
    Message: {
      type: String,
    }
  });
  
  var Todo = mongoose.model("MessageCollection", MessageSchema);

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('sendMessage', async (messageContent) => {
        
        let data = new Todo({
            Message:messageContent.text
        })

        try {
            await data.save();
            io.emit('message', messageContent); // Broadcast the message to all connected clients
        } catch (error) {
            console.error('Error saving message to MongoDB:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
