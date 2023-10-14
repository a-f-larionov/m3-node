const Kafka = require("../../base/Kafka.js").Kafka

SAPILogs = function () {

    this.log = function (cntx, message, level, details) {

        Logs.log(message, level, details, Logs.TYPE_CLIENT_DEBUG_INFO);
//
        //@todo-method
        Kafka.sendToCommon({message: message, level: level, details: details}, cntx.user.id, "LogRqDto")
    };

    this.clientLoaded = function (cntx, prid) {
        //@todo to backlog move
        pFinish(prid);
    };

    this.sendUserAgent = function (cntx, userAgentString) {
      //  DataUser.updateUserAgentString(cntx.user.id, userAgentString);
        //@todo-method
        Kafka.sendToCommon({userAgentString: userAgentString}, cntx.user.id, "SendUserAgentRqDto")
    };

    this.showMoneyDialog = function (cntx, message) {
        //@todo-method
        Kafka.sendToCommon({
            message: "Игрок " + cntx.user.socNetUserId + " Открыл диалог покупки голосов: " + message
        }, cntx.user.id, "LogRqDto");
        Logs.log("Игрок " + cntx.user.socNetUserId + " Открыл диалог покупки голосов: " + message,
            Logs.LEVEL_DEBUG, null, null, true);
    };


    this.closeMoneyDialog = function (cntx) {
        //@todo-method
        Kafka.sendToCommon({message: "Игрок:" + cntx.user.socNetUserId + "  Закрыл диалог покупки голосов"}, cntx.user.id, "LogRqDto");
        Logs.log("Игрок:" + cntx.user.socNetUserId + "  Закрыл диалог покупки голосов", Logs.LEVEL_DEBUG, null, null, true);
    };

    this.showStuffShopDialog = function (cntx, stuffFieldName) {
        //@todo-method
        Kafka.sendToCommon({message: "Игрок:" + cntx.user.socNetUserId + " открыл покупку магии " + stuffFieldName}, cntx.user.id, "LogRqDto");

        Logs.log("Игрок:" + cntx.user.socNetUserId + " открыл покупку магии " + stuffFieldName, Logs.LEVEL_DEBUG, null, null, true);
    }
};

SAPILogs = new SAPILogs();