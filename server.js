const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Bot rules
const botResponses = [
  { keywords: ["hello", "hi", "hey", "hai"], reply: "Hello. How can I help you today?" },
  { keywords: ["how are you", "what's up", "wassup"], reply: "I'm doing great, thank you. How about you?" },
  { keywords: ["bye", "goodbye", "see you"], reply: "Goodbye. Have a great day!" },
  { keywords: ["help", "assist", "support"], reply: "Sure! What do you need help with?" },
  { keywords: ["weather", "weather now", "current weather"], reply: "I can't check the weather right now, but you can look it up online 🌤️" },
  { keywords: ["your name", "who are you"], reply: "I'm your friendly chat bot 🤖, but you can call me whatever you like." },
  { keywords: ["thank", "thanks", "thank you"], reply: "You're welcome! 😊" },
  { keywords: ["cool", "nice", "great", "awesome"], reply: "Glad you think so! 😃" },
  { keywords: ["joke", "funny", "laugh"], reply: () => {
      const jokes = [
        "Why don't scientists trust atoms? Because they make up everything! 😂",
        "Why did the math book look sad? Because it had too many problems. 🤓",
        "Why don't programmers like nature? It has too many bugs! 🐛",
        "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾",
        "Why did the coffee file a police report? It got mugged! ☕",
        "Why did the bicycle fall over? Because it was two-tired! 🚲",
        "Why can't your nose be 12 inches long? Because then it would be a foot!"
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
  }},
  { keywords: ["age", "how old are you"], reply: "I don't have an age, I'm timeless! ⏳" },
  { keywords: ["favorite", "like"], reply: "I love chatting with you." }
];

// Get bot reply
function getBotReply(message) {
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.startsWith("my name is")) {
    const name = message.split(" ").slice(3).join(" ");
    if (name) return `That's a beautiful name, ${name.trim()}!`;
    return "Nice to meet you. What's your name?";
  }

  for (const entry of botResponses) {
    if (entry.keywords.some(k => lowerMsg.includes(k))) {
      return typeof entry.reply === "function" ? entry.reply() : entry.reply;
    }
  }

  const fallback = [
    "Sorry, I didn’t quite understand that.",
    "Hmm, can you rephrase that?",
    "I'm still learning... could you try again?",
    "Not sure I got that, but I’d love to help!",
    "Interesting! Tell me more..."
  ];
  return fallback[Math.floor(Math.random() * fallback.length)];
}

// Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (msg) => {
    // Broadcast user message to all clients
    io.emit('chat message', { text: msg, type: 'user' });

    // Typing indicator
    socket.emit('bot typing', true);

    const botReply = getBotReply(msg);
    if (botReply) {
      setTimeout(() => {
        socket.emit('bot typing', false);
        socket.emit('chat message', { text: botReply, type: 'bot' });
      }, 1000); // Bot delay for realism
    }
  });

  socket.on('disconnect', () => console.log('User disconnected'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
