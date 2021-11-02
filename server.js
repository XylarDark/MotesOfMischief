var MotesOfMischief = pc.createScript('MotesOfMischief');
//Lobby Variables
MotesOfMischief.lobby = null;
MotesOfMischief.lobbyId = null;
//Host Variable
MotesOfMischief.hostId = null;
//Player Variables
MotesOfMischief.playerId = null;
MotesOfMischief.isHost = null;
MotesOfMischief.types = null;
//Display Elements
MotesOfMischief.lobbygroupdisplay = null;
MotesOfMischief.hostdisplay = null;
MotesOfMischief.motetypes = null;
MotesOfMischief.moteimage = null;
MotesOfMischief.type = null;
MotesOfMischief.roomcodeinput = null;
MotesOfMischief.roomcodeinputbutton = null;
MotesOfMischief.playername = null;
MotesOfMischief.hostname = null;
MotesOfMischief.nonhost = null;
MotesOfMischief.hostchoosetypebutton = null;
MotesOfMischief.createlobby = null;
MotesOfMischief.backtomenubutton = null;
MotesOfMischief.joingame = null;
MotesOfMischief.joinlobby = null;
MotesOfMischief.startgame = null;
MotesOfMischief.readygame = null;
MotesOfMischief.roomcodeinputbutton = null;

//Joining Lobby Elements
MotesOfMischief.roomcodeinput = null;
MotesOfMischief.lobbybuttons = null;
MotesOfMischief.joingamegroup = null;
MotesOfMischief.pastebutton = null;
MotesOfMischief.hostchoosetypebutton = null;
MotesOfMischief.hostsettypebutton = null;
MotesOfMischief.playerchoosetypebutton = null;
MotesOfMischief.playersettypebutton = null;

//Setting Mote Type Elements
MotesOfMischief.setlighttypebutton = null;
MotesOfMischief.setgreytypebutton = null;
MotesOfMischief.setneutraltypebutton = null;
MotesOfMischief.setbluetypebutton = null;
MotesOfMischief.setredtypebutton = null;
MotesOfMischief.setdarktypebutton = null;
MotesOfMischief.lobbygroupdisplay = null;
MotesOfMischief.nonhost = null;
MotesOfMischief.gameboardgroup = null;

//Game Elements
MotesOfMischief.turnOrder = null;
MotesOfMischief.playerGraveyard = null;
MotesOfMischief.lobbyGraveyard = null;
MotesOfMischief.phase = null;
MoteOfMischief.isGraveyardTurn = null;


