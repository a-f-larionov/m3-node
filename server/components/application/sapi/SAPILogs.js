const Kafka = require("../../base/Kafka.js").Kafka

SAPILogs = function () {

    this.log = function (cntx, message, level, details) {

        Logs.log(message, level, details, Logs.CHANNEL_CLIENT);

        //@todo-method
        Kafka.sendToCommon({message: message, details: details}, "LogRqDto")
    };

    this.clientLoaded = function (cntx, prid) {
        //@todo to backlog move
        pFinish(prid);
    };

    this.sendUserAgent = function (cntx, userAgentString) {
        DataUser.updateUserAgentString(cntx.user.id, userAgentString);
        //@todo-method
        Kafka.sendToCommon({
            userId: cntx.user.id,
            updateUserAgentString: userAgentString
        }, "SaveUserAgentRqDto")
    };

    this.showMoneyDialog = function (cntx, message) {
        //@todo-method
        Kafka.sendToCommon(
            {message: "Игрок " + cntx.user.socNetUserId + " Открыл диалог покупки голосов: " + message},
            "TelegramRqDto");
        Logs.log("Игрок " + cntx.user.socNetUserId + " Открыл диалог покупки голосов: " + message,
            Logs.LEVEL_NOTIFY, null, null, true);
    };


    this.closeMoneyDialog = function (cntx) {
        //@todo-method
        Kafka.sendToCommon(
            {message: "Игрок:" + cntx.user.socNetUserId + "  Закрыл диалог покупки голосов"},
            "TelegramRqDto");
        Logs.log("Игрок:" + cntx.user.socNetUserId + "  Закрыл диалог покупки голосов", Logs.LEVEL_NOTIFY, null, null, true);
    };

    this.showStuffShopDialog = function (cntx, stuffFieldName) {
        //@todo-method
        Kafka.sendToCommon(
            {message: "Игрок:" + cntx.user.socNetUserId + " открыл покупку магии " + stuffFieldName,},
            "TelegramRqDto");

        Logs.log("Игрок:" + cntx.user.socNetUserId + " открыл покупку магии " + stuffFieldName, Logs.LEVEL_NOTIFY, null, null, true);
    }
};

SAPILogs = new SAPILogs();