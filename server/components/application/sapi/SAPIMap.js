const Kafka = require("../../base/Kafka.js").Kafka

SAPIMap = function () {

    this.sendMeMapInfo = function (cntx, mapId) {
        Kafka.sendToGameplay({mapId: mapId}, cntx.user.id, Kafka.TYPE_SEND_ME_MAP_INFO_RQ_DTO);
    };

    this.sendMePointTopScore = function (cntx, score, pointId, fids, chunks) {
        Kafka.sendToGameplay({
            score: score, pointId: pointId, fids: fids, chunks: chunks
        }, cntx.user.id, Kafka.TYPE_SEND_ME_POINT_TOP_SCORE_RQ_DTO);
    };

    this.onFinish = function (cntx, pointId, score, chestId) {
        Kafka.sendToGameplay({pointId: pointId, score: score, chestId: chestId}, cntx.user.id, Kafka.TYPE_ON_FINISH_RQ_DTO);
        //@todo-method
        TopScoreCache.flush(cntx.user.id, pointId);
    };
};

SAPIMap = new SAPIMap();