// initialize code called once per entity
MotesOfMischief.prototype.initialize = function() {

    var self = this;
    
    var socket = io.connect('https://fishy-turquoise-cosmonaut.glitch.me');
    
    //Root Level Display Groups
    var maintitlegroup = self.app.root.findByName('Main Title Group');
    var lobbyscenegroup = self.app.root.findByName('Lobby Scene Group');
    var gameboardgroup = self.app.root.findByName('Game Board Group'); 
    
    //Lobby Parents
    var lobbygroupdisplay = self.app.root.findByName('Lobby Group');
    var nonhost = self.app.root.findByName('Non Host Group');  
    
    //Create Lobby Buttons
    var createlobbybutton = self.app.root.findByName('Create Lobby Button');
    var backtomenubutton = self.app.root.findByName('Back To Menu Button');
    var joingamebutton = self.app.root.findByName('Join Game Button');
    
    //Join Lobby Buttons
    var joinlobby = self.app.root.findByName('Join Lobby Button');
    var pastebutton = self.app.root.findByName('Paste Button');
    var roomcodeinputbutton = self.app.root.findByName('Room Code Input Button');
    //Join Lobby Code
    var roomcodeinput = self.app.root.findByName('Room Code Input');
    //Join Lobby Groups
    var lobbybuttons = self.app.root.findByName('Lobby Buttons Group');
    var joingamegroup = self.app.root.findByName('Join Game Group');    
    
    //Ready Lobby Elements
    var lobbyreadycount = 0;
    var startgamegroup = self.app.root.findByName('Start Game Group');
    var startgamebutoton = self.app.root.findByName('Start Game Button');
    var readygamebutton = self.app.root.findByName('Ready Game Button');
    var notreadygamebutton = self.app.root.findByName('Not Ready Game Button');
    var readycount = self.app.root.findByName('Group Ready Counter Text');
    
    //Type Display Elements
    var hostchoosetypebutton = self.app.root.findByName('Host Choose Type');
    var hostsettypebutton = self.app.root.findByName('Host Set Type');
    var playerchoosetypebutton = self.app.root.findByName('Player Choose Type Button');
    var playersettypebutton = self.app.root.findByName('Player Set Type');
    var playermotetypetext = self.app.root.findByName('Player Mote Type Text');
    var hostmotetypetext = self.app.root.findByName('Host Mote Type Text');
    var motetypes = self.app.root.findByName('Mote Types');
    
    //Mote Type Buttons
    var setlighttypebutton = self.app.root.findByName('Light Mote');
    var setgreytypebutton = self.app.root.findByName('Grey Mote');
    var setneutraltypebutton = self.app.root.findByName('Neutral Mote');
    var setbluetypebutton = self.app.root.findByName('Blue Mote');
    var setredtypebutton = self.app.root.findByName('Red Mote');
    var setdarktypebutton = self.app.root.findByName('Dark Mote');
    
    //Phase Group
    var phasegroup = self.app.root.findByName('Phase Group');
    var phaseone = self.app.root.findByName('Phase One Text');
    var phasetwo = self.app.root.findByName('Phase Two Text');
    var phasethree = self.app.root.findByName('Phase Three Text');
    var nextphasebutton = self.app.root.findByName('Next Phase Button');
    var yourprioritytext = self.app.root.findByName('Your Priority Text');
    //Game Buttons
    var startturnbutton = self.app.root.findByName('Start Turn Button');
    var startmischiefbutton = self.app.root.findByName('Start Mischief Button');
    var playgraveyardbutton = self.app.root.findByName('Play Graveyard Button');
    
    //Create Lobby Button Event
    createlobbybutton.button.on('click', function(event) {
       lobbybuttons.enabled = false;
        lobbygroupdisplay.enabled = true;
        console.log("Button pressed");
        socket.emit('createLobby', (response) => {
            self.initializeLobby (response);
        });
    }, this);
    
    //Join Lobby Button Event
    joinlobby.button.on('click', function(event) {

        self.roomcodeinput = self.app.root.findByName('Room Code Input');
        self.lobbyId = self.roomcodeinput.element.text;
        var lobbyId = self.lobbyId;

        socket.emit('joinLobby',{lobbyId: lobbyId}, (response) => {
            self.playername = self.app.root.findByName ('Player1');
            self.hostname = self.app.root.findByName ('Host');
            self.nonhost = self.app.root.findByName ('Non Host Group');

            self.nonhost.enabled = true;

            var status = response.joinlobbystatus;
            var message = response.message;
            
            if(status == 'success'){
                self.playerId = response.id;
                self.lobby = response.lobby;
                var lobby = self.lobby;
                var playercounter = 2;
                var name = '';
                self.isHost = false;
                console.log('JoinLobby');
                var type = self.app.root.findByName('Player Choose Type Button');
                type.enabled = true;
                for(var key in lobby){
                    if(lobby.hasOwnProperty(key)){
                        if(lobby[key].host){
                            self.hostId = lobby[key].id;
                            self.hostname.element.text = lobby[key].name + ' - Host';
                            if(lobby[key].ready){
                                lobbyreadycount++;
                                readycount.element.text = lobbyreadycount;
                            }
                        }
                        else{
                            if(lobby[key].id != self.playerId){

                                var playername = self.app.root.findByName ('Player'+playercounter);
                                self.playername.element.text = lobby[key].name;
                                playercounter++;
                                if(lobby[key].ready){
                                    lobbyreadycount++;
                                    readycount.element.text = lobbyreadycount;
                                }

                            }
                            else{
                                self.playername.element.text = lobby[key].name + ' - You';
                            }                            
                        }

                    }
                }
            }
            else if(status == 'fail'){
                console.log('Failed to Connect');
            }
        });        

    }, this);
  
    //Lobby Roomcode Button Event
    roomcodeinputbutton.button.on('click', function(event) {

        var copytext = roomcodeinput.element.text;
        navigator.permissions.query({
            name: "clipboard-write"
        }).then(result => {
            if (result.state == "granted" || result.state == "prompt") {

                navigator.clipboard.writeText(copytext).then(function() {
                    /* clipboard successfully set */
                }, function() {
                    /* clipboard write failed */
                });
            }
        });
        document.execCommand("copy");

    }, this);
    
    //Join Game Button Event
    joingamebutton.button.on('click', function(event) {
        lobbybuttons.enabled = false;
        lobbygroupdisplay.enabled = true;
        joingamegroup.enabled = true;
        pastebutton.enabled = true;
        joinlobby.enabled = true;
        self.roomcodeinput = self.app.root.findByName('Room Code Input');

        self.roomcodeinput.element.text = '';


    }, this);
    
    //Player Joined Lobby Server Communication Event
    socket.on('playerJoined', function(data) {
        self.addPlayer(data);
    });
    
    //Ready Game Button Event
    readygamebutton.button.on('click', function(event) {
        var lobbyId = self.lobbyId;
        var playerId = self.playerId;
        var hostId = self.hostId;            
        var lobby = self.lobby;
        if(self.isHost){

            socket.emit('playerReady', {id:hostId,lobbyId:lobbyId});
            self.lobby[hostId].ready = true;
        
            readygame.enabled = false;
            notreadygame.enabled = true;
        

        }
        else{
            
            socket.emit('playerReady', {id:playerId,lobbyId:lobbyId});
            self.lobby[playerId].ready = true;
        
            readygame.enabled = false;
            notreadygame.enabled = true;
        }

    }, this);
    
    //Player Ready Server Communication Event
    socket.on('playerReady', function(data){
        lobbyreadycount++;
        readycount.element.text = lobbyreadycount;
        if(self.isHost){
            if(lobbyreadycount == 5){
                startgamegroup.enabled = true;                
            }   
        }
    });
    
    //Not Ready Game Button Event
    notreadygamebutton.button.on('click', function(event) {
        var lobbyId = self.lobbyId;
        var hostId = self.hostId;
        var playerId = self.playerId;
        var lobby = self.lobby;
        if(self.isHost){

            socket.emit('playerNotReady', {id:hostId,lobbyId:lobbyId});
            self.lobby[hostId].ready = false;
        
            readygame.enabled = true;
            notreadygame.enabled = false;        
        
        }
        else{
            socket.emit('playerNotReady', {id:playerId,lobbyId:lobbyId});
            self.lobby[playerId].ready = false;
        
            readygame.enabled = true;
            notreadygame.enabled = false; 
        }

    }, this);
 
    //Player Not Ready Server Communication Event
    socket.on('playerNotReady', function(data){
            lobbyreadycount--;
            readycount.element.text = lobbyreadycount;
    });
    
    //Update Player Type Server Communication Event
    socket.on('updateTypes', function(data) {
        self.updateTypes(data);
    });
    
    socket.on('startGame', function(data) {
        gameboardgroup.enabled = true;
        maintitlegroup.enabled = false;
        lobbyscenegroup.enabled = false;
        
        var lobby = data.lobby;
        self.lobby = data.lobby;
        
        var id = self.playerId;
        var hostId = self.hostId;
        
        for(var key in lobby){
            if(lobby.hasOwnProperty(key)){
                var playerName = lobby[key].name;
                var playerOrder = lobby[key].turnOrder;
                self.turnOrder = playerOrder;
                var name = self.app.root.findByName('P' + playerOrder + ' Name Text' );
                var turnOrder = self.app.root.findByName('P' + playerOrder + ' Turn Text' );
                name.element.text = playerName;
                turnOrder.element.text = playerOrder;
                
                if(lobby[key].turnOrder == 1 && lobby[key].id == id){
                    
                    startturn.enabled = true;
                    phasegroup.enabled = true;
                }
                else if(self.isHost){
                    if(lobby[key].turnOrder == 1 && lobby[key].id == hostId){
                    startturn.enabled = true;
                    phasegroup.enabled = true;                        
                    }
                }
            }
        }
        console.log('startgame');
    });
    
    startgamebutton.button.on('click', function(event) {

        var lobbyId = self.lobbyId;
        gameboardgroup.enabled = true;
        maintitlegroup.enabled = false;
        lobbyscenegroup.enabled = false;
        
        socket.emit("startGame",{lobbyId:lobbyId});

    }, this);
    //TODO
    startmischiefbutton.button.on('click',function(event){});    
    nextphasebutton.button.on('click',function(event){});    
    
    
    //Start Point for a game and a new turn.
    startturnbutton.button.on('click', function(event) { 
        var self = this;
        var id = self.playerId;
        var turnOrder = self.turnOrder;
        var phase = 'p1';
        self.phase = phase;
        phasegroup.enabled = true;
        var phasetext = phaseone.element.text;
        phaseone.element.text = phasetext.toUpperCase();
        
        var data = {id:id,turnOrder:turnOrder,phase:phase};
        self.lightPhase(data);

    });
    
    MotesOfMischief.prototype.lightPhase = function(data){
        var id = data.id;
        var lobbyId = self.lobbyId;
        var turnOrder = data.turnOrder;
        var phase = data.phase;
        
        if(phase == 'p1'){
            socket.emit('phaseOne',{id:id,lobbyId:lobbyId,turnOrder:turnOrder},(response) => {
                var isDie = response.isDie;
                var turnOrder = response.turnOrder;
                if(isDie){
                    self.playerGraveyard = response.playerGraveyard;
                    self.lobbyGraveyard = response.lobbyGraveyard;
                    self.playGraveyard();
                    //Send Priority
                    self.nextLightPlayer(); 
                }else{
                    //No die is played and send the priority to the next player
                    //Send Priority
                    self.nextLightPlayer();
                }
            });            
        }
        else{
            socket.emit('phaseThree',{id:id,lobbyId:lobbyId,turnOrder:turnOrder},(response) => {
            var isDie = response.isDie;
            var turnOrder = response.turnOrder;
            if(isDie){
                self.playerGraveyard = response.playerGraveyard;
                self.lobbyGraveyard = response.lobbyGraveyard;
                self.playGraveyard();
                //Send Priority
                self.nextLightPlayer(); 
            }else{
                //No die is played and send the priority to the next player
                //Send Priority
                self.nextLightPlayer();
            }
        });            
        }
        
    };
    MotesOfMischief.prototype.nextLightPlayer = function(){
        var self = this;
        var lobby = self.lobby;
        var lobbyId = self.lobbyId;
        var playerId = self.playerId;
        var nextTurn = self.turnOrder++;
        var phase = self.phase;
        for (var key in lobby) {      
            if (lobby.hasOwnProperty(key)) {      
                //lobby[key] == Player Object
                if(lobby[key].turnOrder == nextTurn){
                    var id = lobby[key].playerId;
                    var nextTurnOrder = lobby[key].turnOrder;
                    socket.emit('nextLightPlayer',{id:id, turnOrder: nextTurnOrder,lobbyId:lobbyId, phase:phase});
                } else if(lobby[key].turnOrder == 6){
                  //Next Phase
                if(phase == 'p1'){
                    self.phase = 'p2';
                    socket.emit('nextPhase',{phase:self.phase});
                }
                else if(phase == 'p2'){
                    self.phase = 'p3';
                    socket.emit('nextPhase',{phase:self.phase});
                }
                else if(phase == 'p3' && self.turnOrder < 5){
                    socket.emit('nextTurn',);
                }
                else if(phase == 'p3' && self.turnOrder == 5){
                    socket.emit('nextRound');
                }                  
                }
            }
          }
        
        };    
    
    MotesOfMischief.prototype.nextLightGraveyardTurn = function(data){
        var self = this;
        var nextPlayerId = data.playerId;
        var playerId = self.playerId;
        var phase = data.phase;
        var playerGraveyard = data.playerGraveyard;
        var lobbyGraveyard = data.lobbyGraveyard;
        var turnOrder = data.turnOrder;
        
        if(playerId == nextPlayerId){
            self.lightPhase({id:playerId,phase:phase,turnOrder:turnOrder});
        }
    };
        
    playgraveyardbutton.on('click',function(event){
        
    });
        
    MotesOfMischief.prototype.playGraveyard = function(data){
        playgraveyardbutton.enabled = true;
        yourprioritytext.enabled = true;
    };
        
    
        
    backtomenubutton.button.on('click', function(event) {
        var self = this;
        lobbybuttons.enabled = true;
        lobbygroupdisplay.enabled = false;
        pastebutton.enabled = false;
        joinlobby.enabled = false;
    

        hostmotetypetext.element.text = '';
        motetypes.enabled = false;
        
        self.hostname = self.app.root.findByName('Host');

        self.hostname.element.text = '';

        roomcodeinput.element.text = '';

        var lobbyId = self.lobbyId;
        if (self.isHost) {

            var hostId = self.hostId;
            
            socket.emit('destroyLobby', {
                lobbyId: lobbyId,
                hostId: hostId
            });
        } else {
            var id = self.playerId;
            socket.emit('backtomenubutton', {
                lobbyId: lobbyId,
                id: id
            });
        }

    }, this);

    hostchoosetypebutton.button.on('click', function(event) {
        self.motetypes = self.app.root.findByName('Mote Types');

        if (self.motetypes.enabled != true) {
            self.motetypes.enabled = true;
        } else {
            self.motetypes.enabled = false;
        }

    }, this);

    playerchoosetypebutton.button.on('click', function(event) {
        
        self.motetypes = self.app.root.findByName('Mote Types');

        if(self.motetypes.enabled != true) {
            self.motetypes.enabled = true;
            
        } else {
            self.motetypes.enabled = false;
            self.app.root.findByName('Choose Player Type').enabled = false;
        }

    }, this);

    setlighttypebutton.button.on('click', function(event) {
        
        setTypeDisplay('Light');

    }, this);

    setgreytypebutton.button.on('click', function(event) {

        setTypeDisplay('Grey');

    }, this);

    setneutraltypebutton.button.on('click', function(event) {

        setTypeDisplay('Neutral');

    }, this);

    setbluetypebutton.button.on('click', function(event) {

        setTypeDisplay('Blue');

    }, this);

    setredtypebutton.button.on('click', function(event) {

        setTypeDisplay('Red');

    }, this);

    setdarktypebutton.button.on('click', function(event) {

        setTypeDisplay('Dark');

    }, this);
    
    function setTypeDisplay(type){
        if(self.isHost) {
            self.moteimage = self.app.root.findByName('Host Mote Type Text');
            self.moteimage.element.text = type;
            
            var hostId = self.hostId;
            
            socket.emit('setType', {
                lobbyId: self.lobbyId,
                id: hostId,
                type: self.type
            });
        } else {
            self.moteimage = self.app.root.findByName('Player Mote Type Text');
            self.moteimage.element.text = type;
            
            var playerId = self.playerId;
            
            socket.emit('setType', {
                lobbyId: self.lobbyId,
                id: playerId,
                type: self.type
            });
        }
    }
};

