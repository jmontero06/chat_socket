const path = require('path');
const express = require('express');
const http = require ('http');
const socketio = require ('socket.io')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname,'public')));

io.on('connection', socket =>{
    // mensage al usuario coenctado
    socket.emit('message','welcome to chat')

    // mensage para todos los clientes exepto el que se esta conectando
    socket.broadcast.emit('message','un usuario se ha conectado al chat')

    socket.on('chatMessage',msg=>{
        console.log(msg)

        // mensage a todos los usuarios conrctados
        io.emit('message',msg)
    })
 });

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));