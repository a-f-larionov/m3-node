/**
 * @type {DataObjects}
 * @constructor
 */
let DataObjects = function () {
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
    this.OBJECT_ALPHA = 150;
    /**
     * Монстр-2
     * @type {number}
     */
    this.OBJECT_BETA = 160;
    /**
     * Монстр-3
     * @type {number}
     */
    this.OBJECT_GAMMA = 161;
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

    this.STUFF_HUMMER = 2010;
    this.STUFF_LIGHTNING = 2011;
    this.STUFF_SHUFFLE = 2012;
    this.STUFF_GOLD = 2013;


    this.images = {};
    /** Cell images */
    this.images[this.CELL_INVISIBLE] = 'field-none.png';
    this.images[this.CELL_VISIBLE] = 'field-cell.png';

    /** Gem images */
    this.images[this.OBJECT_HOLE] = 'field-none.png';
    this.images[this.OBJECT_RANDOM] = 'field-none.png';

    this.images[this.OBJECT_RED] = 'field-red.png';
    this.images[this.OBJECT_GREEN] = 'field-green.png';
    this.images[this.OBJECT_BLUE] = 'field-blue.png';
    this.images[this.OBJECT_YELLOW] = 'field-yellow.png';
    this.images[this.OBJECT_PURPLE] = 'field-purple.png';
    this.images[this.OBJECT_SAND] = 'field-sand.png';

    this.images[this.OBJECT_BARREL] = 'field-barrel.png';
    this.images[this.OBJECT_BLOCK] = 'field-block.png';
    this.images[this.OBJECT_POLY_COLOR] = 'field-poly-color.png';
    this.images[this.OBJECT_GOLD] = 'field-gold.png';
    this.images[this.OBJECT_TILE] = 'field-tile.png';

    this.images[this.OBJECT_ALPHA] = 'field-alpha.png';
    this.images[this.OBJECT_BETA] = 'field-beta.png';
    this.images[this.OBJECT_GAMMA] = 'field-gamma.png';

    this.images[this.OBJECT_BOX] = 'field-box.png';
    this.images[this.OBJECT_CHAIN_A] = 'field-chain-a.png';
    this.images[this.OBJECT_CHAIN_B] = 'field-chain-b.png';

    /** Gem-lightning images */
    this.images[this.WITH_LIGHTNING_VERTICAL] = 'a-gem-light-1.png';
    this.images[this.WITH_LIGHTNING_HORIZONTAL] = 'a-gem-light-1.png';
    this.images[this.WITH_LIGHTNING_CROSS] = 'a-gem-light-1.png';

    this.images[this.STUFF_HUMMER] = 'button-hummer-rest.png';
    this.images[this.STUFF_LIGHTNING] = 'button-lightning-rest.png';
    this.images[this.STUFF_SHUFFLE] = 'button-shuffle-rest.png';
    this.images[this.STUFF_GOLD] = 'coin.png';

};

/** @type {DataObjects} */
DataObjects = new DataObjects();


/** Для кросс-сайдных компонент */
if (CONST_IS_SERVER_SIDE) {
    global['DataObjects'] = DataObjects;
}