// @Todo super mega crunch
GUI = {};

GUI.ANIM_TYPE_ROTATE = 1;
GUI.ANIM_TYPE_MOVE = 2;
GUI.ANIM_TYPE_GOTO = 3;
GUI.ANIM_TYPE_MOVIE = 4;
GUI.ANIM_TYPE_PAUSE = 5;
GUI.ANIM_TYPE_STOP = 6;

DataMap = function () {

    var currentMapId = 1;

    /**
     * DataMapjs
     * @type {[*]}
     */
    var maps = {};

    let mapsLadings = [];

    this.loadMap = function (mapId) {
        if (!mapId) mapId = currentMapId;
        if (!mapsLadings[mapId]) {
            mapsLadings[mapId] = true;
            SAPIMap.sendMeMapInfo(mapId);
        }
    };

    this.setMapById = function (mapId, mapData) {
        maps[mapId] = mapData;
        PageController.redraw();
    };

    this.getCurent = function () {
        if (!maps[currentMapId]) {
            this.loadMap();
        }
        return maps[currentMapId];
    };

    this.setNextMap = function () {
        if (currentMapId == DataMap.MAP_ID_MAX) {
            return;
        }
        currentMapId++;
    };

    this.setPrevMap = function () {
        if (currentMapId == DataMap.MAP_ID_MIN) {
            return;
        }
        currentMapId--;
    };

    this.getFirstPointId = function () {
        return DataMap.POINTS_PER_MAP * (currentMapId - 1) + 1;
    };

    this.getLastPointId = function () {
        return this.getFirstPointId() + DataMap.POINTS_PER_MAP - 1;
    };

    this.getPointIdFromPointNumber = function (number) {
        return this.getFirstPointId() + (number - 1);
    };
}
;

DataMap = new DataMap();

DataMap.MAP_ID_MIN = 1;
DataMap.MAP_ID_MAX = 3;
DataMap.POINTS_PER_MAP = 3;