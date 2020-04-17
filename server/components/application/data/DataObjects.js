DataObjects = function () {
    /**
     * Не видна игроку.
     * @type {number}
     */
    this.CELL_INVISIBLE = 1;

    /**
     * ???
     * @type {number}
     */
    this.CELL_VISIBLE = 2;

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
     * Камень белый
     * @type {number}
     */
    this.OBJECT_SAND = 107;
    /**
     * Нет камня
     * @type {number}
     */
    this.OBJECT_HOLE = 120;
    /**
     * Бочка
     * @type {number}
     */
    this.OBJECT_BARREL = 130;
    /**
     * Блок
     * @type {number}
     */
    this.OBJECT_BLOCK = 135;
    /**
     * Многоцветный камень
     * @type {number}
     */
    this.OBJECT_POLY_COLOR = 140;
    /**
     * Монстр-1
     * @type {number}
     */
    this.OBJECT_SPIDER_ALPHA = 150;
    /**
     * Монстр-2
     * @type {number}
     */
    this.OBJECT_SPIDER_BETA = 160;
    /**
     * Монстр-3
     * @type {number}
     */
    this.OBJECT_SPIDER_GAMMA = 161;
    /**
     * Плитка
     * @type {number}
     */
    this.OBJECT_TILE = 170;
    /**
     * Драгоцености
     * @type {number}
     */
    this.OBJECT_GOLD = 180;
    /**
     * Ящик
     * @type {number}
     */
    this.OBJECT_BOX = 190;
    /**
     * Цепь
     * @type {number}
     */
    this.OBJECT_CHAIN_A = 200;
    /**
     * Цепь
     * @type {number}
     */
    this.OBJECT_CHAIN_B = 210;
    /**
     * Эмитер камней
     * @type {number}
     */
    this.IS_EMITTER = 1001;

    /**
     * Молния хоризонтальная
     * @type {number}
     */
    this.WITH_LIGHTNING_HORIZONTAL = 1010;
    /**
     * Молния вертикальная
     * @type {number}
     */
    this.WITH_LIGHTNING_VERTICAL = 1011;
    /**
     * Молния кросс(двунаправленная)
     * @type {number}
     */
    this.WITH_LIGHTNING_CROSS = 1012;

};

/** @type {DataObjects} */
DataObjects = new DataObjects();