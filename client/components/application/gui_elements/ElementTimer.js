/**
 * Элемент: таймер.
 * @constructor
 * Инициирующие параметры:
 * x : number координата X
 * y : number координата Y
 * width : number ширина поля
 * height : number высота поля
 */
ElementTimer = function () {
    var self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    var showed = false;

    /**
     * Координата X текста.
     * @type {number}
     */
    this.x = undefined;

    /**
     * Координата Y текста.
     * @type {number}
     */
    this.y = undefined;

    let elTimer;
    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        elTimer = GUI.createElement(ElementText, {
            x: this.x, y: this.y,
            width: 100, height: 30
        });
    };

    /**
     * Покажем текст.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        elTimer.show();
        self.redraw();
    };

    /**
     * Спрячем текст.
     */
    this.hide = function () {
        if (!showed) return;
        elTimer.hide();
        showed = false;
    };

    /**
     * Перерисуем.
     */
    this.redraw = function () {
        if (!showed) return;
        elTimer.setText('00:00:00');
        elTimer.redraw();
    };
};
