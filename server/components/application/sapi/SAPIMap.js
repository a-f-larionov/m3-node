SAPIMap = function () {

    this.sendMeMapInfo = function (cntx, mapId) {
        let map, points, chests, userPoints, userChests;
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
        if (!DataMap.existsMap(mapId)) {
            Logs.log("no map found:" + mapId, Logs.LEVEL_WARNING, cntx);
            return;
        }
        if (userIds.length === 0) {
            Logs.log("no friends - no data", Logs.LEVEL_DETAIL, cntx);
            return;
        }
        CAPIMap.log(cntx.user.id, 'ad');
        DataPoints.getUsersInfo(mapId, userIds, function (userPoints) {
            CAPIMap.log(cntx.user.id, 'ad2s');
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

        DataPoints.updateUsersPoints(cntx.userId, pointId, score);
        DataUser.getById(cntx.userId, function (user) {
            if (user.currentPoint < pointId + 1) {
                DataUser.updateCurrentPoint(cntx.userId, pointId + 1);
            }
        });
    };
}
;

SAPIMap = new SAPIMap();