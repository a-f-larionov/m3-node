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
        chests = DataChests.getChestsByMapId(mapId);
        DataPoints.getUsersInfo(mapId, [cntx.userId], function (rows) {
            userPoints = rows;
            DataChests.getUsersInfo(mapId, [cntx.userId], function (rows) {
                userChests = rows;
                CAPIMap.gotMapsInfo(
                    cntx.userId,
                    mapId,
                    map,
                    points,
                    userPoints,
                    chests,
                    userChests
                );
            });
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
     */
    this.finishLevel = function (cntx, pointId, score) {
        if (!cntx.isAuthorized) return Logs.log(arguments.callee.name + " not authorized", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user) return Logs.log(arguments.callee.name + " not user", Logs.LEVEL_WARNING, cntx);
        if (!cntx.user.id) return Logs.log(arguments.callee.name + " not user id", Logs.LEVEL_WARNING, cntx);

        DataPoints.updateUsersPoints(cntx.userId, pointId, score);
        DataUser.getById(cntx.userId, function (user) {
            if (user.nextPointId < pointId + 1) {
                DataUser.updateNextPointId(cntx.userId, pointId + 1);
            }
        });
    };
}
;

SAPIMap = new SAPIMap();