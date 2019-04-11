
//services
const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const classifier = require('./nlu/classifier.js');


// socket.io channels 
const messageChannel = 'message';
const replyChannel = 'reply';

app.use('/', express.static(path.join(__dirname + '/public')));


io.on('connection', function (socket) {
  console.log("User connected to Chatbot");
  socket.emit(replyChannel, "Olá");
  socket.emit(replyChannel, "Como posso ajudar?");
  socket.on(messageChannel, function (message, isUser, fn) {
    
    setTimeout(function(){
      fn('Message arrived to the server'); //callback function
    }, 800);
      console.log("Chatbot received a message saying: ", message);
      setTimeout(function(){
        sendToBot(message, socket);
      }, 800);
      
      // fn('Message arrived to the server'); //callback function
      // sendToBot(message, socket);
      
  });

  socket.on(replyChannel, function(message, intent, feedback){
    console.log("Message: " + message +" | Intent: " +intent +" | Feedback: " + feedback);
  });
});

var port = 8000;
server.listen(port, function () {
  console.log('Chatbot is listening on port ' + port + '!')
});

sendToBot = function(message, socket){  
  classifier.parse(message, function (error, answer, question) {
    if (error) {
      socket.emit(replyChannel, "An error has occurred: " + error);
    } else {
      console.log("QEA", answer, question)
      socket.emit(replyChannel, answer, question);
    }
  });
}