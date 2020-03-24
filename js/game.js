var board=require('./board');
function Game(){
  var obj = {};
  obj.whitesToPlay = true;
  obj.board = board.Board();
  obj.moves=[];
  obj.posToFEN=function(){
    return(this.board.posToFEN());
  };
  obj.restart=function(){
    this.board=board.Board();
    this.whitesToPlay=true;
    this.moves=[];
  };
  obj.isLegalMove=function(move){
    if (move.color===this.whitesToPlay){
      return(this.board.isLegalMove(move));
    }
    else{
      return(false);
    }
  };
  obj.doMove=function(move){
    obj.whitesToPlay = !obj.whitesToPlay;
    this.moves.push(move);
    this.board.doMove(move);
  };
  obj.undoMove=function(){
    if(this.moves.length){
      obj.whitesToPlay = !obj.whitesToPlay;
      var move=this.moves.pop();
      this.board.undoMove(move);
    }
  };
  obj.isChecked=function(){
    if(this.board.isChecked(this.whitesToPlay)){
      if(this.whitesToPlay){
        var king=this.board.pieces[0];
      }
      else{
        var king=this.board.pieces[1];
      }
      return(AbsToLetter(king.abs) + king.ord.toString());
    }
    return("");
  };
  obj.legalMoves=function(){
    return(this.board.legalMoves(this.whitesToPlay));
  };
  obj.chooseBestMove=function(moves){
    var minIndex=0;
    var minHeuristic=500;
    for(let i=0; i<moves.length; i++){
      var moveToTest=moves[i];
      this.board.doMove(moveToTest);
      var heuristic=this.board.heuristic();
      this.board.undoMove(moveToTest);
      if (heuristic<=minHeuristic){
        minIndex=i;
        minHeuristic=heuristic;
      }
    }
    return(moves[minIndex]);
  };
  return obj;
}

function AbsToLetter(abs){
  if (abs===1){
    return('a');
  }
  if (abs===2){
    return('b');
  }
  if (abs===3){
    return('c');
  }
  if (abs===4){
    return('d');
  }
  if (abs===5){
    return('e');
  }
  if (abs===6){
    return('f');
  }
  if (abs===7){
    return('g');
  }
  if (abs===8){
    return('h');
  }
}


exports.Game = Game;
