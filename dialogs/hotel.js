// déclarer un builder
// faire un module.export auquel on donne notre tableau de dialogs

var botbuilder = require('botbuilder');
const library = new botbuilder.Library('reservation');

library.dialog('hotel', [
    function(session, args, next){
        session.dialogData.hotel = args || {};
        if(!session.dialogData.hotel.nom){
            botbuilder.Prompts.text(session, "Quelle est votre nom ?");
        }else{
            next();
        }    
    },
    function(session, results, next){
        if(results.response){
            session.dialogData.hotel.nom = results.response;
        }
        if(!session.dialogData.hotel.mail){
            botbuilder.Prompts.text(session, "Quelle est votre adresse email ?");
        }else{
            next();
        }    
    },
    function(session, results, next){
        if(results.response){
            session.dialogData.hotel.mail = results.response;
        }
        if(!session.dialogData.hotel.age){
            botbuilder.Prompts.number(session, "Quel est votre âge ?");
        }else{
            next();
        }
    },
    function(session, results, next){
        if(results.response){
            session.dialogData.hotel.age = results.response;
        }
        if(!session.dialogData.hotel.destination){
            botbuilder.Prompts.text(session, "Quelle est votre destination ?");
        }else{
            next();
        }
    },
    function(session, results, next){
        if(results.response){
            session.dialogData.hotel.destination = results.response;
        }
        if(!session.dialogData.hotel.checking){
            botbuilder.Prompts.text(session, "A quelle heure souhaitez vous arriver à l'hôtel ?");
        }else{
            next();
        }
    },
    function(session, results, next){
        if(results.response){
            session.dialogData.hotel.checking = results.response;
        }
        if(!session.dialogData.hotel.nbrNuits){
            botbuilder.Prompts.number(session, "Combien de nuits souhaitez-vous réserver ?");
        }
    },
    function(session, results){
        if(results.response){
            session.dialogData.hotel.nbrNuits = results.response;
        }
        session.endDialogWithResult({response: session.dialogData.hotel});
    }
]).endConversationAction('cancelAction', 'Ok, cancel order.', {
    matches: /^cancel$|^goodbye$/i,
    confirmPrompt: "Are you sure ?"
});

module.exports = library;
