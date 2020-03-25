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

    this.countTurns = function (layerGems, fieldHeight, fieldWidth) {
        /**
         * 1 - Меняем a ⇔ b
         * 2 - Считаем линии
         * 3 - Возвращаем a <> b
         * 4 - Считаем линии
         * 5 - Меняем a⇕b
         * 6 - Считаем линии
         * 7 - Возвращаем a⇕b
         */

        for (let y = 0; y < fieldHeight; y++) {
            for (let x = 0; x < fieldWidth; x++) {
                /** 1 - Меняем a ⇔ b */
            }
        }
    };

    this.exchangeGems = function (gemA, gemB, layerGems) {
        let tmp;
        tmp = layerGems[gemB.fieldY][gemB.fieldX];
        layerGems[gemB.fieldY][gemB.fieldX] = layerGems[gemA.fieldY][gemA.fieldX];
        layerGems[gemA.fieldY][gemA.fieldX] = tmp;
    };

};

LogicField = new LogicField;