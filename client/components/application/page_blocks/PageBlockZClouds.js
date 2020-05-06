/**
 * Блок общих.
 * @type {PageBlockZClouds}
 * @constructor
 */
let PageBlockZClouds = function PageBlockZClouds() {
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

    this.init = function () {
        let el, grid;
        grid = [
            {x: 30, y: 50},
            {x: 30, y: 150},
            {x: 30, y: 300},
            {x: 30, y: 350},

            {x: 100, y: 50},
            {x: 110, y: 100},
            {x: 100, y: 200},
            {x: 100, y: 350},

            {x: 250, y: 20},
            {x: 250, y: 100},
            {x: 250, y: 200},
            {x: 250, y: 300},
            {x: 250, y: 400},

            {x: 400, y: 80},
            {x: 400, y: 110},
            {x: 400, y: 200},
            {x: 400, y: 250},
            {x: 400, y: 350},
            {x: 510, y: 50},
            {x: 510, y: 300},
            {x: 510, y: 200},
            {x: 510, y: 400},
        ];

        grid.forEach(function (p) {
            el = GUI.createElement(ElementImage, {x: p.x, y: p.y, src: 'clouds-1.png', opacity: 0.9});
            self.elements.push(el);
        });

        Animate.anim(animClouds, {}, self.elements);
    };

    /**
     * Покажем все элементы на странице.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        for (let i in self.elements) {
            self.elements[i].show();
        }
        self.redraw();
    };

    /**
     * Спрячем все элементы на странице.
     */
    this.hide = function () {
        if (!showed) return;
        showed = false;
        for (let i in self.elements) {
            self.elements[i].hide();
        }
    };

    /**
     * Обновляем онлайн индикатор и индикатор очков.
     */
    this.redraw = function () {
        if (!showed) return;
        self.elements.forEach(function (el) {
            el.redraw();
        });
    };
};

/** @type {PageBlockZClouds} */
PageBlockZClouds = new PageBlockZClouds();