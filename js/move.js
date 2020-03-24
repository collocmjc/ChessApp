//fonction abstraite
function Move(move){
  var obj = {};
  obj.color=(move[0]==='w');
  obj.type=move[1];
  obj.sourceAbs=letterToAbs(move[2]);
  obj.sourceOrd=parseInt(move[3],10);
  obj.targetAbs=letterToAbs(move[4]);
  obj.targetOrd=parseInt(move[5],10);
  if(obj.type=='P' && (obj.targetOrd==8 || obj.targetOrd==1)){
    obj.promotion=true;
  }
  else{
    obj.promotion=false;
  }
  return obj;
}

function CandidateMove(color, candidatePiece, targetAbs, targetOrd){
  var obj = {};
  obj.color=color;
  obj.type=candidatePiece.toType();
  obj.sourceAbs=candidatePiece.abs;
  obj.sourceOrd=candidatePiece.ord;
  obj.targetAbs=targetAbs;
  obj.targetOrd=targetOrd;
  if(obj.type=='P' && (obj.targetOrd==8 || obj.targetOrd==1)){
    obj.promotion=true;
  }
  else{
    obj.promotion=false;
  }
  return obj;
}

function CheckMove(candidatePiece, king){
  var obj = {};
  obj.color=candidatePiece.color;
  obj.type=candidatePiece.toType;
  obj.sourceAbs=candidatePiece.abs;
  obj.sourceOrd=candidatePiece.ord;
  obj.targetAbs=king.abs;
  obj.targetOrd=king.ord;
  if(obj.type=='P' && obj.targetAbs==8 && obj.targetAbs==1){
    obj.promotion=true;
  }
  else{
    obj.promotion=false;
  }
  return obj;
}

function letterToAbs(letter){
  if (letter==='a'){
    return(1);
  }
  if (letter==='b'){
    return(2);
  }
  if (letter==='c'){
    return(3);
  }
  if (letter==='d'){
    return(4);
  }
  if (letter==='e'){
    return(5);
  }
  if (letter==='f'){
    return(6);
  }
  if (letter==='g'){
    return(7);
  }
  if (letter==='h'){
    return(8);
  }
}

exports.Move = Move;
exports.CheckMove = CheckMove;
exports.CandidateMove = CandidateMove;
