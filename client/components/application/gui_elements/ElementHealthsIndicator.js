/**
 * Элемент индикатор сердец.
 * @constructor
 */
ElementHealthIndicator = function () {
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

    /**
     * @type {GUIDom}[]
     */
    let doms;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        let dom, width = 50, height = 50;
        doms = [];
        let step = width - 15;

        for (let i = 0; i < 5; i++) {
            dom = GUI.createDom(null, {
                x: this.x + i * step, y: this.y,
                width: width, height: height,
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
        let health, step, i;
        if (!showed) return;
        i = 1;
        if (LogicUser.onFieldNow) {
            health = LogicUser.oldHealth;
        } else {
            health = LogicUser.getCurrentUser().health;
        }
        step = 50 - 15;
        if (health === LogicHealth.getMaxHealth() - 1) {
            step -= 10;
        }
        doms.forEach(function (dom) {
            dom.x = self.x + (i - 1) * step;
            if (i <= health) dom.show(); else dom.hide();
            dom.redraw();
            i++;
        });
    };
};