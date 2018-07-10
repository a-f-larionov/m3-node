CAPIMap = function () {

    this.gotMaps = function (ctnx, mapId, map) {
        DataMap.setMaps(mapId, map);
    }
};

CAPIMap = new CAPIMap();