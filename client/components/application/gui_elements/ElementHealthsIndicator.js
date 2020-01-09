/**
 * Элемент индикатор сердец.
 * @constructor
 */
ElementHealthIndicator = function () {
    var self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    var showed = false;

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

    /**
     * @type {GUIDom}[]
     */
    let doms;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        doms = [];
        let dom, width = 50, height = 50;
        for (let i = 0; i < 5; i++) {
            dom = GUI.createDom(null, {
                x: this.x + i * width,
                y: this.y,
                width: width,
                height: height,
                backgroundImage: '/images/health-heart.png'
            });
            doms.push(dom);
        }
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        doms.forEach(function (dom) {
            // dom.show();
        });
        self.redraw();
    };

    /**
     * Спрячем картинку.
     */
    this.hide = function () {
        if (!showed) return;
        showed = false;
        doms.forEach(function (dom) {
            dom.hide();
        });
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        if (!showed) return;
        let health = LogicUser.getCurrentUser().health;
        let i = 1;
        doms.forEach(function (dom) {
            if (i <= health) dom.show(); else dom.hide();
            dom.redraw();
            i++;
        });
    };
};