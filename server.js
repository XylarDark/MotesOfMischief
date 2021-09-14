var server = require('http').createServer();
var options = {
  cors: true
}

var io = require('socket.io')(server, options);

io.sockets.on('connection', function(socket) {
    console.log("Client has connected!");
});

console.log ('Server started.');
server.listen(3000);

socket.on ('playerJoined', function (name) {
  console.log (name);
});

socket.on ('positionUpdate', function (data) {
  players[data.id].x = data.x;
  players[data.id].y = data.y;
  players[data.id].z = data.z;

  socket.broadcast.emit ('playerMoved', data);
});