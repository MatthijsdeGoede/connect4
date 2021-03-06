var currentPlayer = Math.round(Math.random());
var gameOver = false;
var opponent = "Computer";
var playerType = 0;    
var myName = null;

var pq = new PriorityQueue();
var tableRow = document.getElementsByTagName('tr');
var tableData = document.getElementsByTagName('td');
var playerStatus = document.getElementById("player-turn");
var movesound = new Audio("../data/pop.mp3");

var combination = [];
var time = 0;

(function checkNickNameCookie(){
    var cookiesArray = document.cookie.split('; ');
    var cookies=[];

    for(var i=0; i < cookiesArray.length; i++) {
        var cookie = cookiesArray[i].split("=");
        cookies[cookie[0]]=cookie[1];
    }

    if(cookiesArray.length>0 && cookies["nickname"] != null){
        myName = cookies["nickname"];
        startscreen();        
    }
})();

function retrieveNickName(){
    let date = new Date(Date.now() + 86400e3);
    date = date.toUTCString();
    myName = document.getElementById("nickname").value;
    document.cookie = "nickname=" + myName + "; expires=" + date;
    startscreen();
}

function startscreen(){
    document.getElementById("enter-nickname").style.display = "none";
    var playerBlock = document.getElementById("players");
    playerBlock.style.display = "block";
    var opponentColor = (playerType == 0) ? getColorClass(1) : getColorClass(0);
    playerBlock.innerHTML = myName + `<span class=${getColorClass(playerType)}> •</span>` + "<br>" + opponent + `<span class=${opponentColor}> •</span>`;
    document.getElementById("startscreen").style.display = "inline-block";
    timer();
}

function start(){
    time = 0;
    document.getElementById("startscreen").style.display = "none";
    document.getElementById("gametime").style.display = "block";
    document.getElementById("replay").style.display = "inline-block";
    document.getElementById("gamegrid").style.display = "inline-block";  
    updateTurnInfo();
    
    // initializing the priorityqueue with the cells of the last row with a random priority between 0 and 1. 
    for(let i = 0; i < 7; i++){
        pq.enqueue(tableRow[5].children[i], Math.random());
    }

    // when the computer is the starting player
    if(currentPlayer == 1){
        quickComputerPlayer();
    }
}

function quickComputerPlayer(){
    changeColorHelper(pq.dequeueAndEnqueueAbove().element, currentPlayer);
    changeTurn();
}
    
