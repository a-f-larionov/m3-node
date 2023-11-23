const Kafka = require("../../base/Kafka.js").Kafka

SAPILogs = function () {

    this.log = function (cntx, message, level, details, telega) {
        Logs.log(message, level + details, null, null, telega);
    };

    this.sendUserAgent = function (cntx, userAgentString) {
        Kafka.sendToCommon({userAgentString: userAgentString}, cntx.user.id, Kafka.TYPE_SENDUSERAGENT_RQ_DTO)
    };

    this.showMoneyDialog = function (cntx, message) {
        Logs.log("Игрок " + cntx.user.socNetUserId + " Открыл диалог покупки голосов: " + message, Logs.LEVEL_INFO, null, null, true);
    };

    this.closeMoneyDialog = function (cntx) {
        Logs.log("Игрок:" + cntx.user.socNetUserId + " Закрыл диалог покупки голосов", Logs.LEVEL_INFO, null, null, true);
    };

    this.showStuffShopDialog = function (cntx, stuffFieldName) {
        Logs.log("Игрок:" + cntx.user.socNetUserId + " открыл покупку магии " + stuffFieldName, Logs.LEVEL_INFO, null, null, true);
    }
};

SAPILogs = new SAPILogs();