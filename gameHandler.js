var game = function (gameID) {
    this.playerA = null;
    this.playerB = null;
    this.id = gameID;
    this.gameState = "0 JOINT";
  };

  game.prototype.addPlayer = function(p){
    if(this.playerA === null){
      this.playerA = p;
      this.gameState = "1 JOINT";
      console.log(p  +"is loaded as pl A");
    }
    else if(this.playerB === null){
      this.playerB = p;
      this.gameState = "2 JOINT";
      console.log(p  +"is loaded as pl B");
    }
  }
  
  game.prototype.hasTwoConnectedPlayers = function() {
    return this.gameState == "2 JOINT";
  };

  game.prototype.hasFinalStatus = function(){
    return this.gameState == "ABORTED" || this.gameState == "A won" || this.gameState == "B won" || this.gameState == "draw";
  }
  
  module.exports = game;