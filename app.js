var restify = require('restify');
var botbuilder = require('botbuilder');


// setup restify server

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function(){
    console.log('%s bot started at %s', server.name, server.url);
});

// create chat connector
var connector = new botbuilder.ChatConnector({
    appId: process.env.APP_ID,
    appPassword: process.env.APP_SECRET
});

// listening for user inputs
server.post('/api/messages', connector.listen());

// reply by enchoing
var bot = new botbuilder.UniversalBot(connector, function(session){
    session.send('You have tapped: %s | [length: %s]', session.message.text, session.message.text.length);

    bot.on('typing', function(){
        session.send("......................");
    }, 3000);

    

    bot.on('conversationUpdate', function(message){
        if(message.membersAdded && message.membersAdded.length > 0){
            var membersAdded = message.membersAdded
                .map(function(x){
                    var isSelf = x.id == message.address.bot.id;
                    return (isSelf ? message.adress.bot.name : x.name) || '' + '(Id = ' + x.id / ')'
                }).join(', ');
            bot.send(new botbuilder.Message()
                .address(message.address)
                .text('Bienvenue ' + membersAdded));
        }

        if (message.membersRemoved && message.membersRemoved.length > 0) {
            var membersRemoved = message.membersRemoved
                .map(function(x) {
                    var isSelf = x.id === message.address.bot.id;
                    return (isSelf ? message.address.bot.name : x.name) || '' + ' (Id = ' + x.id + ')';
                }).join(', ');
    
            bot.send(new botbuilder.Message()
                .address(message.address)
                .text(membersRemoved + 'a quitté la conversation'));
        }
    });


    //session.send(JSON.stringify(session.dialogData));
    //session.send(JSON.stringify(session.sessionState));
    //session.send(JSON.stringify(session.conversationData));
    //session.send(JSON.stringify(session.userData));
});