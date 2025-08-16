const socket = io();
const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');
const messages = document.getElementById('messages');
const typingIndicator = document.getElementById('typing-indicator');

form.addEventListener('submit', e => {
  e.preventDefault();
  const msg = input.value.trim();
  if(!msg) return;
  socket.emit('chat message', msg);
  input.value = '';
});

// Display messages
socket.on('chat message', data => addMessage(data.text, data.type));

// Typing indicator
socket.on('bot typing', status => typingIndicator.style.display = status ? 'block' : 'none');

function addMessage(msg, type) {
  const li = document.createElement('li');
  li.className = type;
  li.textContent = msg;
  messages.appendChild(li);
  messages.scrollTo({ top: messages.scrollHeight, behavior: 'smooth' });
}
