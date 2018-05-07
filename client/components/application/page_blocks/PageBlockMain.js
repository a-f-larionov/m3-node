/**
 * Основная страница игры.
 * @constructor
 */
PageBlockMain = function PageBlockMain() {
    var self = this;

    /**
     * Показывать ли страницу.
     * @type {boolean}
     */
    var showed = false;

    var elementDialog = false;

    /**
     * Массив всех элементов страницы.
     * @type {Array}
     */
    this.elements = [];

    /**
     * Создадим тут все элементы страницы.
     */
    this.init = function () {
        var element;
        element = GUI.createElement(ElementSprite, {
            x: 50,
            y: 50,
            src: '/images/man-01.png',
            domInitParams: {
                animTracks: [
                    [
                        {
                            type: GUI.ANIM_TYPE_MOVIE,
                            images: [
                            '/images/man_right_1.png',
                            '/images/man_right_2.png',
                            '/images/man_right_3.png',
                            '/images/man_right_4.png',
                            '/images/man_right_5.png',
                            '/images/man_right_6.png',
                            '/images/man_right_7.png',
                            '/images/man_right_8.png'
                        ]
                            , duration: 8
                        },
                        {type: GUI.ANIM_TYPE_GOTO, pos: 0}
                    ],
                    [
                        {type: GUI.ANIM_TYPE_MOVE, vX: 3, vY: 0},
                        {type: GUI.ANIM_TYPE_GOTO, pos: 0}
                    ]
                ]
            }
        });
        element.animPlay();
        self.elements.push(element);
        
        element = GUI.createElement(ElementButton, {
            x: 100,
            y: 100,
            srcRest: '/images/man_right_1.png',
            srcHover: '/images/man_right_2.png',
            srcActive: '/images/man_right_3.png',
            onClick: function () {
                self.showDialog();
            }
        });
        self.elements.push(element);

        element = GUI.createElement(ElementDialog, {
            src: '/images/window.png'
        });
        elementDialog = element;
        self.elements.push(element);
    };

    /**
     * Покажем все элементы на странице.
     */
    this.show = function () {
        if (showed === true) return;
        showed = true;
        for (var i in self.elements) {
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
        if (!showed)return;
        self.preset();
        for (var i in self.elements) {
            self.elements[i].redraw();
        }
    };

    this.showDialog = function () {
        Logs.log(Logs.LEVEL_NOTIFY, 'Button clicked!');
        elementDialog.showDialog();
    };
};

PageBlockMain = new PageBlockMain;