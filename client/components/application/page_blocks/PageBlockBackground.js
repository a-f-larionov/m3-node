/**
 * Страница бэкграудна.
 * @type {PageBlockBackground}
 * @constructor
 */
let PageBlockBackground = function PageBlockBackground() {
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
        el = GUI.createElement(ElementImage, {x: -15, y: -15, src: 'fs-frame.png'});
        self.elements.push(el);

        /** Задний фон */
        el = GUI.createElement(ElementImage, {x: 0, y: 0, src: 'old-paper.png'});
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
        let elBody, backgroundImage, url, meta;

        url = 'old-paper.png';
        meta = Images.getMeta(url);
        elBody = document.getElementsByTagName('body')[0];

        backgroundImage = "url('" + meta.path + "')";

        if (window.useSprite) {
            let koefW, koefH;
            koefW = screen.availWidth / meta.w;
            koefH = screen.availHeight / meta.h;
            elBody.style.backgroundPositionX = '-' + meta.x * koefW + 'px';
            elBody.style.backgroundPositionY = '-' + meta.y * koefH + 'px';
            elBody.style.backgroundSize =
                (
                    window.spriteSize.width * koefW + 'px' +
                    ' ' +
                    window.spriteSize.height * koefH + 'px'
                );
        }
        elBody.style.backgroundImage = backgroundImage;
        //elBody.style.backgroundSize = "777px 500px";
    };
};

/**
 *
 * @type {PageBlockBackground}
 */
PageBlockBackground = new PageBlockBackground();