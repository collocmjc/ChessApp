//var movee=require('./move')

//fonction abstraite
function Piece(color, abs, ord){
  var obj = {};
  obj.color=color;
  obj.abs=abs;
  obj.ord=ord;
  obj.doMove=function(move){
      this.abs=move.targetAbs;
      this.ord=move.targetOrd;
  }
  obj.undoMove=function(move){
      this.abs=move.sourceAbs;
      this.ord=move.sourceOrd;
  }
  obj.isLegalMove=function(move,board){
    console.log('abstract');
      return(true);
  }
  return(obj);
  };
function Pawn(color, abs, ord){
  var obj = Piece(color,abs,ord);
  obj.toType=function(){
    return('P');
  }
  obj.value=function(){
    return(1);
  }
  obj.isLegalMove=function(move,board){
    //advance
  if(move.targetAbs===move.sourceAbs){
    //free case
    if (board.whoIsHere(move.targetAbs,move.targetOrd)==null){
      //white
      if (this.color){
         if(move.targetOrd===move.sourceOrd+1){
           return(true);
         }
         //premier coup
         else if ((move.targetOrd===4)&& move.sourceOrd===2) {
           //free intermediate case
            if (board.whoIsHere(move.targetAbs,move.targetOrd-1)==null){
                return(true);
            }
         }
       }
       //black
       else{
         if(move.targetOrd===move.sourceOrd-1){
           return(true);
       }
       //premier coup
       else if ((move.targetOrd===5)&& move.sourceOrd===7) {
         //free intermediate case
          if (board.whoIsHere(move.targetAbs,move.targetOrd+1)==null){
              return(true);
          }
       }
     }
   }
  }
  //Attack
  else if ((move.targetAbs===move.sourceAbs+1)||(move.targetAbs===move.sourceAbs-1)) {
    var pieceToAttack=board.whoIsHere(move.targetAbs,move.targetOrd);
    if (pieceToAttack!=null &&pieceToAttack.color!=move.color){
      //white
      if (this.color){
         if(move.targetOrd===move.sourceOrd+1){
           return(true);
         }
       }
       //black
       else{
         if(move.targetOrd===move.sourceOrd-1){
           return(true);
       }
     }
   }
  }
  return(false);
 }
  obj.toFEN=function(){
    if (color){
      return('P');
    }
    else {
      return('p');
    }
  };
  return obj;
}
function Rook(color, abs, ord){
  var obj = Piece(color,abs,ord);
  obj.toType=function(){
    return('R');
  }
  obj.value=function(){
    return(5);
  }
  obj.isLegalMove=function(move,board){
    //Free Case or attack
    var caseToGo = board.whoIsHere(move.targetAbs,move.targetOrd);
    if (caseToGo==null||caseToGo.color!=move.color){
      //lines
      if (move.targetAbs!=move.sourceAbs && move.targetOrd==move.sourceOrd){
        var pathFree=true;
        for (let i=1; i<9; i++){
            if((i>move.sourceAbs && i<move.targetAbs)||(i<move.sourceAbs && i>move.targetAbs)){
              if (board.whoIsHere(i,move.sourceOrd)!=null){
                pathFree=false;
              }
            }
          }
          return(pathFree);
        }
      //columns
      if (move.targetAbs==move.sourceAbs && move.targetOrd!=move.sourceOrd){
        var pathFree=true;
        for (let i=1; i<9; i++){
            if((i>move.sourceOrd && i<move.targetOrd)||(i<move.sourceOrd && i>move.targetOrd)){
              if (board.whoIsHere(move.sourceAbs, i)!=null){
                pathFree=false;
              }
            }
          }
        return(pathFree);
      }
    }
  return(false);
 }
  obj.toFEN=function(){
    if (color){
      return('R');
    }
    else {
      return('r');
    }
  };
  return obj;
}
function Knight(color, abs, ord){
  var obj = Piece(color,abs,ord);
  obj.toType=function(){
    return('N');
  }
  obj.value=function(){
    return(3);
  }
  obj.toFEN=function(){
    if (color){
      return('N');
    }
    else {
      return('n');
    }
  };
  obj.isLegalMove=function(move,board){
    //Free Case or attack
    var caseToGo = board.whoIsHere(move.targetAbs,move.targetOrd);
    if (caseToGo==null||caseToGo.color!=move.color){
      if (move.targetAbs!=move.sourceAbs && move.targetOrd!=move.sourceOrd && (Math.abs(move.targetAbs-move.sourceAbs)+Math.abs(move.targetOrd-move.sourceOrd)===3)){
        return(true);
      }
    }
  return(false);
 }
  return obj;
}
function Bishop(color, abs, ord){
  var obj = Piece(color,abs,ord);
  obj.toType=function(){
    return('B');
  }
  obj.value=function(){
    return(3);
  }
  obj.isLegalMove=function(move,board){
    //Free Case or attack
    var caseToGo = board.whoIsHere(move.targetAbs,move.targetOrd);
    if (caseToGo==null||caseToGo.color!=move.color){
      //in diag
      if (move.targetAbs!=move.sourceAbs && move.targetOrd!=move.sourceOrd && (Math.abs(move.targetAbs-move.sourceAbs) === Math.abs(move.targetOrd-move.sourceOrd))){
        var pathFree=true;
        for (let i=1; i<9; i++){
          for (let j=1; j<9; j++){
            var inDiag=Math.abs(i-move.sourceAbs) === Math.abs(j-move.sourceOrd);
            if(inDiag&& ((i>move.sourceAbs && i<move.targetAbs)||(i<move.sourceAbs && i>move.targetAbs))&&((j>move.sourceOrd && j<move.targetOrd)||(j<move.sourceOrd && j>move.targetOrd))){
              if (board.whoIsHere(i,j)!=null){
                pathFree=false;
              }
            }
          }
        }
        return(pathFree);
        }
    }
  return(false);
 }
  obj.toFEN=function(){
    if (color){
      return('B');
    }
    else {
      return('b');
    }
  };
  return obj;
}
function Queen(color, abs, ord){
  var obj = Piece(color,abs,ord);
  obj.toType=function(){
    return('Q');
  }
  obj.value=function(){
    return(9);
  }
  obj.isLegalMove=function(move,board){
    var rook=Rook(this.color, this.abs, this.ord);
    var bishop=Bishop(this.color, this.abs, this.ord);
    if(rook.isLegalMove(move, board)||bishop.isLegalMove(move, board)){
      return(true);
    }
    else{
      return(false);
    }
  }
  obj.toFEN=function(){
    if (color){
      return('Q');
    }
    else {
      return('q');
    }
  };
  return obj;
}
function King(color, abs, ord){
  var obj = Piece(color,abs,ord);
  obj.toType=function(){
    return('K');
  }
  obj.value=function(){
    return(100);
  }
  obj.isLegalMove=function(move,board){
    //Free Case or attack
    var caseToGo = board.whoIsHere(move.targetAbs,move.targetOrd);
    if (caseToGo==null||caseToGo.color!=move.color){
      if ((move.targetAbs!=move.sourceAbs || move.targetOrd!=move.sourceOrd) && (Math.abs(move.targetAbs-move.sourceAbs)<2&&Math.abs(move.targetOrd-move.sourceOrd)<2)){
        return(true);
      }
      /*//Rock
      //White
      else if(move.color && move.sourceAbs===5 && move.sourceOrd===1 && move.targetOrd===1){
        //little Rock
        if(move.targetAbs===7 && board.whoIsHere(1,6)=== null ){
          var candidateRook=board.whoIsHere(1,8);
          if(candidateRook!= null && candidateRook.toType()==='R'){
            var move = movee.Move(true, candidateRook, 6, 1);
            candidateRook.doMove(move);
            return(true);
          }
        }
      }
      //large Rock
      else if(move.targetAbs===3 && board.whoIsHere(1,4)=== null && board.whoIsHere(1,2)=== null)
        var candidateRook=board.whoIsHere(1,1);
        if(candidateRook!= null && candidateRook.toType()==='R'){
          var move = movee.Move(true, candidateRook, 3, 1);
          candidateRook.doMove(move);
          return(true);
        }
        //black
        */
    }
  return(false);
 }
  obj.toFEN=function(){
    if (color){
      return('K');
    }
    else {
      return('k');
    }
  };
  return obj;
}


exports.Pawn = Pawn;
exports.Rook = Rook;
exports.Knight = Knight;
exports.Bishop = Bishop;
exports.Queen = Queen;
exports.King = King;
