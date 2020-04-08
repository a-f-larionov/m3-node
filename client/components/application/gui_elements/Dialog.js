/**
 * Элемент картинки.
 * @constructor
 */
Dialog = function () {
    let self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

    this.dialogShowed = false;

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
     * Ширина картинки.
     * @type {number}
     */
    this.width = 500;

    /**
     * Высота картинки.
     * @type {number}
     */
    this.height = 322;

    /**
     * Ссылка на картинку.
     * @type {string}
     */
    this.src = '/images/window-2.png';

    /**
     * Дом картинки.
     * @type {GUIDom}
     */
    this.dom = null;

    this.pointer = undefined;

    let dom;

    /**
     * Массив всех элементов страницы.
     * @type {Array}
     */
    this.elements = [];

    this.title = undefined;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        self = this;
        dom = GUI.createDom(undefined, {
            width: self.width,
            height: self.height,
            backgroundImage: self.src,
            animTracks: [
                [
                    {type: GUI.ANIM_TYPE_MOVE, vX: 0, vY: 15, duration: 38},
                    {
                        type: GUI.ANIM_TYPE_STOP, callback: function () {
                        }
                    },
                    {type: GUI.ANIM_TYPE_MOVE, vX: 0, vY: -15, duration: 38},
                    {
                        type: GUI.ANIM_TYPE_STOP, callback: onCloseFinished
                    }
                ]
            ]
        });
        self.x = (document.getElementById('applicationArea').clientWidth / 2)
            - self.width / 2;
        self.y = -500;

        self.dom = dom;
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        dom.show();
        for (let i in self.elements) {
            self.elements[i].show();
        }
        self.redraw();
    };

    /**
     * Спрячем картинку.
     */
    this.hide = function () {
        if (!showed) return;
        showed = false;
        dom.hide();
        for (let i in self.elements) {
            self.elements[i].hide();
        }
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        if (!showed) return;
        if (!self.dialogShowed) {
            dom.x = self.x;
            dom.y = self.y;
            dom.title = self.title;
            dom.pointer = self.pointer;
            dom.redraw();
        }

        for (let i in self.elements) {
            self.elements[i].redraw();
        }
    };

    /**
     * Show dialog!
     */
    this.showDialog = function (afterDialog) {
        /**
         * 1 - добавить в очередь
         * 2 - показать последний из очереди
         */
        return Dialog.addDialog(this, afterDialog);
    };

    this.showConcreteDialog = function () {
        if (self.dialogShowed) return;
        self.show();
        self.dialogShowed = true;
        dom.animData[0].frameN = 0;
        dom.animPlayed = true;
        self.redraw();
    };

    this.closeDialog = function () {
        /**
         * - Запуск прятания диалога
         */
        dom.animData[0].frameN = 2;
        dom.animPlayed = true;
    };

    let onCloseFinished = function () {
        self.dialogShowed = false;
        /**
         * Показать диалог из очереди
         */
        Dialog.removeDialog();
    };

    this.createElement = function (element, params) {
        self.elements.push(
            GUI.createElement(element, params, self.dom)
        );
    };

    this.reset = function (redraw) {
        dom.x = self.x;
        dom.y = self.y;
        dom.animData[0].frameN = 0;
        self.dialogShowed = false;
        if (redraw) {
            self.redraw();
            self.hide();
        }
        Dialog.removeDialog();
    }
};

Dialog.queue = [];

Dialog.addDialog = function (dialog, afterDialog) {
    if (afterDialog) {
        /**
         * 1 - найти элемент
         * 2 - создать два массива до и после этого элемент
         * 3 - добавить в конец первого массива
         * 4 - соединить два массива
         */
        let index, leftArr, rightArr;
        Dialog.queue.forEach(function (el, i) {
            if (el === afterDialog) {
                index = i;
            }
        });
        leftArr = Dialog.queue.slice(0, index + 1);
        leftArr.push(dialog);
        rightArr = Dialog.queue.slice(index);
        Dialog.queue = leftArr.concat(rightArr);

    } else {
        Dialog.queue.push(dialog);
    }
    Dialog.showDialog();
};

Dialog.removeDialog = function () {
    GUI.unlockEvents();
    Dialog.queue.shift();
    Dialog.showDialog();
};

Dialog.showDialog = function () {
    if (Dialog.queue.length) {
        Dialog.queue[0].showConcreteDialog();
        GUI.lockEvents(Dialog.queue[0].dom);
    }
};