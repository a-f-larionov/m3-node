const Logs = require("../../base/Logs.js").Logs
const Kafka = require("../../base/Kafka.js").Kafka
const DataUser = require("../../application/data/DataUser.js").DataUser
const DataPoints = require("../../application/data/DataPoints.js").DataPoints

SAPIMap = function () {

    this.sendMeMapInfo = function (cntx, mapId) {
        Kafka.sendToMapAndPoints({mapId: mapId}, cntx.user.id, "SendMeMapInfoRqDto");
    };

    this.sendMePointTopScore = function (cntx, score, pointId, fids, chunks) {

        if (chunks > 1) Logs.log("More then one chunk", Logs.LEVEL_ALERT, cntx);

        if (Number.isNaN(score = Validator.DBUINT(score, true))) return Logs.log(arguments.callee.name + " not valid score", Logs.LEVEL_ALERT, arguments);
        if (!(pointId = Validator.DBUINT(pointId))) return Logs.log(arguments.callee.name + " not valid pointId", Logs.LEVEL_ALERT, arguments);
        if (!(fids = Validator.DBUINTArray(fids))) return Logs.log(arguments.callee.name + "not valid fids", Logs.LEVEL_ALERT, arguments);


        //@todo-method
        Kafka.sendToMapAndPoints({
            score: score,
            pointId: pointId,
            fids: fids,
            chunks: chunks
        }, cntx.user.id, "SendMePointTopScoreRqDto");

        TopScoreCache.get(cntx.user.id, pointId, function (data) {
            if (!data) {
                DataPoints.getTopScore(cntx.user.id, score, pointId, fids, function (rows) {
                    DataPoints.getTopScoreUserPosition(score, pointId, fids, cntx.user.id, function (pos) {
                        /** {p1u: 123123, p2u:123213, up:123123 } */
                        let out;
                        out = {
                            place1Uid: rows[0] ? rows[0].userId : null,
                            place2Uid: rows[1] ? rows[1].userId : null,
                            place3Uid: rows[2] ? rows[2].userId : null,
                            pos: pos
                        };
                        TopScoreCache.set(cntx.user.id, pointId, out);
                        CAPIMap.gotPointTopScore(cntx.user.id, pointId, out);
                    });

                });
            } else {
                CAPIMap.gotPointTopScore(cntx.user.id, pointId, data);

            }
        });
    };

    /**
     * Закончили уровень.
     * @param cntx
     * @param pointId
     * @param score
     * @param chestId
     */
    this.onFinish = function (cntx, pointId, score, chestId) {
        //@todo-method and move to users i think
        Kafka.sendToMapAndPoints({pointId: pointId, score: score, chestId: chestId}, cntx.user.id, "OnFinishRqDto");
        //@todo this is no health back, is it finish, health back on sapiuser
        let tid = LogicTid.getOne();
        /** Обновляем номер точки и очки на ней */
        DataPoints.updateUsersPoints(cntx.userId, pointId, score, function () {

            TopScoreCache.flush(cntx.user.id, pointId);

            DataUser.getById(cntx.userId, function (user) {
                //@todo only by one up

                Statistic.write(user.id, Statistic.ID_FINISH_PLAY, pointId, score);

                Logs.log("Игрок " + cntx.user.socNetUserId + " прошёл уровень " + pointId, Logs.LEVEL_DETAIL, undefined, Logs.CHANNEL_TELEGRAM);

                if (user.nextPointId < pointId + 1) {

                    Statistic.write(user.id, Statistic.ID_LEVEL_UP, pointId + 1, score);

                    DataUser.updateNextPointId(cntx.userId, pointId + 1, function () {
                        /** Откроем сундук, если возможно */
                        //@todo check map stars
                        if (chestId) {
                            let chest = DataChests.getById(chestId);

                            if (!chest) {
                                return Logs.log("no chest found for " + chestId, Logs.LEVEL_WARNING, arguments);
                            } else {
                                Logs.log("Chest open uid:" + cntx.user.id + " cid:" + chestId, Logs.LEVEL_ALERT);
                            }
                            Statistic.write(user.id, Statistic.ID_OPEN_CHEST, chestId);
                            let updateUserInfo = function () {
                                DataStuff.getByUserId(cntx.userId, function (data) {
                                    CAPIStuff.gotStuff(cntx.userId, data);
                                });
                            };
                            chest.prizes.forEach(function (prize) {
                                switch (prize.id) {
                                    case DataObjects.STUFF_HUMMER:
                                        DataStuff.giveAHummer(cntx.userId, prize.count, tid, updateUserInfo);
                                        break;
                                    case DataObjects.STUFF_LIGHTNING:
                                        DataStuff.giveALightning(cntx.userId, prize.count, tid, updateUserInfo);
                                        break;
                                    case DataObjects.STUFF_SHUFFLE:
                                        DataStuff.giveAShuffle(cntx.userId, prize.count, tid, updateUserInfo);
                                        break;
                                    case DataObjects.STUFF_GOLD:
                                        DataStuff.giveAGold(cntx.userId, prize.count, tid, updateUserInfo);
                                        break;
                                }
                            });
                            //@todo LOCK many hummer light shuffle and gold
                        } else {
                        }
                    });
                }
            });
        });
    };
};

SAPIMap = new SAPIMap();