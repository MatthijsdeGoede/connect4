function GameState() {
    this.currentPlayer = null;
    this.gameOver = false;
    this.gameStarted = false;
    this.winner;
    this.opponent = null;
    this.playerType = null;    
    this.socket = null;
}

var myName = null;
var gs = null;
var tableRow = document.getElementsByTagName('tr');
var tableData = document.getElementsByTagName('td');
var playerStatus = document.getElementById("player-turn");
var elem = document.documentElement;
var movesound = new Audio("../data/pop.mp3");

var combination = [];
var time = 0;

window.addEventListener("resize", function(){
    if (window.matchMedia('(max-width: 700px)').matches) {
    alert("The width of the screen is too small for optimal play");
    }
    else if(window.matchMedia('(max-height: 500px)').matches){
        alert("The height of the screen is too small for optimal play");
    }
});

for (let i=0; i < tableData.length; i++){
    tableData[i].style.backgroundColor = 'white';
} 

$(".cell").bind('mouseover', function() {

    if($(this)[0].style.backgroundColor == 'white' && !gs.GameStategameOver && checkValidMove($(this)[0]) && gs.currentPlayer == gs.playerType){
        $(this)[0].style.border = `7px solid ${getColor(gs.playerType)}`;
        $(this)[0].style.width = '56px';
        $(this)[0].style.height = '56px';
    }
    else if($(this)[0].style.backgroundColor == 'white' && !gs.gameOver && gs.currentPlayer == gs.playerType){
        $(this)[0].style.border = '7px solid grey';
        $(this)[0].style.width = '56px';
        $(this)[0].style.height = '56px';
    }  

    $(".cell").bind('mouseout', function () {
        if($(this)[0].style.border != '7px solid white'){
            $(this)[0].style.border = '0px';
            $(this)[0].style.width = '70px';
            $(this)[0].style.height = '70px';
        }
    });
});

$(".cell").on("click", function (event) {
    changeColor(this);
});

function getColor(id){
    if(id == 0){
        return '#FFCC00';
    }
    else{
        return '#FF0000';
    }
}

function getColorClass(id){
    if(id == 0){
        return 'yellowcolor';
    }
    else{
        return 'redcolor';
    }
}

function sendNickname(){
	alert("Clicking goes fine");
    myName = document.getElementById("nickname").value;
    
    var outgoingMsg = Messages.O_NICKNAME;
    outgoingMsg.nickname = myName;
    gs.socket.send(JSON.stringify(outgoingMsg));
    waitingForPlayers();
}

function waitingForPlayers(){    
    document.getElementById("enter-nickname").style.display = "none";
    document.getElementById("waiting-wrapper").style.display = "inline-block";
    timer();
}

function startscreen(){
    document.getElementById("waiting-wrapper").style.display = "none";
    var playerBlock = document.getElementById("players");
    playerBlock.style.display = "block";
    var opponentColor = (gs.playerType == 0) ? getColorClass(1) : getColorClass(0);
    playerBlock.innerHTML = myName + `<span class=${getColorClass(gs.playerType)}> •</span>` + "<br>" + gs.opponent + `<span class=${opponentColor}> •</span>`;
    document.getElementById("startscreen").style.display = "inline-block";
}

function start(){
    time = 0;
    document.getElementById("startscreen").style.display = "none";
    document.getElementById("gametime").style.display = "block";
    document.getElementById("replay").style.display = "inline-block";
    document.getElementById("gamegrid").style.display = "inline-block";  
    updateTurnInfo();
}

function updateTurnInfo(){
    if(gs.currentPlayer == gs.playerType){
        playerStatus.innerHTML = `<span class='${getColorClass(gs.currentPlayer)}'>Your</span> turn`;
    }
    else{     
        var textaddon = gs.opponent.substring(gs.opponent.length-1) == "s" ? "" : "'s";
        playerStatus.innerHTML = `<span class='${getColorClass(gs.currentPlayer)}'>${gs.opponent}${textaddon}</span> turn`;
    }  
}

