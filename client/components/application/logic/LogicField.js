LogicField = function () {
    let self = this;

    let gems = [
        DataPoints.OBJECT_RED,
        DataPoints.OBJECT_GREEN,
        DataPoints.OBJECT_BLUE,
        DataPoints.OBJECT_YELLOW,
        DataPoints.OBJECT_PURPLE,
    ];

    let fallDownObjects = [
        DataPoints.OBJECT_RED,
        DataPoints.OBJECT_GREEN,
        DataPoints.OBJECT_BLUE,
        DataPoints.OBJECT_YELLOW,
        DataPoints.OBJECT_PURPLE,
    ];

    this.isGem = function (id) {
        return gems.indexOf(id) !== -1;
    };

    this.isNotGem = function (id) {
        return !self.isGem(id);
    };

    this.isFallingObject = function (id) {
        return fallDownObjects.indexOf(id) !== -1;
    };

    this.mayFall = function (x, y, layerGems) {
        return !LogicField.isFallingObject(layerGems[y][x]) &&
            LogicField.isFallingObject(layerGems[y - 1][x]);
    };

    this.getRandomGemId = function () {
        return gems[Math.floor(Math.random() * gems.length)];
    };

    this.isNoMoreTurns = function (layerGems) {

    }
};

LogicField = new LogicField;