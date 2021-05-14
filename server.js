const path = require('path');
const http = require ('http');
const express = require('express');
const socketio = require ('socket.io')
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname,'public')));

const botName= 'ChatBot';

io.on('connection', socket =>{

    //Mensaje solo al usuario que se conecta
    socket.emit('message',formatMessage( botName, 'Welcome to chat'));
    
    //Mensaje a todos los clientes o usuario, excepto el que se esta conectando en el momento
    socket.broadcast.emit('message', formatMessage(botName,'Un usuario se ha conectado al chat'));


    socket.on('chatMessage', msg =>{
        console.log(msg);
        
        //Meensaje a todos los usuarios conectados en el socket
        io.emit('message', formatMessage('User', msg));
    });

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));