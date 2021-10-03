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
  socket.on("createLobby", function() {
    const newid = new ShortUniqueId({ length: 6 });
    const newname = new ShortUniqueId({ length: 4 });
    var id = newid();
    var name = newname();

    var lobby = {};
    var hostId = socket.id;
    var isHost = true;
    var hostPlayer = new Player(hostId, isHost, name);

    lobby[hostId] = hostPlayer;
    var newLobby = new Lobby(id, hostId, lobby);

    lobbies[id] = newLobby;

    socket.emit("createLobbyData", {
      id: id,
      lobby: lobby,
      hostId: hostId
    });
  });
  socket.on("joinLobby", function(data) {
    var playerId = socket.id;
    var isHost = false;
    const newname = new ShortUniqueId({ length: 4 });
    var name = newname();

    var player = new Player(playerId, isHost, name);
    var lobbyId = data.lobbyId;

    if (lobbies[lobbyId]) {
      if (Object.keys(lobbies[lobbyId].lobby).length < 7) {
        lobbies[lobbyId].lobby[playerId] = player;

        socket.emit("joinLobbyStatus", {
          joinlobbystatus: "success",
          message: "Joined lobby.",
          lobby: lobbies[lobbyId].lobby,
          id: playerId
        });
        socket.broadcast.emit("playerJoined", { player: player });
      }
    } else {
      socket.emit("joinLobbyStatus", {
        joinlobbystatus: "fail",
        message: "Failed to join lobby."
      });
    }
  });

  socket.on("destroyLobby", function(data) {
    var lobbyId = data.lobbyId;
    var hostId = data.hostId;

    if (!lobbies[lobbyId]) return;
    delete lobbies[lobbyId];
    if (!players[socket.hostId]) return;
    delete players[socket.hostId];
  });
  socket.on("leaveLobby", function(data) {
    var lobbyId = data.lobbyId;
    var playerId = data.id;
    console.log(lobbies[lobbyId]);
    if (!lobbies[lobbyId]) return;

    delete lobbies[lobbyId].lobby[playerId];

    if (!players[socket.hostId]) return;
    delete players[socket.hostId];
  });
  socket.on("initialize", function() {
    //1
    var id = socket.id;
    var newPlayer = new Player(id);
    players[id] = newPlayer;

    socket.emit("playerData", { id: id, players: players });
    socket.broadcast.emit("playerJoined", newPlayer);
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
      socket.broadcast.emit("updateTypes", { id: id, type: type });
    }
  });

  socket.on("initialize", function() {
    //1
    var id = socket.id;
    var newPlayer = new Player(id);
    players[id] = newPlayer;

    socket.emit("playerData", { id: id, players: players });
    socket.broadcast.emit("playerJoined", newPlayer);
  });
  socket.on("disconnect", function() {
    if (!players[socket.id]) return;
    delete players[socket.id];
    // Update clients with the new player killed
    socket.broadcast.emit("killPlayer", socket.id);
  });
});

console.log("Server started");
server.listen(3000);
