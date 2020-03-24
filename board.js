var piecee = require('./piece');
var movee = require('./move');
function Board(){
  var obj = {};
  var pieces= [];

  piece= piecee.King(true,5,1);pieces.push(piece);
  piece= piecee.King(false,5,8);pieces.push(piece);

  var piece=piecee.Rook(true,1,1); pieces.push(piece);
  piece= piecee.Knight(true,2,1);pieces.push(piece);
  piece= piecee.Bishop(true,3,1);pieces.push(piece);
  piece= piecee.Queen(true,4,1);pieces.push(piece);
  piece= piecee.Bishop(true,6,1);pieces.push(piece);
  piece= piecee.Knight(true,7,1);pieces.push(piece);
  piece= piecee.Rook(true,8,1);pieces.push(piece);

  piece= piecee.Pawn(true,1,2);pieces.push(piece);
  piece= piecee.Pawn(true,2,2);pieces.push(piece);
  piece= piecee.Pawn(true,3,2);pieces.push(piece);
  piece= piecee.Pawn(true,4,2);pieces.push(piece);
  piece= piecee.Pawn(true,5,2);pieces.push(piece);
  piece= piecee.Pawn(true,6,2);pieces.push(piece);
  piece= piecee.Pawn(true,7,2);pieces.push(piece);
  piece= piecee.Pawn(true,8,2);pieces.push(piece);

  piece=piecee.Rook(false,1,8); pieces.push(piece);
  piece= piecee.Knight(false,2,8);pieces.push(piece);
  piece= piecee.Bishop(false,3,8);pieces.push(piece);
  piece= piecee.Queen(false,4,8);pieces.push(piece);
  piece= piecee.Bishop(false,6,8);pieces.push(piece);
  piece= piecee.Knight(false,7,8);pieces.push(piece);
  piece= piecee.Rook(false,8,8);pieces.push(piece);

  piece= piecee.Pawn(false,1,7);pieces.push(piece);
  piece= piecee.Pawn(false,2,7);pieces.push(piece);
  piece= piecee.Pawn(false,3,7);pieces.push(piece);
  piece= piecee.Pawn(false,4,7);pieces.push(piece);
  piece= piecee.Pawn(false,5,7);pieces.push(piece);
  piece= piecee.Pawn(false,6,7);pieces.push(piece);
  piece= piecee.Pawn(false,7,7);pieces.push(piece);
  piece= piecee.Pawn(false,8,7);pieces.push(piece);
  obj.pieces=pieces;
  obj.destroyedPieces=[];
  obj.whoIsHere=function(abs, ord){
    for (let i=0; i<this.pieces.length;i++){
      var piece=this.pieces[i];
        if (piece.abs===abs && piece.ord===ord){
          return(piece);
        }
    }
    return(null);
  };

  obj.posToFEN=function(){
    var s='';
    for (let i=0; i<8;i++){
      for (let j=0; j<8;j++){
        var piece =this.whoIsHere(j+1,8-i);
        if (piece==null){
          s=s+'1';
        }
        else{
          s=s+piece.toFEN();
        }
      }
      s=s+'-';
    }
    return(s.substring(0,s.length-1));
  };
  obj.isLegalMove=function(move){
    for (let i=0; i<this.pieces.length;i++){
      var piece=pieces[i];
      if (piece.color===move.color && move.type===piece.toType()&&move.sourceAbs===piece.abs&& move.sourceOrd===piece.ord){
          if(piece.isLegalMove(move, this)){
          piece.doMove(move);
          destroyedPiece=this.destroyPiece(!move.color, move.targetAbs, move.targetOrd);
          var isChecked=this.isChecked(piece.color);
          piece.undoMove(move);
          if (destroyedPiece!=null){
            this.pieces.push(destroyedPiece);
          }
          return(!isChecked);
        }
        else{
          return(false);
        }
      }
    }
    console.log('no piece here');
    return(false);
  }
  obj.doMove=function(move){
    for (let i=0; i<this.pieces.length;i++){
      var piece=pieces[i];
      if (piece.color===move.color && move.type===piece.toType()&&move.sourceAbs===piece.abs&& move.sourceOrd===piece.ord){
          this.destroyedPieces.push(this.destroyPiece(!move.color, move.targetAbs, move.targetOrd));
          //promote
          if(move.promotion){
            var promoted=piecee.Queen(piece.color, piece.abs, piece.ord);
            this.destroyPiece(move.color, move.sourceAbs, move.sourceOrd);
            this.pieces.push(promoted);
            piece=promoted
          }
            piece.doMove(move);
      }
    }
  }
  obj.undoMove=function(move){
    for (let i=0; i<this.pieces.length;i++){
      var piece=this.pieces[i];
        if (piece.color===move.color && (move.type===piece.toType()||move.promotion) && move.targetAbs===piece.abs && move.targetOrd===piece.ord){
          var destroyedPiece=this.destroyedPieces.pop();
          if(move.promotion){
            var unpromoted=piecee.Pawn(piece.color, piece.abs, piece.ord);
            this.destroyPiece(move.color, move.targetAbs, move.targetOrd);
            this.pieces.push(unpromoted);
            piece=unpromoted
          }
          piece.undoMove(move);
          if (destroyedPiece!=null){
            this.pieces.push(destroyedPiece);
          }
      }
    }
  }
  obj.destroyPiece=function(color, abs, ord){
    for (let i=0; i<this.pieces.length;i++){
      var candidatePiece=this.pieces[i];
        if (candidatePiece.color==color && candidatePiece.abs===abs && candidatePiece.ord===ord){
          pieces.splice(i, 1);
          return(candidatePiece);
        }
      }
      return(null);
    }
    obj.isChecked=function(color){
      var isChecked=false;
      var king;
      if (color){
        king=this.pieces[0];
      }
      else {
        king=this.pieces[1];
      }
      for (let i=0; i<this.pieces.length;i++){
        var candidatePiece=this.pieces[i];
        var checkMove = movee.CheckMove(candidatePiece, king);
        if (candidatePiece.isLegalMove(checkMove, this)){
            isChecked=true;
        };
    }
    return(isChecked);
  };
  obj.legalMoves=function(color){
    var legalMoves=[];
    for (let k=0; k<this.pieces.length;k++){
      var piece=this.pieces[k];
      if(piece.color===color){
        for (let i=1; i<9;i++){
          for (let j=1; j<9;j++){
            var candidateMove=movee.CandidateMove(color, piece, i, j);
            if (piece.isLegalMove(candidateMove,this)){
                piece.doMove(candidateMove);
                destroyedPiece=this.destroyPiece(!candidateMove.color, candidateMove.targetAbs, candidateMove.targetOrd);
                var isChecked=this.isChecked(piece.color);
                piece.undoMove(candidateMove);
                if (destroyedPiece!=null){
                  this.pieces.push(destroyedPiece);
                }
                if(!isChecked){
                  legalMoves.push(candidateMove);
                }
              }
           }
         }
       }
    }
    return(legalMoves);
  };
  return obj;
}


exports.Board = Board;
