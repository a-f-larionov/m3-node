DataObjects = function () {
    /**
     * ???
     * @type {number}
     */
    this.OBJECT_CELL = 2;

    /**
     * ???
     * @type {number}
     */
    this.OBJECT_VISIBLE = 3;

    /**
     * Не видна игроку.
     * @type {number}
     */
    this.OBJECT_INVISIBLE = 1;


    /**
     * Просто картинка блока на маске
     * @type {number}
     */
    this.OBJECT_BLOCK = 4;

    /**
     * Случайнный камень из набора камней.
     * @type {number}
     * @see LogicField{ let gems = [] };
     */
    this.OBJECT_RANDOM = 101;

    /**
     * Камень красный
     * @type {number}
     */
    this.OBJECT_RED = 102;
    /**
     * Камень зеленый
     * @type {number}
     */
    this.OBJECT_GREEN = 103;
    /**
     * Камень голубой
     * @type {number}
     */
    this.OBJECT_BLUE = 104;
    /**
     * Камень желтый
     * @type {number}
     */
    this.OBJECT_YELLOW = 105;
    /**
     * Камень фиолетовый
     * @type {number}
     */
    this.OBJECT_PURPLE = 106;

    /**
     * Нет камня
     * @type {number}
     */
    this.OBJECT_HOLE = 120;

    /**
     * Эмитер камней
     * @type {number}
     */
    this.OBJECT_EMITTER = 1001;

    /**
     * Молния хоризонтальная
     * @type {number}
     */
    this.OBJECT_LIGHTNING_HORIZONTAL = 1010;
    /**
     * Молния вертикальная
     * @type {number}
     */
    this.OBJECT_LIGHTNING_VERTICAL = 1011;
    /**
     * Молния кросс(двунаправленная)
     * @type {number}
     */
    this.OBJECT_LIGHTNING_CROSS = 1012;

};

/** @type {DataObjects} */
DataObjects = new DataObjects();