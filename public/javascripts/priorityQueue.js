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
    }
  
    // enqueue function to add element to the queue as per priority 
    enqueue(element, priority){ 
        // creating object from queue element 
        var qElement = new QElement(element, priority);
        this.enqueueQElement(qElement); 
    }

    //enqueue function to add QElements to the queue 
    enqueueQElement(qElement){
        var contain = false;
        
        // iterating through the entire item array to add element at the correct location of the Queue 
        for (var i = 0; i < this.items.length; i++) { 
            if (this.items[i].priority > qElement.priority) { 
                this.items.splice(i, 0, qElement); 
                contain = true; 
                break; 
            } 
        } 
    
        // if the element has the highest priority it is added at the end of the queue 
        if (!contain) { 
            this.items.push(qElement); 
        } 
    }
    
    // dequeue method to remove element from the queue and return it. If the queue is empty, it returns Underflow.
    // if the corresponding cell is not in the first row, the cell above the cell is inserted in the priority queue.
    dequeueAndEnqueueAbove(){ 
        if (this.isEmpty()){ 
            return "Underflow";
        }
        
        let qEelement = this.items.pop();
        let row = qEelement.element.parentElement.rowIndex;
        if(row > 0){
            this.enqueueQElement(new QElement(tableRow[row-1].children[qEelement.element.cellIndex], Math.random()));
        }

        return qEelement;         
    }

    // method to remove the first item from the priorityqueue and return it.  
    dequeue(){
        if (this.isEmpty()){ 
            return "Underflow";
        }
        
        return this.items.pop();
    }

    // resets the priority queue by enqueuing the elements from a given entrylist 
    reset(pqElements){
        this.items = [];
        pqElements.forEach(element => {
            this.enqueueQElement(element);
        });
    }
    
    // returns the highest priority element in the Priority queue without removing it. 
    front(){ 
        if (this.isEmpty()) 
            return "No elements in Queue"; 
        return this.items[this.items.length-1]; 
    } 

    // checks whether the pq is empty or not 
    isEmpty(){  
        return this.items.length == 0; 
    } 

    // prints all the element of the queue 
    printPQueue(){ 
        var str = ""; 
        for (var i = this.items.length-1; i >= 0; i--) 
            str += this.items[i].element + " "; 
        return str; 
    }

    // method used for testing to take a look at the current state of the pq
    lookInArray(){
        return this.items;
    }

    //retrieves a list of elements present in the priority queue after the given cell has been played
    retrieveEntriesAfterTurn(cell){
        this.temp = [];

        let counter = 0;
        while(!this.isEmpty()){
            if(this.front().element == cell){
                this.dequeue();
            }
            else{
                this.temp[counter] = this.dequeue();
                counter++;
            }
        }
        let row = cell.parentElement.rowIndex;
        if(row > 0){
            this.temp[this.temp.length] = new QElement(tableRow[row-1].children[cell.cellIndex], Math.random());
        }
        return this.temp;        
    }
} 