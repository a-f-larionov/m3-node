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

    let images = {};

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

        /** Canvas */
        canvas = document.getElementById('wizardArea');

        console.log(canvas);

        canvas.width = DataCross.app.width;
        canvas.height = DataCross.app.height;

        canvas.style.display = 'none';
        cntx = canvas.getContext('2d');

        cntx.showByImg = showByImg;
        cntx.unlockByImg = unlockByImg;
        cntx.highlightCells = highlightCells;

        let proccesEvent = function (event, callback) {
            let pixelData, el, x, y;
            x = event.offsetX;
            y = event.offsetY;
            pixelData = cntx.getImageData(x, y, 1, 1).data;
            if (pixelData[3] === 0) {

                canvas.style.display = 'none';
                el = document.elementFromPoint(event.offsetX, event.offsetY);

                if (el) el.dispatchEvent(new MouseEvent(event.type, event));
                if (canvas.isActive) canvas.style.display = '';

                if (callback) callback(el);
            } else {
                if (callback) callback(false);
            }
        };

        /** On Click */
        canvas.onclick = function (event) {
            proccesEvent(event, LogicWizard.onClick)
        };
        /** On Mouse Move */
        canvas.onmousemove = function (event) {
            proccesEvent(event, function (el) {
                if (el) {
                    canvas.style.cursor = el.style.cursor;
                } else {
                    canvas.style.cursor = '';
                }
            });
        };
        //canvas.onmouseout = proccesEvent;
        //canvas.onmouseover = proccesEvent;
        //canvas.onmousemove = proccesEvent;

        elDialog = GUI.createElement(ElementImage, {
            x: 400, y: 360, src: '/images/wizard-dialog.png'
        });
        elDialog.dom.__dom.style.zIndex = 20000;
        elDialog.hide();

        elText = GUI.createElement(ElementText, {
            x: 400 + dialogBorder, y: 360 + dialogBorder,
            width: Images.getWidth('/images/wizard-dialog.png') - dialogBorder * 2,
            height: Images.getHeight('/images/wizard-dialog.png'),
            alignCenter: true, zIndex: 20001,
            text: 'text'
        });
        elText.hide();
    };

    let drawBackground = function () {
        cntx.clearRect(0, 0,
            DataCross.app.width * window.devicePixelRatio,
            DataCross.app.height * window.devicePixelRatio
        );
        cntx.globalCompositeOperation = 'source-out';
        cntx.globalAlpha = 0.55;
        cntx.fillStyle = 'black';
        cntx.fillRect(0, 0,
            DataCross.app.width * window.devicePixelRatio,
            DataCross.app.height * window.devicePixelRatio
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
        PageBlockField.getElementField().lockHint();
        canvas.style.display = '';
        canvas.isActive = true;
        drawBackground();
    };

    this.finish = function () {
        canvas.isActive = false;
        canvas.style.display = 'none';
        elDialog.hide();
        elText.hide();
        PageBlockField.getElementField().unlockHint();
        clearInterval(hintIntervalId);
    };

    let stopHint = null;
    let hintIntervalId = null;

    this.showHint = function (pList) {
        let coords = PageBlockField.getElementField().getCoords();
        console.log('show hint wizard');
        pList.forEach(function (p) {
            p.x += coords.cellX;
            p.y += coords.cellY;
        });
        if (hintIntervalId) clearInterval(hintIntervalId);
        hintIntervalId = setInterval(function () {
            if (Animate.hintActive) return;
            PageBlockField.getElementField().showHint(pList);
        }, Config.OnIdle.second * 1.5);
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
        callback(cntx);
    };

    let unlockByImg = function (url, x, y) {
        cntx.globalAlpha = 1;
        cntx.globalCompositeOperation = 'destination-out';
        if (!images[url]) {
            images[url] = new Image();
            images[url].onload = function () {
                unlockByImg(url, x, y);
            };
            images[url].src = url;
            return;
        }
        cntx.drawImage(images[url], x, y, Images.getWidth(url), Images.getHeight(url));
    };

    let showByImg = function (url, x, y) {
        cntx.globalAlpha = 0.99;
        cntx.globalCompositeOperation = 'destination-out';
        if (!images[url]) {
            images[url] = new Image();
            images[url].onload = function () {
                showByImg(url, x, y);
            };
            images[url].src = url;
            return;
        }
        cntx.drawImage(images[url], x, y, Images.getWidth(url), Images.getHeight(url));
    };

    let highlightCells = function (pList) {
        let coords = PageBlockField.getElementField().getCoords();

        pList.forEach(function (p) {
            if (p.unlock) {
                unlockByImg('/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * p.x,
                    coords.y + DataPoints.BLOCK_HEIGHT * (p.y + 1)
                );
            } else {
                showByImg('/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * p.x,
                    coords.y + DataPoints.BLOCK_HEIGHT * (p.y + 1)
                );
            }
        });
    };

    this.showByImg = showByImg;
    this.unlockByImg = unlockByImg;
    this.highlightCells = highlightCells;
};

/** @type {PageBlockWizard} */
PageBlockWizard = new PageBlockWizard();

PBWizard = PageBlockWizard;