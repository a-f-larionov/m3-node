DataObjects = function () {
    /**
     * Не видна игроку.
     * @type {number}
     */
    this.OBJECT_NONE = 1;
    this.OBJECT_CELL = 2;
    this.OBJECT_EMPTY = 3;
    /**
     * Просто картинка блока на маске
     * @type {number}
     */
    this.OBJECT_BLOCK = 4;

    this.OBJECT_RANDOM = 101;

    this.OBJECT_RED = 102;
    this.OBJECT_GREEN = 103;
    this.OBJECT_BLUE = 104;
    this.OBJECT_YELLOW = 105;
    this.OBJECT_PURPLE = 106;

    this.OBJECT_EMITTER = 1001;

};

/** @type {DataObjects} */
DataObjects = new DataObjects();