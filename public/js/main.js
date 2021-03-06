const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const roomUsers = document.getElementById('users');
//Get username and room from url..

const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix:true
});

const socket = io();

//Join chatroom

socket.emit('joinRoom', {username, room});
//Get room and users
socket.on('roomUsers', ({room, users})=>{
  outputRoomName(room);
  outputUsers(users);
})



// Join chatroom
socket.on('message', message =>{
  console.log(message);
  outputMessage(message);
  //Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', e=>{
  e.preventDefault();

  const msg = e.target.elements.msg.value;
  socket.emit('chatMessage', msg);

  //clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();

});

//Output message 
function outputMessage(message){
  const div =document.createElement('div');

  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">${message.text}</p>`;
  document.querySelector('.chat-messages').appendChild(div);
}
// Add room name to DOM

function outputRoomName(room){
  roomName.innerText = room;
}
//
function outputUsers(users){
  roomUsers.innerHTML = `
  ${users.map(user => `<li> ${user.username}</li>`).join('')}
  `
}