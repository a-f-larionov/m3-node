LogicField = function () {
    let self = this;

    let gems = [
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

    this.getRandomGemId = function () {
        return gems[Math.floor(Math.random() * gems.length)];
    };
};

LogicField = new LogicField;