/**
 * Страница бэкграудна.
 * @constructor
 */
PageBlockBackground = function PageBlockBackground() {
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
        let el;

        /** Рамка для фулскрина */
        el = GUI.createElement(ElementImage, {
            x: -15,
            y: -15,
            src: '/images/fs-frame.png'
        });
        self.elements.push(el);

        /** Задний фон */
        el = GUI.createElement(ElementImage, {
            x: 0,
            y: 0,
            src: '/images/old-paper.png'
        });
        self.elements.push(el);

        setBackgroundImage();
    };

    /**
     * Покажем все элементы на странице.
     */
    this.show = function () {
        if (showed === true) return;
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
        if (showed === false) return;
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
        for (let i in self.elements) {
            self.elements[i].redraw();
        }
    };

    let setBackgroundImage = function () {
        let elBody, backgroundImage;
        elBody = document.getElementsByTagName('body')[0];

        backgroundImage = "url('" + GUI.getImagePath('/images/old-paper.png') + "')";

        elBody.style.backgroundImage = backgroundImage;
        //elBody.style.backgroundSize = "777px 500px";
    };
};

/**
 *
 * @type {PageBlockBackground}
 */
PageBlockBackground = new PageBlockBackground();