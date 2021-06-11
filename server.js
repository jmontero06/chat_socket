const path = require('path');
const http = require ('http');
const express = require('express');
const socketio = require ('socket.io')
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname,'public')));

const botName= 'Chatbot';

io.on('connection', socket =>{

    socket.on('joinRoom',({username, room}) =>{
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)
        //Mensaje solo al usuario que se conecta
        socket.emit('message',formatMessage( botName, 'Welcome to chat'));
            
        //Mensaje a todos los clientes o usuario, excepto el que se esta conectando en el momento
        socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} se ha conectado al chat`));

        socket.broadcast.to(user.room).emit('message', formatMessage(botName,`los usuarios conectados son: ${JSON.stringify(getRoomUsers(user.room))}`))

        //Mandar usuarios y sala
        io.to(user.room).emit('roomUsers',{room:user.room, users: getRoomUsers(user.room)});

    });
    socket.on('chatMessage', msg =>{
        const user = getCurrentUser(socket.id);
       
        console.log(msg);
        
        //Meensaje a todos los usuarios conectados en el socket
        io.to(user.room).emit('message', formatMessage(`${user.username}`, msg));
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
    
        if (user) {
          io.to(user.room).emit('message', formatMessage(botName, `${user.username} ha salido del chat`));
    
         //Mandar usuarios y sala
          io.to(user.room).emit('roomUsers', { room: user.room, users: getRoomUsers(user.room)});

        }
      });

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));