MotesOfMischief.prototype.addPlayer = function(data) {
    var self = this;
    var lobbyId = self.lobbyId;
    var player = data.player;
    var lobby = self.lobby;
    var playercounter = 2;
    var hostcounter = 1;
    var name = '';
    
    self.lobby[player.id] = player;
    self.nonhost = self.app.root.findByName('Non Host Group');
    self.nonhost.enabled = true;
    
    for (var key in lobby) {
        if (lobby.hasOwnProperty(key)) {
            if(self.isHost) {
                var hostname = self.app.root.findByName('Player' + hostcounter);
                if (lobby[key].id != self.hostId) {
                    if (hostcounter < 5) {
                        hostname.enabled = true;
                        hostname.element.text = lobby[key].name;
                        hostcounter++;
                    }
                }
            } else {
                var playername = self.app.root.findByName('Player' + playercounter);
                if (lobby[key].id != self.playerId && lobby[key].id != self.hostId) {
                    if (playercounter < 5) {
                        playername.element.text = lobby[key].name;
                        playercounter++;
                    }
                }
            }
        }
    }
};

MotesOfMischief.prototype.updateTypes = function(data) {
    var self = this;
    var playerId = data.id;
    var type = data.type;

    self.lobby[playerId].type = type;

};

MotesOfMischief.prototype.initializeLobby = function(data) {
    var self = this;
    self.lobby = data.lobby;
    self.lobbyId = data.id;
    self.hostId = data.hostId;
    self.isHost = true;
    self.types = data.types;
    self.hostdisplay = self.app.root.findByName('Host');
    self.roomcodeinput = self.app.root.findByName('Room Code Input');
    self.hostchoosetypebutton = self.app.root.findByName('Host Choose Type');

    self.hostname = self.lobby[self.hostId].name;
    self.hostchoosetypebutton.enabled = true;
    self.roomcodeinput.element.text = self.lobbyId;
    self.hostdisplay.element.text = self.hostname + ' - Host';
    console.log("Lobby Initialized");
};
    
// update code called every frame
MotesOfMischief.prototype.update = function(dt) {

};