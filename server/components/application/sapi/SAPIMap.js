SAPIMap = function () {

    this.sendMeMapInfo = function (cntx, mapId) {
        let map, points, chests, usersInfo;
        if (!DataMap.existsMap(mapId)) {
            Logs.log("no map found:" + mapId, Logs.LEVEL_WARNING, cntx);
            return;
        }
        map = DataMap.getMap(mapId);
        points = DataPoints.getPointsByMapId(mapId);
        chests = DataChests.getChestsByMapId(mapId);
        DataPoints.getUsersInfo(mapId, [cntx.userId], function (rows) {
            usersInfo = rows;
            CAPIMap.gotMapsInfo(
                cntx.userId,
                mapId,
                map,
                points,
                chests,
                usersInfo
            );
        });
    };

    this.sendMeMapFriends = function (cntx, mapId, friendIds) {
        let friends;
        if (!DataMap.existsMap(mapId)) {
            Logs.log("no map found:" + mapId, Logs.LEVEL_WARNING, cntx);
            return;
        }
        DataPoints.getUsersInfo(mapId, friendIds, function (rows) {
            friends = rows;
            CAPIMap.gotMapFriends(
                cntx.userId,
                mapId,
                friends
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
        CAPIMap.log(cntx.userId, pointId);
        CAPIMap.log(cntx.userId, score);
        DataUser.getById(cntx.userId, function (user) {
            if (user.currentPoint < pointId + 1) {
                DataUser.updateCurrentPoint(cntx.userId, pointId + 1);
            }
        });
    };
};

SAPIMap = new SAPIMap();