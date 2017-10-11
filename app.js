var restify = require('restify');
var botbuilder = require('botbuilder');
var cognitiveservices = require('botbuilder-cognitiveservices');

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

var bot = new botbuilder.UniversalBot(connector);

bot.library(require('./dialogs/hotel'));

var recognizer = new cognitiveservices.QnAMakerRecognizer({
    knowledgeBaseId: 'ba413523-10a8-41c6-96b5-1d7ba350310d',
    subscriptionKey: '797a1b53a3fb4964bb7cc84d604e0389'
});

var basicQnAMakerDialog = new cognitiveservices.QnAMakerDialog({
    recognizers: [recognizer],
    defaultMessage: "Pas de correspondance !!!",
    qnaThreshold: 0.3
});

bot.dialog('/', basicQnAMakerDialog);