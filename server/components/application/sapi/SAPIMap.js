SAPIMap = function () {

    this.sendMeMaps = function (cntx, mapId) {
        CAPIMap.gotMaps(cntx.userId, mapId, DataMap.getMap(mapId));
    }

};

SAPIMap = new SAPIMap();