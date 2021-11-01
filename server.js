var server = require("http").createServer();
var options = {
  cors: true
};
var io = require("socket.io")(server, options);

var players = {};
var lobbies = {};

const ShortUniqueId = require("short-unique-id");

function Player(id, host, name) {
  this.id = id;
  //boolean
  this.host = host;
  this.name = name;
  
  this.type = null;
  this.entity = null;
  
  this.cup = {};
  this.graveyard = {};
  
  this.ready = null;
  this.turnOrder = null;
}
function Lobby(id, hostId, lobby) {
  this.id = id;
  this.hostId = hostId;
  this.lobby = lobby;
  this.graveyard = {};
}

io.on("connection", function(socket) {
  socket.on("createLobby", (callback) => {    
    const newid = new ShortUniqueId({ length: 6 });
    const newname = new ShortUniqueId({ length: 4 });
    var lobbyId = newid();
    var name = newname();
    
    socket.join(lobbyId);
    
    var lobby = {};
    var graveyard = {};
    var hostId = socket.id;
    var isHost = true;
    var hostPlayer = new Player(hostId, isHost, name);
    
    lobby[hostId] = hostPlayer;
    
    var newLobby = new Lobby(lobbyId, hostId, lobby, graveyard);
    
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
      if (rooms.get(lobbyId).size < 5) {
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
  //
  socket.on('nextPhase', function(data){
    var playerId = data.id;
    var lobbyId = data.lobbyId;
    var nextPhase = data.phase;
    
    if(nextPhase == 'one'){
      
    }else if(nextPhase == 'two'){
      
    }else if(nextPhase == 'three'){
      
    }else if(nextPhase == 'mischief'){
      
    }else if(nextPhase == 'rollTurnOrder'){
      
    }
  });
  // Phase One - player turn priority -> player has nothing to play or skips
  // --> next player in turn order plays
  //Phase One is a Light Phase - players play their graveyards in turn order 
  //and there is no stack
  socket.on("phaseOne",(data,callback)=>{
    var lobbyId = data.lobbyId;
    var lobby = lobbies[lobbyId];
    var turnOrder = data.turnOrder;
    
    if(lobby.graveyard.size != 0){
      //lobby object
      var lobbyGraveyard = lobby.graveyard;
      //Takes the lobby array that holds players out of the lobby object
      lobby = lobby.lobby;
      var playerId = data.id;
      
      for (var key in lobby) {      
        if (lobby.hasOwnProperty(key)) {      
          //lobby[key] == Player Object
          if(lobby[key].id == playerId && lobby[key].graveyard.size > 0){
              //Player has a graveyard and plays it
              callback({
                isDie: true,
                turnOrder: turnOrder,
                playerGraveyard: lobby[key].graveyard,
                lobbyGraveyard: lobbyGraveyard
              });
          }
        }
      }
      //next player turn
      callback({
        isDie: false,
        turnOrder: turnOrder
      });
    }
  });
  
  socket.on('nextGraveyard',function(data){});
  socket.on('nextPhase',function(data){});
  socket.on('nextTurn',function(data){});
  socket.on('nextRound',function(data){});
  
  socket.on("startGame",function(data){

    var lobbyId = data.lobbyId;

    const rooms = io.of("/").adapter.rooms;
    if (rooms.has(lobbyId)) {
      var lobby = lobbies[lobbyId].lobby;
      var randomTurnOrder = [1, 2, 3, 4, 5];
      shuffle(randomTurnOrder);
      var i = 0;
      for (var key in lobby) {      
        if (lobby.hasOwnProperty(key)) {
          lobby[key].turnOrder = randomTurnOrder[i];
          i++;
        }
      }
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
});

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

console.log("Server started");
server.listen(3000);