function checkValidMove(cell){
  let col = cell.cellIndex;
  let row = cell.parentElement.rowIndex;
  
  if(row+1 < 6){
    return (tableRow[row+1].children[col].style.backgroundColor != 'white');
  }
  else{
      return true;
  }
}

function showCombination(){
    for(let i = 0; i < combination.length; i++){
        combination[i].style.width = '56px';
        combination[i].style.height = '56px';
        combination[i].style.border = '7px solid white';
    }
}

function changeColor(cell){ 
    if(gs.currentPlayer == gs.playerType && cell.style.backgroundColor == 'white' && !gs.gameOver && checkValidMove(cell)){
        changeColorHelper(cell, gs.playerType);
    }
}

function changeColorHelper(cell, colorId){
    movesound.play();
    cell.style.backgroundColor = getColor(colorId);
    let winnerText = '';

    if (horizontalCheck() || verticalCheck() || diagonalCheck() || diagonalCheck2()){
        if(colorId == gs.playerType){
            winnerText = `Game over! <span class='${getColorClass(colorId)}'>You</span> won!`;
            
            var outgoingMsg = Messages.O_GAME_FINISHED;
            outgoingMsg.row = cell.parentElement.rowIndex;
            outgoingMsg.column = cell.cellIndex;
            outgoingMsg.sender = gs.playerType;
            gs.socket.send(JSON.stringify(outgoingMsg)); 
        }
        else{
            winnerText = `Game over! <span class='${getColorClass(colorId)}'>${gs.opponent}</span> won!`;
        }
        playerStatus.innerHTML = winnerText;

        showCombination();
        setTimeout(function(){ fadeOut(winnerText) }, 2000);
    }
    else if (drawCheck()){
        if(colorId == gs.playerType){
            var outgoingMsg = Messages.O_DRAW;
            outgoingMsg.row = cell.parentElement.rowIndex;
            outgoingMsg.column = cell.cellIndex;
            outgoingMsg.sender = gs.playerType;
            gs.socket.send(JSON.stringify(outgoingMsg)); 
        }
        playerStatus.innerHTML = 'Draw!';
        setTimeout(function(){ fadeOut('Draw!') }, 2000);
    }
    else{
        if(colorId == gs.playerType){
            var outgoingMsg = Messages.O_MOVE_COMPLETED;
            outgoingMsg.row = cell.parentElement.rowIndex;
            outgoingMsg.column = cell.cellIndex;
            outgoingMsg.sender = gs.playerType;
            gs.socket.send(JSON.stringify(outgoingMsg)); 
        }  
    }
}

function fadeOut(winnerText){        
    document.getElementById("gamegrid").style.opacity = 0.07;
    document.getElementById("player-turn").style.display = "none";
    document.getElementById("players").style.display = "none";
    document.getElementById("gametime").style.display = "none";
    document.getElementById("exit").style.display = "none";
    document.getElementById("replay").style.display = "none";
    document.getElementById("endscreen").style.display = "inline-block";
    document.getElementById("winnerText").innerHTML = winnerText;
}

function connect4Check(one, two, three, four){
    return (one === two && one === three && one === four && one !== 'white' && one !== undefined);
}

function horizontalCheck(){
    for (let row = 0; row < tableRow.length; row++){
        for (let col =0; col < 4; col++){
        
            let a = tableRow[row].children[col];
            let b = tableRow[row].children[col+1];
            let c = tableRow[row].children[col+2]
            let d = tableRow[row].children[col+3];

            if (connect4Check(a.style.backgroundColor,b.style.backgroundColor, c.style.backgroundColor, d.style.backgroundColor)){
                combination = [a, b, c, d];                        
                return true;
            }
        }
    }
}

