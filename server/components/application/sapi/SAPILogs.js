const Kafka = require("../../base/Kafka.js").Kafka

SAPILogs = function () {

    this.log = function (cntx, message, level, details, telega) {

        Logs.log(message, level, details, Logs.TYPE_CLIENT_DEBUG_INFO, telega);

        Kafka.sendToCommon({message: message, level: "INFO", details: details},
            cntx && cntx.user ? cntx.user.id : undefined,
            Kafka.TYPE_LOG_RQ_DTO)
    };

    this.sendUserAgent = function (cntx, userAgentString) {
        Kafka.sendToCommon({userAgentString: userAgentString}, cntx.user.id, Kafka.TYPE_SENDUSERAGENT_RQ_DTO)
    };

    this.showMoneyDialog = function (cntx, message) {
        Kafka.sendToCommon({
            message: "Игрок " + cntx.user.socNetUserId + " Открыл диалог покупки голосов: " + message,
            level: "INFO",
        }, cntx.user.id, Kafka.TYPE_LOG_RQ_DTO);
        Logs.log("Игрок " + cntx.user.socNetUserId + " Открыл диалог покупки голосов: " + message, Logs.LEVEL_INFO, null, null, true);
    };


    this.closeMoneyDialog = function (cntx) {
        Kafka.sendToCommon({
            message: "Игрок:" + cntx.user.socNetUserId + "  Закрыл диалог покупки голосов",
            level: "INFO"
        }, cntx.user.id, Kafka.TYPE_LOG_RQ_DTO);
        Logs.log("Игрок:" + cntx.user.socNetUserId + "  Закрыл диалог покупки голосов", Logs.LEVEL_DEBUG, null, null, true);
    };

    this.showStuffShopDialog = function (cntx, stuffFieldName) {
        Kafka.sendToCommon({
            message: "Игрок:" + cntx.user.socNetUserId + " открыл покупку магии " + stuffFieldName,
            level: "INFO"
        }, cntx.user.id, Kafka.TYPE_LOG_RQ_DTO);

        Logs.log("Игрок:" + cntx.user.socNetUserId + " открыл покупку магии " + stuffFieldName, Logs.LEVEL_DEBUG, null, null, true);
    }
};

SAPILogs = new SAPILogs();