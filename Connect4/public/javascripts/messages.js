(function(exports) {
    /*
     * Client to server: game is complete, the winner is ...
     */

    exports.T_NICKNAME = "nickname: ";
    exports.O_NICKNAME = {
        type: exports.T_NICKNAME,
        nickname: null
    }    
    exports.S_NICKNAME = JSON.stringify(exports.O_NICKNAME);
  
    exports.T_READY_TO_START = "2 JOINT";
    exports.O_READY_TO_START = {
        type: exports.T_READY_TO_START,
        data: null,
        opponentName: null,
        startingPlayer: null
    };
    exports.S_READY_TO_START = JSON.stringify(exports.O_READY_TO_START);

    exports.A_TURN = "A turn";
    exports.O_A_TURN = {
        type: exports.A_TURN
    };
    exports.S_A_TURN = JSON.stringify(exports.O_A_TURN);

    exports.B_TURN = "B turn";
    exports.O_B_TURN = {
        type: exports.B_TURN
    };
    exports.S_B_TURN = JSON.stringify(exports.O_B_TURN);

    exports.T_MOVE_COMPLETED = "Move completed";
    exports.O_MOVE_COMPLETED = {
        type: exports.T_MOVE_COMPLETED,
        sender: null,
        row:null , 
        column:null 
    };
    exports.S_MOVE_COMPLETED = JSON.stringify(exports.O_MOVE_COMPLETED);

    exports.T_GAME_FINISHED = "Game is finished";
    exports.O_GAME_FINISHED = {
        type: exports.T_GAME_FINISHED,
        sender: null,
        row: null , 
        column:null 
    };
    exports.S_GAME_FINISHED = JSON.stringify(exports.O_GAME_FINISHED);

    exports.T_GAME_ABORTED = "Game is aborted";
    exports.O_GAME_ABORTED = {
        type: exports.T_GAME_ABORTED, 
        sender: null
    };    
    exports.S_GAME_ABORTED = JSON.stringify(exports.O_GAME_ABORTED);

    exports.T_DRAW = "There is a draw";
    exports.O_DRAW = {
        type: exports.T_DRAW,
        sender: null,
        row: null,
        column: null
    }
    exports.S_DRAW = JSON.stringify(exports.O_DRAW);

  })(typeof exports === "undefined" ? (this.Messages = {}) : exports);
  //if exports is undefined, we are on the client; else the server