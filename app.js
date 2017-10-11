var restify = require('restify');
var botbuilder = require('botbuilder');

// Setup restify

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function(){
    console.log('%s bot started at %s', server.name, server.url);
});

// Setup connector
var connector = new botbuilder.ChatConnector({
   appId: process.env.APP_ID,
   appPassword: process.env.APP_PASSWORD
});

server.post('/api/messages', connector.listen());

var bot = new botbuilder.UniversalBot(connector, [

    function(session){
        session.beginDialog('reservation:hotel');
    },
    function(session, results){
        session.dialogData.hotel = results.response;
        session.send(`Votre récapitulatif: <br/> + 
        nom : ${session.dialogData.hotel.nom}. <br/>
        mail : ${session.dialogData.hotel.mail}. <br/>
        age : ${session.dialogData.hotel.age}. <br/>
        destination : ${session.dialogData.hotel.destination}. <br/>
        checking : ${session.dialogData.hotel.checking}. <br/> 
        nbrNuits : ${session.dialogData.hotel.nbrNuits}`);
    }
    
]);

bot.library(require('./dialogs/hotel'));