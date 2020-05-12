//it is a super mega crumch,, but ... time or result ...
//

/**
 * @see DataMap.MAP_ID_MIN and MAP_ID_MAX
 * @constructor
 */
DataMap = function () {

    let maps = {
            '1': {
                id: 1,
                src: 'map-001.png',
                elements: [
                    /*@todo*/
                ]
            },
            '2': {
                id: 2,
                src: 'map-002.png'
            }
            ,
            '3': {
                id: 3,
                src: 'map-003.png'
            },
            '4': {
                id: 4,
                src: 'map-001.png',
            },
            '5': {
                id: 5,
                src: 'map-002.png'
            }
            ,
            '6': {
                id: 6,
                src: 'map-003.png'
            },
            '7': {
                id: 7,
                src: 'map-001.png',
            },
            '8': {
                id: 8,
                src: 'map-002.png'
            }
            ,
            '9': {
                id: 9,
                src: 'map-003.png'
            },
            '10': {
                id: 10,
                src: 'map-001.png'
            },
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

    this.getMapPointIds = function (mapId) {
        let firstPointId, lastPointId, pointIds;
        firstPointId = DataMap.getFirstPointId(mapId);
        lastPointId = DataMap.getLastPointId(mapId);
        pointIds = [];
        for (let i = firstPointId; i <= lastPointId; i++) pointIds.push(i);
        return pointIds;
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

/** Client see */
DataMap.MAP_ID_MIN = 1;
DataMap.MAP_ID_MAX = 3;
DataMap.POINTS_PER_MAP = 18;
DataMap.CHESTS_PER_MAP = 2;