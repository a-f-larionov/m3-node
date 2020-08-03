/**
 * Элемент картинки.
 * @type {Dialog}
 * @constructor
 */
let Dialog = function (src) {
    let self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

    this.dialogShowed = false;

    this.onShowComplete = null;
    /**
     * Координата Y картинки.
     * @type {number}
     */
    this.startPosition = -500;

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
    this.src = src ? src : 'window-2.png';

    this.bottomPosition = 90;

    /**
     * Дом картинки.
     * @type {GUIDom}
     */
    this.dom = null;

    this.pointer = undefined;

    /**
     * Массив всех элементов страницы.
     * @type {Array}
     */
    this.elements = [];

    this.elHeader = null;

    this.elButtonClose = null;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        let dom;
        dom = GUI.createDom(undefined, {
            width: self.width,
            height: self.height,
            backgroundImage: self.src,
            zIndex: 1000
        });
        dom.x = (document.getElementById('appArea').clientWidth / 2) - self.width / 2;
        dom.y = self.startPosition;

        /** Заголовок диалога */
        self.elHeader = GUI.createElement(ElementText,
            {x: 135, y: 16, width: 230, height: 27},
            dom);

        /** Кнопка закрыть */
        self.elButtonClose = GUI.createElement(ElementButton, {
            x: 452, y: 3, srcRest: 'button-close-rest.png',
            onClick: function () {
                self.closeDialog();
            }
        }, dom);
        self.elButtonClose.show();

        self.dom = dom;
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        self.dom.show();
        self.elHeader.show();
        self.elements.forEach(function (el) {
            el.show();
        });
        self.redraw();
    };

    /**
     * Спрячем картинку.
     */
    this.hide = function () {
        if (!showed) return;
        showed = false;
        self.dom.hide();
        self.elHeader.hide();
        self.elements.forEach(function (el) {
            el.hide();
        });
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        if (!showed) return;
        if (!self.dialogShowed) {
            self.dom.pointer = self.pointer;
            self.dom.redraw();
        }
        self.elements.forEach(function (el) {
            el.redraw();
        });

        self.elHeader.redraw();
    };

    /**
     * Show dialog! only queue
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
        Animate.anim(animShowDialog, {
            dom: self.dom, onFinish: function () {
                if (self.onShowComplete) self.onShowComplete();
                LogicWizard.onShowDialog();
            }
        }, self.bottomPosition);
        self.redraw();
    };

    this.closeDialog = function () {
        /** - Запуск прятания диалога */
        LogicWizard.onHideDialog(true);
        Animate.anim(animHideDialog, {dom: self.dom, onFinish: onCloseFinished}, self.bottomPosition)
    };

    let onCloseFinished = function () {
        self.dialogShowed = false;
        /**
         * Показать диалог из очереди
         */
        Dialog.removeDialog();
        LogicWizard.onHideDialog(false);
    };

    this.createElement = function (element, params) {
        self.elements.push(
            GUI.createElement(element, params, self.dom)
        );
    };

    this.reset = function (redraw) {
        self.dom.y = self.startPosition;
        self.dialogShowed = false;
        if (redraw) {
            self.redraw();
            self.hide();
        }
        Dialog.removeDialog();
    };

    this.setTitle = function (title) {
        self.elHeader.setText(title);
        self.elHeader.redraw();
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