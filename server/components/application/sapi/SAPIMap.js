SAPIMap = function () {

    this.sendMeMapInfo = function (cntx, mapId) {
        let map, points, prid;
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        if (!(mapId = Valid.DBUINT(mapId))) return Logs.log("no map id:" + mapId, Logs.LEVEL_WARNING, arguments);

        if (!DataMap.existsMap(mapId)) return Logs.log("no map found:" + mapId, Logs.LEVEL_WARNING, cntx);

        prid = pStart(Profiler.ID_SAPIMAP_SEND_ME_MAP_INFO);
        map = DataMap.getMap(mapId);
        points = DataPoints.getPointsByMapId(mapId);

        CAPIMap.gotMapsInfo(cntx.userId, mapId, map, points);

        pFinish(prid);
    };

    this.sendMePointTopScore = function (cntx, score, pointId, fids, chunks) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        if (chunks > 1) Logs.log("More then one chunk", Logs.LEVEL_ALERT, arguments);

        if (Number.isNaN(score = Valid.DBUINT(score, true))) return Logs.log(arguments.callee.name + " not valid score", Logs.LEVEL_ALERT, arguments);
        if (!(pointId = Valid.DBUINT(pointId))) return Logs.log(arguments.callee.name + " not valid pointId", Logs.LEVEL_ALERT, arguments);
        if (!(fids = Valid.DBUINTArray(fids))) return Logs.log(arguments.callee.name + "not valid fids", Logs.LEVEL_ALERT, arguments);

        let prid = pStart(Profiler.ID_SAPIMAP_SEND_ME_POINT_TOP_SCORE);

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
                        pFinish(prid);
                    });

                });
            } else {
                CAPIMap.gotPointTopScore(cntx.user.id, pointId, data)
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
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        let prid = pStart(Profiler.ID_SAPIUSER_ON_FINISH);
        let tid = LogicTid.getOne();
        /** Обновляем номер точки и очки на ней */
        DataPoints.updateUsersPoints(cntx.userId, pointId, score, function () {

            TopScoreCache.flush(cntx.user.id, pointId);

            DataUser.getById(cntx.userId, function (user) {
                if (user.nextPointId < pointId + 1) {

                    DataUser.updateNextPointId(cntx.userId, pointId + 1, function () {
                        Logs.log("LevelUp uid:" + cntx.user.id + " pid:" + (pointId + 1), Logs.LEVEL_ALERT);
                        /** Откроем сундук, если возможно */
                        //@todo check map stars
                        if (chestId) {
                            let prid = pStart(Profiler.ID_SAPIMAP_OPEN_CHEST);
                            let chest = DataChests.getById(chestId);

                            if (!chest) {
                                pClear(prid);
                                return Logs.log("no chest found for " + chestId, Logs.LEVEL_WARNING, arguments);
                            } else {
                                Logs.log("Chest open uid:" + cntx.user.id + " cid:" + chestId, Logs.LEVEL_ALERT);
                            }
                            chest.prizes.forEach(function (prize) {
                                switch (prize.id) {
                                    case DataObjects.STUFF_HUMMER:
                                        DataStuff.giveAHummer(cntx.userId, prize.count, tid);
                                        break;
                                    case DataObjects.STUFF_LIGHTNING:
                                        DataStuff.giveALightning(cntx.userId, prize.count, tid);
                                        break;
                                    case DataObjects.STUFF_SHUFFLE:
                                        DataStuff.giveAHummer(cntx.userId, prize.count, tid);
                                        break;
                                    case DataObjects.STUFF_GOLD:
                                        DataStuff.giveAGold(cntx.userId, prize.count, tid);
                                        break;
                                }
                            });
                            //@todo LOCK many hummer light shuffle and gold
                            DataStuff.getByUserId(cntx.userId, function (data) {
                                CAPIStuff.gotStuff(cntx.userId, data);
                                pFinish(prid);
                            });
                        } else {
                            pFinish(prid);
                        }
                    });
                }
            });
        });
    };

    this.reloadLevels = function (cntx) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        DataUser.getById(cntx.user.id, function (user) {
            if (!
                (user.id === 1 || user.socNetUserId === 1)
            ) {
                Logs.log("ERROR", Logs.LEVEL_ERROR);
                return;
            }

            LogicSystemRequests.reloadLevels();
        });
    };
};

SAPIMap = new SAPIMap();