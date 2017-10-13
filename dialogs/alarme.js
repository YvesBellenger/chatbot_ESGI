// déclarer un builder
// faire un module.export auquel on donne notre tableau de dialogs

var botbuilder = require('botbuilder');
const library = new botbuilder.Library('reservation');

library.dialog('createAlarm', [
    
        function(session, args, next) {
            if (!session.userData.alarms) {
                session.userData.alarms = [];
            }
            botbuilder.Prompts.choice(session, "Bienvenue ! Que voulez vous faire ?", "Créer une nouvelle alarme|Voir toutes les alarmes|Voir les alarmes à venir", 
            { listStyle: botbuilder.ListStyle.button });
            next();
        },
        function (session, results, next) {
            if (results.response.index == 0) {
                session.dialogData.currentAlarm = {};
                if (!session.dialogData.currentAlarm.name) {
                    botbuilder.Prompts.text(session, "Veuillez renseigner le nom de votre alarme.");
                } else {
                    next();
                }
            } else if (results.response.index == 1) {
                if (session.userData.alarms.length == 0) {
                    session.send('Vous n\'avez aucune alarme');
                } else {
                    var msg = new botbuilder.Message(session);
                    msg.attachmentLayout(botbuilder.AttachmentLayout.carousel);
                    var richcards = [];
                    for (var i = 0; i<session.userData.alarms.length; i++) {
                        var alarm_number = i+1;
                        var richcard =  new botbuilder.HeroCard(session)
                                        .title("Alarme n°" + alarm_number)
                                        .subtitle("Nom : " + session.userData.alarms[i].name)
                                        .text("Date/heure : " + session.userData.alarms[i].date + "\n \r" +
                                            "Date de création : " + session.userData.alarms[i].creationDate)
                        richcards.push(richcard)
                    }
                    msg.attachments(richcards);
                    session.send(msg).endDialog();
                }
            }
        },
        function (session, results, next) {
            if (results.response) {
                session.dialogData.currentAlarm.name = results.response;
            }
            if (!session.dialogData.currentAlarm.date) {
                botbuilder.Prompts.time(session, "Renseignez la date de début de votre séjour (ex: 10 juin 2017 at 2pm/am).");
            } else {
                next();
            }
        },
        function (session, results) {
            if (results.response) {
                console.log(results.response);
                session.dialogData.currentAlarm.date = botbuilder.EntityRecognizer.resolveTime([results.response]);
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth()+1;
    
                var yyyy = today.getFullYear();
                if(dd<10){
                    dd='0'+dd;
                }
                if(mm<10){
                    mm='0'+mm;
                }
                session.dialogData.currentAlarm.creationDate = dd+'/'+mm+'/'+yyyy;
                session.userData.alarms.push(session.dialogData.currentAlarm);
            }
            session.endDialogWithResult({ response: session.dialogData });
        },
        function (session, results) {
            session.dialogData = results.response;
            console.log(session.dialogData.alarms);
        }
    ]).endConversationAction('cancelAction', 'Ok, cancel order.', {
    matches: /^cancel$|^goodbye$/i,
    confirmPrompt: "Are you sure ?"
});

module.exports = library;
