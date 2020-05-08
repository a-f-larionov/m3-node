SAPIMap = function () {

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

    this.sendMeMapInfo = function (cntx, mapId) {
        let map, points, chests, userPoints, userChests;
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        if (!DataMap.existsMap(mapId)) {
            Logs.log("no map found:" + mapId, Logs.LEVEL_WARNING, cntx);
            return;
        }
        map = DataMap.getMap(mapId);
        points = DataPoints.getPointsByMapId(mapId);

        DataPoints.getUsersInfo(mapId, [cntx.userId], function (usePoints) {
            CAPIMap.gotMapsInfo(cntx.userId, mapId, map, points, usePoints);
        });
    };

    this.sendMeUsersScore = function (cntx, mapId, userIds) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        if (!DataMap.existsMap(mapId)) {
            Logs.log("no map found:" + mapId, Logs.LEVEL_WARNING, cntx);
            return;
        }
        if (userIds.length === 0) {
            Logs.log("no friends - no data", Logs.LEVEL_DETAIL, cntx);
            return;
        }
        DataPoints.getUsersInfo(mapId, userIds, function (userPoints) {
            CAPIMap.gotUserScores(
                cntx.userId,
                userPoints
            );
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

        let tid = LogicTid.getOne();
        /** Обновляем номер точки и очки на ней */
        DataPoints.updateUsersPoints(cntx.userId, pointId, score);
        DataUser.getById(cntx.userId, function (user) {
            if (user.nextPointId < pointId + 1) {
                DataUser.updateNextPointId(cntx.userId, pointId + 1);
            }
        });
        /** Откроем сундук, если возможно */
            //@todo check map stars
        let chest = DataChests.getById(chestId);

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
        DataStuff.getByUserId(cntx.userId, function (data) {
            CAPIStuff.gotStuff(cntx.userId, data);
        });
    };
};

SAPIMap = new SAPIMap();