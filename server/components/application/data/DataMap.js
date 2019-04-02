//it is a super mega crumch,, but ... time or result ...
//


GUI = {};

GUI.ANIM_TYPE_ROTATE = 1;
GUI.ANIM_TYPE_MOVE = 2;
GUI.ANIM_TYPE_GOTO = 3;
GUI.ANIM_TYPE_MOVIE = 4;
GUI.ANIM_TYPE_PAUSE = 5;
GUI.ANIM_TYPE_STOP = 6;

/**
 * @see DataMap.MAP_ID_MIN and MAP_ID_MAX
 * @constructor
 */
DataMap = function () {

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
            },
            '2': {
                id: 2,
                src: '/images/maps/map-002.png'
            }
            ,
            '3': {
                id: 3,
                src: '/images/maps/map-003.png'
            }
        }
    ;

    this.getMap = function (mapId) {
        return maps[mapId];
    };

    this.getFirstPointId = function (mapId) {
        return DataMap.POINTS_PER_MAP * (mapId - 1) + 1;
    };

    this.getLastPointId = function (mapId) {
        return this.getFirstPointId(mapId) + DataMap.POINTS_PER_MAP - 1;
    };

    this.getFirstChestId = function (mapId) {
        return DataMap.CHESTS_PER_MAP * (mapId - 1) + 1;
    };

    this.getLastChestId = function (mapId) {
        return this.getFirstChestId(mapId) + DataMap.CHESTS_PER_MAP - 1;
    };

    this.existsMap = function (mapId) {
        return !(typeof maps[mapId] == 'undefined');
    }
};


DataMap = new DataMap();

DataMap.MAP_ID_MIN = 1;
DataMap.MAP_ID_MAX = 3;
DataMap.POINTS_PER_MAP = 3;
DataMap.CHESTS_PER_MAP = 2;