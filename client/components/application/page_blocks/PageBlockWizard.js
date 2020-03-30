/**
 * Блок Визарда
 * @constructor
 */
PageBlockWizard = function PageBlockWizard() {
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

    let canvas = null;
    /** @type {CanvasRenderingContext2D} */
    let cntx = null;

    let elDialog = null;
    let elText = null;

    this.init = function () {
        let el;

        /** Canvas */
        canvas = document.getElementById('wizardArea');
        canvas.width = DataCross.application.width;
        canvas.height = DataCross.application.height;
        canvas.style.display = 'none';
        cntx = canvas.getContext('2d');

        /** On Click */
        canvas.onclick = function (event) {
            let pixelData, el;
            pixelData = cntx.getImageData(event.offsetX, event.offsetY, 1, 1).data;
            if (pixelData[3] === 0) {
                canvas.style.display = 'none';
                el = document.elementFromPoint(event.clientX, event.clientY);
                el.dispatchEvent(new MouseEvent(event.type, event));
                canvas.style.display = '';
                LogicWizard.onClick(el);
            }
        };
        /** On Move*/
        canvas.onmousemove = function (event) {
            let pixelData, el;
            pixelData = cntx.getImageData(event.offsetX, event.offsetY, 1, 1).data;
            if (pixelData[3] === 0) {
                canvas.style.display = 'none';
                el = document.elementFromPoint(event.clientX, event.clientY);
                el.dispatchEvent(new MouseEvent(event.type, event));
                canvas.style.cursor = el.style.cursor;
                canvas.style.display = '';
            } else {
                canvas.style.cursor = '';
            }
        };

        elDialog = GUI.createElement(ElementImage, {
            x: 400, y: 360, src: '/images/wizard-dialog.png'
        });
        elDialog.dom.__dom.style.zIndex = 20000;
        elDialog.hide();

        let dialogBorder = 16;
        elText = GUI.createElement(ElementText, {
            x: 400 + dialogBorder, y: 360 + dialogBorder,
            width: GUI.getImageWidth('/images/wizard-dialog.png') - dialogBorder * 2,
            height: GUI.getImageHeight('/images/wizard-dialog.png'),
            alignCenter: true, zIndex: 20001,
            text: 'text'
        });
        elText.hide();
    };

    let drawBackground = function () {
        cntx.globalCompositeOperation = 'source-out';
        cntx.globalAlpha = 0.75;
        cntx.fillStyle = 'black';
        cntx.fillRect(0, 0, DataCross.application.width, DataCross.application.height);
    };

    /**
     * Покажем все элементы на странице.
     */
    this.show = function () {
        if (showed) return;
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
        if (!showed) return;
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
        self.elements.forEach(function (el) {
            el.redraw();
        });
        elDialog.redraw();
        elText.redraw();
    };

    this.begin = function () {
        canvas.style.display = '';
        drawBackground();
    };

    this.finish = function () {
        canvas.style.display = 'none';
        elDialog.hide();
        elText.hide();
    };

    this.updateText = function (text) {
        elText.text = text;
        self.redraw();
    };

    this.showDialog = function () {
        elDialog.show();
        elText.show();
    };

    this.draw = function (callback) {
        cntx.globalAlpha = 1;
        cntx.globalCompositeOperation = 'destination-out';
        callback(cntx);
    };
};

/** @type {PageBlockWizard} */
PageBlockWizard = new PageBlockWizard();