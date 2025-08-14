const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // broadcast user message

    const lowerMsg = msg.toLowerCase();

    if (lowerMsg.includes('weather')) {
      socket.emit('chat message', "Bot: I can't view the weather but you can search it up online.");
    } else if (lowerMsg.includes('hello')) {
      socket.emit('chat message', 'Bot: Hello! How can I help you today?');
    } else if (lowerMsg.includes('how are you')) {
      socket.emit('chat message', "Bot: I'm doing great, thank you!");
    } else if (lowerMsg.includes('bye')) {
      socket.emit('chat message', 'Bot: Goodbye! Have a great day!');
    } else {
      socket.emit('chat message', "Bot: Sorry, I didn't understand that.");
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

