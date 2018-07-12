/**
 * Элемент игрового поля.
 * @constructor
 */
ElementField = function () {
    let self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

    /**
     * Координата X картинки.
     * @type {number}
     */
    this.x = 0;

    /**
     * Координата Y картинки.
     * @type {number}
     */
    this.y = 0;

    let domBackground = null;
    let domCells = [];
    let domObjects = [];

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        let dom;

        domBackground = GUI.createDom(undefined, {});

        /**
         * Create dom Cells
         */
        for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            domCells[y] = [];
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                dom = GUI.createDom(undefined, {
                    x: self.x + x * 50,
                    y: self.y + y * 50,
                    backgroundImage: '/images/field-cell.png'
                });
                domCells[y][x] = dom;
            }
        }

        /**
         * Create dom Objects
         */
        for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            domObjects[y] = [];
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                dom = GUI.createDom(undefined, {
                    x: self.x + x * 50,
                    y: self.y + y * 50,
                    backgroundImage: '/images/field-none.png'
                });
                domObjects[y][x] = dom;
            }
        }

        console.log(domCells);

        this.redraw();
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed == true) return;
        showed = true;
        /**todo**/
        domBackground.show();
        for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                domCells[y][x].show();
            }
        }
        for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                domObjects[y][x].show();
            }
        }
        self.redraw();
    };

    /**
     * Спрячем картинку.
     */
    this.hide = function () {
        if (showed == false) return;
        showed = false;
        domBackground.hide();
        for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                domCells[y][x].hide();
            }
        }
        for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                domCells[y][x].hide();
            }
        }
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        if (!showed) return;
        domBackground.redraw();
        for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                domCells[y][x].redraw();
            }
        }
        for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                domObjects[y][x].show();
            }
        }
    };
};