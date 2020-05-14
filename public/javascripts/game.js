
// HEAVY WIP

var tableRow = null;
var tableData = null;
var combination = [];

//create general check function that will be exported
export default function check(){
    if(horizontalCheck() || verticalCheck() || diagonalCheck() || diagonalCheck2()){
        
    }
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