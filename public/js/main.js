const chatForm = document.getElementById('chat-form')
// Constante que toma el estilo del elemento de mi document
const chatMessage = document.querySelector('.chat-messages')

const socket = io();

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