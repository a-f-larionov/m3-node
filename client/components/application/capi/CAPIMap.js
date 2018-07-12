CAPIMap = function () {

    this.gotMapsInfo = function (ctnx, mapId, map, points) {
        DataMap.setMapById(mapId, map);
        for (let i in points) {
            DataPoints.setPointData(points[i].id, points[i]);
        }
    };
};

CAPIMap = new CAPIMap();