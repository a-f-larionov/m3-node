/**
 * Блок общих.
 * @constructor
 */
PageBlockPanel = function PageBlockPanel() {
    var self = this;

    /**
     * Показывать ли страницу.
     * @type {boolean}
     */
    var showed = false;

    /**
     * Массив всех элементов страницы.
     * @type {Array}
     */
    this.elements = [];

    this.init = function () {
        console.log('init-common');
        var el;
        /* Задний фон */
        el = GUI.createElement(ElementHealthsIndicator, {
            x: 430,
            y: 10
        });
        self.elements.push(el);

        el = GUI.createElement(ElementButton, {
            x: 650, y: 10,
            srcRest: '/images/star-off.png',
            srcHover: '/images/star-on.png',
            srcActive: '/images/star-on.png',
        });
        self.elements.push(el);
    };

    /**
     * Покажем все элементы на странице.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        self.preset();
        for (var i in self.elements) {
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
        for (var i in self.elements) {
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
        for (var i in self.elements) {
            self.elements[i].redraw();
        }
    };
};

PageBlockPanel = new PageBlockPanel();