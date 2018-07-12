SAPIMap = function () {

    this.sendMeMapInfo = function (cntx, mapId) {
        CAPIMap.gotMapsInfo(
            cntx.userId,
            mapId,
            DataMap.getMap(mapId),
            DataPoints.getPointsByMapId(mapId)
        );
    };
};

SAPIMap = new SAPIMap();