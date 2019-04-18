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

    let elSoundsButton = null;

    this.init = function () {
        console.log('init-common');
        var el;
        /* Задний фон */
        el = GUI.createElement(ElementHealthIndicator, {
            x: 430,
            y: 10
        });
        self.elements.push(el);

        el = GUI.createElement(ElementHealthTimer, {
            x: 550, y: 40
        });
        self.elements.push(el);

        // sounds button кнопка звука
        elSoundsButton = GUI.createElement(ElementButton, {
            x: 700, y: 10,
            srcRest: '/images/star-off.png',
            srcHover: '/images/star-on.png',
            srcActive: '/images/star-on.png',
            onClick: function () {
                Sounds.toggle();
                Sounds.play(Sounds.PATH_CHALK);
                PageController.redraw();
            }
        });
        self.elements.push(elSoundsButton);
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
        if (Sounds.isEnabled()) {
            elSoundsButton.srcRest = '/images/star-on.png';
        } else {
            elSoundsButton.srcRest = '/images/star-off.png';
        }
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

PageBlockPanel = new PageBlockPanel();