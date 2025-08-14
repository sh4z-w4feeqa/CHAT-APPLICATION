const socket = io();

// Get DOM elements
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-btn');
const messageList = document.getElementById('messages');

// Send message when button is clicked
sendButton.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('chat message', message);
    messageInput.value = '';
  }
});

// Also send message on Enter key
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    sendButton.click();
  }
});

// Display incoming messages
socket.on('chat message', (msg) => {
  const li = document.createElement('li');
  li.textContent = msg;
  messageList.appendChild(li);
  messageList.scrollTop = messageList.scrollHeight;
});
