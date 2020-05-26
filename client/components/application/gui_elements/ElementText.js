/**
 * Элемент: текст.
 * @constructor
 * Инициирующие параметры:
 * x : number координата X
 * y : number координата Y
 * width : number ширина поля
 * height : number высота поля
 * text : string текст
 * fontSize: string размер шрифта, 21 по умолчанию
 * alignCenter : bool
 */
let ElementText = function () {
    let self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

    /**
     * Координата X текста.
     * @type {number}
     */
    this.x = undefined;

    /**
     * Координата Y текста.
     * @type {number}
     */
    this.y = undefined;

    /**
     * Ширина текста.
     * @type {number}
     */
    this.width = undefined;

    /**
     * Высота текста.
     * @type {number}
     */
    this.height = undefined;

    /**
     * Текст.
     * @type {string}
     */
    this.text = '';

    /**
     * Дом для текста.
     * @type {GUIDom}
     */
    let dom = null;

    /**
     * Указатель мыши при наведении.
     * @type {string}
     */
    this.pointer = GUI.POINTER_ARROW;

    /**
     * Размер шрифта, по умолчанию 21.
     * @type {number}
     */
    this.fontSize = 18;

    /**
     * Жирный ли шрифт?
     * @type {boolean}
     */
    this.bold = true;


    /**
     * Выравнивать по правой стороне.
     * @type {boolean}
     */
    this.alignCenter = true;
    this.alignRight = false;

    this.opacity = undefined;

    this.textDecoration = undefined;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        //this.color = "rgba(255,0,0,0.5)";
        dom = GUI.createDom(undefined, {
            height: this.height,
            color: this.color ? this.color : "rgba(103, 77, 56, 1.0)",
            background: this.background,
            fontFamily: 'arial,sans-serif,"Marvin",Tahoma,"Geneva CY",sans-serif',
        });
        dom.__dom.style.zIndex = this.zIndex;
//        dom.textShadow = '1px 1px black';
        GUI.bind(dom, GUI.EVENT_MOUSE_CLICK, onMouseClick, self);
    };

    /**
     * Покажем текст.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        dom.show();
        self.redraw();
    };

    /**
     * Спрячем текст.
     */
    this.hide = function () {
        if (!showed) return;
        showed = false;
        dom.hide();
    };

    /**
     * Обновим текст.
     * @param text {string}
     */
    this.setText = function (text) {
        if (typeof text != 'string') {
            text = text.toString();
        }
        self.text = text;
    };

    /**
     * Перерисуем.
     */
    this.redraw = function () {
        if (!showed) return;
        refreshText();
        dom.x = self.x;
        dom.y = self.y;
        dom.fontSize = self.fontSize;
        dom.opacity = self.opacity;
        dom.width = self.width;
        dom.textDecoration = self.textDecoration;
        if (self.bold) dom.fontWeight = 'bold'; else dom.fontWeight = 'normal';
        if (self.alignCenter) {
            dom.alignText = 'center';
        }
        if (self.alignRight) {
            dom.alignText = 'right';
        }
        dom.redraw();
    };

    let refreshText = function () {
        let textHTML, charCode;
        textHTML = '';
        for (let i in self.text) {
            let symbol = self.text[i];
            charCode = self.text.charCodeAt(i);
            /* feed line symbol: 0xAh, 10d, \n */
            if (charCode == 10) {
                textHTML += "<br>";
                continue;
            }
            textHTML += symbol;
        }
        dom.innerHTML = textHTML;
        dom.pointer = self.pointer;
    };

    /**
     * Обработка события на клик.
     * @param mouseEvent {MouseEvent}
     * @param dom {Element}
     */
    let onMouseClick = function (mouseEvent, dom) {
        if (!self.onClick) {
            return;
        }
        /** Да, тут мы останавливаем дальнейшие течение клика. */
        mouseEvent.stopPropagation();
        return self.onClick.call(this, mouseEvent, dom);
    };
};
