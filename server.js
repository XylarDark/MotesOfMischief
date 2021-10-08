var server = require("http").createServer();
var options = {
  cors: true
};
var io = require("socket.io")(server, options);

var players = {};
var motes = {};
var graveyard = {};
var lobbies = {};

const ShortUniqueId = require("short-unique-id");

function Player(id, host, name) {
  this.id = id;
  //boolean
  this.host = host;
  this.name = name;
  this.type = null;
  this.entity = null;
  this.ready = null;
}
function Motes(playerId, motes) {
  this.id = playerId;
  this.motes = motes;
  this.entity = null;
}
function Lobby(id, hostId, lobby) {
  this.id = id;
  this.hostId = hostId;
  this.lobby = lobby;
}
io.on("connection", function(socket) {
  socket.on("createLobby", (callback) => {    
    const newid = new ShortUniqueId({ length: 6 });
    const newname = new ShortUniqueId({ length: 4 });
    var lobbyId = newid();
    var name = newname();
    
    socket.join(lobbyId);
    
    var lobby = {};
    var hostId = socket.id;
    var isHost = true;
    var hostPlayer = new Player(hostId, isHost, name);
    
    lobby[hostId] = hostPlayer;
    
    var newLobby = new Lobby(lobbyId, hostId, lobby);
    lobbies[lobbyId] = newLobby;
    
    callback({
      id: lobbyId,
      lobby: lobby,
      hostId: hostId      
    });

  });
  socket.on("joinLobby", (data,callback) => {
    var playerId = socket.id;
    var isHost = false;
    const newname = new ShortUniqueId({ length: 4 });
    var name = newname();

    var player = new Player(playerId, isHost, name);
    var lobbyId = data.lobbyId;
    const rooms = io.of("/").adapter.rooms;
    
    if (rooms.has(lobbyId)) {   
      if (rooms.get(lobbyId).size < 6) {
        socket.join(lobbyId);
        lobbies[lobbyId].lobby[playerId] = player;

        callback({
          joinlobbystatus: "success",
          message: playerId + " Joined lobby.",
          lobby: lobbies[lobbyId].lobby,
          id: playerId
        });
        io.to(lobbyId).emit("playerJoined", { player: player });
      }
      else{
         callback({
          joinlobbystatus: "fail",
          message: " Failed to Join lobby."
        });       
      }
    }
  });
  socket.on("startGame",function(data){
    var lobbyId = data.lobbyId;
    var lobby = lobbies[lobbyId];
    const rooms = io.of("/").adapter.rooms;
    if (rooms.has(lobbyId)) {
      io.to(lobbyId).emit("startGame",{lobby:lobby});
    }
  });  
  socket.on("playerReady",function(data){
    var lobbyId = data.lobbyId;
    var id = data.id;
    const rooms = io.of("/").adapter.rooms;
    if (rooms.has(lobbyId)) {
      lobbies[lobbyId].lobby[id].ready = true;
      io.to(lobbyId).emit("playerReady",{id:id});
    }
  });
  socket.on("playerNotReady",function(data){
    var lobbyId = data.lobbyId;
    var id = data.id;
    const rooms = io.of("/").adapter.rooms;
    if (rooms.has(lobbyId)) {
      lobbies[lobbyId].lobby[id].ready = false;
      io.to(lobbyId).emit("playerNotReady",{id:id});
    }
  });  
  socket.on("destroyLobby", function(data) {
    var lobbyId = data.lobbyId;
    var hostId = data.hostId;

    if (!lobbies[lobbyId]) return;
    delete lobbies[lobbyId];
    if (!players[socket.hostId]) return;
    socket.leave(lobbyId);
    delete players[socket.hostId];
  });
  socket.on("leaveLobby", function(data) {
    var lobbyId = data.lobbyId;
    var playerId = data.id;
    if (!lobbies[lobbyId]) return;

    delete lobbies[lobbyId].lobby[playerId];

    if (!players[socket.hostId]) return;
    socket.leave(lobbyId);
    delete players[socket.hostId];
  });

  socket.on("setType", function(data) {
    var lobbyId = data.lobbyId;
    var id = data.id;
    var type = data.type;
    var lobby = lobbies[lobbyId].lobby;
    var noType = true;
    for (var key in lobby) {
      if (lobby.hasOwnProperty(key)) {
        if (lobby[key].type == type) {
          noType = false;
        }
      }
    }

    if (noType) {
      lobbies[lobbyId].lobby[id].type = type;
      io.to(lobbyId).emit("updateTypes", { id: id, type: type });
    }
  });
  //   socket.on("initialize", function() {
//     var id = socket.id;
//     var newPlayer = new Player(id);
//     players[id] = newPlayer;

//     socket.emit("playerData", { id: id, players: players });
//     socket.broadcast.emit("playerJoined", newPlayer);
//   });
  // socket.on("disconnect", function() {
  //   if (!players[socket.id]) return;
  //   delete players[socket.id];
  //   // Update clients with the new player killed
  //   socket.broadcast.emit("killPlayer", socket.id);
  // });
});

console.log("Server started");
server.listen(3000);
