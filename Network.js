this.socket = io.connect('https://fishy-turquoise-cosmonaut.glitch.me');

this.socket.emit ('playerJoined', 'John');

Network.prototype.initializePlayers = function (data) {
    this.players = data.players;
    // Create a player array and populate it with the currently connected players.

    this.id = data.id;
    // Keep track of what ID number you are.

    for(var id in this.players){
        if(id != Network.id){
            this.players[id].entity = this.createPlayerEntity(this.players[id]);
        }
    }
    // For every player already connected, create a new capsule entity.

    this.initialized = true;
    // Mark that the client has received data from the server.

    socket.on ('playerMoved', function (data) {
        self.movePlayer (data);
    });
};

Network.prototype.createPlayerEntity = function (data) {
    var newPlayer = this.other.clone ();
    // Create a new player entity.

    newPlayer.enabled = true;
    // Enable the newly created player.

    this.other.getParent ().addChild (newPlayer);
    // Add the entity to the entity hierarchy.

    if (data)
        newPlayer.rigidbody.teleport (data.x, data.y, data.z);
    // If a location was given, teleport the new entity to the position of the connected player.

    return newPlayer;
    // Return the new entity.
};

Network.prototype.addPlayer = function (data) {
    this.players[data.id] = data;
    this.players[data.id].entity = this.createPlayerEntity(data);
};

Network.prototype.update = function (dt) {
    this.updatePosition ();
};

Network.prototype.movePlayer = function (data) {
    if (this.initialized)
        this.players[data.id].entity.rigidbody.teleport (data.x, data.y, data.z);
};

Network.prototype.updatePosition = function () {
    if (this.initialized) {
        var pos = this.player.getPosition ();
        this.socket.emit ('positionUpdate', {id: this.id, x: pos.x, y: pos.y, z: pos.z});
    }
};