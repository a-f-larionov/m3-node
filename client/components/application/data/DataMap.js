// super mega crunch
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
     * DataMap
     * Первый элемент копирует \server\components\application\data\DataMap.js
     * остальные будут подгружены.
     * @type {[*]}
     */
    var maps = {
        '1': {
            id: 1,
            src: '/images/maps/map-001.png',
            elements: [
                {
                    name: 'ElementSprite',
                    animPlay: true,
                    params: {
                        x: 50,
                        y: 50,
                        src: '/images/man-01.png',
                        domInitParams: {
                            animTracks: [
                                [
                                    {
                                        type: GUI.ANIM_TYPE_MOVIE,
                                        images: [
                                            '/images/man_right_1.png',
                                            '/images/man_right_2.png',
                                            '/images/man_right_3.png',
                                            '/images/man_right_4.png',
                                            '/images/man_right_5.png',
                                            '/images/man_right_6.png',
                                            '/images/man_right_7.png',
                                            '/images/man_right_8.png'
                                        ]
                                        , duration: 8
                                    },
                                    {type: GUI.ANIM_TYPE_GOTO, pos: 0}
                                ],
                                [
                                    {type: GUI.ANIM_TYPE_MOVE, vX: 3, vY: 0, duration: 200},
                                    {type: GUI.ANIM_TYPE_MOVE, vX: -3, vY: 0, duration: 200},
                                    {type: GUI.ANIM_TYPE_GOTO, pos: 0}
                                ]
                            ]
                        }
                    }
                }
            ]
        }
    };

    this.loadMap = function (mapId) {
        if (!mapId) mapId = currentMapId;
        SAPIMap.sendMeMaps(mapId);
    };

    this.setMaps = function (mapId, mapData) {
        maps[mapId] = mapData;
        PageController.redraw();
    };

    this.getCurent = function () {
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