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

    this.finishLevel = function (cntx, pointId, score) {

        DataPoints.updateUsersPoints(cntx.userId, pointId, score, function () {

            DataUser.updateCurrentPoint(cntx.userId, pointId + 1, function () {

                DataUser.getById(cntx.userId, function (user) {
     //@todo , send to all?
                    CAPIUser.updateUserInfo(cntx.userId, user);
                });
            });
        });
    };
};

SAPIMap = new SAPIMap();