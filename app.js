var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var websocket = require('ws');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var express = require("express");
var http = require("http");
var game = require('./gameHandler');
var messages = require("./public/javascripts/messages");

var port = process.env.PORT || 3000
var app = express();
var server = http.createServer(app);
const wss = new websocket.Server({ server });
var websockets = {}; //property: websocket, value: game

var gameStats = {
  gamesPlayed: 0,
  draws: 0,
  gamesOngoing: 0,
}

var connectionId = 0;
var currentGame = new game(gameIds++);
var gameIds = 0;

app.get('/', function(req, res){
  res.render('splash.ejs', { draws: gameStats.draws, gamesPlayed: gameStats.gamesPlayed, gamesOngoing: gameStats.gamesOngoing});
})

app.get('/multiplayer', function(req, res){
  res.sendFile("multiplayer.html", {root: "./public"});
})

app.get('/singleplayer', function(req, res){
  res.sendFile("singleplayer.html", {root: "./public"});
})

app.get("/stats", function(req, res){

  res.json(gameStats);
});


//clean websockets
setInterval(function() {
  for (let i in websockets) {
    if (Object.prototype.hasOwnProperty.call(websockets,i)) {
      let gameObj = websockets[i];
      //if the gameObj has a final status, the game is complete/aborted
      if (gameObj.hasfinalStatus) {
        delete websockets[i];
      }
    }
  }
}, 50000);


wss.on("connection", function connection(ws) {

  /*
   * two-player game: every two players are added to the same game
   */
  let con = ws;
  con.id = connectionId++;
 
  
  /* some messages between players
  */

 con.on("message", function incoming(message) {
  let oMsg = JSON.parse(message);
  let gameObj = websockets[con.id];

  if(oMsg.type == messages.T_NICKNAME){
    con.nick = oMsg.nickname;
    currentGame.addPlayer(con);
    websockets[con.id] = currentGame;

    if(currentGame.hasTwoConnectedPlayers()){
      var startingPlayer = 0;
      gameStats.gamesOngoing++;
      let message1 = messages.O_READY_TO_START;
      message1.data = 0;
      message1.startingPlayer = startingPlayer;
      message1.opponentName  = currentGame.playerB.nick;
      currentGame.playerA.send(JSON.stringify(message1));
      let message2 = messages.O_READY_TO_START;
      message2.data = 1;
      message2.opponentName = currentGame.playerA.nick;
      message2.startingPlayer = startingPlayer;
      currentGame.playerB.send(JSON.stringify(message2));
      if(startingPlayer == 0){
        currentGame.gameState = "A turn";
      }
      else{
        currentGame.gameState = "B turn"
      }
      currentGame = new game(gameIds++);
    }
  }

    else if(oMsg.type == messages.T_MOVE_COMPLETED){
      if(oMsg.sender == 0){
        gameObj.gameState = "B turn";
        gameObj.playerB.send(JSON.stringify(oMsg));
        let message = messages.O_B_TURN;
        gameObj.playerB.send(JSON.stringify(message)); 
        gameObj.playerA.send(JSON.stringify(message));
      }
      else{
        gameObj.gameState = "A turn";
        gameObj.playerA.send(JSON.stringify(oMsg));
        let message = messages.O_A_TURN;
        gameObj.playerA.send(JSON.stringify(message));
        gameObj.playerB.send(JSON.stringify(message));
      }
    }

    else if(oMsg.type == messages.T_GAME_FINISHED){
      gameStats.gamesOngoing--;
      gameStats.gamesPlayed++;
      if(oMsg.sender == 0){
        gameObj.gameState = "A won";
        gameObj.playerB.send(JSON.stringify(oMsg));
      }
      else if(oMsg.sender == 1){
        gameObj.gameState = "B won";
        gameObj.playerA.send(JSON.stringify(oMsg));
      }
    }

    else if(oMsg.type == messages.T_DRAW){
      gameStats.gamesOngoing--;
      gameStats.draws++;
      gameStats.gamesPlayed++;
      gameObj.gameState = "draw";
      if(oMsg.sender == 0){
        gameObj.playerB.send(JSON.stringify(oMsg));
      }
      else if(oMsg.sender == 1){
        gameObj.playerA.send(JSON.stringify(oMsg));
      }
    }

    else if(oMsg.type == messages.T_GAME_ABORTED){
      if(gameObj.gameState != "ABORTED"){
        gameStats.gamesOngoing--;
      }
      if(oMsg.sender == 0){
        gameObj.playerA = null;
        gameObj.playerB.send(JSON.stringify(oMsg));
      }
      else{
        gameObj.playerB = null;
        gameObj.playerA.send(JSON.stringify(oMsg));
      }
      gameObj.gameState = "ABORTED";
    } 
 })

 con.on("close", function(code) {
    
    let gameObj = websockets[con.id];
    let message = messages.O_GAME_ABORTED;
    if(gameObj){
      if(gameObj.gameState == "1 JOINT"){
        gameObj.playerA = null;
        gameObj.playerB = null;
        gameObj.gameState = "0 JOINT";
      }
    if(gameObj.gameState == "A turn" || gameObj.gameState == "B turn"){
      if(gameObj.gameState !== "ABORTED"){
        gameStats.gamesOngoing--;
      } 
        gameObj.gameState = "ABORTED";     
      if(gameObj.playerA == con){
        gameObj.playerA = null;
        if(gameObj.playerB != null){
        gameObj.playerB.send(JSON.stringify(message));
        }
      }
      else if(gameObj.playerB == con){
        gameObj.playerB = null;
        if(gameObj.playerA != null){
        gameObj.playerA.send(JSON.stringify(message));
        }
      }
    }
 }
})

});

app.use(express.static(__dirname + "/public")); //still necessary?

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
server.listen(process.env.PORT || 3000);
module.exports = app;
