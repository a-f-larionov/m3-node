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
};

SAPIMap = new SAPIMap();