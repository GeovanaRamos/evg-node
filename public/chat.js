(function () {
    //This is the message object, which has some text, and a "side"
    var Message;
    var messageId = 0;
    var replyId = 0;
    var userPicId = (Math.round(Math.random()) + 1);
    var showHelpTooltip = true;
    Message = function (arg) {
        this.text = arg.text;
        this.message_side = arg.message_side;
        this.sender = arg.sender;
        this.originalMessage = arg.originalMessage;
        //The draw function takes the message_template, which is a hidden html element and clones it
        //then it adds the ".text" class to mark that it has text, and insert the message text in it
        //Finally it appends the newly cloned element in the "messages" div containing all the messages
        //and add an animation, which is completed by adding the "appeared" class to the element
        this.draw = function (_this) {
            return function () {
                var $message = $($('.message_template').clone().html()); //Create the new message starting from the template

                if (_this.sender === "bot") {
                    if (_this.originalMessage === "init") {
  
                    } else {
                        //Looking for the last element in the messages container with class left and writing
                        $lastWritingMessage =  $('.message.left.writing');
                    
                        $message.attr("replyId", replyId++);
            
                    }
                } else {
                    $message.attr("messageId", messageId++);
                }

                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $message.find(".avatar").attr('class', 'transparent avatar'); //I want the avatar to be transparent
                //I am getting the class of the last message received, if it's NOT on the same side as the one I want to append
                //I want to show the avatar and also the message tick
                //the avatar is already transparent so if I want to show the bot pic or the user pic I just append the img element
                $lastMessage = $('.messages li:last-child').last();
                if (!$lastMessage.hasClass(_this.message_side)) {
                    var userPicString = _this.message_side == "left" ? "bot_pic.png" :  "user" + userPicId + ".svg";
                    $message.find(".avatar").append("<img class='avatarPic' src='" +userPicString +"'>");
                } else {
                    if($lastMessage.hasClass("writing")){
                        $lastMessage.removeClass("writing");
                    }
                    else{
                        //if we are still on the same side I want to remove the tick and I also avoid appending the user or bot pic
                        $message.find(".text_wrapper").addClass("no-tick");
              
                    }
                }
                var date = new Date();
                $message.find(".message-time").text(moment().format('HH:mm'));
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };

    $(function () {
        var getMessageText, message_side, sendMessage;
        var message_side = 'right';
        const messageChannel = 'message';
        const replyChannel = 'reply';
        var socket = io();

        socket.on(replyChannel, function (answer, question) {
            console.log("Received a reply from bot: ");
            console.log(answer);
            appendMessage(answer, "bot", question);
        });

        socket.on(messageChannel, function (msg, isUser) {
            console.log("Received a message: " + msg);
            appendMessage(text, "user", "");
        });


        sendMessage = function (text) {
            var message_input = $('.message_input');
            var messageText = message_input.val().trim();
            if (messageText === '') {
                return;
            }
            $('.message_input').val('');
            console.log("sending message " + messageText);
            socket.emit(messageChannel, messageText, true, function(message){
                console.log("Log: " + message);
            });
            appendMessage(messageText, "user", "");
        };

        appendMessage = function (text, from, originalMessage) {
            //IF the message is empty, do nothing
            if (text.trim() === '') {
                return;
            }

            var $messages, message;

            $messages = $('.messages');
            //IF the message is from the bot, then the bubble should be on the left
            //Otherwise if the message is from the user, it should be on the right
            message_side = from === 'bot' ? 'left' : 'right';

            //Let's create the new message object, with its text and its side and then draw it
            message = new Message({
                text: text,
                message_side: message_side,
                sender: from,
                originalMessage: originalMessage
            });
            message.draw();

            //We animate the message box to scroll down by the height of the message, to show it all
            return $messages.animate({
                scrollTop: $messages.prop('scrollHeight')
            }, 100);
        }

        $('.send_message').click(function (e) {
            return sendMessage();
        });

        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                return sendMessage();
            }
        });

        var themeSwitch = document.querySelector('.js-theme-switch');
        var init2 = new Switchery(themeSwitch,  {jackSecondaryColor: '#b1e0f9', secondaryColor: '#fdd5a9', jackColor: '#ded9d9', color: '#5773ff'});
        init2.setPosition(true);

        
        themeSwitch.addEventListener('click', function () {
            var messagesContainer = $(".messages");
            if(messagesContainer.hasClass("theme1")){
                console.log("Has theme1, switching to theme2");
                messagesContainer.removeClass("theme1").addClass("theme2");
            }
            else if(messagesContainer.hasClass("theme2")){
                console.log("Has theme2, switching to theme1");
                messagesContainer.removeClass("theme2").addClass("theme1");
            }
        });

       
    });

}.call(this));