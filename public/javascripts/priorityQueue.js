// Class for the possible moves
class QElement { 
    constructor(element, priority) 
    { 
        this.element = element; 
        this.priority = priority; 
    } 
} 
  
// PriorityQueue class 
class PriorityQueue { 
  
    // An array is used to implement priority
    // A second array is created to store the elements of the priority queue while performing calculations on them
    constructor(){ 
        this.items = []; 
        this.temp = [];
        this.won = false;
    } 
  
    // enqueue function to add element 
    // to the queue as per priority 
    enqueue(element, priority){ 
        // creating object from queue element 
        var qElement = new QElement(element, priority); 
        var contain = false; 
    
        // iterating through the entire 
        // item array to add element at the 
        // correct location of the Queue 
        for (var i = 0; i < this.items.length; i++) { 
            if (this.items[i].priority > qElement.priority) { 
                // Once the correct location is found it is 
                // enqueued 
                this.items.splice(i, 0, qElement); 
                contain = true; 
                break; 
            } 
        } 
    
        // if the element has the highest priority 
        // it is added at the end of the queue 
        if (!contain) { 
            this.items.push(qElement); 
        } 
    }
    
    // dequeue method to remove 
    // element from the queue 
    dequeue(){ 
        // return the dequeued element 
        // and remove it. 
        // if the queue is empty 
        // returns Underflow 
        if (this.isEmpty()) 
            return "Underflow"; 
        return this.items.pop();         
    }
    
    // front function 
    front(){ 
        // returns the highest priority element 
        // in the Priority queue without removing it. 
        if (this.isEmpty()) 
            return "No elements in Queue"; 
        return this.items[this.items.length-1]; 
    } 

    // isEmpty function 
    isEmpty(){ 
        // return true if the queue is empty. 
        return this.items.length == 0; 
    } 

    // printQueue function 
    // prints all the element of the queue 
    printPQueue(){ 
        var str = ""; 
        for (var i = this.items.length-1; i >= 0; i--) 
            str += this.items[i].element + " "; 
        return str; 
    }

    // refresh method to refresh the priority queue
    // all relevant cells are given a new weight
    refreshPQ(cell){
        for(let i = 0; i < this.items.length; i++){
            if(front().element == cell){
                this.items.dequeue();               
            }
            else {
                this.temp[i] = this.items.dequeue();
            }
        }

        let row = cell.parentElement.rowIndex;
        if(row > 0){
            this.temp[this.temp.length] = new QElement(tableRow[row-1].children[cell.cellIndex], 0);
        }

        while(this.temp.length > 0 && !this.won){
            //recalculatePriority(this.temp[0]);
            enqueue(this.temp[0]);
            this.tempList.splice(0, 1);
        }        
    }

    // recalculatePriority(qElement){
    //     let value = 0;
    //     var cell = qElement.element; 
        
    //     //Check whether its a winning move
    //     cell.style.backgroundColor = getColor(1);
    //     if(checkWon()){
    //         value += 60;
    //         this.won = true;
    //     }

    //     //Check if it prevents the other player from winning
    //     cell.style.backgroundColor = getColor(0);
    //     if(checkWon()){
    //         value += 50;
    //     }

    //     else if(){
    //         value += 50;
    //     }
    //     else if(){
    //         value += 40;
    //     }
    //     else if (){
    //         value += 30;
    //     }
    //     else if (){
    //         value += 20;
    //     }
    //     else {
    //         value += 10;
    //     }

    //     qElement.priority = value;
    //     cell.style.backgroundColor = 'white';
    // }
} 