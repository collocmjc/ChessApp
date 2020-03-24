var express = require('express');
var fs = require("fs");
var url = require('url');
var querystring = require('querystring');
var game = require('./js/game');
var movee=require('./js/move');

//Init Game
var game = game.Game();

var app = express();
app.engine('html', require('ejs').renderFile);
app.use(express.static('public'));
//menu
app.get('/', function(req, res) {
res.render("index.html");
})
//multiplayer game(human vs human)
.get('/multi', function(req, res) {
  var params = querystring.parse(url.parse(req.url).query);
  var moveString=params["move"];
  //Start Position
  if (moveString==='Start'){
    game.restart();
    res.render('board.html', {position: game.posToFEN(), yourTurn: true, checked:"", over:false, mode:"multi"});
 }
 //Undo last move
 else if (moveString==='Undo'){
   game.undoMove();
   res.render('board.html', {position: game.posToFEN(), yourTurn: true, checked:game.isChecked(), over:false, mode:'multi'});
 }
 //normal move
 else{
  var move=movee.Move(moveString);
  if(game.isLegalMove(move)){
    game.doMove(move);
    var legalMoves=game.legalMoves();
    if(legalMoves.length===0){
      if(game.isChecked()){
        res.render('board.html', {position: game.posToFEN(), yourTurn: true, checked:game.isChecked(),over:true, mode:'multi'});
      }
      else{
        res.render('board.html', {position: game.posToFEN(), yourTurn: true, checked:game.isChecked(),over:'pat', mode:'multi'});
      }
    }
  }
  else{
  res.render('board.html', {position: game.posToFEN(), yourTurn: true, checked:game.isChecked(),over:false, mode:'multi'});
  }
 }
})
//solo game(human vs IA)
.get('/solo', function(req, res) {
  var params = querystring.parse(url.parse(req.url).query);
  var moveString=params["move"];
  //Start Position
  if (moveString==='Start'){
    game.restart();
    res.render('board.html', {position: game.posToFEN(), yourTurn: true, checked:"", over:false, mode:'solo'});
 }
 //Undo last move
 else if (moveString==='Undo'){
   game.undoMove();
   game.undoMove();
   res.render('board.html', {position: game.posToFEN(), yourTurn: true, checked:game.isChecked(), over:false, mode:'solo'});
 }
 //normal move
 else{
  var move=movee.Move(moveString);
  if(game.isLegalMove(move)){
    game.doMove(move);
    var legalMoves=game.legalMoves();
    if(legalMoves.length===0){
      if(game.isChecked()){
        res.render('board.html', {position: game.posToFEN(), yourTurn: false, checked:game.isChecked(),over:'win', mode:'solo'});
      }
      else{
        res.render('board.html', {position: game.posToFEN(), yourTurn: false, checked:game.isChecked(),over:'pat', mode:'solo'});
      }
    }
    else{
      var computerMove=game.chooseBestMove(legalMoves);
      game.doMove(computerMove);
      if(legalMoves.length===0){
        if(game.isChecked()){
          res.render('board.html', {position: game.posToFEN(), yourTurn: false, checked:game.isChecked(),over:'lose', mode:'solo'});
        }
        else{
          res.render('board.html', {position: game.posToFEN(), yourTurn: false, checked:game.isChecked(),over:'pat', mode:'solo'});
        }
      }
      else{
        res.render('board.html', {position: game.posToFEN(), yourTurn: true, checked:game.isChecked(),over:false, mode:'solo'});
        }
      }
    }
    else{
      res.render('board.html', {position: game.posToFEN(), yourTurn: true, checked:game.isChecked(),over:false, mode:'solo'});
    }
  }
})
.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
})

app.listen(8080);
