const chatForm = document.getElementById('chat-form')
// Constante que toma el estilo del elemento de mi document
const chatMessage = document.querySelector('.chat-messages')
const roomName = document.getElementById('room-name')
const userList = document. getElementById('users');

// Obteniendo username y room del URL
const {username,room} = Qs.parse(location.search,{
  ignoreQueryPrefix: true
});

const socket = io();

//Unirse a la sala
socket.emit('joinRoom', {username, room, users});


socket.on('roomUsers', ({room, users}) =>{
  outputRoomName(room);
  outputUsers(users);
})

socket.on('message', message =>{
  //console.log(message);
  outputMessage(message);

  //Top del scroll
  chatMessage.scrollTop = chatMessage.scrollHeight;
});

chatForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  
  //obteniendo el valor o texto del input
  const msg = e.target.elements.msg.value

  socket.emit('chatMessage', msg)

  //limpiar input y mantener el focus en el input
  e.target.elements.msg.value ='';
  e.target.elements.msg.focus();

  //console.log(msg)
})

function outputMessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML= `<p class= = "meta"> ${message.username} <span>${message.time}</span></p>
  <p class= "text">
    ${message.text}
  </p>`
  

  document.querySelector('.chat-messages').appendChild(div);
}

document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('¿Estas seguro que quieres salir?');

  if (leaveRoom) {
    window.location = '../index.html';
  }
});


//Agregar el nombre de la sala

function outputRoomName(room){
  roomName.innerHTML = room;
}

function outputUsers(users) {
  userList.innerHTML = `
   ${users.map(user => `<li>${user.username}</li>`).join('')}
  `;
}