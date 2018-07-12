SAPIMap = function () {

    this.sendMeMaps = function (cntx, mapId) {
        CAPIMap.gotMaps(cntx.userId, mapId, DataMap.getMap(mapId));
    };

    this.sendMePointData = function (cntx, pointId) {
        CAPIMap.gotPointData(cntx.userId, pointId, DataPoints.getPointData(pointId));
    };

};

SAPIMap = new SAPIMap();