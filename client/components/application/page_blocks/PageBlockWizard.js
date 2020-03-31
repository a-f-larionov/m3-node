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

    let dialogBorder = 16;

    this.init = function () {
        let el;

        /** Canvas */
        canvas = document.getElementById('wizardArea');

        canvas.width = DataCross.application.width * window.devicePixelRatio;
        canvas.height = DataCross.application.height * window.devicePixelRatio;
        canvas.style.display = 'none';
        cntx = canvas.getContext('2d');

        /** On Click */
        canvas.onclick = function (event) {
            let pixelData, el, x, y;
            x = event.offsetX * window.devicePixelRatio;
            y = event.offsetY * window.devicePixelRatio;
            pixelData = cntx.getImageData(x, y, 1, 1).data;
            if (pixelData[3] === 0) {
                canvas.style.display = 'none';
                el = document.elementFromPoint(event.offsetX, event.offsetY);
                el.dispatchEvent(new MouseEvent(event.type, event));
                canvas.style.display = '';
                LogicWizard.onClick(el);
            }
        };
        /** On Move */
        canvas.onmousemove = function (event) {
            let pixelData, el, x, y;
            x = event.offsetX * window.devicePixelRatio;
            y = event.offsetY * window.devicePixelRatio;
            pixelData = cntx.getImageData(x, y, 1, 1).data;
            if (pixelData[3] === 0) {
                canvas.style.display = 'none';
                el = document.elementFromPoint(event.offsetX, event.offsetY);
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
        cntx.clearRect(0, 0,
            DataCross.application.width * window.devicePixelRatio,
            DataCross.application.height * window.devicePixelRatio
        );
        cntx.globalCompositeOperation = 'source-out';
        cntx.globalAlpha = 0.75;
        cntx.fillStyle = 'black';
        cntx.fillRect(0, 0,
            DataCross.application.width * window.devicePixelRatio,
            DataCross.application.height * window.devicePixelRatio
        );
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

    this.showDialog = function (x, y, textOffsetY, fontSize) {
        if (!x) x = 400;
        if (!y) y = 360;
        if (!textOffsetY) textOffsetY = 0;
        if (!fontSize) fontSize = 21;
        elDialog.x = x;
        elDialog.y = y;
        elText.x = x + dialogBorder;
        elText.y = y + dialogBorder + textOffsetY;
        elText.fontSize = fontSize;
        elDialog.show();
        elText.show();
        self.redraw();
    };

    this.draw = function (callback) {
        cntx.globalAlpha = 1;
        cntx.globalCompositeOperation = 'destination-out';
        callback(cntx, drawImage);
    };

    let drawImage = function (cntx, url, x, y) {
        let image;
        image = new Image();
        image.onload = function () {
            cntx.drawImage(image, x * window.devicePixelRatio, y * window.devicePixelRatio);
        };
        image.src = url;
    }
};

/** @type {PageBlockWizard} */
PageBlockWizard = new PageBlockWizard();