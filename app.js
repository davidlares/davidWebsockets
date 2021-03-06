const express = require('express');
const ws = require('ws').Server;
const port = process.env.PORT || 3000;

// HTTP
// express instance
const app = express();
// static files
app.use(express.static('scripts'));
// view engine
app.set('view engine', 'pug');
// views
app.set('views', './views');

// get instance
app.get('/', (req,res) => {
  res.render('index');
});

// Websockets
const server = new ws({port: 5000, server: app});

server.on('connection', (ws) => {
  // receiving messages
  ws.on('message', (message) => {
    // parsing the message -> client
    message = JSON.parse(message);
    // first handshake
    if(message.type == 'name'){
      ws.personName = message.data;
      return;
    }
    // broadcasting
    server.clients.forEach((client) => {
      client.send(JSON.stringify({ name: ws.personName, data: message.data}));
    });
  });
  // leaving socket (or refreshing website)
  ws.on('close', () => {
    console.log(`I lost a client`);
  })
  console.log(`client connected`);
});

app.listen(port, () => console.log(`on port ${port}`));
