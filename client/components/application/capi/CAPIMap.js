CAPIMap = function () {

    this.gotMaps = function (ctnx, mapId, map) {
        DataMap.setMapById(mapId, map);
    };

    this.gotPointData = function(cntx, pointId, data){
        DataPoints.setPointData(pointId, data);
    }
};

CAPIMap = new CAPIMap();