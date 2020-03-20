/**
 * Блок диалогов
 * @constructor
 */
PageBlockQDialogs = function PageBlockQDialogs() {
    let self = this;

    /**
     * Показывать ли страницу.
     * @type {boolean}
     */
    let showed = false;

    /**
     * Массив всех элементов страницы.
     * @type {Array}
     */
    this.elements = [];

    /**
     * @type {DialogMoneyShop}
     */
    this.dialogMoneyShop = null;

    /**
     * @type {DialogHealthShop}
     */
    this.dialogHealthShop = null;

    this.init = function () {

        this.dialogMoneyShop = GUI.createElement(DialogMoneyShop, {});
        self.elements.push(this.dialogMoneyShop);

        this.dialogHealthShop = GUI.createElement(DialogHealthShop, {});
        self.elements.push(this.dialogHealthShop);
    };

    /**
     * Покажем все элементы на странице.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        self.preset();
        for (let i in self.elements) {
            self.elements[i].show();
        }
        self.redraw();
    };

    /**
     * Спрачем все элементы на странице.
     */
    this.hide = function () {
        if (!showed) return;
        showed = false;
        for (let i in self.elements) {
            self.elements[i].hide();
        }
    };

    /**
     * Настройка перед отрисовкой.
     */
    this.preset = function () {

    };

    /**
     * Обновляем онлайн индикатор и индикатор очков.
     */
    this.redraw = function () {
        if (!showed) return;
        self.preset();
        self.elements.forEach(function (el) {
            el.redraw();
        });
    };
};

/**
 * @type {PageBlockQDialogs}
 */
PageBlockQDialogs = new PageBlockQDialogs();