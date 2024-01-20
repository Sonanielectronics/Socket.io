const express = require("express");
const app = express();

require("./db/conn");
const router = require('./router/router');

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const server = http.createServer(app);
const io = socketIO(server);

var { Todo, Todo2, Todo3, Todo4, Todo5, Todo6 } = require("./model/schema");

app.use(express.static(path.join(__dirname, "..")));

// app.use(express.static(path.join(__dirname, 'public')));

// var ejs = require("ejs");
// var ejs_folder_path = path.join(__dirname, "../templates");
// app.set("view engine", "ejs");
// app.set("views", ejs_folder_path);

require('dotenv').config();

const port = process.env.PORT || 3500;

io.on('connection', async (socket) => {

    console.log('A user connected');

    const user = {
        id: socket.id,
        connectedAt: new Date(),
    };

    socket.emit('user id', socket.id);

    socket.on('chat message', async (msg) => {
        io.emit('chat message', `${socket.id}: ${msg}`);

        let data = new Todo6({
            Sender: socket.id,
            Message: msg,
        })
        await data.save();

    });

    socket.on('disconnect', () => {

        console.log('User disconnected');

        //   db.collection('users').updateOne(
        //     { id: socket.id },
        //     { $set: { disconnectedAt: new Date() } },
        //     (err) => {
        //       if (err) {
        //         console.error('Error storing user disconnection data:', err);
        //       }
        //     }
        //   );

    });
});

app.use('/', router);

server.listen(port, () => {
    console.log(`Server running at ` + port);
});