function changeTurn(){
    currentPlayer = currentPlayer == 1 ? 0 : 1;
    updateTurnInfo();
    if(currentPlayer == 1){
        quickComputerPlayer();
    }
}

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

    if($(this)[0].style.backgroundColor == 'white' && !gameOver && checkValidMove($(this)[0]) && currentPlayer == playerType){
        $(this)[0].style.border = `7px solid ${getColor(playerType)}`;
        $(this)[0].style.width = '56px';
        $(this)[0].style.height = '56px';
    }
    else if($(this)[0].style.backgroundColor == 'white' && !gameOver && currentPlayer == playerType){
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

function updateTurnInfo(){
    if(currentPlayer == playerType){
        playerStatus.innerHTML = `<span class='${getColorClass(currentPlayer)}'>Your</span> turn`;
    }
    else{     
        var textaddon = opponent.substring(opponent.length-1) == "s" ? "" : "'s";
        playerStatus.innerHTML = `<span class='${getColorClass(currentPlayer)}'>${opponent}${textaddon}</span> turn`;
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
    if(currentPlayer == playerType && cell.style.backgroundColor == 'white' && !gameOver && checkValidMove(cell)){
        changeColorHelper(cell, playerType);
    }
}

function changeColorHelper(cell, colorId){    
    movesound.play();

    cell.style.backgroundColor = getColor(colorId);
    let winnerText = '';

    if (checkWon()){
        if(colorId == playerType){
            winnerText = `Game over! <span class='${getColorClass(colorId)}'>You</span> won!`;
        }
        else{
            winnerText = `Game over! <span class='${getColorClass(colorId)}'>${opponent}</span> won!`;
        }
        playerStatus.innerHTML = winnerText;

        showCombination();
        setTimeout(function(){ fadeOut(winnerText) }, 2000);
    }
    else if (drawCheck()){
        playerStatus.innerHTML = 'Draw!';
        setTimeout(function(){ fadeOut('Draw!') }, 2000);
    }
    else{
        if(colorId == playerType){
            updatePQAfterPlayerTurn(cell);
            changeTurn();
        }  
    }
    console.log(pq.lookInArray());
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

function checkWon(){
    return (horizontalCheck4() || verticalCheck4() || diagonalCheck4() || diagonalCheck24());
}

function checkConnectsThree(){
    return (horizontalCheck3() || verticalCheck3() || diagonalCheck3() || diagonalCheck23());
}

function checkConnectsTwo(){
    return (horizontalCheck2() || verticalCheck2() || diagonalCheck2() || diagonalCheck22());
}

function connect4Check(one, two, three, four){
    return (one === four && connect3Check(one, two, three));
}

function connect3Check(one, two, three){
    return (one === three && connect2Check(one, two));
}

function connect2Check(one, two){
    return (one === two && one != 'white' && one !== undefined);
}

function horizontalCheck4(){
    for (let row = 0; row < tableRow.length; row++){
        for (let col =0; col < 4; col++){
        
            let a = tableRow[row].children[col];
            let b = tableRow[row].children[col+1];
            let c = tableRow[row].children[col+2]
            let d = tableRow[row].children[col+3];

            if (connect4Check(a.style.backgroundColor, b.style.backgroundColor, c.style.backgroundColor, d.style.backgroundColor)){
                combination = [a, b, c, d];                    
                return true;
            }
        }
    }
}

function verticalCheck4(){
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

function diagonalCheck4(){
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

function diagonalCheck24(){
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

function horizontalCheck3(){
    for (let row = 0; row < tableRow.length; row++){
        for (let col =0; col < 5; col++){
        
            let a = tableRow[row].children[col];
            let b = tableRow[row].children[col+1];
            let c = tableRow[row].children[col+2];

            if (connect3Check(a.style.backgroundColor,b.style.backgroundColor, c.style.backgroundColor)){                        
                return true;
            }
        }
    }
}

function verticalCheck3(){
    for (let col = 0; col < 7; col++){
        for (let row = 0; row < 4; row++){

            let a = tableRow[row].children[col];
            let b = tableRow[row+1].children[col];
            let c = tableRow[row+2].children[col];
            
            if (connect3Check(a.style.backgroundColor, b.style.backgroundColor, c.style.backgroundColor)){                    
                return true;
            }
        }   
    }
}

function diagonalCheck3(){
    for(let col = 0; col < 5; col++){
        for (let row = 0; row < 4; row++){

            let a = tableRow[row].children[col];
            let b = tableRow[row+1].children[col+1];
            let c = tableRow[row+2].children[col+2];

            if (connect3Check(a.style.backgroundColor, b.style.backgroundColor, c.style.backgroundColor)){
                return true;
            }
        }
    }
}

function diagonalCheck23(){
    for(let col = 0; col < 5; col++){
        for (let row = 5; row > 1; row--){

            let a = tableRow[row].children[col];
            let b = tableRow[row-1].children[col+1];
            let c = tableRow[row-2].children[col+2];

            if (connect4Check(a.style.backgroundColor, b.style.backgroundColor, c.style.backgroundColor)){
                return true;
            }
        }
    }
}

function horizontalCheck2(){
    for (let row = 0; row < tableRow.length; row++){
        for (let col =0; col < 6; col++){
        
            let a = tableRow[row].children[col];
            let b = tableRow[row].children[col+1];

            if (connect2Check(a.style.backgroundColor,b.style.backgroundColor)){                        
                return true;
            }
        }
    }
}

function verticalCheck2(){
    for (let col = 0; col < 7; col++){
        for (let row = 0; row < 5; row++){

            let a = tableRow[row].children[col];
            let b = tableRow[row+1].children[col];
            
            if (connect2Check(a.style.backgroundColor, b.style.backgroundColor)){                    
                return true;
            }
        }   
    }
}


function diagonalCheck2(){
    for(let col = 0; col < 6; col++){
        for (let row = 0; row < 5; row++){

            let a = tableRow[row].children[col];
            let b = tableRow[row+1].children[col+1];

            if (connect3Check(a.style.backgroundColor, b.style.backgroundColor)){
                return true;
            }
        }
    }
}

function diagonalCheck22(){
    for(let col = 0; col < 6; col++){
        for (let row = 5; row > 0; row--){

            let a = tableRow[row].children[col];
            let b = tableRow[row-1].children[col+1];
    
            if (connect4Check(a.style.backgroundColor, b.style.backgroundColor)){
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
        if(!gameOver){
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
            document.getElementById("gametime").innerHTML = hours + ":" + mins + ":" + secs;
            timer(true);
        }
    },100);
}

// updates the priority queue after a player has made a turn. 
function updatePQAfterPlayerTurn(cell){
    var pqElements = pq.retrieveEntriesAfterTurn(cell);

    pqElements.forEach(qElement => {
        recalculatePriority(qElement);
    });

    pq.reset(pqElements);
}

// recalculates the priority of a given qElement
function recalculatePriority(qElement){
    let cell = qElement.element;
    let value = 0;

    //first check winning move
    cell.style.backgroundColor = getColor(1);
    if(checkWon()){
        value += 600;
    }
    else{
        //if not, then check if it prevents the other player from winning
        cell.style.backgroundColor = getColor(0);
        if(checkWon()){
            value += 500;
        }
        else{
            //if not, then check whether it creates an array of 3, taking into account that the opponent cannot win in the next turn, assign weights for array length (multiplicities) and open spots
            cell.style.backgroundColor = getColor(1);
            if(checkConnectsThree()){
                value += 400;
            }
            else{
                //if not, then check whether it can prevent the opponent from creating an array of three
                cell.style.backgroundColor = getColor(0);
                if(checkConnectsThree()){
                    value += 300;
                }
                else{
                    //if not, then check whether it creates an array of 2, taking into account that the opponent cannot win in the next turn, assign weights for array length and open spots
                    cell.style.backgroundColor = getColor(1);
                    if(checkConnectsTwo()){
                        value += 200;
                    }
                    else{
                        //if not, then it is at most possible to prevent the opponent from creating an array of two, but not important as this will never be the priority.
                        value += 100;
                    }
                }
            }
        }
    }
    qElement.priority = value;
    cell.style.backgroundColor = 'white';
}