function verticalCheck(){
    for (let col = 0; col < 7; col++){
        for (let row = 0; row < 3; row++){

            let a = tableRow[row].children[col];
            let b = tableRow[row+1].children[col];
            let c = tableRow[row+2].children[col];
            let d = tableRow[row+3].children[col];

            if (connect4Check(a.style.backgroundColor, b.style.backgroundColor, c.style.backgroundColor, d.style.backgroundColor)){
                combination = [a, b, c, d];                    
                return true;
            }
        }   
    }
}

function diagonalCheck(){
    for(let col = 0; col < 4; col++){
        for (let row = 0; row < 3; row++){

            let a = tableRow[row].children[col];
            let b = tableRow[row+1].children[col+1];
            let c = tableRow[row+2].children[col+2];
            let d = tableRow[row+3].children[col+3];

            if (connect4Check(a.style.backgroundColor, b.style.backgroundColor, c.style.backgroundColor, d.style.backgroundColor)){
                combination = [a, b, c, d];
                return true;
            }
        }
    }

}

function diagonalCheck2(){
    for(let col = 0; col < 4; col++){
        for (let row = 5; row > 2; row--){

            let a = tableRow[row].children[col];
            let b = tableRow[row-1].children[col+1];
            let c = tableRow[row-2].children[col+2];
            let d = tableRow[row-3].children[col+3];

            if (connect4Check(a.style.backgroundColor, b.style.backgroundColor, c.style.backgroundColor, d.style.backgroundColor)){
                combination = [a, b, c, d];
                return true;
            }
        }
    }
}

function drawCheck(){
    let occupied = [];
    for (var i=0; i < tableData.length; i++){
        if (tableData[i].style.backgroundColor !== 'white'){
            occupied.push(tableData[i]);
        } 
    }
    if (occupied.length === tableData.length){
        return true;
    }
}

function timer(){
    setTimeout(function(){
        if(!gs.gameOver){
            time++;
            var mins = Math.floor(time/10/60);
            var secs = Math.floor(time/10 % 60);
            var hours = Math.floor(time/10/60/60);
            if(mins < 10){
                mins = "0" + mins;
            }
            if(secs < 10){
                secs = "0" + secs;
            }
            if(gs.gameStarted){
                document.getElementById("gametime").innerHTML = hours + ":" + mins + ":" + secs;
                timer(true);
            }
            else{
                document.getElementById("waitingtime").innerHTML = mins + ":" + secs;
                timer(false);
            }
        }
    },100);
}

(function setup() {
    var HOST = location.origin.replace(/^http/, 'ws')
	var socket = new WebSocket(HOST);
    
	gs = new GameState();
    gs.socket = socket;

    socket.onmessage = function(event) {
      let incomingMsg = JSON.parse(event.data);
  
      if(incomingMsg.type == Messages.T_READY_TO_START){

        gs.gameStarted = true;
        gs.opponent = incomingMsg.opponentName;
        gs.playerType = incomingMsg.data;
        gs.currentPlayer = incomingMsg.startingPlayer;
        startscreen();        
      }

      if(incomingMsg.type == Messages.A_TURN){
        gs.currentPlayer = 0;
        updateTurnInfo();
      }

      if(incomingMsg.type == Messages.B_TURN){
        gs.currentPlayer = 1;
        updateTurnInfo();
      }

      if(incomingMsg.type == Messages.T_MOVE_COMPLETED || incomingMsg.type == Messages.T_DRAW || incomingMsg.type == Messages.T_GAME_FINISHED){
        changeColorHelper(tableRow[incomingMsg.row].children[incomingMsg.column], incomingMsg.sender);
      }

      if(incomingMsg.type == Messages.T_DRAW || incomingMsg.type == Messages.T_GAME_FINISHED){
        gs.gameOver = true;
      }

      if(incomingMsg.type == Messages.T_GAME_ABORTED){
        fadeOut("Game <span class='redcolor'>aborted</span>!");
        gs.gameOver = true;
      }
    };

    socket.onclose = function() {
        if(!gs.gameOver){
            fadeOut("Game <span class='redcolor'>aborted</span>!");
            gs.gameOver = true;
        }
    };
  
    socket.onerror = function() {};
  })();

