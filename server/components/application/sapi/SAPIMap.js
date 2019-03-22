SAPIMap = function () {

    this.sendMeMapInfo = function (cntx, mapId) {
        let map, points, usersInfo;
        map = DataMap.getMap(mapId);
        points = DataPoints.getPointsByMapId(mapId);
        DataPoints.getUsersInfo(mapId, [cntx.userId], function (rows, query) {
            console.log(rows, query);
            usersInfo = rows;
            CAPIMap.gotMapsInfo(
                cntx.userId,
                mapId,
                map,
                points,
                usersInfo
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
        CAPIMap.log(cntx.userId,pointId);
        CAPIMap.log(cntx.userId,score);
        DataUser.getById(cntx.userId, function (user) {
            if (user.currentPoint < pointId + 1) {
                DataUser.updateCurrentPoint(cntx.userId, pointId + 1);
            }
        });
    };
};

SAPIMap = new SAPIMap();