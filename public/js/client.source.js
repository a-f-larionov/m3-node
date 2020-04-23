
/** ../client/core/constants.js */
CONST_IS_SERVER_SIDE = false;
CONST_IS_CLIENT_SIDE = true;
if(window["constants"] !== undefined){window["constants"].__path="../client/core/constants.js"};

/** ../client/core/functions.js */
/**
 * В этом файле содержаться системные функции.
 */

/**
 * Логи на этапах создания.
 * @param message
 */
let log = console.log;

/**
 * Ошибка создания, выводит сообщение и завершает работу.
 * @param message
 */
let error = function (message) {
    console.log("Ошибка: " + message);
    process.exit();
};

/* Функционал для последовательной инициализации компонент. */
let sequencedInitStack = [];
let sequencedInitBlocked = false;

/**
 * Выполнить очередной инит по завершению всех предыдущих.
 * @param initFunction {function}
 */
let sequencedInit = function (initFunction) {
    sequencedInitStack.push(initFunction);
    tryInitNext();
};

let tryInitNext = function () {
    if (!sequencedInitStack.length) {
        log("Init stack empty now.");
        return;
    }
    if (sequencedInitBlocked) return;
    sequencedInitBlocked = true;
    initFunction = sequencedInitStack.shift();
    initFunction(function () {
        sequencedInitBlocked = false;
        tryInitNext();
    });
};

/**
 *
 *  Javascript string pad
 *  http://www.webtoolkit.info/
 *
 **/

let STR_PAD_LEFT = 1;
let STR_PAD_RIGHT = 2;
let STR_PAD_BOTH = 3;

let str_pad = function (str, len, pad, dir) {
    if (typeof (len) == "undefined") {
        let len = 0;
    }
    if (typeof (pad) == "undefined") {
        let pad = ' ';
    }
    if (typeof (dir) == "undefined") {
        let dir = STR_PAD_RIGHT;
    }
    if (len + 1 >= str.length) {

        switch (dir) {
            case STR_PAD_LEFT:
                str = Array(len + 1 - str.length).join(pad) + str;
                break;

            case STR_PAD_BOTH:
                let right = Math.ceil((padlen = len - str.length) / 2);
                let left = padlen - right;
                str = Array(left + 1).join(pad) + str + Array(right + 1).join(pad);
                break;

            default:
                str = str + Array(len + 1 - str.length).join(pad);
                break;
        } // switch
    }
    return str;
};

/**
 * Возвращает время в секундах.
 */
let time = function () {
    return LogicTimeClient.getTime();
};

/**
 * Возвращает время в миллисекундах секундах.
 */
let mtime = function () {
    return LogicTimeClient.getMicroTime();
};

let getQueryVariable = function (variable) {
    let query = window.location.search.substring(1);
    let variables = query.split("&");
    for (let i = 0; i < variables.length; i++) {
        let pair = variables[i].split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    Logs.log('Query Variable ' + variable + ' not found', Logs.LEVEL_WARNING);
};

/**
 * Provides requestAnimationFrame in a cross browser way.
 * @author paulirish / http://paulirish.com/
 */

if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (function () {

        return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function ( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
                return window.setTimeout(callback, 1000 / 60);
            };

    })();
}

if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame =
        window.mozCancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.msCancelAnimationFrame;
}if(window["functions"] !== undefined){window["functions"].__path="../client/core/functions.js"};

/** ../client/components/application/anims/AnimLocker.js */
let AnimLocker = {
    locks: 0,
    lock: function () {
        AnimLocker.locks++;
    },
    release: function () {
        AnimLocker.locks--;
    },
    free: function () {
        return AnimLocker.locks === 0;
    },
    busy: function () {
        return !AnimLocker.free();
    }
};if(window["AnimLocker"] !== undefined){window["AnimLocker"].__path="../client/components/application/anims/AnimLocker.js"};

/** ../client/components/application/anims/Animate.js */
let Animate = {
    anim: function (animClass, context) {
        let args, animObj, position, requestId;
        position = 0;
        animObj = new animClass();
        for (let name in context) {
            if (context.hasOwnProperty(name)) {
                animObj[name] = context[name];
            }
        }

        args = Array.from(arguments);
        args.shift();
        args.shift();

        animObj.init.apply(animObj, args);

        if (!animObj.skipAnimLock) AnimLocker.lock();

        let iterate = function () {
            position += Config.OnIdle.animStep;
            if (animObj.iterate(position)) {
                requestId = requestAnimationFrame(iterate);
            } else {
                stopAnim();
            }
        };
        let stopAnim = function () {
            cancelAnimationFrame(requestId);
            if (animObj.finish) animObj.finish();
            if (animObj.skipAnimLock) {
            } else {
                AnimLocker.release();
            }
            if (context.onFinish) context.onFinish();
        };

        iterate();
        return stopAnim;
    },

    getFrameUrl: function (urlStart, position, max) {
        return urlStart + (Math.floor((position) % max) + 1) + '.png';
    }
};

Animate.settings = {
    fallVelocity: 5
};if(window["Animate"] !== undefined){window["Animate"].__path="../client/components/application/anims/Animate.js"};

/** ../client/components/application/anims/dialogs.js */
let animShowDialog = function () {
    let
        velocity = 20,
        startPosition = -500,
        endPosition = 70
    ;

    this.init = function (bottomPosition) {
        endPosition = bottomPosition;
        this.skipAnimLock = true;
    };

    this.iterate = function (counter) {
        this.dom.y = startPosition + velocity * counter;
        this.dom.redraw();
        return this.dom.y < endPosition;
    };

    this.finish = function () {
        this.dom.y = endPosition;
        this.dom.redraw();
    };
};

let animHideDialog = function () {
    let
        velocity = -20,
        startPosition = 70,
        endPosition = -500
    ;

    this.init = function (bottomPosition) {
        startPosition = bottomPosition;
        this.skipAnimLock = true;
        startPosition = this.dom.y;
    };

    this.iterate = function (counter) {
        this.dom.y = startPosition + velocity * counter;
        this.dom.redraw();
        return this.dom.y > endPosition;
    };

    this.finish = function () {
        this.dom.y = endPosition;
        this.dom.redraw();
    };
};if(window["dialogs"] !== undefined){window["dialogs"].__path="../client/components/application/anims/dialogs.js"};

/** ../client/components/application/anims/element-field.js */
let animChangeAndBack = function () {
    let dom, v, velocity, tMiddle, tFinish, startP;
    velocity = 5;
    tFinish = Math.floor(100 / velocity);
    tMiddle = Math.floor(tFinish / 2);

    this.init = function (a, b) {
        v = {x: (b.x - a.x) * velocity, y: (b.y - a.y) * velocity};
        dom = this.gemDoms[a.x][a.y];
        startP = {x: dom.x, y: dom.y};
    };

    this.iterate = function (t) {
        if (t > tMiddle) {
            dom.x = startP.x + (tMiddle * v.x) - v.x * (t - tMiddle);
            dom.y = startP.y + (tMiddle * v.y) - v.y * (t - tMiddle);
        } else {
            dom.x = startP.x + v.x * t;
            dom.y = startP.y + v.y * t;
        }

        dom.redraw();
        if (dom.bindedDoms) {
            dom.bindedDoms.x = dom.x;
            dom.bindedDoms.y = dom.y;
            dom.bindedDoms.redraw();
        }
        return t + 1 < tFinish;
    };
};

let animLightning = function () {
    let dom;
    let velocity = 0.5;

    this.init = function (p, specId) {
        dom = this.animDoms.pop();
        let lineData = Field.getVisibleLength(p, specId);
        dom.width = lineData.length * DataPoints.BLOCK_WIDTH;
        dom.height = Images.getHeight('anim-light-1.png');
        if (specId === DataObjects.WITH_LIGHTNING_VERTICAL) {
            dom.rotate = 90;
            dom.x = (p.x) * DataPoints.BLOCK_WIDTH;
            dom.y = (lineData.lower) * DataPoints.BLOCK_HEIGHT
                - (Images.getHeight('anim-light-1.png') - DataPoints.BLOCK_HEIGHT) / 2;
            /** Rotate from center like a cos&sin*/
            dom.x -= (dom.width - DataPoints.BLOCK_WIDTH) / 2;
            dom.y += (dom.width - DataPoints.BLOCK_WIDTH) / 2;
        }
        if (specId === DataObjects.WITH_LIGHTNING_HORIZONTAL) {
            dom.rotate = 0;
            dom.x = lineData.lower * DataPoints.BLOCK_WIDTH;
            dom.y = p.y * DataPoints.BLOCK_HEIGHT
                - (Images.getHeight('anim-light-1.png') - DataPoints.BLOCK_HEIGHT) / 2;
        }
        dom.show();
        dom.redraw();
    };

    this.iterate = function (position) {
        dom.backgroundImage = Animate.getFrameUrl('anim-light-', position * velocity, 5);
        dom.redraw();
        if (position < 15) return true;
    };

    this.finish = function () {
        dom.hide();
        this.animDoms.push(dom);
    }
};

let animHummerDestroy = function () {
    let dom, imageUrl = 'anim-hd-1.png';

    let velocity = 1.0;

    this.init = function (p) {
        dom = this.animDoms.pop();
        dom.x = p.x * DataPoints.BLOCK_WIDTH
            - (Images.getWidth(imageUrl) - DataPoints.BLOCK_WIDTH) / 2;
        dom.y = p.y * DataPoints.BLOCK_HEIGHT
            - (Images.getHeight(imageUrl) - DataPoints.BLOCK_HEIGHT) / 2;
        dom.width = null;
        dom.height = null;
        dom.backgroundImage = imageUrl;
        dom.show();
        dom.redraw();
    };

    this.iterate = function (position) {
        dom.backgroundImage = Animate.getFrameUrl('anim-hd-', position * velocity, 15);
        dom.redraw();
        return position < 15;
    };

    this.finish = function () {
        this.animDoms.push(dom);
        dom.hide();
    }
};

let animChangeAndDestroy = function () {
    let dom, v, velocity, counterStop;
    velocity = 5;
    counterStop = Math.floor(50 / velocity) - 1;
    let startP;
    this.init = function (a, b) {
        v = {x: (b.x - a.x) * velocity, y: (b.y - a.y) * velocity};
        dom = this.gemDoms[a.x][a.y];
        startP = {x: dom.x, y: dom.y};
    };

    this.iterate = function (position) {
        dom.x = startP.x + v.x * position;
        dom.y = startP.y + v.y * position;
        dom.redraw();
        if (dom.bindedDoms) {
            dom.bindedDoms.x = dom.x;
            dom.bindedDoms.y = dom.y;
            dom.bindedDoms.redraw();
        }
        return position < counterStop;
    };
};

let animGemEmitFader = function () {
    let dom;
    let velocity = Animate.settings.fallVelocity;

    this.init = function (p) {
        dom = this.gemDoms[p.x][p.y];
        dom.x = p.x * DataPoints.BLOCK_WIDTH;
        dom.y = p.y * DataPoints.BLOCK_HEIGHT;

        dom.backgroundPositionY = DataPoints.BLOCK_HEIGHT;
        dom.height = 0;
        dom.width = DataPoints.BLOCK_WIDTH;
        dom.backgroundImage = DataPoints.objectImages[Field.getGemId(p)];
        dom.redraw();
        dom.show();
    };
    this.iterate = function (position) {
        //dom.opacity = (counter / 10);
        dom.height = velocity * position;
        dom.backgroundPositionY = DataPoints.BLOCK_HEIGHT - velocity * position;
        dom.redraw();
        return dom.height < DataPoints.BLOCK_HEIGHT;
    };
};

let animFallGems = function () {
    let doms, dom, self = this;
    let velocity = Animate.settings.fallVelocity;

    this.init = function (list) {
        doms = [];
        list.forEach(function (data) {
            self.gemDoms[data.from.x][data.from.y].hide();
            dom = self.gemDoms[data.to.x][data.to.y];
            doms.push(dom);
            dom.fallMode = 'just';

            dom.startY = (data.to.y - 1) * DataPoints.BLOCK_HEIGHT;

            dom.backgroundImage = DataPoints.objectImages[Field.getGemId({x: data.to.x, y: data.to.y})];
            dom.x = data.to.x * DataPoints.BLOCK_WIDTH;
            dom.y = data.to.y * DataPoints.BLOCK_HEIGHT;
            dom.show();


            //@todo who to-hide on from point, if to.y == from.y+2
            if (!Field.isVisible({x: data.to.x, y: data.to.y - 1}) && Field.isVisible(data.to))
                dom.fallMode = 'to-show';
            if (Field.isVisible({x: data.to.x, y: data.to.y - 1}) && !Field.isVisible(data.to))
                dom.fallMode = 'to-hide';

            if (dom.fallMode === 'to-show') {
                /** Спускаем его заранее  */
                dom.y = (data.to.y) * DataPoints.BLOCK_HEIGHT;
                dom.height = 25;
                dom.width = DataPoints.BLOCK_WIDTH;
                //dom.backgroundImage = DataPoints.objectImages[Field.getGemId({x: dom.from.x, y: dom.p.y + 1})];
                /** Перерисовка backgroundPositionY это хитрый хак и костыль :) */
                dom.backgroundPositionY = DataPoints.BLOCK_HEIGHT;
            }
            dom.redraw();
        });
    };

    this.iterate = function (position) {
        let go;
        go = false;
        doms.forEach(function (dom) {
            switch (dom.fallMode) {
                case 'to-hide':
                    dom.y = dom.startY + velocity * position;
                    dom.height = DataPoints.BLOCK_HEIGHT - velocity * position;
                    go |= (dom.y < dom.startY + DataPoints.BLOCK_HEIGHT);
                    break;
                case 'to-show':
                    dom.height = velocity * position;
                    dom.backgroundPositionY = DataPoints.BLOCK_HEIGHT - velocity * position;
                    go |= (dom.height < DataPoints.BLOCK_HEIGHT);
                    break;
                case 'just':
                    dom.y = dom.startY + velocity * position;
                    go |= (dom.y < dom.startY + DataPoints.BLOCK_HEIGHT);
                    break;
            }
            if (dom.bindedDoms) {
                dom.bindedDoms.x = dom.x;
                dom.bindedDoms.y = dom.y;
                dom.bindedDoms.redraw();
            }
            dom.redraw();
        });
        return go;
    };

    this.finish = function () {
        doms.forEach(function (dom) {
            dom.backgroundPositionY = 0;
            dom.height = DataPoints.BLOCK_HEIGHT;
            dom.redraw();
        });
    }
};

let animShuffle = function () {
    let dom;
    let velocity = 20;

    this.init = function (x, y) {
        dom = this.animDoms.pop();
        dom.x = x - Images.getWidth('anim-shuffle-1.png') / 2;
        dom.y = y - Images.getHeight('anim-shuffle-1.png') / 2;
        dom.width = Images.getWidth('anim-shuffle-1.png');
        dom.height = Images.getHeight('anim-shuffle-1.png');
        dom.backgroundImage = 'anim-shuffle-1.png';
        dom.opacity = 0.7;
        dom.rotate = 0;
        dom.show();
    };

    this.iterate = function (position) {
        dom.rotate = position * velocity;
        dom.redraw();
        return position < 36 / 2;
    };

    this.finish = function () {
        dom.hide();
        this.animDoms.push(dom);
    }
};

let animHint = function animHint() {
    let list, forEver;

    this.init = function (pList, forEverValue) {
        Animate.hintActive = true;
        this.skipAnimLock = true;
        forEver = forEverValue;

        list = [];
        pList.forEach(function (p) {
            list.push({
                startY: this.gemDoms[p.x][p.y].y,
                dom: this.gemDoms[p.x][p.y]
            });
        }, this);
    };

    this.iterate = function (position) {
        list.forEach(function (el) {
            el.dom.y = el.startY + Math.cos(Math.PI * position / 15) * 3;
            el.dom.redraw();
            if (el.dom.bindedDoms) {
                el.dom.bindedDoms.x = el.x;
                el.dom.bindedDoms.y = el.y;
                el.dom.bindedDoms.redraw();
            }
        });
        return forEver || !AnimLocker.busy();
    };

    this.finish = function () {
        Animate.hintActive = false;
    }
};

let animHintArrow = function animHint() {
    let imgs, offset;

    this.init = function (dom) {
        this.skipAnimLock = true;
        imgs = [dom];
    };

    this.iterate = function (counter) {
        offset = Math.cos(Math.PI / 15 * counter) * 4;
        imgs.forEach(function (img) {
            img.x = img.p.x + offset / 2;
            img.y = img.p.y + offset / 2;
            img.dom.width = 50 - offset;
            img.dom.height = 50 - offset;
            img.redraw();
        });
        return true;
    };

    this.finish = function () {
        Animate.hintActive = false;
    }
};

/**
 * @todo
 */
let animDestroyGem = function () {

    this.init = function () {

    };

    this.iterate = function (counter) {
        return counter < 10;
    };
};

let animDestroyLines = function () {

    this.init = function () {

    };

    this.iterate = function (counter) {
        return counter < 10;
    };
};
if(window["element-field"] !== undefined){window["element-field"].__path="../client/components/application/anims/element-field.js"};

/** ../client/components/application/capi/CAPILog.js */
let CAPILog = function () {

    this.log = function (ctnx, message, data) {
        console.log(message, data);
    };
};

/** @type {CAPILog} */
CAPILog = new CAPILog();if(window["CAPILog"] !== undefined){window["CAPILog"].__path="../client/components/application/capi/CAPILog.js"};

/** ../client/components/application/capi/CAPIMap.js */
let CAPIMap = function () {
    let self = this;
    let mapping;

    this.onMapInfoCallback = null;

    /**
     * ╱ ╲ ■ □ ᥩ α β
     * @param ctnx
     * @param mapId
     * @param map
     * @param points
     * @param userPoints
     * @param chests
     * @param userChests
     */
    this.gotMapsInfo = function (ctnx, mapId, map, points, userPoints, chests, userChests) {
        if (!mapping) mapping = {
            /** Layer mask */
            '□': DataObjects.CELL_VISIBLE,
            ' ': DataObjects.CELL_INVISIBLE,

            /** Layer gems */
            '?': DataObjects.OBJECT_RANDOM,
            'H': DataObjects.OBJECT_HOLE,

            'R': DataObjects.OBJECT_RED,
            'G': DataObjects.OBJECT_GREEN,
            'B': DataObjects.OBJECT_BLUE,
            'Y': DataObjects.OBJECT_YELLOW,
            'P': DataObjects.OBJECT_PURPLE,
            'S': DataObjects.OBJECT_SAND,

            '△': DataObjects.OBJECT_RED,
            '◆': DataObjects.OBJECT_GREEN,
            '▭': DataObjects.OBJECT_BLUE,
            '◇': DataObjects.OBJECT_YELLOW,
            '⨀': DataObjects.OBJECT_PURPLE,

            'ᨔ': DataObjects.OBJECT_POLY_COLOR,

            'ᥩ': DataObjects.OBJECT_BARREL,
            '$': DataObjects.OBJECT_GOLD,
            't': DataObjects.OBJECT_TILE,
            'Ξ': DataObjects.OBJECT_TILE,
            'α': DataObjects.OBJECT_SPIDER_ALPHA,
            '‖': DataObjects.OBJECT_BLOCK,


            'β': DataObjects.OBJECT_SPIDER_BETA,
            'γ': DataObjects.OBJECT_SPIDER_GAMMA,

            'b': DataObjects.OBJECT_BOX,
            '■': DataObjects.OBJECT_BOX,
            '╲': DataObjects.OBJECT_CHAIN_A,
            '╱': DataObjects.OBJECT_CHAIN_B,
            'X': [DataObjects.OBJECT_CHAIN_A, DataObjects.OBJECT_CHAIN_B],

            '⭤': DataObjects.WITH_LIGHTNING_HORIZONTAL,
            '⭥': DataObjects.WITH_LIGHTNING_VERTICAL,
            '+': DataObjects.WITH_LIGHTNING_CROSS,

            /** Layer special */
            '*': DataObjects.IS_EMITTER,
        };
        DataMap.setMapById(mapId, map);

        points.forEach(function (point) {
            if (!point.layers.gems) point.layers.gems = getRandomGems();

            if (point.layers.special === undefined) point.layers.special = [];
            if (point.layers.special[0] === undefined) point.layers.special[0] = [];
            if (typeof point.layers.special[0] === 'string') point.layers.special = [point.layers.special];
            point.layers.special.forEach(function (layer) {
                layer.unshift('');
            });
            point.layers.mask.unshift('');

            point.layers.gems.unshift('');

            point.layers.special.unshift(getEmitterSpecialLayer());

            point.layers.mask = convertLayers(point.layers.mask, false);
            point.layers.gems = convertLayers(point.layers.gems, false);
            point.layers.special = convertLayers(point.layers.special, true);

            DataPoints.setPointData(point);
        });
        chests.forEach(function (chest) {
            DataChests.setData(chest);
        });
        userPoints.forEach(function (info) {
            DataPoints.setPointUserScore(info.userId, info.pointId, info.score);
        });
        userChests.forEach(function (info) {
            DataChests.setOpened(info.chestId);
        });
        if (self.onMapInfoCallback) {
            self.onMapInfoCallback.call();
            self.onMapInfoCallback = null;
        }
    };

    /** Каллбэк после обновления данных о карте(точках и прочие) */
    this.setCallbackOnMapsInfo = function (callback) {
        self.onMapInfoCallback = callback;
    };

    this.gotUserScores = function (cntx, usersInfo) {
        usersInfo.forEach(function (info) {
            DataPoints.setPointUserScore(info.userId, info.pointId, info.score);
        });
        PageController.redraw();
    };

    let getEmitterSpecialLayer = function () {
        let row = '';
        for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
            row += '*';
        }
        return [row];
    };

    let getRandomGems = function () {
        let gems = [];
        for (let x = 0; x < DataPoints.FIELD_MAX_HEIGHT; x++) {
            gems[x] = '';
            for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
                gems[x] += '?';
            }
        }
        return gems;
    };

    /**
     * @returns {*[]}
     * ⬍⬌⭥⭤⯐↔↕       ʘ¤ïĦα α ȯ ɷ ɵ ʆ ʭ ʬ ʚ ░▒▓∏∩≡▀ ϔ∎
     *
     * https://pixelplus.ru/samostoyatelno/stati/vnutrennie-faktory/tablica-simvolov-unicode.html
     * https://unicode-table.com/ru/
     *
     * обозначения:
     * RGBPY - камни цветные
     * ⯐↔↕ - молния, вертикальная, горизонтальная, кросовая
     *
     * α - рыба
     * β - осминог
     * ᥩ - бочка
     * ɨ - лёд
     * $ - драгоценности
     * ■ - ящик
     * Z - цепи
     * Ż - цепи на ящик
     * ᨔ - многоцветный камень
     *
     *
     * китайский:
     * 冰 - лёд
     * 桶 - бочка
     *
     * 洞  - дырка
     * 红 - красный
     * 绿 - зеленый
     * 蓝 - голубой
     * 紫 - фиолетовый
     * 黄 - желтый
     *
     * @param layers
     * @param isSpecialLayer
     */
    let convertLayers = function (layers, isSpecialLayer) {

        let out;
        out = [];
        if (typeof layers[0] === 'string') layers = [layers];
        layers.forEach(function (layer) {
            layer.forEach(function (row, y) {
                row.split('').forEach(function (ceil, x) {
                    if (!mapping[ceil]) {
                        Logs.log("error", Logs.LEVEL_DETAIL, [layer]);
                        Logs.alert(Logs.LEVEL_ERROR, 'ERROR: Нет такого символа в мепинге.' + ceil);
                    }

                    if (!out[x]) out[x] = [];
                    if (isSpecialLayer) {
                        if (!out[x][y]) out[x][y] = [];
                        //@todo move to mapping prepare
                        out[x][y] = out[x][y].concat(mapping[ceil].length ? mapping[ceil] : [mapping[ceil]]);
                    } else {
                        out[x][y] = mapping[ceil];
                    }
                });
            });
        });

        return out;
    };
}
;

/** @type {CAPIMap} */
CAPIMap = new CAPIMap();
if(window["CAPIMap"] !== undefined){window["CAPIMap"].__path="../client/components/application/capi/CAPIMap.js"};

/** ../client/components/application/capi/CAPIStuff.js */
let CAPIStuff = function () {

    this.gotStuff = function (cntx, stuff) {
        LogicStuff.updateStuff(stuff);
    };

    this.incrementGold = function (cntx, quantity) {
        LogicStuff.giveAGold(quantity);
        PageController.redraw();
    };

    this.decrementGold = function (cntx, quantity) {
        LogicStuff.usedGold(quantity);
        PageController.redraw();
    };
};

CAPIStuff = new CAPIStuff();if(window["CAPIStuff"] !== undefined){window["CAPIStuff"].__path="../client/components/application/capi/CAPIStuff.js"};

/** ../client/components/application/capi/CAPITimeServer.js */
let CAPITimeServer = function () {

    /**
     * Got a serverTime time
     * @param cntx
     * @param time
     */
    this.gotServerTime = function (cntx, time) {
        LogicTimeClient.setServerTime(time);
    };
};


/**
 * Static class
 * @type {CAPITimeServer}
 */
CAPITimeServer = new CAPITimeServer();if(window["CAPITimeServer"] !== undefined){window["CAPITimeServer"].__path="../client/components/application/capi/CAPITimeServer.js"};

/** ../client/components/application/capi/CAPIUser.js */
let CAPIUser = function () {

    /**
     * Авторизация успешна.
     * @param cntx {Object} контекст соединения.
     * @param user {Object} какой id авторизованного юзера сообщаем.
     */
    this.authorizeSuccess = function (cntx, user) {
        /** @todo похоже на костыль, ну да ладно, время деньги */
        CAPIUser.updateUserInfo(cntx, user);
        LogicUser.authorizeSuccess(user.id);
    };

    /**
     * Обновить данные о пользователи.
     * @param cntx {Object} контекст соединения.
     * @param user {Object} юзер инфо.
     */
    this.updateUserInfo = function (cntx, user) {
        user.createTimestamp = LogicTimeClient.convertToClient(user.createTimestamp);
        user.lastLoginTimestamp = LogicTimeClient.convertToClient(user.lastLoginTimestamp);
        user.fullRecoveryTime = LogicTimeClient.convertToClient(user.fullRecoveryTime);
        LogicUser.updateUserInfo(user);
    };

    this.updateUserListInfo = function (cntx, userList) {
        PageController.pendingData(true);
        userList.forEach(function (user) {
            CAPIUser.updateUserInfo(cntx, user);
        });
        PageController.pendingData(false);
    };

    this.gotFriendsIds = function (cntx, ids) {
        //@todo got userIds for that map
        LogicUser.setFriendIds(ids);
    };

    /**
     * @param cntx {Object}
     * @param value {boolean}
     */
    this.setOneHealthHide = function (cntx, value) {
        PageBlockPanel.oneHealthHide = value;
    }
};

/**
 * Константный класс.
 * @type {CAPIUser}
 */
CAPIUser = new CAPIUser();if(window["CAPIUser"] !== undefined){window["CAPIUser"].__path="../client/components/application/capi/CAPIUser.js"};

/** ../client/components/application/data/DataChests.js */
let DataChests = function () {

    let chestCoords = [
        {
            number: 1,
            x: 175,
            y: 125
        },
        {
            number: 2,
            x: 475,
            y: 225
        }
    ];

    let chests = [];

    let opened = [];

    this.getCoords = function () {
        return chestCoords;
    };

    this.getById = function (id) {
        return chests[id];
    };

    this.setData = function (data) {
        chests[data.id] = data;
        PageController.redraw();
    };

    this.setOpened = function (chestId) {
        opened[chestId] = true;
    };

    this.isItOpened = function (chestId) {
        return opened[chestId] === true;
    };
};

DataChests = new DataChests;
if(window["DataChests"] !== undefined){window["DataChests"].__path="../client/components/application/data/DataChests.js"};

/** components/application/data/DataCross.js */
let DataCross = {};

DataCross.user = {
    maxHealth: 5,
    healthRecoveryTime: 45,
};

DataCross.app = {
    width: 777,
    height: 500
};

/** Для кросс-сайдных компонент */
if (CONST_IS_SERVER_SIDE) {
    global['DataCross'] = DataCross;
}if(window["DataCross"] !== undefined){window["DataCross"].__path="components/application/data/DataCross.js"};

/** ../client/components/application/data/DataMap.js */
let DataMap = function () {

    let currentMapId = 1;

    /**
     * DataMapjs
     * @type {[*]}
     */
    let maps = {};

    let mapsLoadings = [];

    let loadMap = function (mapId) {
        if (!mapId) mapId = currentMapId;
        if (!mapsLoadings[mapId]) {
            mapsLoadings[mapId] = true;
            SAPIMap.sendMeMapInfo(mapId);
        }
    };

    this.setMapById = function (mapId, mapData) {
        maps[mapId] = mapData;
        PageController.redraw();
    };

    this.getCurent = function () {
        if (!maps[currentMapId]) {
            loadMap();
        }
        return maps[currentMapId];
    };

    this.setCurrentMapId = function (id) {
        if (id >= DataMap.MAP_ID_MAX) {
            return;
        }
        if (id <= DataMap.MAP_ID_MIN) {
            return;
        }
        currentMapId = id;
    };

    this.setNextMap = function () {
        if (currentMapId === DataMap.MAP_ID_MAX) {
            return;
        }
        currentMapId++;
    };

    this.setPrevMap = function () {
        if (currentMapId === DataMap.MAP_ID_MIN) {
            return;
        }
        currentMapId--;
    };

    this.getMapIdFromPointId = function (pointId) {
        return Math.ceil(LogicUser.getCurrentUser().nextPointId / DataMap.POINTS_PER_MAP);
    };

    this.getFirstPointId = function () {
        return DataMap.POINTS_PER_MAP * (currentMapId - 1) + 1;
    };

    this.getLastPointId = function () {
        return this.getFirstPointId() + DataMap.POINTS_PER_MAP - 1;
    };

    this.getPointIdFromPointNumber = function (number) {
        return this.getFirstPointId() + (number - 1);
    };

    this.getNumberFromPointId = function (pointId) {
        return pointId - this.getFirstPointId() + 1;
    };

    this.getFirstChestId = function () {
        return DataMap.CHESTS_PER_MAP * (currentMapId - 1) + 1;
    };

    this.getLastChestId = function () {
        return this.getFirstChestId() + DataMap.CHESTS_PER_MAP - 1;
    };

    this.getChestIdFromChestNumber = function (number) {
        return this.getFirstChestId() + (number - 1);
    };

    this.countStarsByMapId = function (mapId) {
        let mapStars, user, pointUsersInfo, pointId, point, stars;
        if (!mapId) mapId = currentMapId;

        mapStars = 0;
        user = LogicUser.getCurrentUser();
        if (!user) return 0;
        pointUsersInfo = DataPoints.getPointUserScore(mapId, [user.id]);

        if (!pointUsersInfo) return 0;
        for (let number = 1; number <= DataMap.POINTS_PER_MAP; number++) {
            pointId = DataMap.getPointIdFromPointNumber(number);
            point = DataPoints.getById(pointId);
            if (!point) return 0;

            stars = 0;
            if (!pointUsersInfo[pointId]) continue;
            if (!pointUsersInfo[pointId][user.id]) continue;

            if (pointUsersInfo[pointId][user.id].score >= point.score1) stars = 1;
            if (pointUsersInfo[pointId][user.id].score >= point.score2) stars = 2;
            if (pointUsersInfo[pointId][user.id].score >= point.score3) stars = 3;
            mapStars += stars;
        }
        return mapStars;
    }
};

/** @Todo super mega crunch */
/*GUI = {};

GUI.ANIM_TYPE_ROTATE = 10;
GUI.ANIM_TYPE_MOVE = 20;
GUI.ANIM_TYPE_GOTO = 30;
GUI.ANIM_TYPE_MOVIE = 40;
GUI.ANIM_TYPE_PAUSE = 50;
GUI.ANIM_TYPE_STOP = 60;
*/
//@Todonow
/** @type {DataMap} */
DataMap = new DataMap();

/* server see */
DataMap.MAP_ID_MIN = 1;
DataMap.MAP_ID_MAX = 10;
DataMap.POINTS_PER_MAP = 18;
DataMap.CHESTS_PER_MAP = 2;if(window["DataMap"] !== undefined){window["DataMap"].__path="../client/components/application/data/DataMap.js"};

/** components/application/data/DataObjects.js */
let DataObjects = function () {
    /**
     * Не видна игроку.
     * @type {number}
     */
    this.CELL_INVISIBLE = 1;

    /**
     * ???
     * @type {number}
     */
    this.CELL_VISIBLE = 2;

    /**
     * Случайнный камень из набора камней.
     * @type {number}
     * @see LogicField{ let gems = [] };
     */
    this.OBJECT_RANDOM = 101;

    /**
     * Камень красный
     * @type {number}
     */
    this.OBJECT_RED = 102;
    /**
     * Камень зеленый
     * @type {number}
     */
    this.OBJECT_GREEN = 103;
    /**
     * Камень голубой
     * @type {number}
     */
    this.OBJECT_BLUE = 104;
    /**
     * Камень желтый
     * @type {number}
     */
    this.OBJECT_YELLOW = 105;
    /**
     * Камень фиолетовый
     * @type {number}
     */
    this.OBJECT_PURPLE = 106;
    /**
     * Камень белый
     * @type {number}
     */
    this.OBJECT_SAND = 107;
    /**
     * Нет камня
     * @type {number}
     */
    this.OBJECT_HOLE = 120;
    /**
     * Бочка
     * @type {number}
     */
    this.OBJECT_BARREL = 130;
    /**
     * Блок
     * @type {number}
     */
    this.OBJECT_BLOCK = 135;
    /**
     * Многоцветный камень
     * @type {number}
     */
    this.OBJECT_POLY_COLOR = 140;
    /**
     * Монстр-1
     * @type {number}
     */
    this.OBJECT_SPIDER_ALPHA = 150;
    /**
     * Монстр-2
     * @type {number}
     */
    this.OBJECT_SPIDER_BETA = 160;
    /**
     * Монстр-3
     * @type {number}
     */
    this.OBJECT_SPIDER_GAMMA = 161;
    /**
     * Плитка
     * @type {number}
     */
    this.OBJECT_TILE = 170;
    /**
     * Драгоцености
     * @type {number}
     */
    this.OBJECT_GOLD = 180;
    /**
     * Ящик
     * @type {number}
     */
    this.OBJECT_BOX = 190;
    /**
     * Цепь
     * @type {number}
     */
    this.OBJECT_CHAIN_A = 200;
    /**
     * Цепь
     * @type {number}
     */
    this.OBJECT_CHAIN_B = 210;
    /**
     * Эмитер камней
     * @type {number}
     */
    this.IS_EMITTER = 1001;

    /**
     * Молния хоризонтальная
     * @type {number}
     */
    this.WITH_LIGHTNING_HORIZONTAL = 1010;
    /**
     * Молния вертикальная
     * @type {number}
     */
    this.WITH_LIGHTNING_VERTICAL = 1011;
    /**
     * Молния кросс(двунаправленная)
     * @type {number}
     */
    this.WITH_LIGHTNING_CROSS = 1012;

};

/** @type {DataObjects} */
DataObjects = new DataObjects();


/** Для кросс-сайдных компонент */
if (CONST_IS_SERVER_SIDE) {
    global['DataObjects'] = DataObjects;
}if(window["DataObjects"] !== undefined){window["DataObjects"].__path="components/application/data/DataObjects.js"};

/** ../client/components/application/data/DataPoints.js */
let DataPoints = function () {

    this.FIELD_MAX_WIDTH = 10;
    this.FIELD_MAX_HEIGHT = 11;

    this.BLOCK_WIDTH = 50;
    this.BLOCK_HEIGHT = 50;

    this.objectImages = {};
    /** Cell images */
    this.objectImages[DataObjects.CELL_INVISIBLE] = 'field-none-2.png';
    this.objectImages[DataObjects.CELL_VISIBLE] = 'field-cell.png';

    /** Gem images */
    this.objectImages[DataObjects.OBJECT_HOLE] = 'field-none-2.png';
    this.objectImages[DataObjects.OBJECT_RANDOM] = 'field-none.png';

    this.objectImages[DataObjects.OBJECT_RED] = 'field-red.png';
    this.objectImages[DataObjects.OBJECT_GREEN] = 'field-green.png';
    this.objectImages[DataObjects.OBJECT_BLUE] = 'field-blue.png';
    this.objectImages[DataObjects.OBJECT_YELLOW] = 'field-yellow.png';
    this.objectImages[DataObjects.OBJECT_PURPLE] = 'field-purple.png';
    this.objectImages[DataObjects.OBJECT_SAND] = 'field-sand.png';

    this.objectImages[DataObjects.OBJECT_BARREL] = 'field-barrel.png';
    this.objectImages[DataObjects.OBJECT_BLOCK] = 'field-block.png';
    this.objectImages[DataObjects.OBJECT_POLY_COLOR] = 'field-poly-color.png';
    this.objectImages[DataObjects.OBJECT_GOLD] = 'field-gold.png';
    this.objectImages[DataObjects.OBJECT_TILE] = 'field-tile.png';

    this.objectImages[DataObjects.OBJECT_SPIDER_ALPHA] = 'field-alpha.png';
    this.objectImages[DataObjects.OBJECT_SPIDER_BETA] = 'field-beta.png';
    this.objectImages[DataObjects.OBJECT_SPIDER_GAMMA] = 'field-gamma.png';

    this.objectImages[DataObjects.OBJECT_BOX] = 'field-box.png';
    this.objectImages[DataObjects.OBJECT_CHAIN_A] = 'field-chain-a.png';
    this.objectImages[DataObjects.OBJECT_CHAIN_B] = 'field-chain-b.png';

    /** Gem-lightning images */
    this.objectImages[DataObjects.WITH_LIGHTNING_VERTICAL] = 'spec-light-ver-1.png';
    this.objectImages[DataObjects.WITH_LIGHTNING_HORIZONTAL] = 'spec-light-hor-1.png';
    this.objectImages[DataObjects.WITH_LIGHTNING_CROSS] = 'spec-light-cross-1.png';

    /** Spider healths */
    this.healthImages = {};
    this.healthImages[0] = 'creature-health-0.png';
    this.healthImages[1] = 'creature-health-1.png';
    this.healthImages[2] = 'creature-health-2.png';
    this.healthImages[3] = 'creature-health-3.png';

    this.objectAnims = {};

    let pointsCoords = [
        {
            number: 1,
            x: 61,
            y: 209
        },
        {
            number: 2,
            x: 61,
            y: 290,
        },
        {
            number: 3,
            x: 105,
            y: 371
        },
        {
            number: 4,
            x: 197,
            y: 390,
        },
        {
            number: 5,
            x: 283,
            y: 360
        },
        {
            number: 6,
            x: 279,
            y: 274,
        },
        {
            number: 7,
            x: 214,
            y: 205,
        },
        {
            number: 8,
            x: 205,
            y: 111,
        },
        {
            number: 9,
            x: 276,
            y: 55
        },
        {
            number: 10,
            x: 371,
            y: 51,
        },
        {
            number: 11,
            x: 452,
            y: 93
        },
        {
            number: 12,
            x: 448,
            y: 185,
        },
        {
            number: 13,
            x: 404,
            y: 269
        },
        {
            number: 14,
            x: 425,
            y: 356,
        },
        {
            number: 15,
            x: 516,
            y: 386,
        },
        {
            number: 16,
            x: 608,
            y: 367,
        },
        {
            number: 17,
            x: 614,
            y: 280,
        },
        {
            number: 18,
            x: 661,
            y: 211,
        }
    ];

    let pointUserScore = {};

    let pointsData = [];

    this.getPointsCoords = function () {
        return pointsCoords;
    };

    this.getById = function (id) {
        return pointsData[id];
    };

    this.setPointData = function (data) {
        pointsData[data.id] = data;
        PageController.redraw();
    };

    /**
     * В эту игру играют в текущий момент.
     * @type {null}
     */
    let playedId = null;

    this.setPlayedId = function (id) {
        playedId = id;
    };

    this.getPlayedId = function () {
        return playedId;
    };

    this.getPointUserScore = function (mapId, userIds) {
        let pIdFirst, pIdLast, out;
        pIdFirst = DataMap.getFirstPointId(mapId);
        pIdLast = DataMap.getLastPointId(mapId);
        out = {};
        for (let pId = pIdFirst; pId <= pIdLast; pId++) {
            for (let uid in pointUserScore[pId]) {
                if (userIds.indexOf(parseInt(uid)) === -1) continue;
                if (!out[pId]) out[pId] = {};
                out[pId][uid] = pointUserScore[pId][uid];
            }
        }
        return out;
    };

    this.setPointUserScore = function (userId, pointId, score) {
        if (!pointUserScore[pointId]) {
            pointUserScore[pointId] = {};
        }
        pointUserScore[pointId][userId] = {
            userId: userId,
            pointId: pointId,
            score: score
        }
    };

    this.getScore = function (pointId, userId) {
        if (!userId) userId = LogicUser.getCurrentUser().id;
        if (!userId) return null;
        if (!pointUserScore[pointId]) {
            pointUserScore[pointId] = {};
        }
        if (!pointUserScore[pointId][userId]) {
            pointUserScore[pointId][userId] = {
                userId: userId,
                pointId: pointId,
                score: 0
            }
        }
        return pointUserScore[pointId][userId].score;
    };

    this.countStars = function (pointId, userId, userScore) {
        let point;
        if (!pointId) pointId = DataPoints.getPlayedId();
        if (!userId) userId = LogicUser.getCurrentUser().id;
        if (!userId || !pointId) return null;
        if (isNaN(userScore)) userScore = DataPoints.getScore(pointId);
        point = DataPoints.getById(pointId);
        if (!point || userScore === null) return null;

        if (userScore >= point.score3) return 3;
        if (userScore >= point.score2) return 2;
        if (userScore >= point.score1) return 1;
        return 0;
    };

    this.copyGoals = function (goals) {
        let goalsNew;
        goalsNew = [];
        for (let i in goals) {
            goalsNew.push({
                id: goals[i].id,
                count: goals[i].count
            });
        }
        return goalsNew;
    };

    this.init = function () {

        this.objectAnims[DataObjects.WITH_LIGHTNING_HORIZONTAL] = [[{
            type: GUI.ANIM_TYPE_MOVIE,
            images: [
                'spec-light-hor-1.png',
                'spec-light-hor-2.png',
                'spec-light-hor-3.png',
                'spec-light-hor-4.png',
                'spec-light-hor-5.png',
            ],
            duration: 5,
        }, {
            type: GUI.ANIM_TYPE_GOTO,
            pos: 0
        }]];
        this.objectAnims[DataObjects.WITH_LIGHTNING_VERTICAL] = [[{
            type: GUI.ANIM_TYPE_MOVIE,
            images: [
                'spec-light-ver-1.png',
                'spec-light-ver-2.png',
                'spec-light-ver-3.png',
                'spec-light-ver-4.png',
                'spec-light-ver-5.png',
            ],
            duration: 5,
        }, {
            type: GUI.ANIM_TYPE_GOTO,
            pos: 0
        }]];
        this.objectAnims[DataObjects.WITH_LIGHTNING_CROSS] = [[{
            type: GUI.ANIM_TYPE_MOVIE,
            images: [
                'spec-light-cross-1.png',
                'spec-light-cross-2.png',
                'spec-light-cross-3.png',
                'spec-light-cross-4.png',
                'spec-light-cross-5.png',
            ],
            duration: 5,
        }, {
            type: GUI.ANIM_TYPE_GOTO,
            pos: 0
        }]];
    }
    ;
};

DataPoints = new DataPoints;
if(window["DataPoints"] !== undefined){window["DataPoints"].__path="../client/components/application/data/DataPoints.js"};

/** ../client/components/application/data/DataPrizes.js */
let DataPrizes = function () {
    let self = this;

    this.giveOutPrizes = function (prizes) {
        prizes.forEach(function (prize) {
            self.giveOutPrize(prize);
        })
    };

    this.giveOutPrize = function (prize) {
        switch (prize.id) {
            case DataPrizes.PRIZE_STUFF_HUMMER:
                LogicStuff.giveAHummer(prize.count);
                break;
            case DataPrizes.PRIZE_STUFF_SHUFFLE:
                LogicStuff.giveAShuffle(prize.count);
                break;
            case DataPrizes.PRIZE_STUFF_LIGHTNING:
                LogicStuff.giveALighnting(prize.count);
                break;
            case DataPrizes.PRIZE_STUFF_GOLD:
                LogicStuff.giveAGold(prize.count);
                break;
        }
    };

    this.getImageFor = function (prize) {
        let src;
        switch (prize.id) {
            case DataPrizes.PRIZE_STUFF_GOLD:
                src = 'map-way-point-red.png';
                break;
            case DataPrizes.PRIZE_STUFF_HUMMER:
                src = 'button-hummer-rest.png';
                break;
            case DataPrizes.PRIZE_STUFF_SHUFFLE:
                src = 'button-shuffle-rest.png';
                break;
            case DataPrizes.PRIZE_STUFF_LIGHTNING:
                src = 'button-lightning-rest.png';
                break;
        }
        return src;
    };
};

DataPrizes = new DataPrizes;

DataPrizes.PRIZE_STUFF_HUMMER = 1;
DataPrizes.PRIZE_STUFF_SHUFFLE = 2;
DataPrizes.PRIZE_STUFF_LIGHTNING = 3;

DataPrizes.PRIZE_STUFF_GOLD = 100;
if(window["DataPrizes"] !== undefined){window["DataPrizes"].__path="../client/components/application/data/DataPrizes.js"};

/** components/application/data/DataShop.js */
let DataShop = function () {

    this.getGoldProductByPrice = function (price) {
        let product;
        product = false;
        DataShop.gold.forEach(function (element) {
            if (element.votes === price) product = element;
        });
        return product;
    };
};

DataShop = new DataShop();

/* @see LogicPayments.doOrderChange */
DataShop.gold = [
    {
        votes: 1,
        quantity: 10
    },
    {
        votes: 5,
        quantity: 70
    },
    {
        votes: 10,
        quantity: 1000
    }
];

DataShop.hummers = [
    {
        gold: 10,
        quantity: 3,
        imageSrc: 'shop-hummer-1.png',
    },
    {
        gold: 15,
        quantity: 6,
        imageSrc: 'shop-hummer-2.png',
    },
    {
        gold: 30,
        quantity: 9,
        imageSrc: 'shop-hummer-3.png',
    }
];

DataShop.shuffle = [
    {
        gold: 10,
        quantity: 3,
        imageSrc: 'shop-shuffle-1.png',
    },
    {
        gold: 15,
        quantity: 6,
        imageSrc: 'shop-shuffle-2.png',
    },
    {
        gold: 30,
        quantity: 9,
        imageSrc: 'shop-shuffle-3.png',
    }
];


DataShop.lightning = [
    {
        gold: 10,
        quantity: 3,
        imageSrc: 'shop-lightning-1.png',
    },
    {
        gold: 15,
        quantity: 6,
        imageSrc: 'shop-lightning-2.png',
    },
    {
        gold: 30,
        quantity: 9,
        imageSrc: 'shop-lightning-3.png',
    }
];

DataShop.healthPrice = 100;

/** Для кросс-сайдных компонент */
if (CONST_IS_SERVER_SIDE) {
    global['DataShop'] = DataShop;
}if(window["DataShop"] !== undefined){window["DataShop"].__path="components/application/data/DataShop.js"};

/** ../client/components/application/gui_elements/Dialog.js */
/**
 * Элемент картинки.
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

    this.title = undefined;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        let dom;
        dom = GUI.createDom(undefined, {
            width: self.width,
            height: self.height,
            backgroundImage: self.src,
        });
        dom.x = (document.getElementById('appArea').clientWidth / 2) - self.width / 2;
        dom.y = self.startPosition;

        self.dom = dom;
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        self.dom.show();
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
            self.dom.title = self.title;
            self.dom.pointer = self.pointer;
            self.dom.redraw();
        }

        self.elements = function (el) {
            el.redraw();
        };
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
};if(window["Dialog"] !== undefined){window["Dialog"].__path="../client/components/application/gui_elements/Dialog.js"};

/** ../client/components/application/gui_elements/DialogChestNeedStars.js */
let DialogChestNeedStars = function () {
    let self = this;
    this.__proto__ = new Dialog();

    let elText;

    this.init = function () {
        this.__proto__.init.call(this);
        GUI.pushParent(self.dom);
        /** Кнопка закрыть */
        GUI.createElement(ElementButton, {
            x: 452, y: 3,
            width: 100, height: 40,
            srcRest: 'button-close-rest.png',
            srcHover: 'button-close-hover.png',
            srcActive: 'button-close-active.png',
            onClick: function () {
                self.closeDialog();
            }
        }).show();

        elText = GUI.createElement(ElementText, {
            x: 50, y: 70, width: 260, height: 80, text: ''
        });
        elText.show();

        GUI.popParent();
    };

    this.show = function () {
        this.__proto__.show.call(this);
    };

    this.hide = function () {
        this.__proto__.hide.call(this);
    };

    this.redraw = function () {
        this.__proto__.redraw.call(this);

        if (!this.dialogShowed) return;

        elText.setText('Нужно собрать еще :' + (this.goalStars - this.mapStars) + ' звезд(ы)');
        elText.redraw();
    };

    this.showDialog = function () {
        this.__proto__.showDialog.call(this);
        self.redraw();
    }
};




if(window["DialogChestNeedStars"] !== undefined){window["DialogChestNeedStars"].__path="../client/components/application/gui_elements/DialogChestNeedStars.js"};

/** ../client/components/application/gui_elements/DialogChestYouWin.js */
let DialogChestYouWin = function () {
    let self = this;
    this.__proto__ = new Dialog();

    let elText;

    let imagesEls = {};
    let countersEls = {};

    this.init = function () {
        this.__proto__.init.call(this);
        GUI.pushParent(self.dom);
        /** Кнопка закрыть */
        GUI.createElement(ElementButton, {
            x: 452, y: 3,
            width: 100, height: 40,
            srcRest: 'button-close-rest.png',
            srcHover: 'button-close-hover.png',
            srcActive: 'button-close-active.png',
            onClick: function () {
                self.closeDialog();
            }
        }).show();

        elText = GUI.createElement(ElementText, {
            x: 40, y: 20, width: 240, height: 80, text: ''
        });
        elText.show();

        for (let i = 0; i < 4; i++) {
            imagesEls[i] = GUI.createElement(ElementImage, {
                x: 40 + (i * 50), y: 90, src: ''
            });

            countersEls[i] = GUI.createElement(ElementText, {
                x: 60 + (i * 50), y: 80 + 60, width: 50
            });
        }
        GUI.popParent();
    };

    this.show = function () {
        this.__proto__.show.call(this);
    };

    this.hide = function () {
        this.__proto__.hide.call(this);
    };

    this.redraw = function () {
        this.__proto__.redraw.call(this);

        if (!this.dialogShowed) return;

        let chest, prize;
        chest = DataChests.getById(self.chestId);

        elText.setText('Собраны все звезды! Ты открыл сундук и нашел там:');
        for (let i = 0; i < 4; i++) {
            prize = chest.prizes[i];
            if (prize) {
                imagesEls[i].src = DataPrizes.getImageFor(prize);
                countersEls[i].setText(prize.count);

                imagesEls[i].show();
                countersEls[i].show();
                countersEls[i].redraw();
                imagesEls[i].redraw();
            } else {
                imagesEls[i].hide();
                countersEls[i].hide();
            }
        }

        elText.redraw();
    };

    this.showDialog = function () {
        this.__proto__.showDialog.call(this);
        self.redraw();
    }
};




if(window["DialogChestYouWin"] !== undefined){window["DialogChestYouWin"].__path="../client/components/application/gui_elements/DialogChestYouWin.js"};

/** ../client/components/application/gui_elements/DialogGoals.js */
let DialogGoals = function DialogGoals() {
    let self = this;
    this.__proto__ = new Dialog();

    let goalsImagesEls = {};
    let goalsCounterEls = {};

    this.init = function () {
        this.__proto__.width = 250;
        this.__proto__.height = 150;
        this.__proto__.src = 'window-3.png';
        this.__proto__.bottomPosition = 100 + 172 / 2;

        this.__proto__.init.call(this);
        this.__proto__.onShowComplete = this.onShowComplete;

        GUI.pushParent(self.dom);
        /** Заголовок */
        //GUI.createElement(ElementText, {x: 150, y: 13, width: 200, height: 40, text: 'ЦЕЛИ'}).show();

        /** Список целей */
        for (let i in DataPoints.objectImages) {
            /** Список целей - картинки */
            goalsImagesEls[i] = GUI.createElement(ElementImage, {
                x: 200 + i * (DataPoints.BLOCK_WIDTH + 5),
                y: 30,
                src: DataPoints.objectImages[i]
            });
            /** Список целей - кол-во */
            goalsCounterEls[i] = GUI.createElement(ElementText, {
                x: 100 + i * (DataPoints.BLOCK_WIDTH + 5),
                y: 30 + DataPoints.BLOCK_HEIGHT + 5,
                width: DataPoints.BLOCK_WIDTH
            });
        }

        /** Кнопка закрыть */
        GUI.createElement(ElementButton, {
                x: 195, y: 0,
                srcRest: 'button-close-rest.png',
                srcHover: 'button-close-hover.png',
                srcActive: 'button-close-active.png',
                onClick: function () {
                    self.closeDialog();
                }
            }, this.dom
        ).show();


        GUI.popParent();
    };

    this.onShowComplete = function () {
        setTimeout(function () {
            self.closeDialog();
        }, Config.OnIdle.second * 1.2);
    };

    this.setGoals = function (goals) {
        let offsetX, startX;
        for (let i in this.elements) {
            this.elements[i].hide();
        }
        this.elements = [];
        startX = Images.getWidth(this.src) / 2
            - goals.length * (DataPoints.BLOCK_WIDTH + 5) / 2
        ;

        offsetX = 0;
        for (let i in goals) {

            goalsImagesEls[goals[i].id].x = startX + offsetX;
            goalsCounterEls[goals[i].id].x = startX + offsetX;
            goalsCounterEls[goals[i].id].setText(goals[i].count);
            this.elements.push(goalsImagesEls[goals[i].id]);
            this.elements.push(goalsCounterEls[goals[i].id]);
            offsetX += DataPoints.BLOCK_WIDTH + 5;
        }
        for (let i in this.elements) {
            this.elements[i].show();
            this.elements[i].redraw();
        }
    };
};if(window["DialogGoals"] !== undefined){window["DialogGoals"].__path="../client/components/application/gui_elements/DialogGoals.js"};

/** ../client/components/application/gui_elements/DialogGoalsReached.js */
let DialogGoalsReached = function () {
    let self = this;
    this.__proto__ = new Dialog();

    /**
     * Номер точки
     * @type {null}
     */
    let elTitle = null;

    let elStarOne = null;
    let elStarTwo = null;
    let elStarThree = null;

    let friendsPanel = [];
    let elUserPhotoScore = null;

    let elButtonPlay = null;

    /**
     * Точка с которой нажали.
     * @type {null}
     */
    let pointId = null;
    let friends;

    this.init = function () {
        this.__proto__.init.call(this);
        GUI.pushParent(self.dom);

        /** Номер точки\заголовок */
        elTitle = GUI.createElement(ElementText, {x: 135, y: 12, width: 230, height: 40, text: ''});
        elTitle.show();

        /** Кол-во звёзд */
        elStarOne = GUI.createElement(ElementImage, {x: 100, y: 40, src: 'star-off-big.png'});
        elStarOne.show();
        elStarTwo = GUI.createElement(ElementImage, {x: 200, y: 40, src: 'star-off-big.png'});
        elStarTwo.show();
        elStarThree = GUI.createElement(ElementImage, {x: 300, y: 40, src: 'star-off-big.png'});
        elStarThree.show();

        for (let i = 0; i < 3; i++) {
            friendsPanel[i] = {
                elPhotoScore: GUI.createElement(ElementUserScorePhoto, {x: 75 + 75 * i + 15, y: 155}),
            }
        }

        elUserPhotoScore = GUI.createElement(ElementUserScorePhoto, {x: 75 + 75 * 3 + 55, y: 155});
        elUserPhotoScore.show();

        /** Кнопка играть */
        elButtonPlay = GUI.createElement(ElementButton, {
            x: 178, y: 240,
            srcRest: 'button-red-rest.png',
            srcHover: 'button-red-hover.png',
            srcActive: 'button-red-active.png',
            onClick: function () {
                self.closeDialog();
                //PageBlockPanel.oneHealthHide = false;
                PageController.showPage(PageMain);
            },
            title: 'НА КАРТУ'
        });
        elButtonPlay.show();

        // Кнопка закрыть
        GUI.createElement(ElementButton, {
            x: 452, y: 3,
            srcRest: 'button-close-rest.png',
            srcHover: 'button-close-hover.png',
            srcActive: 'button-close-active.png',
            onClick: function () {
                self.closeDialog();
                PageController.showPage(PageMain);
            }
        }).show();

        GUI.popParent();
    };


    this.redraw = function () {
        let user, point, friend, score;
        this.__proto__.redraw.call(this);

        if (!this.dialogShowed) return;

        user = LogicUser.getCurrentUser();
        point = DataPoints.getById(pointId);
        elTitle.text = 'ПРОЙДЕН ' + pointId;

        for (let i = 0; i < 3; i++) {
            if ((friend = friends[i]) && friend.id) {
                score = DataPoints.getScore(point.id, friend.id);
                friendsPanel[i].elPhotoScore.user = friend;
                friendsPanel[i].elPhotoScore.score = score;
                if (score) {
                    friendsPanel[i].elPhotoScore.show();
                    friendsPanel[i].elPhotoScore.redraw();
                } else {
                    friendsPanel[i].elPhotoScore.hide();
                }
            } else {
                friendsPanel[i].elPhotoScore.hide();
            }
        }
        elUserPhotoScore.user = LogicUser.getCurrentUser();
        elUserPhotoScore.score = DataPoints.getScore(point.id);

        elTitle.redraw();
        elStarOne.src = 'star-off-big.png';
        elStarTwo.src = 'star-off-big.png';
        elStarThree.src = 'star-off-big.png';

        switch (DataPoints.countStars(point.id)) {
            case 3:
                elStarThree.src = 'star-on-big.png';
            case 2:
                elStarTwo.src = 'star-on-big.png';
            case 1:
                elStarOne.src = 'star-on-big.png';
        }
        elStarOne.redraw();
        elStarTwo.redraw();
        elStarThree.redraw();
        elUserPhotoScore.redraw();

        if (LogicHealth.getHealths(user) === 0) {
            elButtonPlay.hide();
        } else {
            elButtonPlay.show();
        }
    };

    this.showDialog = function (pId) {
        let mapId;
        pointId = pId;
        /** @todo mapId from pointId */
        mapId = DataMap.getCurent().id;
        friends = LogicUser.getFriendIdsByMapIdAndPointIdWithScore(mapId, pId);
        this.__proto__.showDialog.call(this);
        self.redraw();
    }
};if(window["DialogGoalsReached"] !== undefined){window["DialogGoalsReached"].__path="../client/components/application/gui_elements/DialogGoalsReached.js"};

/** ../client/components/application/gui_elements/DialogHealthShop.js */
let  DialogHealthShop = function () {
    let self = this;
    this.__proto__ = new Dialog();

    let elHealth5 = null;

    this.init = function () {
        let el, offsetX, stepX, offsetY;
        this.__proto__.init.call(this);

        offsetX = 30;
        offsetY = 80;
        stepX = 145;

        GUI.pushParent(self.dom);

        /** Заголовок диалога */
        el = GUI.createElement(ElementText, {
            x: 135, y: 11, width: 230, height: 40,
            text: 'МАГАЗИН'
        });
        self.elements.push(el);

        elHealth5 = GUI.createElement(ElementButton, {
            x: offsetX + stepX, y: offsetY,
            srcRest: 'shop-health-1.png',
            srcHover: 'shop-health-1.png',
            srcActive: 'shop-health-1.png',
            onClick: function () {
                self.buyHealth5();
            }
        });
        self.elements.push(elHealth5);

        el = GUI.createElement(ElementButton, {
            x: offsetX + stepX * 2, y: offsetY,
            srcRest: 'shop-health-2.png',
            srcHover: 'shop-health-2.png',
            srcActive: 'shop-health-2.png',
            onClick: function () {
                SAPIUser.zeroLife();
            }
        });
        self.elements.push(el);

        /** Кнопка закрыть */
        GUI.createElement(ElementButton, {
            x: 452, y: 3,
            srcRest: 'button-close-rest.png',
            srcHover: 'button-close-hover.png',
            srcActive: 'button-close-active.png',
            onClick: function () {
                self.closeDialog();
            }
        }).show();

        GUI.popParent();
    };

    this.redraw = function () {
        let user;
        user = LogicUser.getCurrentUser();
        elHealth5.enabled = LogicHealth.getHealths(user) === 0;
        this.__proto__.redraw.call(this);
    };

    this.buyHealth5 = function () {
        let gold, user;
        gold = LogicStuff.getStuff('goldQty');
        user = LogicUser.getCurrentUser();

        if (LogicHealth.getHealths(user) > 0) return;

        if (gold < DataShop.healthPrice) {
            PBZDialogs.dialogMoneyShop.showDialog(this);
            self.closeDialog();
        } else {
            SAPIStuff.buyHealth();
            LogicStuff.giveAHealth(LogicHealth.getMaxHealth());
            LogicStuff.usedGold(DataShop.healthPrice);
            self.closeDialog();
        }
        PageController.redraw();
    };
};if(window["DialogHealthShop"] !== undefined){window["DialogHealthShop"].__path="../client/components/application/gui_elements/DialogHealthShop.js"};

/** ../client/components/application/gui_elements/DialogJustQuit.js */
let DialogJustQuit = function () {
    let self = this;
    this.__proto__ = new Dialog();

    this.init = function () {
        this.__proto__.init.call(this);
        let element;

        /** Заголовок */
        element = GUI.createElement(ElementText, {
            x: 150, y: 12, width: 200,
            bold: true,
            alignCenter: true,
        }, this.dom);
        element.setText("ВЫЙТИ?");
        self.elements.push(element);

        /** Надпись в центре */
        element = GUI.createElement(ElementText, {
            x: 127, y: 114, width: 250,
            bold: true, alignCenter: true,
        }, this.dom);
        element.setText("Потеряешь одну жизнь.");
        self.elements.push(element);

        /** Кнопка выйти */
        element = GUI.createElement(ElementButton, {
                x: 75, y: 220,
                srcRest: 'button-red-rest.png',
                srcHover: 'button-red-hover.png',
                srcActive: 'button-red-active.png',
                onClick: function () {
                    self.closeDialog();
                    PageBlockPanel.oneHealthHide = false;
                    PageController.showPage(PageMain);
                    PageBlockField.setStuffMode(null);
                },
                title: 'СДАТЬСЯ'
            }, this.dom,
        );
        self.elements.push(element);

        /** Кнопка вернуться в игру */
        element = GUI.createElement(ElementButton, {
                x: 275, y: 220,
                srcRest: 'button-green-rest.png',
                srcHover: 'button-green-hover.png',
                srcActive: 'button-green-active.png',
                onClick: function () {
                    self.closeDialog();
                },
                title: 'ИГРАТЬ'
            }, this.dom
        );
        self.elements.push(element);

        /** Кнопка закрыть */
        element = GUI.createElement(ElementButton, {
                x: 452, y: 3,
                srcRest: 'button-close-rest.png',
                srcHover: 'button-close-hover.png',
                srcActive: 'button-close-active.png',
                onClick: function () {
                    self.closeDialog();
                }
            }, this.dom
        );
        self.elements.push(element);
    };
};if(window["DialogJustQuit"] !== undefined){window["DialogJustQuit"].__path="../client/components/application/gui_elements/DialogJustQuit.js"};

/** ../client/components/application/gui_elements/DialogMoneyShop.js */
let DialogMoneyShop = function () {
    let self = this;
    this.__proto__ = new Dialog();

    this.init = function () {
        let el, offsetX, stepX, offsetY;
        this.__proto__.init.call(this);

        offsetX = 25;
        offsetY = 60;
        stepX = 150;

        GUI.pushParent(self.dom);
        /** заголовок диалога */
        el = GUI.createElement(ElementText, {
            x: 135, y: 11, width: 230, height: 40,
            text: 'ГОЛОСА'
        });
        self.elements.push(el);

        for (let i = 0; i < 3; i++) {
            el = GUI.createElement(ElementButton, {
                x: offsetX + stepX * i, y: offsetY,
                srcRest: 'money_' + (i + 1) + '.png',
                srcHover: 'money_' + (i + 1) + '.png',
                srcActive: 'money_' + (i + 1) + '.png',
                onClick: function () {
                    if (GUI.isFullScreen()) {
                        GUI.fsSwitch();
                    }
                    SocNet.openOrderDialog(DataShop.gold[i].votes);
                    self.closeDialog();
                }
            });
            self.elements.push(el);

            el = GUI.createElement(ElementButton, {
                x: offsetX + stepX * i + 45, y: offsetY + 150 - 45,
                srcRest: 'button-add-rest.png',
                srcHover: 'button-add-hover.png',
                srcActive: 'button-add-active.png',
                onClick: function () {
                    SocNet.openOrderDialog(DataShop.gold[i].votes);
                    self.closeDialog();
                }
            });
        }

        /** кнопка закрыть */
        GUI.createElement(ElementButton, {
            x: 452, y: 3,
            srcRest: 'button-close-rest.png',
            srcHover: 'button-close-hover.png',
            srcActive: 'button-close-active.png',
            onClick: function () {
                self.closeDialog();
            }
        }).show();

        GUI.popParent();
    };
};




if(window["DialogMoneyShop"] !== undefined){window["DialogMoneyShop"].__path="../client/components/application/gui_elements/DialogMoneyShop.js"};

/** ../client/components/application/gui_elements/DialogPointInfo.js */
let DialogPointInfo = function () {
    let self = this;
    this.__proto__ = new Dialog();

    /**
     * Номер точки
     * @type {null}
     */
    let elTitle = null;

    let elStarOne = null;
    let elStarTwo = null;
    let elStarThree = null;

    let friendsPanel = [];
    let elUserPhotoScore = null;

    let elButtonPlay = null;

    /**
     * Точка с которой нажали.
     * @type {null}
     */
    let pointId = null;
    let friends;

    this.init = function () {
        this.__proto__.init.call(this);
        GUI.pushParent(self.dom);

        /** Номер точки\заголовок */
        elTitle = GUI.createElement(ElementText, {x: 135, y: 12, width: 230, height: 40, text: ''});
        elTitle.show();

        /** Кол-во звёзд */
        elStarOne = GUI.createElement(ElementImage, {
            x: 100, y: 40, src: 'star-off-big.png'
        });
        elStarOne.show();
        elStarTwo = GUI.createElement(ElementImage, {
            x: 200, y: 40, src: 'star-off-big.png'
        });
        elStarTwo.show();
        elStarThree = GUI.createElement(ElementImage, {x: 300, y: 40, src: 'star-off-big.png'});
        elStarThree.show();

        [0, 1, 2].forEach(function (i) {
            friendsPanel[i] = {
                elPhotoScore: GUI.createElement(ElementUserScorePhoto, {x: 75 + 75 * i + 15, y: 155})
            }
        });

        elUserPhotoScore = GUI.createElement(ElementUserScorePhoto, {x: 75 + 75 * 3 + 55, y: 155});
        elUserPhotoScore.show();

        /** Кнопка играть */
        elButtonPlay = GUI.createElement(ElementButton, {
            x: 178, y: 240,
            srcRest: 'button-red-rest.png',
            srcHover: 'button-red-hover.png',
            srcActive: 'button-red-active.png',
            onClick: function () {
                self.closeDialog();
                /** Предложить купить жизни */
                if (LogicHealth.getHealths(LogicUser.getCurrentUser()) === 0) {
                    PBZDialogs.dialogHealthShop.showDialog();
                    self.showDialog(pointId);
                } else {
                    /** Начать игру */
                    SAPIUser.onPlayStart();
                    PageBlockPanel.oneHealthHide = true;
                    DataPoints.setPlayedId(pointId);
                    PageController.showPage(PageField);
                }
            },
            title: 'ИГРАТЬ'
        });
        elButtonPlay.show();

        /** Кнопка закрыть */
        GUI.createElement(ElementButton, {
            x: 452, y: 3,
            srcRest: 'button-close-rest.png',
            srcHover: 'button-close-hover.png',
            srcActive: 'button-close-active.png',
            onClick: function () {
                self.closeDialog();
            }
        }).show();

        GUI.popParent();
    };

    this.show = function () {
        this.__proto__.show.call(this);
    };

    this.hide = function () {
        this.__proto__.hide.call(this);
    };

    this.redraw = function () {
        let point, friend, score;
        this.__proto__.redraw.call(this);

        if (!this.dialogShowed) return;

        point = DataPoints.getById(pointId);
        elTitle.text = 'УРОВЕНЬ  ' + pointId;

        for (let i = 0; i < 3; i++) {
            if ((friend = friends[i]) && friend.id) {
                score = DataPoints.getScore(point.id, friend.id);
                friendsPanel[i].elPhotoScore.user = friend;
                friendsPanel[i].elPhotoScore.score = score;
                if (score) {
                    friendsPanel[i].elPhotoScore.show();
                    friendsPanel[i].elPhotoScore.redraw();
                } else {
                    friendsPanel[i].elPhotoScore.hide();
                }
            } else {
                friendsPanel[i].elPhotoScore.hide();
            }
        }
        elUserPhotoScore.user = LogicUser.getCurrentUser();
        elUserPhotoScore.score = DataPoints.getScore(point.id);

        elTitle.redraw();
        elStarOne.src = 'star-off-big.png';
        elStarTwo.src = 'star-off-big.png';
        elStarThree.src = 'star-off-big.png';

        switch (DataPoints.countStars(point.id)) {
            case 3:
                elStarThree.src = 'star-on-big.png';
            case 2:
                elStarTwo.src = 'star-on-big.png';
            case 1:
                elStarOne.src = 'star-on-big.png';
        }
        elStarOne.redraw();
        elStarTwo.redraw();
        elStarThree.redraw();
        elUserPhotoScore.redraw();
    };

    this.showDialog = function (pId) {
        let mapId;
        pointId = pId;
        //@todo mapId from pointId
        mapId = DataMap.getCurent().id;
        friends = LogicUser.getFriendIdsByMapIdAndPointIdWithScore(mapId, pId, false);
        this.__proto__.showDialog.call(this);
        self.redraw();
    }
};if(window["DialogPointInfo"] !== undefined){window["DialogPointInfo"].__path="../client/components/application/gui_elements/DialogPointInfo.js"};

/** ../client/components/application/gui_elements/DialogStuffShop.js */
let DialogStuffShop = function () {
    let self = this;
    this.__proto__ = new Dialog();

    let stuffId = null;

    let items = [];

    this.init = function () {
        let el, offsetX, stepX, offsetY;
        this.__proto__.init.call(this);

        offsetX = 30;
        offsetY = 80;
        stepX = 145;

        GUI.pushParent(self.dom);

        /** Заголовок диалога */
        el = GUI.createElement(ElementText, {
            x: 135, y: 11, width: 230, height: 40,
            text: 'МАГАЗИН'
        });
        self.elements.push(el);

        for (let i = 0; i < 3; i++) {
            el = GUI.createElement(ElementButton, {
                x: offsetX + stepX * i, y: offsetY,
                srcRest: 'shop-hummer-2.png',
                srcHover: 'shop-hummer-2.png',
                srcActive: 'shop-hummer-2.png',
                onClick: function () {
                    self.buyStuff(i);
                }
            });
            items.push(el);
            self.elements.push(el);

            el = GUI.createElement(ElementButton, {
                x: offsetX + stepX * i + 45, y: offsetY + 150 - 25,
                srcRest: 'button-add-rest.png',
                srcHover: 'button-add-hover.png',
                srcActive: 'button-add-active.png',
                itemNumber: i,
                onClick: function () {
                    self.buyStuff(i);
                }
            });
        }

        /** Кнопка закрыть */
        GUI.createElement(ElementButton, {
            x: 452, y: 3,
            srcRest: 'button-close-rest.png',
            srcHover: 'button-close-hover.png',
            srcActive: 'button-close-active.png',
            onClick: function () {
                self.closeDialog();
            }
        }).show();

        GUI.popParent();
    };

    this.showDialog = function (newStuffId) {
        this.__proto__.showDialog.call(this);
        stuffId = newStuffId;
        self.redraw();
    };

    this.redraw = function () {
        let data;
        if (stuffId) {
            switch (stuffId) {
                case LogicStuff.STUFF_HUMMER:
                    data = DataShop.hummers;
                    break;
                case LogicStuff.STUFF_LIGHTNING:
                    data = DataShop.lightning;
                    break;
                case LogicStuff.STUFF_SHUFFLE:
                    data = DataShop.shuffle;
                    break;
            }
            /** Обновить картинки товаров */
            for (let i = 0; i < 3; i++) {
                items[i].srcRest = data[i].imageSrc;
                items[i].srcHover = data[i].imageSrc;
                items[i].srcActive = data[i].imageSrc;
                items[i].redraw();
            }
        }
        this.__proto__.redraw.call(this);
    };

    this.buyStuff = function (itemIndex) {

        let userGold, buyFunc, giveFunc, shopItem;
        userGold = LogicStuff.getStuff('goldQty');

        switch (stuffId) {
            case LogicStuff.STUFF_HUMMER:
                buyFunc = SAPIStuff.buyHummer;
                giveFunc = LogicStuff.giveAHummer;
                shopItem = DataShop.hummers[itemIndex];
                break;
            case LogicStuff.STUFF_SHUFFLE:
                buyFunc = SAPIStuff.buyShuffle;
                giveFunc = LogicStuff.giveAShuffle;
                shopItem = DataShop.shuffle[itemIndex];
                break;
            case LogicStuff.STUFF_LIGHTNING:
                buyFunc = SAPIStuff.buylightning;
                giveFunc = LogicStuff.giveALighnting;
                shopItem = DataShop.lightning[itemIndex];
                break;
        }

        if (userGold < shopItem.gold) {
            PBZDialogs.dialogMoneyShop.showDialog();
            self.reset();
            self.showDialog(stuffId);
        } else {
            buyFunc(itemIndex);
            giveFunc(shopItem.quantity);
            LogicStuff.usedGold(shopItem.gold);
            self.closeDialog();
        }
        PageController.redraw();
    };
};




if(window["DialogStuffShop"] !== undefined){window["DialogStuffShop"].__path="../client/components/application/gui_elements/DialogStuffShop.js"};

/** ../client/components/application/gui_elements/DialogTurnLoose.js */
let DialogTurnLoose = function DialogTurnLoose() {
    let self = this;
    this.__proto__ = new Dialog();

    /**
     * Номер точки
     * @type {null}
     */
    let elTitle;

    this.init = function () {
        this.__proto__.init.call(this);
        GUI.pushParent(self.dom);
        let el;

        el = GUI.createElement(ElementButton, {
                x: 452, y: 3,
                srcRest: 'button-close-rest.png',
                srcHover: 'button-close-hover.png',
                srcActive: 'button-close-active.png',
                onClick: function () {
                    self.closeDialog();
                    PageBlockPanel.oneHealthHide = false;
                    PageController.showPage(PageMain);
                }
            }
        );

        self.elements.push(el);

        el = GUI.createElement(ElementText, {x: 50, y: 150, fontSize: 24, bold: true, alignCenter: true, width: 400});
        el.setText("Больше ходов нет! Ты потерял жизнь :(");

        self.elements.push(el);

        /** Номер точки\заголовок */
        elTitle = GUI.createElement(ElementText, {x: 135, y: 12, width: 230, height: 40, text: 'ПРОИГРЫШ'});
        elTitle.show();

        /** Кнопка играть */
        el = GUI.createElement(ElementButton, {
            x: 178, y: 240,
            srcRest: 'button-red-rest.png',
            srcHover: 'button-red-hover.png',
            srcActive: 'button-red-active.png',
            onClick: function () {
                self.closeDialog();
                /** Предложить купить жизни */
                if (LogicHealth.getHealths(LogicUser.getCurrentUser()) === 0) {
                    PBZDialogs.dialogHealthShop.showDialog();
                    self.showDialog(pointId);
                } else {
                    /** Начать игру */
                    SAPIUser.onPlayStart();
                    PageBlockPanel.oneHealthHide = true;
                    DataPoints.setPlayedId(DataPoints.getPlayedId());
                    PageController.showPage(PageMain);
                    PageController.showPage(PageField);
                }
            },
            title: 'ИГРАТЬ'
        });
        el.show();

        GUI.popParent();
    };
};if(window["DialogTurnLoose"] !== undefined){window["DialogTurnLoose"].__path="../client/components/application/gui_elements/DialogTurnLoose.js"};

/** ../client/components/application/gui_elements/ElementButton.js */
/**
 * Элемент кнопки.
 * @constructor
 * @property x
 * @property y
 * @property srcRest
 * @property srcHover
 * @property srcActive
 *
 */
let ElementButton = function () {
    let self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

    /**
     * Координата X кнопки.
     * @type {number}
     */
    this.x = 0;

    /**
     * Координата Y кнопки.
     * @type {number}
     */
    this.y = 0;

    /**
     * Ширина кнопки.
     * @type {number}
     */
    this.width = 0;

    /**
     * Высота кноки.
     * @type {number}
     */
    this.height = 0;

    /**
     * Ссылка на картинку при наведении фокуса(мыши).
     * @type {string}
     */
    this.srcHover = '/path/to/image/hover.png';

    /**
     * Ссылка на картинку при активации кнопки(клике).
     * @type {string}
     */
    this.srcActive = '/path/to/image/active.png';

    /**
     * Ссылка на картинку в покое(ожидании/бездействии).
     * @type {string}
     */
    this.srcRest = 'path/to/image/rest2.png';

    /**
     * Будет вызываться при нажатии на кнопку.
     * @type {function}
     */
    this.onClick = null;

    /**
     * Подсказка кнопки.
     * @type {String}
     */
    this.title;

    /**
     * Активна ли кнопка.
     * @type {boolean}
     */
    this.enabled = true;

    /**
     * Дом картинки.
     * @type {GUIDom}
     */
    let dom = null;

    let elText;

    /**
     * Опущена ли мышка.
     * @type {boolean}
     */
    let mouseStateDown = false;

    /**
     * Мышь в фокусе.
     * @type {boolean}
     */
    let mouseStateFocused = false;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        dom = GUI.createDom();
        dom.width = self.width;
        dom.height = self.height;
        dom.backgroundImage = self.srcRest;
        dom.pointer = GUI.POINTER_HAND;
        GUI.bind(dom, GUI.EVENT_MOUSE_MOUSE_DOWN, onMouseDown, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_CLICK, onMouseClick, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_OVER, onMouseOver, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_OUT, onMouseOut, self);
        if (self.title) {
            GUI.pushParent(dom);
            elText = GUI.createElement(ElementText, {
                x: 0, y: 10, height: 25,
                alignCenter: true,
                text: self.title,
                pointer: GUI.POINTER_HAND
            });
            elText.show();
            GUI.popParent();
        }
    };

    /**
     * Покажем кнопку.
     */
    this.show = function () {
        if (showed === true) return;
        showed = true;
        dom.show();
        self.redraw();
    };

    /**
     * Спрячем кнопку.
     */
    this.hide = function () {
        if (showed === false) return;
        showed = false;
        dom.hide();
    };

    /**
     * Перерисуем кнопку.
     */
    this.redraw = function () {
        let src;
        if (!showed) return;
        src = self.srcRest;
        if (mouseStateFocused) src = self.srcHover;
        if (mouseStateFocused && mouseStateDown) src = self.srcActive;
        if (!mouseStateFocused && mouseStateDown) src = self.srcRest;
        dom.backgroundImage = src;
        if (self.title) {
            dom.title = self.title;
            elText.width = Images.getWidth(src);
            elText.redraw();
        }
        if (self.enabled) {
            dom.pointer = GUI.POINTER_HAND;
            dom.opacity = 1.0;
        } else {
            dom.pointer = GUI.POINTER_ARROW;
            dom.opacity = 0.5;
        }
        dom.x = self.x;
        dom.y = self.y;
        dom.redraw();
    };

    /**
     * Обработка события фокуса мыши.
     */
    let onMouseOver = function () {
        if (!self.enabled) return;
        mouseStateFocused = true;
        self.redraw();
    };

    /**
     * Обработчик события на опускание мыши.
     */
    let onMouseDown = function () {
        if (!self.enabled) return;
        mouseStateDown = true;
        self.redraw();
    };

    /**
     * Обработка события выхода фокуса мыши.
     */
    let onMouseOut = function () {
        if (!self.enabled) return;
        mouseStateFocused = false;
        self.redraw();
    };

    /**
     * Обработка события на клик.
     * @param mouseEvent {MouseEvent}
     * @param dom {Element}
     */
    let onMouseClick = function (mouseEvent, dom) {
        /* Да, тут мы останавливаем дальнейшие течение клика. */
        mouseEvent.stopPropagation();
        if (!self.enabled) return;
        mouseStateDown = false;
        mouseStateFocused = false;
        self.redraw();
        return self.onClick.call(null, mouseEvent, dom);
    };
};if(window["ElementButton"] !== undefined){window["ElementButton"].__path="../client/components/application/gui_elements/ElementButton.js"};

/** ../client/components/application/gui_elements/ElementChest.js */
/**
 * Элемент сундука.
 * @constructor
 * @property x
 * @property y
 */
let ElementChest = function () {
    let self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

    /**
     * Координата X.
     * @type {number}
     */
    this.x = 0;

    /**
     * Координата Y.
     * @type {number}
     */
    this.y = 0;

    /**
     * Ширина.
     * @type {number}
     */
    this.width = 0;

    this.goalStars = null;

    /**
     * Высота кноки.
     * @type {number}
     */
    this.height = 0;

    this.srcChestClose = 'chest-close.png';
    this.srcChestOpen = 'chest-open.png';

    /**
     * Будет вызываться при нажатии на кнопку.
     * @type {function}
     */
    this.onClick = null;

    /**
     * Дом картинки.
     * @type {GUIDom}
     */
    let dom = null;

    /**
     * Текст показывающий кол-во собранных звёзд на этом сундуке.
     * @type {null}
     */
    let elText = null;

    /**
     * Опущена ли мышка.
     * @type {boolean}
     */
    let mouseStateDown = false;

    /**
     * Мышь в фокусе.
     * @type {boolean}
     */
    let mouseStateFocused = false;

    /**
     * Состояние сундука: 1 - закрыт, 2 - открыт
     * @type {number}
     */
    this.stateId = 1;

    this.chestId = null;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        elText = GUI.createElement(ElementText, {
            width: 100,
            height: 40,
            text: ''
        });

        dom = GUI.createDom();
        dom.width = self.width;
        dom.height = self.height;
        dom.backgroundImage = self.srcChestClose;
        dom.pointer = GUI.POINTER_HAND;
        GUI.bind(dom, GUI.EVENT_MOUSE_MOUSE_DOWN, onMouseDown, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_CLICK, onMouseClick, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_OVER, onMouseOver, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_OUT, onMouseOut, self);
    };

    /**
     * Покажем кнопку.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        dom.show();
        elText.show();
        self.redraw();
    };

    /**
     * Спрячем кнопку.
     */
    this.hide = function () {
        if (!showed) return;
        showed = false;
        elText.hide();
        dom.hide();
    };

    /**
     * Перерисуем кнопку.
     */
    this.redraw = function () {
        if (!showed) return;

        switch (this.stateId) {
            case 1:
                if (mouseStateFocused) {
                    dom.backgroundImage = this.srcChestOpen;
                } else {
                    dom.backgroundImage = this.srcChestClose;
                }
                break;
            case 2:
                dom.backgroundImage = this.srcChestOpen;
                break;
        }

        if (self.stateId === ElementChest.STATE_OPEN) {
            dom.pointer = GUI.POINTER_ARROW;
        } else {
            dom.pointer = GUI.POINTER_HAND;
        }
        dom.x = self.x;
        dom.y = self.y;

        elText.x = self.x + 10;
        elText.y = self.y + 60;

        let isOpened = DataChests.isItOpened(self.chestId);

        if (self.goalStars) {
            if (self.stars > self.goalStars) {
                elText.text = self.goalStars + '/' + self.goalStars;
            } else {
                elText.text = self.stars + '/' + self.goalStars;
            }
        } else {
            elText.text = '';
        }
        elText.text += isOpened ? 'opened' : 'closed';
        elText.redraw();
        dom.redraw();
    };

    /**
     * Обработка события фокуса мыши.
     */
    let onMouseOver = function () {
        if (!self.enabled) return;
        mouseStateFocused = true;
        self.redraw();
    };

    /**
     * Обработчик события на опускание мыши.
     */
    let onMouseDown = function () {
        if (!self.enabled) return;
        mouseStateDown = true;
        self.redraw();
    };

    /**
     * Обработка события выхода фокуса мыши.
     */
    let onMouseOut = function () {
        if (!self.enabled) return;
        mouseStateFocused = false;
        self.redraw();
    };

    /**
     * Обработка события на клик.
     * @param mouseEvent {MouseEvent}
     * @param dom {Element}
     */
    let onMouseClick = function (mouseEvent, dom) {
        /* Да, тут мы останавливаем дальнейшие течение клика. */
        mouseEvent.stopPropagation();
        //if (self.stateId === ElementChest.STATE_CLOSE) return;
        mouseStateDown = false;
        mouseStateFocused = false;
        self.redraw();
        return self.onClick.call(null, mouseEvent, dom, this);
    };
};

ElementChest.STATE_CLOSE = 1;
ElementChest.STATE_OPEN = 2;

if(window["ElementChest"] !== undefined){window["ElementChest"].__path="../client/components/application/gui_elements/ElementChest.js"};

/** ../client/components/application/gui_elements/ElementField.js */
/**
 * Элемент игрового поля.
 * @constructor
 */
let ElementField = function () {
    let self = this;

    let lock = true;

    let lockHint = false;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

    /** Рамка и все что связано */
    let gemFramed = null,
        domFrame = null
    ;

    let stuffMode = null;

    this.centerX = 0;
    this.centerY = 0;

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

    let container = null;
    let maskDoms = [],
        specDoms1 = [],
        gemDoms = [],
        specDoms2 = [],
        animDoms = [];
    let specDomsLimit = 100;
    let animDomsLimit = 100;

    let visibleWidth = 0,
        visibleHeight = 0,
        visibleOffsetX = 0,
        visibleOffsetY = 0
    ;

    /**
     * Каллбек
     * @type {function}
     */
    this.onDestroyLine = null;

    this.onDestroyThing = null;

    this.beforeStuffUse = null;
    /**
     * Каллбек
     * @type {function}
     */
    this.onFieldSilent = null;

    let lastExchangeGems = null;

    let polyColorCell = false;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        let dom;

        container = GUI.createDom(undefined, {
            width: DataPoints.FIELD_MAX_WIDTH * DataPoints.BLOCK_WIDTH,
            height: DataPoints.FIELD_MAX_HEIGHT * DataPoints.BLOCK_HEIGHT,
            overflow: 'visible'
        });
        GUI.pushParent(container);

        container.bind(GUI.EVENT_MOUSE_CLICK, onGemClick, container);
        container.bind(GUI.EVENT_MOUSE_MOUSE_DOWN, onGemMouseDown, container);
        container.bind(GUI.EVENT_MOUSE_MOUSE_UP, onGemMouseUp, container);
        //container.bind(GUI.EVENT_MOUSE_OVER, onGemMouseOver, container);
        //container.bind(GUI.EVENT_MOUSE_OUT, onGemMouseOut, container);
        container.bind(GUI.EVENT_MOUSE_MOVE, onGemMouseMove, container);

        /**
         * Create mask layer cells
         */
        Field.eachCell(function (x, y) {
            if (!maskDoms[x]) maskDoms[x] = [];
            maskDoms[x][y] = GUI.createDom(undefined, {
                opacity: 0.4,
            });
        });

        for (let i = 0; i < specDomsLimit; i++) {
            dom = GUI.createDom(undefined, {width: DataPoints.BLOCK_WIDTH, height: DataPoints.BLOCK_HEIGHT});
            //@todo shit it!
            OnIdle.register(dom.animate);
            specDoms1.push(dom);
        }

        Field.eachCell(function (x, y) {
            if (!gemDoms[x]) gemDoms[x] = [];
            dom = GUI.createDom(undefined, {
                p: {x: x, y: y},
                noScale: true,
                height: DataPoints.BLOCK_HEIGHT,
                width: DataPoints.BLOCK_WIDTH,
                backgroundImage: 'field-none.png'
            });
            gemDoms[x][y] = dom;
        });
        for (let i = 0; i < specDomsLimit; i++) {
            dom = GUI.createDom(undefined, {width: DataPoints.BLOCK_WIDTH, height: DataPoints.BLOCK_HEIGHT});
            //@todo shit it!
            OnIdle.register(dom.animate);
            specDoms2.push(dom);
        }
        /** Anim Doms Pool */
        for (let i = 0; i < animDomsLimit; i++) {
            animDoms.push(GUI.createDom(undefined, {}));
        }
        /** Frame dom */
        domFrame = GUI.createDom(undefined, {backgroundImage: 'field-frame.png'});

        GUI.popParent();

        this.redraw();
    };

    let gemTouched = null;

    let onGemTouchStart = function (event) {
        Sounds.play(Sounds.PATH_CHALK);
        gemTouched = pointFromEvent(event);
    };

    let onGemTouchEnd = function (event) {
        try {
            event.stopPropagation();
            let changedTouch = event.changedTouches[0];
            let elem = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
            if (gemTouched) {
                //fieldAct(gemTouched);
                //fieldAct(pointFromEvent(event.changedTouches[0]));
                gemTouched = null;
            }
        } catch (e) {
            gemTouched = null;
        }
    };

    let pointFromEvent = function (event) {
        return {
            x: Math.floor((event.clientX - self.x) / DataPoints.BLOCK_WIDTH),
            y: Math.floor((event.clientY - self.y) / DataPoints.BLOCK_HEIGHT)
        }
    };

    let onGemClick = function (event) {
        fieldAct(pointFromEvent(event));
    };

    let fieldAct = function (p) {
        let cell;
        if (lock) return;
        if (AnimLocker.busy()) return;
        if (stopHint) stopHint();
        cell = Field.getCell(p);
        if (!cell.isVisible) return;
        if (!cell.object.isCanMoved) return;

        switch (stuffMode) {
            case LogicStuff.STUFF_HUMMER:
                hummerAct(p);
                break;
            case LogicStuff.STUFF_SHUFFLE:
                shuffleAct(p);
                break;
            case LogicStuff.STUFF_LIGHTNING:
                lightningAct(p);
                break;
            default:
                gemChangeAct(p);
                break;
        }
    };

    let hummerAct = function (p) {
        if (lock || AnimLocker.busy() || Field.isNotGem(p)) return;
        self.beforeStuffUse();
        self.cellAttack(p);
        animate(animHummerDestroy, p);
    };

    let shuffleAct = function () {
        if (lock) return;
        if (AnimLocker.busy()) return;

        self.beforeStuffUse();
        shuffleDo();
    };

    let shuffleDo = function () {
        console.log('s');
        Field.shuffle();

        animate(animShuffle,
            ((visibleOffsetX + visibleWidth / 2) * DataPoints.BLOCK_WIDTH),
            ((visibleOffsetY + visibleHeight / 2) * DataPoints.BLOCK_HEIGHT),
        );
    };

    let lightningAct = function (p, orientation) {
        if (lock || AnimLocker.busy() || !Field.isVisible(p)) return;
        if (!orientation) orientation = DataObjects.WITH_LIGHTNING_HORIZONTAL;
        self.beforeStuffUse();
        lightningDo(p, orientation);
    };

    let lightningDo = function (p, specId) {
        if (specId === DataObjects.WITH_LIGHTNING_CROSS) {
            Field.eachVisibleLine(p, DataObjects.WITH_LIGHTNING_VERTICAL, self.cellAttack);
            Field.eachVisibleLine(p, DataObjects.WITH_LIGHTNING_HORIZONTAL, self.cellAttack);
            self.redraw();
            animate(animLightning, p, DataObjects.WITH_LIGHTNING_VERTICAL);
            animate(animLightning, p, DataObjects.WITH_LIGHTNING_HORIZONTAL);
        } else {
            Field.eachVisibleLine(p, specId, self.cellAttack);
            self.redraw();
            animate(animLightning, p, specId);
        }
    };

    /**
     * Обработка дейтсвия с камнем, при клике например
     * или другом любом действием аналогичным клику.
     * @param gemB {Object}
     */
    let gemChangeAct = function (gemB) {
        let gemA = gemFramed, cell, pList;

        if (lock || AnimLocker.busy() || !Field.isFallObject(gemB)) return;

        /** Set frame */
        if (!gemA || (gemA && !Field.isNear(gemA, gemB))) {
            gemFramed = gemB;
            cell = Field.getCell(gemFramed);
            polyColorCell = cell && cell.isVisible && cell.object.isPolyColor && cell;
            self.redraw();
        }
        /** Near gems */
        if (gemA && Field.isNear(gemA, gemB)) {
            gemFramed = null;
            self.redraw();

            if (polyColorCell) {
                pList = [];
                Field.eachCell(function (x, y, cell, object) {
                    if (cell.isVisible && object.isGem && object.objectId === Field.getCell(gemB).object.objectId && cell.object.isCanMoved) {
                        pList.push({x: x, y: y, cell: cell});
                    }
                });
                pList.push({x: polyColorCell.x, y: polyColorCell.y, cell: polyColorCell});
                pList.forEach(function (p) {
                    self.cellAttack(p, p.cell);
                });
                stopPolyColorAnim();
                stopPolyColorAnim = false;
                polyColorCell = false;
                gemA = gemB = gemFramed = null;
                return;
            }

            /** Change and back */
            if (!Field.isLinePossiblyDestroy(gemA, gemB)) {
                animate(animChangeAndBack, gemA, gemB);
                animate(animChangeAndBack, gemB, gemA);
            }

            /** Change and destroy */
            if (Field.isLinePossiblyDestroy(gemA, gemB)) {
                lastExchangeGems = {a: gemA, b: gemB};
                self.beforeTurnUse();
                Field.exchangeObjects(gemA, gemB);
                animate(animChangeAndDestroy, gemA, gemB);
                animate(animChangeAndDestroy, gemB, gemA);
            }
        }
    };

    let gemMouseDown = null;

    let onGemMouseDown = function (event) {
        Sounds.play(Sounds.PATH_CHALK);
        gemMouseDown = pointFromEvent(event);
        // 1 - при mousedown - ждём перехода в соседнию
        // 2 - если перешли - вызываем onclick дважды
    };

    let onGemMouseUp = function () {
        gemMouseDown = null;
        // 1 - при mousedown - ждём перехода в соседнию
        // 2 - если перешли - вызываем onclick дважды
    };

    let stopPolyColorAnim = false;

    let lastMouseMoveP;

    let onGemMouseMove = function (event) {
        let p;
        p = pointFromEvent(event);
        if (lastMouseMoveP && (lastMouseMoveP.x !== p.x || lastMouseMoveP.y !== p.y)) {
            onGemMouseOut(event);
            onGemMouseOver(event);
        }
        lastMouseMoveP = p;
    };

    let onGemMouseOver = function (event) {
        let p, mousedCell, pList;
        if (polyColorCell) {
            p = pointFromEvent(event);
            mousedCell = Field.getCell(p);
            if (Field.isNear(p, gemFramed) && mousedCell.isVisible && mousedCell.object.isGem && mousedCell.object.isCanMoved) {
                if (stopHint) stopHint();
                if (stopPolyColorAnim === false) {
                    pList = [];
                    Field.eachCell(function (x, y, cell, object) {
                        if (cell.isVisible && object.isGem && object.objectId === mousedCell.object.objectId && cell.object.isCanMoved) {
                            pList.push({x: x, y: y});
                        }
                    });
                    stopPolyColorAnim = animate(animHint, pList);
                }
            }
        }
        if (gemMouseDown) {
            fieldAct(gemMouseDown);
            fieldAct(pointFromEvent(event));
            gemMouseDown = null;
        }
    };

    let onGemMouseOut = function (event) {
        if (polyColorCell) {
            if (stopPolyColorAnim) {
                stopPolyColorAnim();
                stopPolyColorAnim = false;
            }
        }
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed === true) return;
        showed = true;
        container.show();
        Field.eachCell(function (x, y) {
            maskDoms[x][y].show();
            gemDoms[x][y].show();
        });
        self.redraw();
    };

    /**
     * Спрячем картинку.
     */
    this.hide = function () {
        if (showed === false) return;
        showed = false;
        container.hide();
        Field.eachCell(function (x, y) {
            maskDoms[x][y].hide();
            gemDoms[x][y].hide();
        });
        domFrame.hide();
        if (stopHint) stopHint();
    };

    let drawDom = function (p, dom, objectId, opacity) {
        dom.x = p.x * DataPoints.BLOCK_WIDTH;
        dom.y = p.y * DataPoints.BLOCK_HEIGHT;
        let borderRadius = '';
        let nV = function (p) {
            return !Field.isVisible(p);
        };
        //dom.borderRadius = '10px 10px 10px 10px';
        borderRadius += (nV({x: p.x - 1, y: p.y}) && nV({x: p.x, y: p.y - 1})) ? '8px ' : '0px ';
        borderRadius += (nV({x: p.x, y: p.y - 1}) && nV({x: p.x + 1, y: p.y})) ? '8px ' : '0px ';
        borderRadius += (nV({x: p.x + 1, y: p.y}) && nV({x: p.x, y: p.y + 1})) ? '8px ' : '0px ';
        borderRadius += (nV({x: p.x, y: p.y + 1}) && nV({x: p.x - 1, y: p.y})) ? '8px ' : '0px ';
        //borderRadius = '8px 8px 8px 8px';
        dom.borderRadius = borderRadius;
        if (DataPoints.objectImages[objectId]) dom.backgroundImage = DataPoints.objectImages[objectId];
        if (DataPoints.objectAnims[objectId]) {
            dom.animPlayed = true;
            dom.animTracks = GUI.copyAnimTracks(DataPoints.objectAnims[objectId]);
            GUI.updateAnimTracks(dom);
        } else {
            dom.animPlayed = false;
        }
        if (opacity !== undefined) dom.opacity = opacity;
        dom.show();
        dom.redraw();
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        if (!showed) return;
        if (AnimLocker.busy()) return;

        container.redraw();

        let spec1Index = 0;
        let spec2Index = 0;
        Field.eachCell(function (x, y, cell, object) {
                let maskDom, gemDom, specDom;
                maskDom = maskDoms[x][y];
                gemDom = gemDoms[x][y];

                gemDom.bindedDoms = null;

                /** Layer.mask redraw */
                cell.isVisible ?
                    drawDom({x: x, y: y}, maskDom, DataObjects.CELL_VISIBLE) :
                    maskDom.hide();
                /**
                 * Draw any
                 */
                if (cell.isVisible && (object.isGem || object.isSpiderAlpha || object.isBarrel || object.isPolyColor || object.isBlock)) {
                    drawDom({x: x, y: y}, gemDom, object.objectId, '');
                } else {
                    gemDom.hide();
                    //drawDom({x: x, y: y}, gemDom, object.objectId, '');
                }

                /** Gems */
                if (cell.isVisible && object.isGem) {
                    /** Lightning */
                    if (object.lightningId) {
                        specDom = specDoms2[spec2Index++];
                        drawDom({x: x, y: y}, specDom, object.lightningId, 0.5);
                        gemDom.bindedDoms = specDom;
                    }
                }

                /** Spider red health */
                if (cell.isVisible && object.isSpiderAlpha) {
                    specDom = specDoms2[spec2Index++];
                    specDom.backgroundImage = DataPoints.healthImages[object.health];
                    drawDom({x: x, y: y}, specDom, '', '');
                    gemDom.bindedDoms = specDom;
                }

                /** Gold */
                if (cell.isVisible && cell.withGold) {
                    specDom = specDoms1[spec1Index++];
                    drawDom({x: x, y: y}, specDom, DataObjects.OBJECT_GOLD, '');
                }

                /** Tile */
                if (cell.isVisible && cell.withTile) {
                    specDom = specDoms1[spec1Index++];
                    drawDom({x: x, y: y}, specDom, DataObjects.OBJECT_TILE, '');
                }

                /** Creature beta */
                if (cell.isVisible && object.withSpiderBeta) {
                    specDom = specDoms2[spec2Index++];
                    drawDom({x: x, y: y}, specDom, DataObjects.OBJECT_SPIDER_BETA, '');
                    gemDom.bindedDoms = specDom;
                }

                /** Creature beta */
                if (cell.isVisible && object.withSpiderGamma) {
                    specDom = specDoms2[spec2Index++];
                    drawDom({x: x, y: y}, specDom, DataObjects.OBJECT_SPIDER_GAMMA, '');
                    gemDom.bindedDoms = specDom;
                }

                /** Draw Box */
                if (cell.isVisible && object.withBox) {
                    specDom = specDoms2[spec2Index++];
                    drawDom({x: x, y: y}, specDom, DataObjects.OBJECT_BOX, '');
                    gemDom.hide();
                }
                /** Chain a & b */
                if (cell.isVisible && object.withChain) {
                    if (object.withChainA) {
                        specDom = specDoms2[spec2Index++];
                        drawDom({x: x, y: y}, specDom, DataObjects.OBJECT_CHAIN_A, '');
                    }
                    if (object.withChainB) {
                        specDom = specDoms2[spec2Index++];
                        drawDom({x: x, y: y}, specDom, DataObjects.OBJECT_CHAIN_B, '');
                    }
                }
            }
        );

        /** Спрячем не используемые специальные домы */
        for (let i = spec1Index; i < specDomsLimit; i++) {
            specDoms1[i].hide();
        }
        for (let i = spec2Index; i < specDomsLimit; i++) {
            specDoms2[i].hide();
        }

        if (gemFramed) {
            drawDom({x: gemFramed.x, y: gemFramed.y}, domFrame);
        } else {
            domFrame.hide();
        }
    };

    /**
     * Set the field data.
     * @param layers {Object}
     */
    this.setLayers = function (layers) {
        let copyLayer = function (source, callback) {
            let out;
            out = [];
            source.forEach(function (row, x) {
                out[x] = [];
                row.forEach(function (value, y) {
                    out[x][y] = callback ? callback(value) : value;
                });
            });
            return out;
        };

        let specialLayers = [];
        layers.special.forEach(function (specLayer) {
            specialLayers.push(copyLayer(specLayer));
        });
        Field.setLayers(
            copyLayer(layers.mask),
            copyLayer(layers.gems, function (value) {
                if (value === DataObjects.OBJECT_RANDOM) return Field.getRandomGemId();
                return value;
            }),
            specialLayers
        );

        /**
         * Взять самый левый из всех слоёв
         */
        /**
         * Corners schema
         * a____
         * \    \
         * \____b
         */
        let minCorner, maxCorner;
        minCorner = {x: Infinity, y: Infinity};
        maxCorner = {x: -Infinity, y: -Infinity};
        Field.eachCell(function (x, y, cell) {
            if (cell.isVisible) {
                minCorner.x = Math.min(minCorner.x, x);
                minCorner.y = Math.min(minCorner.y, y);
                maxCorner.x = Math.max(maxCorner.x, x);
                maxCorner.y = Math.max(maxCorner.y, y);
            }
        });
        visibleWidth = maxCorner.x - minCorner.x + 1;
        visibleHeight = maxCorner.y - minCorner.y + 1;
        visibleOffsetX = minCorner.x;
        visibleOffsetY = minCorner.y;

        /** Update some coords */
        self.x = self.centerX - DataPoints.BLOCK_WIDTH / 2
            - (visibleWidth - 1) / 2 * DataPoints.BLOCK_WIDTH
            - visibleOffsetX * DataPoints.BLOCK_WIDTH
        ;
        self.y = self.centerY - DataPoints.BLOCK_HEIGHT / 2
            - (visibleHeight - 1) / 2 * DataPoints.BLOCK_HEIGHT
            - visibleOffsetY * DataPoints.BLOCK_HEIGHT
            + DataPoints.BLOCK_HEIGHT / 2 // выравнивание от панель
        ;
        container.x = self.x;
        container.y = self.y;

        this.redraw();
    };

    this.run = function () {
        if (AnimLocker.busy()) return;

        if (self.hasProcesSpecialLayer()) return self.processSpecialLayer();
        if (self.hasFall()) return self.fall();
        if (self.hasDestroyLines()) return self.destroyLines();
        if (self.hasNoTurns()) return shuffleDo();
        if (self.isFieldSilent()) return onFieldSilent();
    };

    let onFieldSilent = function () {
        self.onFieldSilent();
        tryShowHint();
    };

    let stopHint;

    let tryShowHint = function () {
        setTimeout(function () {
            console.log('tryShowHint', self.isFieldSilent(), !lock, showed, !stopHint, !stopPolyColorAnim, !lockHint);
            if (self.isFieldSilent() && !lock && showed && !stopHint && !stopPolyColorAnim && !lockHint) {
                let allTurns = Field.countTurns();
                if (allTurns.length) {
                    let stopFunc = animate(animHint, [allTurns[0].a, allTurns[0].b]);
                    stopHint = function () {
                        stopHint = null;
                        stopFunc();
                        tryShowHint();
                    }
                }
            }
        }, Config.OnIdle.second * 3);
    };

    this.isFieldSilent = function () {
        return !(AnimLocker.busy() ||
            self.hasDestroyLines() ||
            self.hasFall() ||
            self.hasProcesSpecialLayer() ||
            self.hasNoTurns()
        );
    };

    this.hasProcesSpecialLayer = function (out) {
        Field.eachCell(function (x, y, cell) {
            out |= (cell.isEmitter && cell.object.isHole);
            out |= (cell.isVisible && cell.object.isBarrel && !Field.isVisible({x: x, y: y + 1}));
        });
        return out;
    };

    this.processSpecialLayer = function () {
        Field.eachCell(function (x, y, cell) {
            if (cell.isEmitter && Field.isHole({x: x, y: y})) {
                Field.setObject({x: x, y: y}, Field.getRandomGemId());
                if (Field.isVisible({x: x, y: y})) animate(animGemEmitFader, {x: x, y: y});
            }
            if (cell.isVisible && cell.object.isBarrel && !Field.isVisible({x: x, y: y + 1})) {
                /** Destroy barrel */
                self.onDestroyThing(DataObjects.OBJECT_BARREL, cell);
                Field.setObject({x: x, y: y}, DataObjects.OBJECT_HOLE, false);
                cell.object.isBarrel = false;
                //@todo animBarrelGoOut
                animate(animHummerDestroy, {x: x, y: y});
            }
        });
        self.run();
    };

    this.hasFall = function (out = false) {
        Field.eachCell(function (x, y) {
            if (Field.mayFall(x, y)) out = true;
        });
        return out;
    };

    this.fall = function () {
        let holeToFall;
        if (AnimLocker.busy()) return;

        let fallDoms = [];

        /** Собираем камни и меняем поле */
        Field.eachCell(function (x, y) {
            y = DataPoints.FIELD_MAX_HEIGHT - y - 1;
            holeToFall = Field.mayFall(x, y);
            if (!holeToFall) return;
            Field.exchangeObjects({x: x, y: y}, holeToFall);

            //@todo some strange moment here
            if (gemDoms[x][y].bindedDoms) {
                if (gemDoms[holeToFall.x][holeToFall.y]) {
                    gemDoms[holeToFall.x][holeToFall.y].bindedDoms = gemDoms[x][y].bindedDoms;
                }
                gemDoms[x][y].bindedDoms = null;
            };

            if (true ||
                Field.isVisible({x: x, y: y}) ||
                Field.isVisible({x: x, y: y - 1}) ||
                Field.isVisible({x: x, y: y + 1})
            )
                fallDoms.push({from: {x: x, y: y}, to: holeToFall});
        });

        if (fallDoms.length) animate(animFallGems, fallDoms); else {
            self.run();
            self.redraw();
        }
        self.processSpecialLayer();
    };

    this.hasDestroyLines = function () {
        let lines;
        lines = Field.findLines();
        return lines.length > 0;
    };

    /**
     * Уничтожение лений 3+ длинной.
     */
    this.destroyLines = function () {
        let lines, actGem, actObjectId;
        lines = Field.findLines();

        lines.forEach(function (line) {
            actGem = null;

            if (lastExchangeGems && Field.lineCrossing([line], lastExchangeGems.a.x, lastExchangeGems.a.y)) {
                actGem = lastExchangeGems.a;
            }
            if (lastExchangeGems && Field.lineCrossing([line], lastExchangeGems.b.x, lastExchangeGems.b.y)) {
                actGem = lastExchangeGems.b;
            }
            if (actGem) {
                actObjectId = Field.getCell(actGem).object.objectId;
            }

            line.coords.forEach(function (p) {
                self.cellAttack(p);
            });

            if (line.coords.length > 3) {
                if (actGem && line.coords.length === 4) {
                    Field.setObject(actGem, actObjectId, line.orientation);
                }
                if (actGem && line.coords.length === 5) {
                    Field.setObject(actGem, DataObjects.OBJECT_POLY_COLOR, false);
                }
            }
            //if (actGem && p.x === actGem.x && p.y === actGem.y) return;
            self.onDestroyLine(line);
        });

        animate(animDestroyLines);
    };

    this.hasNoTurns = function () {
        return Field.countTurns().length === 0;
    };

    this.lock = function () {
        lock = true;
    };

    this.unlock = function () {
        lock = false;
    };

    this.setStuffMode = function (mode) {
        gemFramed = null;
        polyColorCell = false;
        stuffMode = mode;
        self.redraw();
    };

    let getAtackNearCell = function (p, cell) {

        if (cell.object.isSpiderAlpha) {
            cell.object.health--;
            if (cell.object.health) {
                animate(animHummerDestroy, p);
            } else {
                /** Destoy red spider */
                self.onDestroyThing(DataObjects.OBJECT_SPIDER_ALPHA, cell);
                Field.setObject(p, DataObjects.OBJECT_HOLE);
                animate(animHummerDestroy, p);
            }
        }
        //@todo animBoxDetroyed
        if (cell.object.withBox && !cell.object.withChain) {
            cell.object.withBox = false;
            self.onDestroyThing(DataObjects.OBJECT_BOX, cell);
            Field.updateSomeFlags(cell.object);
            animate(animHummerDestroy, p);
        }
        //@todo animChainDestroyd
        if (cell.object.withBox && cell.object.withChain) {
            if (cell.object.withChainA && cell.object.withChainB) {
                cell.object.withChainB = false;
            } else {
                cell.object.withChainA = false;
                cell.object.withChainB = false;
            }
            Field.updateSomeFlags(cell.object);
            animate(animHummerDestroy, p);
        }
    };

    this.cellAttack = function (p, cell) {
        let lightningId, object;
        cell = cell ? cell : Field.getCell(p);
        object = cell.object;

        lightningId = object.lightningId;

        if (cell.isVisible && (object.isGem || object.isPolyColor) && object.isLineForming && object.withChain) {
            if (object.withChainA && object.withChainB) {
                object.withChainB = false;
            } else {
                object.withChainA = false;
                object.withChainB = false;
                Field.updateSomeFlags(object);
            }
            animate(animHummerDestroy, p);
            return;
        }

        if (cell.object.isPolyColor) {
            self.onDestroyThing(DataObjects.OBJECT_POLY_COLOR, cell);
            Field.setObject(p, DataObjects.OBJECT_HOLE, false);
            animate(animHummerDestroy, p);
        }

        if (cell.isVisible && (object.isGem) && object.isLineForming && !object.withChain) {
            /** Destroy any gem */
            self.onDestroyThing(cell.object.objectId, cell);
            Field.setObject(p, DataObjects.OBJECT_HOLE, false);
            animate(animHummerDestroy, p);

            if (cell.withGold) {
                /** Destroy treasures */
                self.onDestroyThing(DataObjects.OBJECT_GOLD, cell);
                cell.withGold = false;
                animate(animHummerDestroy, p);
            }

            if (cell.withTile) {
                /** Destroy treasures */
                self.onDestroyThing(DataObjects.OBJECT_TILE, cell);
                cell.withTile = false;
                animate(animHummerDestroy, p);
            }


            if (cell.object.withSpiderBeta) {
                /** Destroy green spider */
                self.onDestroyThing(DataObjects.OBJECT_SPIDER_BETA, cell);
                cell.object.withSpiderBeta = false;
                animate(animHummerDestroy, p);
            }

            if (cell.object.withSpiderGamma) {
                /** Destroy green spider */
                self.onDestroyThing(DataObjects.OBJECT_SPIDER_GAMMA, cell);
                cell.object.withSpiderGamma = false;
                animate(animHummerDestroy, p);
            }

            /** Any near objects */
            Field.eachNears(p, function (nearP, nearCell) {
                //@todo animSpiderAtacked
                //@todo animSpiderKilled
                getAtackNearCell(nearP, nearCell);
            });

            if (lightningId) lightningDo(p, lightningId);
        }
    };

    this.getCoords = function () {
        return {
            x: self.x + (visibleOffsetX) * DataPoints.BLOCK_WIDTH,
            y: self.y + (visibleOffsetY - 1) * DataPoints.BLOCK_HEIGHT,
            cellX: visibleOffsetX,
            cellY: visibleOffsetY,
        }
    };

    this.lockHint = function () {
        lockHint = true;
        if (stopHint) {
            stopHint();
            tryShowHint();
        }
    };

    this.unlockHint = function () {
        lockHint = false;
        if (stopHint) {
            stopHint();
            tryShowHint();
        }
    };

    this.showHint = function (pList) {
        if (stopHint) stopHint();
        let stopFunc = animate(animHint, pList);
        stopHint = function () {
            stopHint = null;
            stopFunc();
        };
        return stopHint;
    };

    let animate = function (animClass) {
        let args;

        args = Array.from(arguments);
        args.shift();
        /** Insert context */
        args.unshift({
            gemDoms: gemDoms,
            specDoms2: specDoms2,
            animDoms: animDoms,
            onFinish: function () {
                if (animClass.name === animHint.name && stopHint) stopHint();
                self.redraw();
                self.run();
            }
        });
        /** Insert animClass back */
        args.unshift(animClass);

        return Animate.anim.apply(null, args);
    }
};if(window["ElementField"] !== undefined){window["ElementField"].__path="../client/components/application/gui_elements/ElementField.js"};

/** ../client/components/application/gui_elements/ElementFriendsPanel.js */
/**
 * Элемент панель друзей.
 * @constructor
 */
let ElementFriendsPanel = function () {
    let self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

    /**
     * Координата X панели.
     * @type {number}
     */
    this.x = 0;

    /**
     * Координата Y панели.
     * @type {number}
     */
    this.y = 0;

    this.cardWidth = 50;
    this.cardHeight = 50;
    this.cardSpace = 10;

    this.cardsCount = 6;

    let friends = [];

    /**
     * @type GUIDom[]
     */
    let cardsDom = [];

    /**
     * @type GUIDom[]
     */
    let cardsText = [];

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        for (let i = 0; i < self.cardsCount; i++) {
            let dom;
            dom = GUI.createDom(undefined, {
                x: self.x + i * (self.cardWidth + self.cardSpace),
                y: self.y,
                width: self.cardWidth,
                height: self.cardHeight,
                border: '2px solid #715f4b', borderRadius: '8px',
                background: '#aaa'
            });
            GUI.bind(dom, GUI.EVENT_MOUSE_CLICK, function () {
                if (!friends[i]) SocNet.openInviteFriendDialog();
            });
            cardsDom.push(dom);
            cardsText.push(GUI.createElement(ElementText,
                {
                    x: self.x + i * (self.cardWidth + self.cardSpace) + 3,
                    y: self.y + 50 - 15,
                    width: self.cardWidth, height: 30 / (100 / self.cardWidth), alignCenter: true,
                    background: '#eee',
                    opacity: 0.7,
                    fontSize: 12
                }));
        }
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        cardsDom.forEach(function (card) {
            card.show();
        });
        cardsText.forEach(function (el) {
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
        cardsDom.forEach(function (card) {
            card.hide();
        });
        cardsText.forEach(function (el) {
            el.hide();
        });
    };

    /**
     * @param newData {Object}[]
     */
    this.setFriends = function (newData) {
        friends = newData;
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        if (!showed) return;

        cardsDom.forEach(function (card, i) {
            if (friends[i] && friends[i].photo50) {
                card.backgroundImage = friends[i].photo50;
                card.pointer = GUI.POINTER_ARROW;
            } else {
                card.backgroundImage = 'friend-vacancy.png';
                card.pointer = GUI.POINTER_HAND;
            }
            card.redraw();
        });

        cardsText.forEach(function (text, i) {
            if (friends[i]) {
                text.text = 'ур. ' + friends[i].nextPointId;
                text.show();
            } else {
                text.hide();
            }
            text.redraw();
        });

    };
};if(window["ElementFriendsPanel"] !== undefined){window["ElementFriendsPanel"].__path="../client/components/application/gui_elements/ElementFriendsPanel.js"};

/** ../client/components/application/gui_elements/ElementHealthTimer.js */
/**
 * Элемент: таймер.
 * @constructor
 * Инициирующие параметры:
 * x : number координата X
 * y : number координата Y
 * width : number ширина поля
 * height : number высота поля
 */
let ElementHealthTimer = function () {
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
     *
     * @type {ElementHealthIndicator}
     */
    this.healthIndicator = null;

    let elText;
    /**
     * Создадим дом и настроим его.
     */
    this.init = function () {

        elText = GUI.createElement(ElementText, {
            x: this.x, y: this.y,
            width: 100, height: 30,
            alignCenter: true, bold: true
        });
        OnIdle.register(self.updateTimer);
    };

    /**
     * Покажем текст.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        elText.show();
        self.redraw();
    };

    /**
     * Спрячем текст.
     */
    this.hide = function () {
        if (!showed) return;
        elText.hide();
        showed = false;
    };

    /**
     * Перерисуем.
     */
    this.redraw = function () {
        if (!showed) return;
        elText.setText('00:00:00');

        self.updateTimer();

        elText.redraw();
    };

    this.updateTimer = function () {
        let user;
        if (!showed) return;

        user = LogicUser.getCurrentUser();
        if (PageBlockPanel.oneHealthHide) user.fullRecoveryTime -= LogicHealth.getHealthRecoveryTime();

        if (LogicHealth.isMaxHealths(user)) {
            if (PageBlockPanel.oneHealthHide) user.fullRecoveryTime += LogicHealth.getHealthRecoveryTime();
            self.healthIndicator.redraw();
            elText.hide();

        } else {
            if (PageBlockPanel.oneHealthHide) user.fullRecoveryTime += LogicHealth.getHealthRecoveryTime();

            elText.setText(toHHMMSS(LogicHealth.getTimeLeft(user)));
            elText.show();
            elText.redraw();
            self.healthIndicator.redraw();
        }
    };

    let toHHMMSS = function (val) {
        let sec_num = parseInt(val, 10);
        /** Don't forget the second param */
        let hours = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        let seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        /** hours+':'+*/
        return minutes + ':' + seconds;
    };
};
if(window["ElementHealthTimer"] !== undefined){window["ElementHealthTimer"].__path="../client/components/application/gui_elements/ElementHealthTimer.js"};

/** ../client/components/application/gui_elements/ElementHealthsIndicator.js */
/**
 * Элемент индикатор сердец.
 * @constructor
 */
let ElementHealthIndicator = function () {
    let self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

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
     * @type {GUIDom}[]
     */
    let doms;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        let dom, width = 50, height = 50;
        doms = [];
        let step = width - 15;

        for (let i = 0; i < 5; i++) {
            dom = GUI.createDom(null, {
                x: this.x + i * step, y: this.y - 2,
                width: width, height: height, backgroundImage: 'health-heart.png'
            });
            doms.push(dom);
        }
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        doms.forEach(function (dom) {
            // dom.show();
        });
        self.redraw();
    };

    /**
     * Спрячем картинку.
     */
    this.hide = function () {
        if (!showed) return;
        showed = false;
        doms.forEach(function (dom) {
            dom.hide();
        });
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        let health, step, i, user;
        if (!showed) return;
        user = LogicUser.getCurrentUser();
        if (PageBlockPanel.oneHealthHide) user.fullRecoveryTime -= LogicHealth.getHealthRecoveryTime();
        i = 1;

        health = LogicHealth.getHealths(user);

        step = 50 - 15;
        if (health === LogicHealth.getMaxHealth() - 1) {
            step -= 10;
        }
        doms.forEach(function (dom) {
            dom.x = self.x + (i - 1) * step;
            if (i <= health) dom.show(); else dom.hide();
            dom.redraw();
            i++;
        });
        if (PageBlockPanel.oneHealthHide) user.fullRecoveryTime += LogicHealth.getHealthRecoveryTime();
    };
};if(window["ElementHealthsIndicator"] !== undefined){window["ElementHealthsIndicator"].__path="../client/components/application/gui_elements/ElementHealthsIndicator.js"};

/** ../client/components/application/gui_elements/ElementImage.js */
/**
 * Элемент картинки.
 * @constructor
 */
let ElementImage = function () {
    let self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

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
    this.width = 0;

    /**
     * Высота картинки.
     * @type {number}
     */
    this.height = 0;

    /**
     * Ссылка на картинку.
     * @type {string}
     */
    this.src = 'not-found.png';

    /**
     * Прозрачность картинки.
     * @type {null}
     */
    this.opacity = null;

    /**
     * Дом картинки.
     * @type {GUIDom}
     */
    this.dom = null;

    this.pointer = undefined;

    /** @type {GUIDom} */
    let dom = null;

    this.title = undefined;

    this.photoBorder = false;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        dom = GUI.createDom();
        dom.width = self.width;
        dom.height = self.height;
        dom.backgroundImage = self.src;
        if (this.photoBorder) {
            dom.border = '2px solid rgba(68, 62, 0, 0.7)';
            dom.borderRadius = '8px';
        }
        self.dom = dom;
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed === true) return;
        showed = true;
        dom.show();
        self.redraw();
    };

    /**
     * Спрячем картинку.
     */
    this.hide = function () {
        if (showed === false) return;
        showed = false;
        dom.hide();
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        if (!showed) return;
        dom.backgroundImage = self.src;
        if (self.opacity != null) {
            dom.opacity = self.opacity;
        }
        dom.x = self.x;
        dom.y = self.y;
        dom.title = self.title;
        dom.pointer = self.pointer;
        dom.redraw();
    };
};if(window["ElementImage"] !== undefined){window["ElementImage"].__path="../client/components/application/gui_elements/ElementImage.js"};

/** ../client/components/application/gui_elements/ElementPanelItems.js */
/**
 * Элемент панель целей.
 * @constructor
 */
let ElementPanelItems = function () {
    let self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

    /**
     * Координата X панели.
     * @type {number}
     */
    this.x = 0;

    /**
     * Координата Y панели.
     * @type {number}
     */
    this.y = 0;


    this.items = [];

    let elPanel1;
    let elPanel2;
    let elPanel3;

    let imagesEls = {};

    let countersEls = {};

    let elTitle;

    this.title = '';

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        let el;
        elPanel1 = GUI.createElement(ElementImage, {x: self.x, y: self.y, src: 'panel-goals-1.png'});
        elPanel2 = GUI.createElement(ElementImage, {x: self.x, y: self.y, src: 'panel-goals-2.png'});
        elPanel3 = GUI.createElement(ElementImage, {x: self.x, y: self.y, src: 'panel-goals-3.png'});
        /** Текст : заголовок */
        elTitle = GUI.createElement(ElementText, {x: self.x + 15, y: self.y + 7, width: 80, text: self.title, fontSize: self.fontSize});

        for (let id in DataPoints.objectImages) {
            el = GUI.createElement(ElementImage, {width: 50, height: 50, src: DataPoints.objectImages[id]});
            imagesEls[id] = el;
            el = GUI.createElement(ElementText, {width: DataPoints.BLOCK_WIDTH, alignRight: true});
            countersEls[id] = el;
        }
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        for (let i in imagesEls) {
            imagesEls[i].show();
        }
        for (let i in countersEls) {
            countersEls[i].show();
        }
        elTitle.show();
    };

    /**
     * Спрячем картинку.
     */
    this.hide = function () {
        if (!showed) return;
        showed = false;
        for (let i in imagesEls) {
            imagesEls[i].hide();
        }
        for (let i in countersEls) {
            countersEls[i].hide();
        }
        elTitle.hide();

        elPanel1.hide();
        elPanel2.hide();
        elPanel3.hide();
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        if (!showed) return;
        /** Items indication */
        for (let i in imagesEls) {
            imagesEls[i].hide();
        }
        for (let i in countersEls) {
            countersEls[i].hide();
        }

        elPanel1.hide();
        elPanel2.hide();
        elPanel3.hide();

        switch (self.items.length) {
            case 3:
                elPanel3.show();
                break;
            case 2:
                elPanel2.show();
                break;
            case 1:
                elPanel1.show();
                break;
        }

        elPanel1.redraw();
        elPanel2.redraw();
        elPanel3.redraw();
        let offsetY;
        offsetY = 0;

        self.items.forEach(function (item) {
            imagesEls[item.id].x = self.x + 15;
            imagesEls[item.id].y = self.y + 46 + offsetY;
            imagesEls[item.id].show();

            countersEls[item.id].x = self.x - 7 + DataPoints.BLOCK_WIDTH;
            countersEls[item.id].y = self.y + 46 + DataPoints.BLOCK_HEIGHT / 2 - 10 + offsetY;
            countersEls[item.id].setText(item.count);
            countersEls[item.id].show();

            offsetY += DataPoints.BLOCK_HEIGHT + 5;
        });
    };
};if(window["ElementPanelItems"] !== undefined){window["ElementPanelItems"].__path="../client/components/application/gui_elements/ElementPanelItems.js"};

/** ../client/components/application/gui_elements/ElementPoint.js */
/**
 * Элемент кнопки.
 * @constructor
 * @property x
 * @property y
 */
let ElementPoint = function () {
    let self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

    let photoSize = 24;

    /**
     * Координата X.
     * @type {number}
     */
    this.x = 0;

    /**
     * Координата Y.
     * @type {number}
     */
    this.y = 0;

    /**
     * Ссылка на картинку при наведении фокуса(мыши).
     * @type {string}
     */
    this.srcGrey = 'map-way-point-grey.png';

    /**
     * Ссылка на картинку при активации кнопки(клике).
     * @type {string}
     */
    this.srcRed = 'map-way-point-red.png';

    /**
     * Ссылка на картинку в покое(ожидании/бездействии).
     * @type {string}
     */
    this.srcYellow = 'map-way-point-yellow.png';

    this.srcStarOff = 'star-off.png';
    this.srcStarOn = 'star-on.png';

    /**
     * Будет вызываться при нажатии на кнопку.
     * @type {function}
     */
    this.onClick = null;

    /**
     * Дом картинки.
     * @type {GUIDom}
     */
    let dom = null;

    let gamers = [];

    /**
     * Первая звезда
     * @type {GUIDom}
     */
    let domStar1 = null;
    /**
     * Вторая звезда
     * @type {GUIDom}
     */
    let domStar2 = null;
    /**
     * Третья звезда
     * @type {GUIDom}
     */
    let domStar3 = null;
    /**
     * Фото друга 1
     * @type {GUIDom}
     */
    let dPhoto1 = null;
    /**
     * Фото друга 2
     * @type {GUIDom}
     */
    let dPhoto2 = null;
    /**
     * Фото друга 3
     * @type {GUIDom}
     */
    let dPhoto3 = null;

    let elText = null;

    /**
     * Опущена ли мышка.
     * @type {boolean}
     */
    let mouseStateDown = false;

    /**
     * Мышь в фокусе.
     * @type {boolean}
     */
    let mouseStateFocused = false;

    /**
     * Состояние точки точки, 1 - серый, 2 - красный, 3 - жёлтый
     * @type {number}
     */
    this.stateId = ElementPoint.STATE_CLOSE;

    this.pointId = null;

    this.pointWidth = 50;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        dom = GUI.createDom();
        dom.backgroundImage = self.srcGrey;
        dom.pointer = GUI.POINTER_HAND;
        GUI.bind(dom, GUI.EVENT_MOUSE_MOUSE_DOWN, onMouseDown, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_CLICK, onMouseClick, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_OVER, onMouseOver, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_OUT, onMouseOut, self);

        elText = GUI.createElement(ElementText, {
            width: 33, height: 20,
            fontSize: 15,
            pointer: GUI.POINTER_HAND
        }, dom);

        domStar1 = GUI.createDom();
        domStar1.backgroundImage = self.srcStarOff;

        domStar2 = GUI.createDom();
        domStar2.backgroundImage = self.srcStarOff;

        domStar3 = GUI.createDom();
        domStar3.backgroundImage = self.srcStarOff;

        dPhoto1 = GUI.createDom(null, {
            height: photoSize, width: photoSize,
            border: '1px solid #715f4b',
            borderRadius: '2px'
        });
        dPhoto2 = GUI.createDom(null, {
            height: photoSize, width: photoSize,
            border: '1px solid #715f4b',
            borderRadius: '2px'
        });
        dPhoto3 = GUI.createDom(null, {
            height: photoSize, width: photoSize,
            border: '1px solid #715f4b',
            borderRadius: '2px'
        });
    };

    /**
     * Покажем кнопку.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        self.redraw();
        dom.show();
        domStar1.show();
        domStar2.show();
        domStar3.show();
        elText.show();
    };

    /**
     * Спрячем кнопку.
     */
    this.hide = function () {
        if (!showed) return;
        showed = false;
        dom.hide();
        domStar1.hide();
        domStar2.hide();
        domStar3.hide();
        elText.hide();
        dPhoto1.hide();
        dPhoto2.hide();
        dPhoto3.hide();
    };

    /**
     * Перерисуем кнопку.
     */
    this.redraw = function () {
        if (!showed) return;
        switch (this.stateId) {
            case ElementPoint.STATE_CLOSE:
                dom.pointer = GUI.POINTER_ARROW;
                dom.backgroundImage = this.srcGrey;
                break;
            case ElementPoint.STATE_CURRENT:
                dom.pointer = GUI.POINTER_HAND;
                dom.backgroundImage = this.srcRed;
                break;
            case ElementPoint.STATE_FINISHED:
                dom.pointer = GUI.POINTER_HAND;
                dom.backgroundImage = this.srcYellow;
                break;
        }

        if (self.stateId === ElementPoint.STATE_CLOSE) {
            dom.pointer = GUI.POINTER_ARROW;
        } else {
            dom.pointer = GUI.POINTER_HAND;
        }
        dom.x = self.x;
        dom.y = self.y;

        elText.x = 9;
        elText.y = 16.5;
        elText.text = self.pointId ? self.pointId.toString() : '';

        redrawStars();
        redrawPhotos();

        dom.redraw();
        domStar1.redraw();
        domStar2.redraw();
        domStar3.redraw();
        elText.redraw();
    };

    let redrawStars = function () {
        let count, offsetX, offsetY;

        count = DataPoints.countStars(self.pointId);

        offsetX = (self.pointWidth / 2 - 25 / 2);
        offsetY = 7;

        domStar1.x = self.x - 17 + offsetX;
        domStar1.y = self.y - offsetY;
        domStar1.backgroundImage = count >= 1 ? self.srcStarOn : self.srcStarOff;

        domStar2.x = self.x + offsetX;
        domStar2.y = self.y - offsetY - 11;
        domStar2.backgroundImage = count >= 2 ? self.srcStarOn : self.srcStarOff;

        domStar3.x = self.x + 17 + offsetX;
        domStar3.y = self.y - offsetY;
        domStar3.backgroundImage = count >= 3 ? self.srcStarOn : self.srcStarOff;
    };

    let redrawPhotos = function () {
        let offsetX = (self.pointWidth / 2 - photoSize / 2) - 2;
        /** H   alf of Y */
        let offsetY, offsetCenterY;
        let friendIndex = 0;
        let doms = [dPhoto1, dPhoto2, dPhoto3];

        if (self.y > 250
            || DataMap.getNumberFromPointId(self.pointId) === 1
            || DataMap.getNumberFromPointId(self.pointId) === 18
        ) {
            offsetY = -38;
            offsetCenterY = 5;
        } else {
            offsetY = +38;
            offsetCenterY = -5;
        }

        dPhoto1.x = self.x - 18 + offsetX;
        dPhoto1.y = self.y + offsetY;

        dPhoto2.x = self.x + offsetX;
        dPhoto2.y = self.y + offsetY - offsetCenterY;

        dPhoto3.x = self.x + 19 + offsetX;
        dPhoto3.y = self.y + offsetY;

        gamers.forEach(function (user) {

            if (!user) doms[friendIndex].hide();
            else {
                if (user && user.photo50
                    ////  && user.nextPointId === self.pointId
                ) {
                    doms[friendIndex].backgroundImage = user.photo50;
                    doms[friendIndex].show();
                    doms[friendIndex].redraw();
                } else {
                    doms[friendIndex].hide();
                }
            }
            friendIndex++;
        });
    };

    /**
     * Обработка события фокуса мыши.
     */
    let onMouseOver = function () {
        if (!self.enabled) return;
        mouseStateFocused = true;
        self.redraw();
    };

    /**
     * Обработчик события на опускание мыши.
     */
    let onMouseDown = function () {
        if (!self.enabled) return;
        mouseStateDown = true;
        self.redraw();
    };

    /**
     * Обработка события выхода фокуса мыши.
     */
    let onMouseOut = function () {
        if (!self.enabled) return;
        mouseStateFocused = false;
        self.redraw();
    };

    /**
     * Обработка события на клик.
     * @param mouseEvent {MouseEvent}
     * @param dom {Element}
     */
    let onMouseClick = function (mouseEvent, dom) {
        /** Да, тут мы останавливаем дальнейшие течение клика. */
        mouseEvent.stopPropagation();
        if (self.stateId === ElementPoint.STATE_CLOSE) return;
        mouseStateDown = false;
        mouseStateFocused = false;
        self.redraw();
        return self.onClick.call(null, mouseEvent, dom, this);
    };

    /**
     * Игроки на точке это друзья
     * @param newData
     */
    this.setGamers = function (newData) {
        newData = newData.filter(function (user) {
            return user.nextPointId === self.pointId;
        });
        gamers = newData.slice(0, 3);
        /** Центрируем если игрок только один */
        if (gamers.length === 1) gamers.unshift(null);
        while (gamers.length < 3) gamers.push(null);
    }
};

ElementPoint.STATE_CLOSE = 1;
ElementPoint.STATE_CURRENT = 2;
ElementPoint.STATE_FINISHED = 3;
if(window["ElementPoint"] !== undefined){window["ElementPoint"].__path="../client/components/application/gui_elements/ElementPoint.js"};

/** ../client/components/application/gui_elements/ElementSprite.js */
/**
 * Element Sprite.
 * @constructor
 */
let ElementSprite = function () {
    let self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

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
    this.width = 0;

    /**
     * Высота картинки.
     * @type {number}
     */
    this.height = 0;

    /**
     * Ссылка на картинку.
     * @type {string}
     */
    this.src = 'not-found.png';

    /**
     * Прозрачность картинки.
     * @type {null}
     */
    this.opacity = null;

    /**
     * Дом картинки.
     * @type {GUIDom}
     */
    this.dom = null;

    this.pointer = undefined;

    let dom;

    this.title = undefined;

    this.animPlay = function () {

        dom.animPlayed = true;
    };

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        dom = GUI.createDom(undefined, self.domInitParams);
        dom.width = self.width;
        dom.height = self.height;
        dom.x = self.x;
        dom.y = self.y;
        dom.backgroundImage = self.src;
        self.dom = dom;
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed === true) return;
        showed = true;
        dom.show();
        self.redraw();
    };

    /**
     * Спрячем картинку.
     */
    this.hide = function () {
        if (showed === false) return;
        showed = false;
        dom.hide();
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        if (!showed) return;
        if (self.opacity != null) {
            dom.opacity = self.opacity;
        }
        dom.title = self.title;
        dom.pointer = self.pointer;
        dom.redraw();
    };
};
if(window["ElementSprite"] !== undefined){window["ElementSprite"].__path="../client/components/application/gui_elements/ElementSprite.js"};

/** ../client/components/application/gui_elements/ElementStuffButton.js */
/**
 * Элемент инструмент(магия) молоток там и т.д..
 * @constructor
 * @property x
 * @property y
 * @property srcRest
 * @property srcHover
 * @property srcActive
 *
 */
let ElementStuffButton = function () {
    let self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

    /**
     * Координата X кнопки.
     * @type {number}
     */
    this.x = 0;

    /**
     * Координата Y кнопки.
     * @type {number}
     */
    this.y = 0;

    /**
     * Ширина кнопки.
     * @type {number}
     */
    this.width = 0;

    /**
     * Высота кноки.
     * @type {number}
     */
    this.height = 0;

    /**
     * Ссылка на картинку при наведении фокуса(мыши).
     * @type {string}
     */
    this.srcHover = '/path/to/image/hover.png';

    /**
     * Ссылка на картинку при активации кнопки(клике).
     * @type {string}
     */
    this.srcActive = '/path/to/image/active.png';

    /**
     * Ссылка на картинку в покое(ожидании/бездействии).
     * @type {string}
     */
    this.srcRest = 'path/to/image/rest1.png';

    /**
     * Будет вызываться при нажатии на кнопку.
     * @type {function}
     */
    this.onClick = null;

    /**
     * Подсказка кнопки.
     * @type {String}
     */
    this.title = null;

    /**
     * Активна ли кнопка.
     * @type {boolean}
     */
    this.enabled = true;

    /**
     * Дом картинки.
     * @type {GUIDom}
     */
    let dom = null;

    let counter = null;

    /**
     * Опущена ли мышка.
     * @type {boolean}
     */
    let mouseStateDown = false;

    /**
     * Мышь в фокусе.
     * @type {boolean}
     */
    let mouseStateFocused = false;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        dom = GUI.createDom();
        dom.width = self.width;
        dom.height = self.height;
        dom.backgroundImage = self.srcRest;
        dom.pointer = GUI.POINTER_HAND;
        GUI.bind(dom, GUI.EVENT_MOUSE_MOUSE_DOWN, onMouseDown, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_CLICK, onMouseClick, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_OVER, onMouseOver, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_OUT, onMouseOut, self);

        counter = GUI.createElement(ElementText, {});
    };

    /**
     * Покажем кнопку.
     */
    this.show = function () {
        if (showed == true) return;
        showed = true;
        dom.show();
        counter.show();
        self.redraw();
    };

    /**
     * Спрячем кнопку.
     */
    this.hide = function () {
        if (showed == false) return;
        showed = false;
        dom.hide();
        counter.hide();
    };

    /**
     * Перерисуем кнопку.
     */
    this.redraw = function () {
        let src;
        if (!showed) return;
        src = self.srcRest;
        if (mouseStateFocused) src = self.srcHover;
        if (mouseStateFocused && mouseStateDown) src = self.srcActive;
        if (!mouseStateFocused && mouseStateDown) src = self.srcRest;
        dom.backgroundImage = src;
        if (self.title) dom.title = self.title;
        if (self.enabled) {
            dom.pointer = GUI.POINTER_HAND;
            dom.opacity = 1.0;
        } else {
            dom.pointer = GUI.POINTER_ARROW;
            dom.opacity = 0.5;
        }
        dom.x = self.x;
        dom.y = self.y;
        counter.x = self.x + 70;
        counter.y = self.y + 40;
        counter.setText(LogicStuff.getStuff(self.fieldName));
        dom.redraw();
        counter.redraw();
    };

    /**
     * Обработка события фокуса мыши.
     */
    let onMouseOver = function () {
        if (!self.enabled) return;
        mouseStateFocused = true;
        self.redraw();
    };

    /**
     * Обработчик события на опускание мыши.
     */
    let onMouseDown = function () {
        if (!self.enabled) return;
        mouseStateDown = true;
        self.redraw();
    };

    /**
     * Обработка события выхода фокуса мыши.
     */
    let onMouseOut = function () {
        if (!self.enabled) return;
        mouseStateFocused = false;
        self.redraw();
    };

    /**
     * Обработка события на клик.
     * @param mouseEvent {MouseEvent}
     * @param dom {Element}
     */
    let onMouseClick = function (mouseEvent, dom) {
        /* Да, тут мы останавливаем дальнейшие течение клика. */
        mouseEvent.stopPropagation();
        if (!self.enabled) return;
        mouseStateDown = false;
        mouseStateFocused = false;
        self.redraw();
        return self.onClick.call(null, mouseEvent, dom);
    };
};if(window["ElementStuffButton"] !== undefined){window["ElementStuffButton"].__path="../client/components/application/gui_elements/ElementStuffButton.js"};

/** ../client/components/application/gui_elements/ElementText.js */
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
        /* Да, тут мы останавливаем дальнейшие течение клика. */
        mouseEvent.stopPropagation();
        return self.onClick.call(this, mouseEvent, dom);
    };
};
if(window["ElementText"] !== undefined){window["ElementText"].__path="../client/components/application/gui_elements/ElementText.js"};

/** ../client/components/application/gui_elements/ElementUserScorePhoto.js */
/**
 * Элемент фото пользователя и очки
 * @constructor
 */
let ElementUserScorePhoto = function () {
    let self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

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

    this.user = null;
    this.score = null;

    let elPhoto;
    let elTextScore;
    let elTextName;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        elTextName = GUI.createElement(ElementText, {
            x: self.x - 25, y: self.y - 22, width: 100, height: 50,
            fontSize: 12, alignCenter: true
        });
        elPhoto = GUI.createElement(ElementImage, {
            x: self.x, y: self.y, width: 50, height: 50,
            photoBorder: true
        });
        elTextScore = GUI.createElement(ElementText, {
            x: self.x - 25, y: self.y + 61, width: 100, height: 50,
            fontSize: 12, alignCenter: true
        });
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed === true) return;
        showed = true;
        elTextName.show();
        elPhoto.show();
        elTextScore.show();
        self.redraw();
    };

    /**
     * Спрячем картинку.
     */
    this.hide = function () {
        if (showed === false) return;
        showed = false;
        elTextName.hide();
        elPhoto.hide();
        elTextScore.hide();
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        if (!showed) return;
        if (!this.user || !this.user.id) return;
        elTextName.text = this.user.firstName;
        elPhoto.src = this.user.photo50;
        elTextScore.text = this.score.toString();
        elTextName.redraw();
        elPhoto.redraw();
        elTextScore.redraw();
    };
};if(window["ElementUserScorePhoto"] !== undefined){window["ElementUserScorePhoto"].__path="../client/components/application/gui_elements/ElementUserScorePhoto.js"};

/** ../client/components/application/logic/LogicField.js */
let LogicField = function () {
    let self = this;

    let cells = null;

    /**
     * Список всех камней
     * @type {number[]}
     */
    let gems = [
        DataObjects.OBJECT_RED,
        DataObjects.OBJECT_GREEN,
        DataObjects.OBJECT_BLUE,
        DataObjects.OBJECT_YELLOW,
        DataObjects.OBJECT_PURPLE,

        DataObjects.OBJECT_SAND,
    ];

    /**
     * Список случайных камней
     * @type {number[]}
     */
    let randomGems = [
        DataObjects.OBJECT_RED,
        DataObjects.OBJECT_GREEN,
        DataObjects.OBJECT_BLUE,
        DataObjects.OBJECT_YELLOW,
        DataObjects.OBJECT_PURPLE,
    ];

    /**
     * Объекты, способные падать вниз.
     * @type {number[]}
     */
    let fallObjects = [
        DataObjects.OBJECT_RED,
        DataObjects.OBJECT_GREEN,
        DataObjects.OBJECT_BLUE,
        DataObjects.OBJECT_YELLOW,
        DataObjects.OBJECT_PURPLE,

        DataObjects.OBJECT_SAND,

        DataObjects.OBJECT_POLY_COLOR,
        DataObjects.OBJECT_BARREL,
        DataObjects.OBJECT_SPIDER_ALPHA,
    ];

    this.getCell = function (p) {
        if (self.isOut(p)) return false;
        return cells[p.x][p.y];
    };

    this.getObject = function (p) {
        return this.getCell(p).object;
    };

    this.isGem = function (p) {
        if (!cells[p.x] || !cells[p.x][p.y]) return false;
        return cells[p.x][p.y].object.isGem;
    };

    this.isNotGem = function (p) {
        return !self.isGem(p);
    };

    this.isHole = function (p) {
        if (!cells[p.x] || !cells[p.x][p.y]) return false;
        return cells[p.x][p.y].object.isHole;
    };

    this.isFallObject = function (p) {
        if (self.isOut(p)) return false;
        return fallObjects.indexOf(cells[p.x][p.y].object.objectId) !== -1;
    };

    this.mayFall = function (x, y) {
        if (self.isOut({x: x, y: y})) return false;
        if (!LogicField.getCell({x: x, y: y}).object.isCanMoved) return false;

        return LogicField.isFallObject({x: x, y: y}) &&
            getHole({x: x, y: y})
    };

    let getHole = function (p) {
        for (let y = 0, cell, object; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            p.y++;
            cell = self.getCell(p);
            object = cell && cell.object;
            if (cell && cell.isVisible && !object.isHole && !object.withBox) {
                break;
            }
            if (cell && cell.isVisible && object.isHole) {
                return p;
            }
        }
        return false;
    };

    this.getRandomGemId = function () {
        return randomGems[Math.floor(Math.random() * randomGems.length)];
    };

    this.isVisible = function (p) {
        if (!cells[p.x] || !cells[p.x][p.y]) return false;
        return cells[p.x][p.y].isVisible;
    };

    this.countTurns = function () {
        let allLines = [], lines, objectA, objectB, cellA, cellB;

        let checkGems = function (a, b) {
            cellA = self.getCell(a);
            cellB = self.getCell(b);
            if (cellA && cellB) {
                objectA = cellA.object;
                objectB = cellB.object;
                if (cellA.isVisible && objectA.isCanMoved && cellB.isVisible && objectB.isCanMoved) {
                    /** 1 - Меняем a ⇔ b */
                    self.exchangeObjects(a, b);
                    /** 2 - Считаем линии */
                    lines = self.findLines();
                    if (lines.length) allLines.push({a: a, b: b, lines: lines});
                    /** 3 - Возвращаем a ⇔ b */
                    self.exchangeObjects(a, b);
                }
            }
        };
        this.eachCell(function (x, y) {
            checkGems({x: x, y: y}, {x: x + 1, y: y});
            checkGems({x: x, y: y}, {x: x, y: y + 1});
        });

        return allLines;
    };

    this.exchangeObjects = function (a, b, onlyObjectId) {
        let tmp;
        if (self.isOut(a) || self.isOut(b)) return false;

        if (onlyObjectId) {
            tmp = cells[b.x][b.y].object.objectId;
            cells[b.x][b.y].object.objectId = cells[a.x][a.y].object.objectId;
            cells[a.x][a.y].object.objectId = tmp;
        } else {
            tmp = cells[b.x][b.y].object;
            cells[b.x][b.y].object = cells[a.x][a.y].object;
            cells[a.x][a.y].object = tmp;
        }
        return true;
    };

    this.isOut = function (p) {
        return p.x < 0 ||
            p.x >= DataPoints.FIELD_MAX_WIDTH ||
            p.y < 0 ||
            p.y > DataPoints.FIELD_MAX_HEIGHT;
    };

    /**
     * Камни рядом, значит они прилегают друг к другу.
     * @param a
     * @param b
     * @returns {boolean}
     */
    this.isNear = function (a, b) {
        if (Math.abs(a.x - b.x) === 1
            && a.y - b.y === 0
        ) return true;
        if (a.x - b.x === 0
            && Math.abs(a.y - b.y) === 1
        ) return true;
        return false;
    };

    this.findLines = function () {
        let line, lines;
        lines = [];
        for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                if (this.lineCrossing(lines, x, y)) continue;

                line = this.findLine(x, y, DataObjects.WITH_LIGHTNING_VERTICAL);
                if (line) lines.push(line);

                line = this.findLine(x, y, DataObjects.WITH_LIGHTNING_HORIZONTAL);
                if (line) lines.push(line);
            }
        }
        return lines;
    };

    this.findLine = function (x, y, orientation) {
        let gemId, line, cell;
        cell = self.getCell({x: x, y: y});
        gemId = cell.object.objectId;
        if (!cell.isVisible || !cell.object.isLineForming) return false;

        line = {
            orientation: orientation,
            coords: [],
            gemId: gemId
        };
        let checkCell = function (p) {
            cell = self.getCell(p);
            if (cell && cell.isVisible &&
                cell.object.isLineForming &&
                cell.object.objectId === gemId)
                return line.coords.push(p);
            return false;
        };
        if (orientation === DataObjects.WITH_LIGHTNING_HORIZONTAL) {
            for (let offset = 0; offset < 5; offset++) {
                if (!checkCell({x: x + offset, y: y})) break;
            }
        } else {
            for (let offset = 0; offset < 5; offset++) {
                if (!checkCell({x: x, y: y + offset})) break;
            }
        }
        if (line.coords.length >= 3)
            return line;
        else
            return false;
    };

//@todo refactring
    this.lineCrossing = function (lines, x, y) {
        for (let i in lines) {
            for (let n in lines[i].coords) {
                if (x === lines[i].coords[n].x &&
                    y === lines[i].coords[n].y) {
                    return true;
                }
            }
        }
        return false;
    };

    this.eachCell = function (callback) {
        for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                callback(x, y,
                    cells && cells[x][y],
                    cells && cells[x][y].object
                );
            }
        }
    };

    this.setObject = function (p, id, lightningId) {
        let object;
        object = cells[p.x][p.y].object;
        object.objectId = id;
        object.isHole = (id === DataObjects.OBJECT_HOLE);
        object.isGem = gems.indexOf(id) !== -1;
        object.lightningId = lightningId;

        object.isPolyColor = (id === DataObjects.OBJECT_POLY_COLOR);
        object.isBarrel = (id === DataObjects.OBJECT_BARREL);
        object.isBlock = (id === DataObjects.OBJECT_BLOCK);
        object.isSpiderAlpha = (id === DataObjects.OBJECT_SPIDER_ALPHA);

        self.updateSomeFlags(object);
    };

    this.updateSomeFlags = function (object) {
        object.withChain = object.withChainA || object.withChainB;
        object.isCanMoved = (object.isGem || object.isBarrel || object.isPolyColor)
            && !object.withBox && !object.withChain;
        object.isLineForming = (object.isGem) && !object.withBox;
    };

    this.getGemId = function (p) {
        return cells[p.x] && cells[p.x][p.y].object.objectId;
    };

    this.setLayers = function (mask, objects, specials) {
        let specIds, lightningId, objectId;
        cells = [];
        console.log(objects);
        for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
            cells[x] = [];
            for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
                specIds = getSpecIds({x: x, y: y}, specials);
                lightningId = false;
                if (specIds.indexOf(DataObjects.WITH_LIGHTNING_HORIZONTAL) !== -1) lightningId = DataObjects.WITH_LIGHTNING_HORIZONTAL;
                if (specIds.indexOf(DataObjects.WITH_LIGHTNING_VERTICAL) !== -1) lightningId = DataObjects.WITH_LIGHTNING_VERTICAL;
                if (specIds.indexOf(DataObjects.WITH_LIGHTNING_CROSS) !== -1) lightningId = DataObjects.WITH_LIGHTNING_CROSS;

                objectId = objects[x] && objects[x][y];
                if (specIds.indexOf(DataObjects.OBJECT_BARREL) !== -1) objectId = DataObjects.OBJECT_BARREL;
                if (specIds.indexOf(DataObjects.OBJECT_SPIDER_ALPHA) !== -1) objectId = DataObjects.OBJECT_SPIDER_ALPHA;
                if (specIds.indexOf(DataObjects.OBJECT_SAND) !== -1) objectId = DataObjects.OBJECT_SAND;
                if (specIds.indexOf(DataObjects.OBJECT_BLOCK) !== -1) objectId = DataObjects.OBJECT_BLOCK;
                gems.forEach(function (gemId) {
                    if (specIds.indexOf(gemId) !== -1) {
                        objectId = gemId;
                        console.log(gemId);
                    }
                });
                if (!objectId) objectId = Field.getRandomGemId();

                let cell, object;
                object = {};
                cell = {object: object, x: x, y: y};
                cells[x][y] = cell;
                cell.isVisible = mask[x] && mask[x][y] && mask[x][y] === DataObjects.CELL_VISIBLE;
                cell.isEmitter = specIds.indexOf(DataObjects.IS_EMITTER) !== -1;

                if (objectId === DataObjects.OBJECT_SPIDER_ALPHA) object.health = 3;

                cell.withGold = specIds.indexOf(DataObjects.OBJECT_GOLD) !== -1;
                cell.withTile = specIds.indexOf(DataObjects.OBJECT_TILE) !== -1;

                object.withBox = specIds.indexOf(DataObjects.OBJECT_BOX) !== -1;
                object.withChainA = specIds.indexOf(DataObjects.OBJECT_CHAIN_A) !== -1;
                object.withChainB = specIds.indexOf(DataObjects.OBJECT_CHAIN_B) !== -1;
                object.withSpiderBeta = specIds.indexOf(DataObjects.OBJECT_SPIDER_BETA) !== -1;
                object.withSpiderGamma = specIds.indexOf(DataObjects.OBJECT_SPIDER_GAMMA) !== -1;

                self.setObject({x: x, y: y}, objectId, lightningId)
            }
        }
        console.log('find lines', Field.findLines().length);
        if (Field.findLines().length) {
            Field.shuffle(true);
        }
    };

    this.eachNears = function (p, callback) {
        let toSearch = [
            {x: p.x + 1, y: p.y},
            {x: p.x - 1, y: p.y},
            {x: p.x, y: p.y + 1},
            {x: p.x, y: p.y - 1},
        ];
        toSearch.forEach(function (p) {
            if (!self.isOut(p) && self.isVisible(p)) {
                callback(p, self.getCell(p));
            }
        });
    };

    let getSpecIds = function (p, specials) {
        if (!specials[p.x]) return [];
        if (!specials[p.x][p.y]) return [];
        return specials[p.x][p.y];
    };

    this.isLinePossiblyDestroy = function (pA, pB) {
        let lines, mayLineDestroy;
        LogicField.exchangeObjects(pA, pB);
        lines = LogicField.findLines();
        mayLineDestroy = LogicField.lineCrossing(lines, pA.x, pA.y) | LogicField.lineCrossing(lines, pB.x, pB.y);
        LogicField.exchangeObjects(pA, pB);
        return mayLineDestroy;
    };

    /**
     * @param p
     * @param oreintation
     * @param callback
     */
    this.eachVisibleLine = function (p, oreintation, callback) {
        let list = [];
        let isVisbleCall = function (p, cell) {
            cell = self.getCell(p);
            if (cell.isVisible) list.push({p: p, cell: cell});
        };
        switch (oreintation) {
            case DataObjects.WITH_LIGHTNING_HORIZONTAL:
                for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) isVisbleCall({x: x, y: p.y});
                break;
            case DataObjects.WITH_LIGHTNING_VERTICAL:
                for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) isVisbleCall({x: p.x, y: y});
                break;
            default:
                Logs.log("Error :" + arguments.callee.name, Logs.LEVEL_ERROR);
                break;
        }
        list.sort(function (a, b) {
            if (a.cell.object.isCanMoved && !b.cell.object.isCanMoved) return 1;
            if (!a.cell.object.isCanMoved && b.cell.object.isCanMoved) return -1;
            return 0;
        });
        list.forEach(function (i) {
            callback(i.p, i.cell);
        })
    };

    this.getVisibleLength = function (p, orientation) {
        let leftX = Infinity, rightX = -Infinity;
        /** Получить длину текущей линии */
        switch (orientation) {
            case DataObjects.WITH_LIGHTNING_HORIZONTAL:
                for (let x = 0; x < DataPoints.FIELD_MAX_WIDTH; x++) {
                    if (Field.isVisible({x: x, y: p.y})) {
                        leftX = Math.min(leftX, x);
                        rightX = Math.max(rightX, x);
                    }
                }
                return {lower: leftX, higher: rightX, length: rightX - leftX + 1};
            case DataObjects.WITH_LIGHTNING_VERTICAL:
                for (let y = 0; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
                    if (Field.isVisible({x: p.x, y: y})) {
                        leftX = Math.min(leftX, y);
                        rightX = Math.max(rightX, y);
                    }
                }
                return {lower: leftX, higher: rightX, length: rightX - leftX + 1};
        }
    };

    let shuffleCounter = 0;

    this.shuffle = function (beforePlay) {
        shuffleCounter++;
        let funcShuffleField = function () {
            let p1, p2, cell2;
            Field.eachCell(function (x1, y1, cell1) {
                p1 = {x: x1, y: y1};
                p2 = {
                    x: Math.floor(Math.random() * DataPoints.FIELD_MAX_WIDTH),
                    y: Math.floor(Math.random() * DataPoints.FIELD_MAX_HEIGHT)
                };
                cell2 = Field.getCell(p2);
                let o1, o2;
                o1 = cell1.object;
                o2 = cell2.object;
                if (cell1.isVisible && o1.isCanMoved && !o1.isBarrel && o1.objectId !== DataObjects.OBJECT_SAND &&
                    cell2.isVisible && o2.isCanMoved && !o2.isBarrel && o2.objectId !== DataObjects.OBJECT_SAND) {
                    Field.exchangeObjects(p1, p2, beforePlay)
                }
            });
        };
        funcShuffleField();
        /** Еще попытки, если не получилось */
        let i;
        i = 0;
        while (i++ < 50) {
            if (Field.findLines().length === 0) break;
            funcShuffleField();
        }

        i = 0;
        if (Field.findLines().length > 0 && beforePlay && shuffleCounter++ < 1000) {
            while (i++ < 50) {
                Field.eachCell(function (x, y, cell) {
                    if (cell.isVisible && cell.object.isGem &&
                        cell.object.objectId !== DataObjects.OBJECT_SAND) {
                        cell.object.objectId = self.getRandomGemId();
                    }
                });
                if (Field.findLines().length === 0) break;
            }
            self.shuffle(true);
            return;
        }
        shuffleCounter = 0;
    }
};

/** @type {LogicField} */
LogicField = new LogicField;
/** Aliases */
Field = LogicField;if(window["LogicField"] !== undefined){window["LogicField"].__path="../client/components/application/logic/LogicField.js"};

/** components/application/logic/LogicHealth.js */
let LogicHealth = function () {

    let getTime = function () {
        return typeof LogicTimeClient !== 'undefined' ?
            LogicTimeClient.getTime() :
            LogicTimeServer.getTime();
    };

    this.getMaxHealth = function () {
        return DataCross.user.maxHealth;
    };

    this.getHealthRecoveryTime = function () {
        return DataCross.user.healthRecoveryTime;
    };

    this.getHealths = function (user) {
        let fullRecoveryTime, now, recoveryTime, timeLeft;
        fullRecoveryTime = user.fullRecoveryTime;
        now = getTime();
        recoveryTime = LogicHealth.getHealthRecoveryTime();

        timeLeft = fullRecoveryTime - now;

        if (timeLeft <= 0) return this.getMaxHealth();

        return Math.max(0, this.getMaxHealth() - Math.ceil(timeLeft / recoveryTime));
    };

    this.isMaxHealths = function (user) {
        return this.getHealths(user) === this.getMaxHealth();
    };

    this.setMaxHealth = function (user) {
        user.fullRecoveryTime = getTime();
    };

    this.decrementHealth = function (user, quantity) {
        if (!quantity) quantity = 1;
        /** Сброс таймера, если максимум жизней */
        if (LogicHealth.isMaxHealths(user)) {
            LogicHealth.setMaxHealth(user);
        }
        if (LogicHealth.getHealths(user) === 0) {
            LogicHealth.zeroLife(user);
        }
        user.fullRecoveryTime += this.getHealthRecoveryTime() * quantity;
    };

    this.getTimeLeft = function (user) {
        let left;
        if (this.isMaxHealths(user)) return 0;
        left = user.fullRecoveryTime - getTime();
        return left - Math.floor(left / this.getHealthRecoveryTime()) * this.getHealthRecoveryTime();
    };

    this.zeroLife = function (user) {
        user.fullRecoveryTime = getTime() + this.getHealthRecoveryTime() * this.getMaxHealth();
    }
};

/** @type {LogicHealth} */
LogicHealth = new LogicHealth();


/** Для кросс-сайдных компонент */
if (CONST_IS_SERVER_SIDE) {
    global['LogicHealth'] = LogicHealth;
}if(window["LogicHealth"] !== undefined){window["LogicHealth"].__path="components/application/logic/LogicHealth.js"};

/** ../client/components/application/logic/LogicMain.js */
let LogicMain = function () {

    this.main = function () {
        /**@todo show preloader */
        Logs.init(function () {
        });

        DataPoints.init();

        /** init some components */
        SocNet.init();

        /** WebSocket Client */
        webSocketClient = new WebSocketClient();
        webSocketClient.init(function () {
        });

        //@todo need be automate...
        /** ApiRouter */

        ApiRouter.setMap({
            CAPIUser: CAPIUser,
            CAPITimeServer: CAPITimeServer,
            CAPIMap: CAPIMap,
            CAPIStuff: CAPIStuff
        });

        /** Link ApiRouter and WebSocketClient */
        ApiRouter.sendData = webSocketClient.sendData;
        webSocketClient.onData = ApiRouter.onData;
        webSocketClient.onConnect = this.onConnect;
        webSocketClient.onDisconnect = ApiRouter.onDisconnect;

        /** Running */
        webSocketClient.run();

        OnIdle.init(function () {
        });
    };

    /**
     * After connect
     * @param connectionId
     */
    this.onConnect = function (connectionId) {
        ApiRouter.onConnect(connectionId);
        LogicUser.authorize();
    };

    this.onAuthorizeSuccess = function () {
        /** Установить текущую карту игрока */
        DataMap.setCurrentMapId(
            DataMap.getMapIdFromPointId(
                LogicUser.getCurrentUser().nextPointId
            )
        );

        SAPITimeServer.sendMeTime();
        LogicStuff.loadStuff();


        /** Первый показ игры: Главная страница */
        PageController.showPage(PageMain);

        /** Проверка визарада начала игры */
        LogicWizard.onAuthorizeSuccess();
    };
};
if(window["LogicMain"] !== undefined){window["LogicMain"].__path="../client/components/application/logic/LogicMain.js"};

/** ../client/components/application/logic/LogicMap.js */
let LogicMap = function () {
    let self = this;

    this.onArrowPrevClick = function () {
        DataMap.setPrevMap();
        PageController.redraw();
    };

    this.onArrowNextClick = function () {
        DataMap.setNextMap();
        PageController.redraw();
    };
};

/**
 * Статичный класс.
 * @type {LogicMap}
 */
LogicMap = new LogicMap();
if(window["LogicMap"] !== undefined){window["LogicMap"].__path="../client/components/application/logic/LogicMap.js"};

/** ../client/components/application/logic/LogicStuff.js */
let LogicStuff = function () {
    let self = this;

    let stuff = {};

    this.STUFF_HUMMER = 1;
    this.STUFF_LIGHTNING = 2;
    this.STUFF_SHUFFLE = 3;

    this.loadStuff = function () {
        SAPIStuff.sendMeStuff();
    };

    this.updateStuff = function (data) {
        stuff = data;
    };

    this.getStuff = function (fieldName) {
        if (fieldName) {
            if (stuff[fieldName] === undefined) {
                Logs.log("No Stuff:", Logs.LEVEL_FATAL_ERROR, [fieldName, stuff]);
            }
            return stuff[fieldName];
        }
        return stuff;
    };

    this.usedHummer = function () {
        stuff['hummerQty']--;
    };

    this.usedShuffle = function () {
        stuff['shuffleQty']--;
    };

    this.usedlightning = function () {
        stuff['lightningQty']--;
    };

    this.usedGold = function (quantity) {
        stuff['goldQty'] -= quantity;
    };

    this.giveAHummer = function (quantity) {
        stuff['hummerQty'] += quantity;
    };

    this.giveAShuffle = function (quantity) {
        stuff['shuffleQty'] += quantity;
    };

    this.giveALighnting = function (quantity) {
        stuff['lightningQty'] += quantity;
    };

    this.giveAGold = function (quantity) {
        stuff['goldQty'] += quantity;
    };

    this.giveAHealth = function (quantity) {
        let user;
        user = LogicUser.getCurrentUser();
        LogicHealth.decrementHealth(user, -quantity);
    };
};

/**
 * Статичный класс.
 * @type {LogicStuff}
 */
LogicStuff = new LogicStuff();
if(window["LogicStuff"] !== undefined){window["LogicStuff"].__path="../client/components/application/logic/LogicStuff.js"};

/** ../client/components/application/logic/LogicTimeClient.js */
let LogicTimeClient = function () {

    /**
     * Server time
     * @type {number}
     */
    let serverTime = 0;
    /**
     * Time of receipt
     * @type {number}
     */
    let gotTime = 0;

    /**
     * Server vs client diff time
     * @type {number}
     */
    let timeDiff = 0;

    this.setServerTime = function (timestamp) {
        serverTime = timestamp;
        gotTime = (new Date).getTime();
        timeDiff = serverTime - gotTime;
        Logs.log("Time sync:" + timestamp + ' gotTime:' + gotTime + ' timeDiff:' + timeDiff, Logs.LEVEL_DETAIL);
    };

    this.getTime = function () {
        return Math.floor(this.getMicroTime() / 1000);
    };

    this.getMicroTime = function () {
        return new Date().getTime() + timeDiff;
    };

    this.convertToClient = function (timestamp) {
        let newTimestamp;
        newTimestamp = timestamp * 1000 - timeDiff;
        return newTimestamp / 1000;
    };
};

LogicTimeClient = new LogicTimeClient();if(window["LogicTimeClient"] !== undefined){window["LogicTimeClient"].__path="../client/components/application/logic/LogicTimeClient.js"};

/** ../client/components/application/logic/LogicUser.js */
let LogicUser = function () {
    let self = this;

    /**
     * Id пользователя под которым мы сидим.
     */
    let authorizedUserId = null;

    /**
     * Тут мы будем хранить данные пользователей.
     * @type {Array}
     */
    let users = [];

    let friendIds = null;

    /**
     * Авторизация пользователя.
     */
    this.authorize = function () {
        let socNetUserId, authParams;
        socNetUserId = SocNet.getSocNetUserId();
        authParams = SocNet.getAuthParams();
        switch (SocNet.getType()) {
            case SocNet.TYPE_VK:
                SAPIUser.authorizeByVK(socNetUserId, authParams);
                break;
            case SocNet.TYPE_STANDALONE:
                SAPIUser.authorizeByStandalone(socNetUserId, authParams);
                break;
            default:
                Logs.log("Wrong soc net type", Logs.LEVEL_FATAL_ERROR);
                break;
        }
    };

    /**
     * Метод для обработки ответа от сервера об успешной авторизации.
     * @param user
     */
    this.authorizeSuccess = function (userId) {
        authorizedUserId = userId;
        pendingIds = {};
        LogicMain.onAuthorizeSuccess();
    };

    /**
     * Авторизован ли текущий юзер.
     * @returns {Boolean}
     */
    this.isAuthorized = function () {
        return !!authorizedUserId;
    };

    /**
     * Возвращает текущего(авторизованного пользователя).
     * @returns {null|Object}
     */
    this.getCurrentUser = function () {
        return this.getById(authorizedUserId);
    };

    /**
     * Получить данные пользователя по его id.
     * @param id
     * @returns {null|Object}
     */
    this.getById = function (id) {
        if (users[id]) {
            return users[id];
        } else {
            self.loadUserInfoById(id);
            /** Некоторая заглушка */
            return getDummy();
        }
    };

    this.getList = function (ids) {
        let out, toLoadIds;
        out = [];
        if (!ids || !ids.length) return out;
        toLoadIds = [];
        ids.forEach(function (id) {
            if (!users[id] && !pendingIds[id]) {
                pendingIds[id] = true;
                users[id] = false;
                toLoadIds.push(id);
            }
        });
        if (toLoadIds.length) {
            SAPIUser.sendMeUserListInfo(toLoadIds);
        }

        ids.forEach(function (id) {
            if (self.getById(id).photo50) {
                out.push(self.getById(id));
            }
        });
        return out;
    };

    let getDummy = function () {
        return {
            id: null,
            online: false
        };
    };

    /**
     * Запомним, чьи загрузки мы уже ждём, что бы не повторять лишних запросов.
     * @type {Object}
     */
    let pendingIds = {};

    /**
     * Загрузить данные о пользователе.
     * @param userId {int}
     */
    this.loadUserInfoById = function (userId) {
        if (authorizedUserId === null) {
            return;
        }
        if (!pendingIds[userId]) {
            pendingIds[userId] = true;
            SAPIUser.sendMeUserInfo(userId);
        }
    };

    /**
     * Обновить данные о пользователе.
     * Обновит\создаст, только переданные поля!
     * При создании, создаются дефолтовые поля: firstName: '', lastName: '',
     * @param user {Object}
     */
    this.updateUserInfo = function (user) {
        pendingIds[user.id] = false;
        if (!users[user.id]) {
            users[user.id] = getDummy();
        }
        for (let field in user) {
            users[user.id][field] = user[field];
        }
        if (!users[user.id].photo50) {
            SocNet.getUserInfo(user.socNetUserId, function (data) {
                users[user.id].photo50 = data[0].photo_50;
                users[user.id].photo100 = data[0].photo_100;
                users[user.id].firstName = data[0].first_name;
                users[user.id].lastName = data[0].last_name;
                PageController.redraw();
            });
        }
        PageController.redraw();
    };

    this.setFriendIds = function (ids) {
        friendIds = ids;
        PageController.redraw();
    };

    let friendIdsLoading = false;

    this.getFriendIds = function (limit) {
        //@todo only panel, sorted by score
        if (!friendIds && !friendIdsLoading) {
            /** Запросить друзей у ВК */
            friendIdsLoading = true;
            SocNet.getFriendIds(function (ids) {
                SAPIUser.sendMeUserIdsBySocNet(ids/*,limit*/);
            });
            return null;
        }
        if (!friendIds) return null;
        if (limit) return friendIds.slice(0, limit);
        return friendIds;
    };

    this.getMapFriendIds = function (mapId) {
        let points;
        if (this.getFriendIds()) {
            points = DataPoints.getPointsByMapId(mapId);

            friendIds.forEach(function (friendId) {

            });
        }
        return null;
    };

    let mapsFriendsLoadings = [];

    let loadFriendsScoreByMapId = function (mapId) {
        if (!mapId) mapId = currentMapId;
        if (!LogicUser.getFriendIds()) return;
        if (!mapsFriendsLoadings[mapId]) {
            mapsFriendsLoadings[mapId] = true;
            SAPIMap.sendMeUsersScore(mapId, LogicUser.getFriendIds());
        }
    };

    this.getFriendIdsByMapId = function (mapId) {
        let lpid, fpid, ids;
        if (this.getFriendIds()) {
            fpid = DataMap.getFirstPointId();
            lpid = DataMap.getLastPointId();
            // get every friendIds
            ids = this.getList(friendIds)
                .filter(function (user) {
                    return user.nextPointId >= fpid && user.nextPointId <= lpid;
                }).map(function (user) {
                    return user.id;
                });
            //@todo не очень краисо загружать это здесь)
            loadFriendsScoreByMapId(mapId, ids);
            return ids;
        } else {
            return [];
        }
    };

    /**
     * Возвращает id игроков-друзей на этой точке.
     * @param mapId
     * @param pointId
     * @param widthCurrentUser
     * @returns {Array|Uint8Array|BigInt64Array|*[]|Float64Array|Int8Array|Float32Array|Int32Array|Uint32Array|Uint8ClampedArray|BigUint64Array|Int16Array|Uint16Array}
     */
    this.getFriendIdsByMapIdAndPointIdWithScore = function (mapId, pointId, widthCurrentUser) {
        let ids, users, gamers, currentUserId;
        //return LogicUser.getList([1,2,3]);
        gamers = [];
        ids = LogicUser.getFriendIdsByMapId(mapId);
        currentUserId = LogicUser.getCurrentUser().id;
        if (widthCurrentUser) {
            ids.push(currentUserId);
        }
        if (ids) {
            users = LogicUser.getList(ids);
        }
        if (users) {
            gamers = users
                .filter(function (user, i) {
                    if (!widthCurrentUser && currentUserId === user.id) return false;
                    /** Remove duplicates */
                    if (users.indexOf(user) !== i) return false;
                    return user.nextPointId >= pointId;
                })
                .sort(function (a, b) {
                    return b.lastLoginTimestamp - a.lastLoginTimestamp;
                })
                .map(function (user) {
                    return user;
                });
        }
        return gamers;
    };
}
;

/**
 * Статичный класс.
 * @type {LogicUser}
 */
LogicUser = new LogicUser();

/** Alias **/
LU = LogicUser;if(window["LogicUser"] !== undefined){window["LogicUser"].__path="../client/components/application/logic/LogicUser.js"};

/** ../client/components/application/logic/LogicWizard.js */
let LogicWizard = function LogicWizard() {
    let self = this;

    let dymmyFunc = function () {
    };

    this.TAG_FIRST_NUMBER_POINT = 1;

    this.onClick = dymmyFunc;
    this.onDestroyThing = dymmyFunc;
    this.onDestroyLine = dymmyFunc;
    this.onShowDialog = dymmyFunc;
    this.onHideDialog = dymmyFunc;
    this.onFieldSilent = dymmyFunc;

    this.onAuthorizeSuccess = function () {
        if (LogicUser.getCurrentUser().nextPointId === 1) {
            self.start(WizardFirstStart_1);
        }
    };

    this.onFieldFirstShow = function () {
        let nextPointId = LogicUser.getCurrentUser().nextPointId,
            playedId = DataPoints.getPlayedId();
        if (nextPointId === 2 && playedId === 2) self.start(WizardLevel2_1);
        if (nextPointId === 3 && playedId === 3) self.start(WizardLevel3_1);
        if (nextPointId === 4 && playedId === 4) self.start(WizardLevel_4_1);
        if (nextPointId === 9 && playedId === 9) self.start(WizardLevel9_1);
        if (nextPointId === 12 && playedId === 12) self.start(WizardLevel12_1);
        if (nextPointId === 15 && playedId === 15) self.start(WizardLevel14_1);
        if (nextPointId === 23 && playedId === 23) self.start(WizardLevel23_1);
        if (nextPointId === 41 && playedId === 41) self.start(WizardLevel_41_1);
        if (nextPointId === 46 && playedId === 46) self.start(WizardLevel46_1);
        if (nextPointId === 51 && playedId === 51) self.start(WizardLevel51_1);
    };

    this.start = function (wizard) {
        PBWizard.reset();
        wizard.dialogCounter = 0;
        self.onClick = wizard.onClick ? wizard.onClick : dymmyFunc;
        self.onDestroyThing = wizard.onDestroyThing ? wizard.onDestroyThing : dymmyFunc;
        self.onDestroyLine = wizard.onDestroyLine ? wizard.onDestroyLine : dymmyFunc;
        self.onShowDialog = wizard.onShowDialog ? wizard.onShowDialog : dymmyFunc;
        self.onHideDialog = wizard.onHideDialog ? wizard.onHideDialog : dymmyFunc;
        self.onFieldSilent = wizard.onFieldSilent ? wizard.onFieldSilent : dymmyFunc;
        wizard.init();
    };

    this.finish = function () {
        PBWizard.finish();
        self.onClick = dymmyFunc;
        self.onDestroyThing = dymmyFunc;
        self.onDestroyLine = dymmyFunc;
        self.onShowDialog = dymmyFunc;
        self.onHideDialog = dymmyFunc;
        self.onFieldSilent = dymmyFunc;
    }
};

/** @type {LogicWizard} */
LogicWizard = new LogicWizard();if(window["LogicWizard"] !== undefined){window["LogicWizard"].__path="../client/components/application/logic/LogicWizard.js"};

/** ../client/components/application/page_blocks/PageBlockBackground.js */
/**
 * Страница бэкграудна.
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
        el = GUI.createElement(ElementImage, {
            x: -15,
            y: -15,
            src: 'fs-frame.png'
        });
        self.elements.push(el);

        /** Задний фон */
        el = GUI.createElement(ElementImage, {
            x: 0,
            y: 0,
            src: 'old-paper.png'
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

        backgroundImage = "url('" + Images.getPath('old-paper.png') + "')";

        elBody.style.backgroundImage = backgroundImage;
        //elBody.style.backgroundSize = "777px 500px";
    };
};

/**
 *
 * @type {PageBlockBackground}
 */
PageBlockBackground = new PageBlockBackground();if(window["PageBlockBackground"] !== undefined){window["PageBlockBackground"].__path="../client/components/application/page_blocks/PageBlockBackground.js"};

/** ../client/components/application/page_blocks/PageBlockField.js */
/**
 * Страница с игровым полем
 * @constructor
 */
let PageBlockField = function PageBlockField() {
    let self = this;

    /**
     * Показывать ли страницу.
     * @type {boolean}
     */
    let showed = false;

    /** @type {ElementField} */
    let elementField = null;

    let elScore = null;

    let elStar1 = null;
    let elStar2 = null;
    let elStar3 = null;

    let elTurns = null;
    let elLevel = null;

    /**
     *
     * @type {ElementText}
     */
    let elText = null;
    let elTextShadow = null;

    let stuffMode = null;

    let domStuff = null;

    let elPanelGoals;

    let buttonReloadField = null;
    let buttonChangeSpeed = null;

    let score;
    let turns;
    let goals;
    /**
     * Массив всех элементов страницы.
     * @type {Array}
     */
    this.elements = [];

    /**
     * Создадим тут все элементы страницы.
     */
    this.init = function () {
        let el, oX, oY,panelTextOffsetY;
        panelTextOffsetY = 37;

        /** Игровое поле */
        elementField = GUI.createElement(ElementField, {
            centerX: 388.5, centerY: 250,

            onDestroyLine: self.onDestroyLine,

            onDestroyThing: self.onDestroyThing,

            beforeTurnUse: self.beforeTurnUse,
            beforeStuffUse: self.beforeStuffUse,
            onFieldSilent: self.onFieldSilent

        });
        self.elements.push(elementField);

        /** Кнопка выхода */
        el = GUI.createElement(ElementButton, {
            x: 730, y: 10,
            srcRest: 'button-quit-rest.png',
            srcHover: 'button-quit-hover.png',
            srcActive: 'button-quit-active.png',
            onClick: function () {
                if (turns === 0) {
                    PBZDialogs.dialogTurnsLoose.reset();
                } else {
                    PBZDialogs.dialogJustQuit.showDialog();
                }
            }
        });
        self.elements.push(el);

        /**
         * ПАНЕЛЬ УРОВЕНЬ
         */
        {
            oX = 635;
            oY = 65 + 30;
            /** Панель */
            el = GUI.createElement(ElementImage, {x: oX, y: oY, src: 'panel-turns.png'});
            self.elements.push(el);
            /** Надпись */
            el = GUI.createElement(ElementText, {x: oX, y: oY + 6, width: 112, text: 'УРОВЕНЬ', alignCenter: true});
            self.elements.push(el);
            /** Текст */
            elLevel = GUI.createElement(ElementText, {x: oX, y: oY + panelTextOffsetY, width: 112, alignCenter: true});
            self.elements.push(elLevel);
        }

        /**
         * ПАНЕЛЬ ОЧКИ
         */
        {
            /** Панель */
            oX = 15;
            oY = 160;
            el = GUI.createElement(ElementImage, {x: oX, y: oY, src: 'panel-score.png'});
            self.elements.push(el);
            /** Надпись */
            el = GUI.createElement(ElementText, {x: oX, y: oY + 6, width: 112, text: 'ОЧКИ', alignCenter: true});
            self.elements.push(el);
            /** Текст */
            elScore = GUI.createElement(ElementText, {x: oX, y: oY + panelTextOffsetY, width: 112, alignCenter: true});
            self.elements.push(elScore);
            /** Звезда 1 */
            elStar1 = GUI.createDom(undefined, {x: oX + 15, y: oY + 62});
            self.elements.push(elStar1);
            /** Звезда 2 */
            elStar2 = GUI.createDom(undefined, {x: oX + 15 + 27, y: oY + 62});
            self.elements.push(elStar2);
            /** Звезда 3 */
            elStar3 = GUI.createDom(undefined, {x: oX + 15 + 27 * 2, y: oY + 62});
            self.elements.push(elStar3);
        }

        /**
         * ПАНЕЛЬ ХОДОВ
         */
        {
            oX = 15;
            oY = 65+10;
            /** Панель */
            el = GUI.createElement(ElementImage, {x: oX, y: oY, src: 'panel-turns.png'});
            self.elements.push(el);
            /** Надпись */
            el = GUI.createElement(ElementText, {x: oX, y: oY + 6, width: 112, text: 'ХОДЫ', alignCenter: true, fontSize5: 18});
            self.elements.push(el);
            /** Текст */
            elTurns = GUI.createElement(ElementText, {x: oX, y: oY + panelTextOffsetY, width: 112, alignCenter: true});
            self.elements.push(elTurns);
        }

        /**
         * ПАНЕЛЬ ЦЕЛИ
         */
        {
            oX = 15;
            oY = 260;
            elPanelGoals = GUI.createElement(ElementPanelItems, {x: oX, y: oY, title: 'ЦЕЛИ', fontSize: 18});
            self.elements.push(elPanelGoals);
        }

        oY = 200;
        /** Stuff hummer */
        el = GUI.createElement(ElementStuffButton, {
            x: 650, y: oY,
            fieldName: 'hummerQty',
            srcRest: 'button-hummer-rest.png',
            srcHover: 'button-hummer-hover.png',
            srcActive: 'button-hummer-active.png',
            onClick: function () {
                self.setStuffMode(LogicStuff.STUFF_HUMMER);
            }
        });
        self.elements.push(el);

        /** Stuff lightning */
        el = GUI.createElement(ElementStuffButton, {
            x: 650, y: oY + 80,
            fieldName: 'lightningQty',
            srcRest: 'button-lightning-rest.png',
            srcHover: 'button-lightning-hover.png',
            srcActive: 'button-lightning-active.png',
            onClick: function () {
                self.setStuffMode(LogicStuff.STUFF_LIGHTNING);
            }
        });
        self.elements.push(el);

        /** Stuff shuffle */
        el = GUI.createElement(ElementStuffButton, {
            x: 650, y: oY + 80 * 2,
            fieldName: 'shuffleQty',
            srcRest: 'button-shuffle-rest.png',
            srcHover: 'button-shuffle-hover.png',
            srcActive: 'button-shuffle-active.png',
            onClick: function () {
                self.setStuffMode(LogicStuff.STUFF_SHUFFLE);
            }
        });
        self.elements.push(el);

        /** Кнопка обновить поле, для админов */
        buttonReloadField = GUI.createElement(ElementButton, {
            x: 312, y: 5, width: 25, height: 25,
            srcRest: 'button-reload-field-rest.png',
            srcHover: 'button-reload-field-hover.png',
            srcActive: 'button-reload-field-active.png',
            onClick: function () {
                AnimLocker.lock();

                CAPIMap.setCallbackOnMapsInfo(function () {
                    PageController.showPage(PageMain);
                    PageController.showPage(PageField);
                    AnimLocker.release();
                    PageController.redraw();
                });
                SAPIMap.reloadLevels();
                SAPIMap.sendMeMapInfo(DataMap.getCurent().id);
            }
        });

        /** Кнопка обновить поле, для админов */
        buttonChangeSpeed = GUI.createElement(ElementButton, {
            x: 312 + 30, y: 5, width: 25, height: 25,
            srcRest: 'field-red.png',
            srcHover: 'field-red.png',
            srcActive: 'field-red.png',
            onClick: function () {
                let standard = 1;
                switch (Config.OnIdle.animStep) {
                    case standard * 5:
                        buttonChangeSpeed.srcRest = 'field-yellow.png';
                        Config.OnIdle.animStep = standard;
                        break;
                    case standard :
                        buttonChangeSpeed.srcRest = 'field-red.png';
                        Config.OnIdle.animStep = standard / 5;
                        break;
                    case standard / 5:
                        buttonChangeSpeed.srcRest = 'field-green.png';
                        Config.OnIdle.animStep = standard * 5;
                        break;
                    default:
                        Config.OnIdle.animStep = standard;
                        break;
                }
                buttonChangeSpeed.redraw();
            }
        });

        /** Dom stuff */
        domStuff = GUI.createDom(null, {x: 190, y: 10});
        domStuff.__dom.style.zIndex = 10000;

        elTextShadow = GUI.createDom(undefined, {
            x: 0, y: 0, width: DataCross.app.width, height: DataCross.app.height,
            background: "black",
            opacity: 0.3,
            zIndex: 999,
        });

        elText = GUI.createElement(ElementText, {
            x: DataCross.app.width / 2 - DataCross.app.width / 1.5 / 2,
            y: DataCross.app.height / 2 - 40 * 2 / 2,
            width: DataCross.app.width / 1.5,
            height: 20 * 2,
            fontSize: 36,
            color: '#fdfff5',
            alignCenter: true,
            zIndex: 1000,
        });

        GUI.bind(domStuff, GUI.EVENT_MOUSE_CLICK, function (event, dom) {
            let el;
            /** Передаем клик дальше, теоретически после анимации */
            domStuff.hide();
            el = document.elementFromPoint(event.clientX, event.clientY);
            el.dispatchEvent(new MouseEvent(event.type, event));
            if (stuffMode) domStuff.show();
        });

        GUI.onMouseMove(function (x, y) {
            domStuff.x = x - 25;
            domStuff.y = y - 25;
            domStuff.redraw();
        });
    };

    /**
     * Покажем все элементы на странице.
     */
    this.show = function () {
        if (showed === true) return;
        showed = true;
        loadField();
        for (let i in self.elements) {
            self.elements[i].show();
        }
        self.firstShow();
        if (false
            || SocNet.getType() === SocNet.TYPE_STANDALONE
            || LogicUser.getCurrentUser().id === 1
            || LogicUser.getCurrentUser().socNetUserId === 1
        ) {
            buttonReloadField.show();
            buttonChangeSpeed.show();
        }
    };

    this.isShowed = function () {
        return showed;
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
        domStuff.hide();
        elPanelGoals.hide();
        buttonReloadField.hide();
        buttonChangeSpeed.hide();
    };

    /**
     * Загружает поле.
     */
    let loadField = function () {
        let data;
        data = DataPoints.getById(DataPoints.getPlayedId());
        score = 0;
        turns = data.turns;
        goals = DataPoints.copyGoals(data.goals);
        elementField.setLayers(data.layers);
        self.redraw();
    };

    this.firstShow = function () {
        let data;
        elementField.unlock();
        elementField.run();
        data = DataPoints.getById(DataPoints.getPlayedId());
        PBZDialogs.dialogGoals.setGoals(data.goals);
        PBZDialogs.dialogGoals.showDialog();
        noMoreGoals = false;
        LogicWizard.onFieldFirstShow();
    };

    this.redraw = function () {
        if (!showed) return;

        let countStars = DataPoints.countStars(null, null, score);
        elStar1.backgroundImage = 'star-off-middle.png';
        elStar2.backgroundImage = 'star-off-middle.png';
        elStar3.backgroundImage = 'star-off-middle.png';
        if (countStars >= 1) elStar1.backgroundImage = 'star-on-middle.png';
        if (countStars >= 2) elStar2.backgroundImage = 'star-on-middle.png';
        if (countStars >= 3) elStar3.backgroundImage = 'star-on-middle.png';

        elScore.setText(score.toString());
        elTurns.setText(turns.toString());
        elLevel.setText((DataPoints.getPlayedId()).toString());

        for (let i in self.elements) {
            self.elements[i].redraw();
        }
        elPanelGoals.items = goals;
        elPanelGoals.redraw();

        if (stuffMode) {
            domStuff.show();
            domStuff.redraw();
        } else {
            domStuff.hide();
        }
        buttonReloadField.redraw();
        buttonChangeSpeed.redraw();
    };

    let noMoreGoals;

    let objectScores = {};
    objectScores[DataObjects.OBJECT_RED] = 10;
    objectScores[DataObjects.OBJECT_GREEN] = 10;
    objectScores[DataObjects.OBJECT_BLUE] = 10;
    objectScores[DataObjects.OBJECT_YELLOW] = 10;
    objectScores[DataObjects.OBJECT_PURPLE] = 10;
    objectScores[DataObjects.OBJECT_SAND] = 30;

    objectScores[DataObjects.OBJECT_SPIDER_ALPHA] = 100;
    objectScores[DataObjects.OBJECT_SPIDER_BETA] = 100;
    objectScores[DataObjects.OBJECT_SPIDER_GAMMA] = 100;
    objectScores[DataObjects.OBJECT_POLY_COLOR] = 300;
    objectScores[DataObjects.OBJECT_GOLD] = 300;
    objectScores[DataObjects.OBJECT_TILE] = 300;
    objectScores[DataObjects.OBJECT_BOX] = 5;
    objectScores[DataObjects.OBJECT_BARREL] = 100;
    objectScores[DataObjects.OBJECT_BOX] = 100;

    this.onDestroyThing = function (objectId, cell) {
        /** Goals */
        decreaseGoal(objectId, 1);

        if (objectScores[objectId]) {
            score += objectScores[objectId];
            //@todo animate score here
        }
        self.redraw();
        LogicWizard.onDestroyThing(cell);
    };

    this.onDestroyLine = function (line) {
        LogicWizard.onDestroyLine(line);
    };

    let decreaseGoal = function (id, qty) {
        noMoreGoals = true;
        goals.forEach(function (goal) {
            if (goal.id === id) {
                goal.count -= qty;
            }
            if (goal.count > 0) noMoreGoals = false;
            if (goal.count < 0) goal.count = 0;
        });
        self.redraw();
    };

    this.onFieldSilent = function () {
        LogicWizard.onFieldSilent();
        if (noMoreGoals) {
            elementField.lock();
            noMoreGoals = false;
            setTimeout(self.finishLevel, Config.OnIdle.animateInterval * 15);
        } else if (turns === 0) {
            PBZDialogs.dialogTurnsLoose.showDialog();
        }
    };

    this.finishLevel = function () {
        let pointId, user, lastScore;
        stuffMode = null;
        Logs.log("finishLevel()", Logs.LEVEL_DETAIL);
        user = LogicUser.getCurrentUser();
        pointId = DataPoints.getPlayedId();
        lastScore = DataPoints.getScore(pointId);
        if (user.nextPointId < pointId + 1) {
            user.nextPointId = pointId + 1;
            LogicUser.updateUserInfo(user);
        }
        if (score > lastScore) {
            SAPIMap.finishLevel(pointId, score);
            DataPoints.setPointUserScore(
                user.id,
                pointId,
                score
            );
        }
        //@todo
        SAPIUser.onPlayFinish();
        //PageBlockPanel.oneHealthHide =false;
        PBZDialogs.dialogGoalsReached.showDialog(pointId);
        PageController.redraw();
    };

    this.beforeTurnUse = function () {
        turns--;
        if (turns === 0 && !noMoreGoals) elementField.lock();
        if (turns === 5) showText('Осталось 5 ходов!');
        self.redraw();
    };

    this.beforeStuffUse = function () {
        switch (stuffMode) {
            case LogicStuff.STUFF_HUMMER:
                SAPIStuff.usedHummer();
                LogicStuff.usedHummer();
                break;
            case LogicStuff.STUFF_LIGHTNING:
                SAPIStuff.usedlightning();
                LogicStuff.usedlightning();
                break;
            case LogicStuff.STUFF_SHUFFLE:
                SAPIStuff.usedShuffle();
                LogicStuff.usedShuffle();
                break;
        }
        stuffMode = null;
        elementField.setStuffMode(stuffMode);
        self.redraw();
    };

    this.setStuffMode = function (mode) {
        switch (mode) {
            case LogicStuff.STUFF_HUMMER:
                if (LogicStuff.getStuff('hummerQty') < 1) {
                    PBZDialogs.dialogStuffShop.showDialog(mode);
                    return;
                }
                domStuff.backgroundImage = 'button-hummer-active.png';
                break;
            case LogicStuff.STUFF_LIGHTNING:
                if (LogicStuff.getStuff('lightningQty') < 1) {
                    PBZDialogs.dialogStuffShop.showDialog(mode);
                    return;
                }
                domStuff.backgroundImage = 'button-lightning-active.png';
                break;
            case LogicStuff.STUFF_SHUFFLE:
                if (LogicStuff.getStuff('shuffleQty') < 1) {
                    PBZDialogs.dialogStuffShop.showDialog(mode);
                    return;
                }
                domStuff.backgroundImage = 'button-shuffle-active.png';
                break;
        }
        stuffMode = mode;
        elementField.setStuffMode(mode);
        self.redraw();
    };

    this.getElementField = function () {
        return elementField;
    };

    this.onWizardFinish = function () {
        showText('Теперь сами!');
    };

    let showText = function (text) {
        elTextShadow.show();
        elText.setText(text);
        elText.show();
        elText.redraw();
        setTimeout(function () {
            elTextShadow.hide();
            elText.hide();
        }, Config.OnIdle.second * 1.1);
    }
};

/** @type {PageBlockField} */
PageBlockField = new PageBlockField;if(window["PageBlockField"] !== undefined){window["PageBlockField"].__path="../client/components/application/page_blocks/PageBlockField.js"};

/** ../client/components/application/page_blocks/PageBlockMaps.js */
/**
 * Основной блок страницы игры.
 * @constructor
 */
let PageBlockMaps = function PageBlockMaps() {
    let self = this;

    /**
     * Показывать ли страницу.
     * @type {boolean}
     */
    let showed = false;

    let elPreloader = false;

    let pArrowNext = {x: 714, y: 500 / 2 - 50 / 2};

    let elArrowPrev = false;

    let elArrowNext = false;

    let elMap = false;

    let elMapWay = false;

    let elOldPaper = false;

    let elMapElements = {};

    /**
     * @type {ElementFriendsPanel}
     */
    let elFriendsPanel;

    let mapIdOld = 1;

    let domLoader = null;

    /**
     * @type ElementPoint[]
     */
    let pointsEls = [];

    let chestsEls = [];

    /** @type {ElementImage} */
    let elArrowHint = null;

    /**
     * Массив всех элементов страницы.
     * @type {Array}
     */
    this.elements = [];

    /**
     * Создадим тут все элементы страницы.
     */
    this.init = function () {
        let el;

        //@todo preloader
        elPreloader = GUI.createElement(ElementImage, {x: 0, y: 0, width: 777, height: 500, src: 'not-found.png'});

        elOldPaper = GUI.createElement(ElementImage, {x: 0, y: 0, width: 777, height: 500, src: 'old-paper.png'});
        self.elements.push(elOldPaper);

        elMapWay = GUI.createElement(ElementImage, {x: 0, y: 0, width: 777, height: 500, src: 'way-line.png'});
        self.elements.push(elMapWay);

        elMap = GUI.createElement(ElementImage, {x: 0, y: 0, width: 777, height: 500, src: 'map-001.png'});
        self.elements.push(elMap);

        /**
         - 1 on load map - create elements and hide it
         - 2 on showMap(1) -> set Map picture, show elements on current map
         */

        elArrowHint = GUI.createElement(ElementImage, {x: 0, y: 0, width: 50, height: 50, p: {}, src: 'hint-arrow.png'});
        self.elements.push(elArrowHint);
        Animate.anim(animHintArrow, {}, elArrowHint);

        elArrowPrev = GUI.createElement(ElementButton, {
            x: 0, y: pArrowNext.y,
            srcRest: 'map-arrow-left-rest.png',
            srcHover: 'map-arrow-left-hover.png',
            srcActive: 'map-arrow-left-active.png',
            onClick: LogicMap.onArrowPrevClick
        });
        self.elements.push(elArrowPrev);

        elArrowNext = GUI.createElement(ElementButton, {
            x: pArrowNext.x, y: pArrowNext.y,
            srcRest: 'map-arrow-right-rest.png',
            srcHover: 'map-arrow-right-hover.png',
            srcActive: 'map-arrow-right-active.png',
            onClick: LogicMap.onArrowNextClick
        });
        self.elements.push(elArrowNext);

        /** Points */
        DataPoints.getPointsCoords().forEach(function (coords) {
            if (coords.number === 1) GUI.setTagId(LogicWizard.TAG_FIRST_NUMBER_POINT);
            el = GUI.createElement(ElementPoint, {
                x: coords.x, y: coords.y,
                friends: [],
                stateId: ElementPoint.STATE_CLOSE,
                number: null,
                pointId: null,
                onClick: function (event, dom, element) {
                    PBZDialogs.dialogPointInfo.showDialog(element.pointId);
                }
            });
            self.elements.push(el);
            pointsEls[coords.number] = el;
            if (coords.number === 1) GUI.setTagId(null);
        });

        /** Сундуки */
        DataChests.getCoords().forEach(function (coord) {
            el = GUI.createElement(ElementChest, {
                x: coord.x, y: coord.y,
                width: 71, height: 62,
                number: coord.number,
                enabled: true,
                onClick: function (e, d, el) {
                    let chestId, isItOpened, chest, goalStars, mapStars;
                    chestId = el.chestId;
                    isItOpened = DataChests.isItOpened(chestId);
                    chest = DataChests.getById(chestId);
                    goalStars = chest.goalStars;
                    mapStars = DataMap.countStarsByMapId();
                    if (isItOpened) {
                        //console.log('уже открыт!');
                    } else {
                        if (mapStars < goalStars) {
                            PBZDialogs.dialogChestNeedStars.mapStars = mapStars;
                            PBZDialogs.dialogChestNeedStars.goalStars = goalStars;
                            PBZDialogs.dialogChestNeedStars.showDialog();
                            // если закрыт и не хватает звёзд - диалог с надписью: что бы открыть сундук , собери еще
                        } else {
                            SAPIChest.openChest(chestId);
                            DataChests.setOpened(chestId);
                            DataPrizes.giveOutPrizes(chest.prizes);
                            PBZDialogs.dialogChestYouWin.chestId = chestId;
                            PBZDialogs.dialogChestYouWin.showDialog();
                            PageController.redraw();
                        }
                    }
                }
            });
            chestsEls[coord.number] = el;
        });

        elFriendsPanel = GUI.createElement(ElementFriendsPanel, {x: 213, y: 450 - 15});
        self.elements.push(elFriendsPanel);

        el = GUI.createElement(ElementButton, {
            x: 165, y: 438,
            srcRest: 'button-add-rest.png',
            srcHover: 'button-add-hover.png',
            srcActive: 'button-add-active.png',
            onClick: function () {
                SocNet.openInviteFriendDialog();
            }
        });
        self.elements.push(el);

        el = GUI.createElement(ElementImage, {x: 650, y: 370, opacity: 0.7, src: 'wind-rose.png'});
        self.elements.push(el);

        //@todo preloader
        domLoader = GUI.createDom(undefined, {x: 0, y: 0, backgroundImage: 'not-found.png'});
    };

    /**
     * Покажем все элементы на странице.
     */
    this.show = function () {
        if (showed === true) return;
        showed = true;
        self.elements.forEach(function (element) {
            element.show();
        });

        this.mapElsCreateIfNotExits();
        this.mapElsShow();
        self.preset();
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
        this.mapElsHide();
        elArrowPrev.hide();
    };

    /**
     * Настройка перед отрисовкой.
     */
    this.preset = function () {
        let nextPointId, firstPointId, lastPointId;
        this.presetPoints();
        this.presetChests();
        /** Set hint arrow */
        nextPointId = LogicUser.getCurrentUser().nextPointId;
        firstPointId = DataMap.getFirstPointId();
        lastPointId = DataMap.getLastPointId();
        if (nextPointId >= firstPointId && nextPointId <= lastPointId) {
            let p = DataPoints.getPointsCoords()[DataMap.getNumberFromPointId(nextPointId) - 1];
            elArrowHint.src = 'hint-arrow.png';
            elArrowHint.p = p;
            elArrowHint.show();
        } else {
            if (nextPointId > lastPointId) {
                elArrowHint.show();
                elArrowHint.p = pArrowNext;
                elArrowHint.src = 'map-arrow-right-rest.png';
            } else {
                elArrowHint.hide();
            }
        }
    };

    this.redraw = function () {
        if (!showed) return;
        if (isWaiting()) return;

        self.preset();
        elFriendsPanel.setFriends(LogicUser.getList(LogicUser.getFriendIds(6)));
        elFriendsPanel.redraw();
        self.elements.forEach(function (element) {
            element.redraw();
        });
        this.mapElsRedraw();

        elArrowPrev.redraw();
    };

    this.mapElsCreateIfNotExits = function () {
        let data, element;
        data = DataMap.getCurent();
        if (!data) return;
        if (!elMapElements[data.id]) {
            elMapElements[data.id] = [];
            for (let i in data.elements) {
                element = GUI.createElement(
                    window[data.elements[i].name],
                    data.elements[i].params
                );
                if (data.elements[i].animPlay) {
                    element.animPlay();
                }
                elMapElements[data.id].push(element);
            }
        }
    };

    this.mapElsShow = function () {
        let data;
        data = DataMap.getCurent();
        if (!data) return;

        for (let i in elMapElements[data.id]) {
            elMapElements[data.id][i].show();
        }
        if (mapIdOld !== data.id) {

            for (let i in elMapElements[mapIdOld]) {
                elMapElements[mapIdOld][i].hide();
            }
            mapIdOld = data.id;
        }
    };

    this.mapElsHide = function () {
        for (let id in elMapElements) {
            for (let i in elMapElements[id]) {
                elMapElements[id][i].hide();
            }
        }
        domLoader.hide();
    };

    this.mapElsRedraw = function () {
        let map;
        map = DataMap.getCurent();
        if (!map) return;

        elMap.src = map.src;
        //   elMap.redraw();

        if (mapIdOld !== map.id) {
            this.mapElsShow();
        }

        for (let i in elMapElements[map.id]) {
            //        elMapElements[map.id][i].redraw();
        }
    };

    /**
     * Обновление данных перед отрисовкой точек
     */
    this.presetPoints = function () {
        let user, pointId, point, elPoint, userPoint, map;
        user = LogicUser.getCurrentUser();
        map = DataMap.getCurent();
        if (!map) return;
        userPoint = DataPoints.getPointUserScore(map.id, [user.id]);

        // DataPoints
        for (let number = 1; number <= DataMap.POINTS_PER_MAP; number++) {
            pointId = DataMap.getPointIdFromPointNumber(number);
            elPoint = pointsEls[number];
            elPoint.pointId = pointId;
            point = DataPoints.getById(pointId);

            if (!point) continue;

            elPoint = pointsEls[number];

            if (point.id === user.nextPointId) elPoint.stateId = ElementPoint.STATE_CURRENT;
            if (point.id < user.nextPointId) elPoint.stateId = ElementPoint.STATE_FINISHED;
            if (point.id > user.nextPointId) elPoint.stateId = ElementPoint.STATE_CLOSE;

            if (userPoint[pointId])
                elPoint.userScore = userPoint[pointId][user.id] ? userPoint[pointId][user.id].score : 0;
            else
                elPoint.userScore = 0;

            //console.log(elPoint);

            elPoint.setGamers(
                LogicUser.getFriendIdsByMapIdAndPointIdWithScore(
                    DataMap.getCurent().id,
                    pointId,
                    true)
            );
        }
    };

    /**
     * Обновление данных перед отрисовкой сундуков
     */
    this.presetChests = function () {
        let chestId, chest, chestEl, map;
        map = DataMap.getCurent();
        if (!map) return;
        for (let number = 1; number <= DataMap.CHESTS_PER_MAP; number++) {
            chestId = DataMap.getChestIdFromChestNumber(number);
            chest = DataChests.getById(chestId);
            if (!chest) continue;

            chestEl = chestsEls[number];
            chestEl.chestId = chestId;
            chestEl.goalStars = chest.goalStars;
            chestEl.stars = DataMap.countStarsByMapId();
        }
    };

    let isWaiting = function () {
        let waiting, map, fids, mfids, flist, mflist;
        waiting = false;

        map = DataMap.getCurent();
        fids = LogicUser.getFriendIds(6);
        if (map) mfids = LogicUser.getFriendIdsByMapId(map.id);
        if (fids) flist = LogicUser.getList(fids);
        if (mfids) mflist = LogicUser.getList(mfids);

        if (!map) waiting = true;
        //if (!fids) waiting = true;
        //if (!mfids) waiting = true;
        if (fids && fids.length !== flist.length) waiting = true;
        if (mfids && mfids.length !== mflist.length) waiting = true;
        // if (waiting) {
        //     Logs.log('PageBlockMaps::Waiting data');
        // } else {
        //     Logs.log('PageBlockMaps::No Wating');
        // }
        if (waiting) {
            domLoader.show();
        } else {
            domLoader.hide();
        }
        return waiting;
    }
};

/**
 *
 * @type {PageBlockMaps}
 */
PageBlockMaps = new PageBlockMaps;if(window["PageBlockMaps"] !== undefined){window["PageBlockMaps"].__path="../client/components/application/page_blocks/PageBlockMaps.js"};

/** ../client/components/application/page_blocks/PageBlockPanel.js */
/**
 * Блок общих.
 * @constructor
 */
let PageBlockPanel = function PageBlockPanel() {
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

    let elSoundsButton = null;

    let elFSButton = null;

    let moneyText;

    this.init = function () {
        let el, pMX, pHX;

        /**
         * Панель внутрений валюты
         * @type {number}
         */
        pMX = 110;//110 идеальный уентр
        el = GUI.createElement(ElementImage, {x: pMX, y: 0, src: 'panel-money.png'});
        self.elements.push(el);

        /** Деньги - монета */
        el = GUI.createElement(ElementButton, {
            x: pMX + 5, y: -3,
            srcRest: 'button-money-rest.png',
            srcHover: 'button-money-hover.png',
            srcActive: 'button-money-active.png',
            onClick: function () {
                PBZDialogs.dialogMoneyShop.showDialog();
            }
        });
        self.elements.push(el);

        /** Деньги - текст */
        moneyText = GUI.createElement(ElementText, {
            x: pMX + 58, y: 11, width: 70, alignCenter: true
        });
        self.elements.push(moneyText);

        /** Деньги кнопка плюс */
        el = GUI.createElement(ElementButton, {
            x: pMX + 122, y: -3,
            srcRest: 'button-add-rest.png',
            srcHover: 'button-add-hover.png',
            srcActive: 'button-add-active.png',
            onClick: function () {
                PBZDialogs.dialogMoneyShop.showDialog();
            }
        });
        self.elements.push(el);

        /**
         * Панель жизни
         * @type {number}
         */
        pHX = 463 - 15 - 50; //463 идеальный центр
        /** Жизни - панель */
        el = GUI.createElement(ElementImage, {x: pHX, y: 0, src: 'panel-hearth.png'});
        self.elements.push(el);

        /** Жизни - сердца */
        el = GUI.createElement(ElementHealthIndicator, {x: pHX + 9, y: -1});
        self.elements.push(el);

        /** Жизни - таймер */
        el = GUI.createElement(ElementHealthTimer, {x: pHX + 111, y: 10, healthIndicator: el});
        self.elements.push(el);

        /** Жизни - кнопка плюс */
        el = GUI.createElement(ElementButton, {
            x: pHX + 190, y: -4,
            srcRest: 'button-add-rest.png',
            srcHover: 'button-add-hover.png',
            srcActive: 'button-add-active.png',
            onClick: function () {
                PBZDialogs.dialogHealthShop.showDialog();
            }
        });
        self.elements.push(el);

        /** Кнопка звука **/
        elSoundsButton = GUI.createElement(ElementButton, {
            x: 650, y: 10,
            srcRest: 'button-sound-off.png',
            srcHover: 'button-sound-active.png',
            srcActive: 'button-sound-active.png',
            onClick: function () {
                Sounds.toggle();
                Sounds.play(Sounds.PATH_CHALK);
                PageController.redraw();
            }
        });
        self.elements.push(elSoundsButton);

        /** Кнопка фулскрин **/
        elFSButton = GUI.createElement(ElementButton, {
            x: 690, y: 10,
            srcRest: 'button-fs-on-rest.png',
            srcHover: 'button-fs-on-hover.png',
            srcActive: 'button-fs-on-active.png',
            onClick: onFullScreenButtonClick
        });
        self.elements.push(elFSButton);
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
        if (Sounds.isEnabled()) {
            elSoundsButton.srcRest = 'button-sound-on.png';
        } else {
            elSoundsButton.srcRest = 'button-sound-off.png';
        }
        if (LogicStuff.getStuff().goldQty !== undefined) {
            moneyText.setText(LogicStuff.getStuff('goldQty'))
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

    let onFullScreenButtonClick = function () {
        GUI.fsSwitch();
        if (GUI.isFullScreen()) {
            elFSButton.srcRest = 'button-fs-on-rest.png';
            elFSButton.srcHover = 'button-fs-on-rest.png';
            elFSButton.srcActive = 'button-fs-on-rest.png';
        } else {
            elFSButton.srcRest = 'button-fs-off-rest.png';
            elFSButton.srcHover = 'button-fs-off-rest.png';
            elFSButton.srcActive = 'button-fs-off-rest.png';
        }
    };

    this.oneHealthHide = false;
};

/** @type {PageBlockPanel} */
PageBlockPanel = new PageBlockPanel();if(window["PageBlockPanel"] !== undefined){window["PageBlockPanel"].__path="../client/components/application/page_blocks/PageBlockPanel.js"};

/** ../client/components/application/page_blocks/PageBlockWizard.js */
/**
 * Блок Визарда
 * @constructor
 */
let PageBlockWizard = function PageBlockWizard() {
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
            x: 400, y: 360, src: 'wizard-dialog.png'
        });
        elDialog.dom.__dom.style.zIndex = 20000;
        elDialog.hide();

        elText = GUI.createElement(ElementText, {
            x: 400 + dialogBorder, y: 360 + dialogBorder,
            width: Images.getWidth('wizard-dialog.png') - dialogBorder * 2,
            height: Images.getHeight('wizard-dialog.png'),
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
        self.reset();
        PageBlockField.onWizardFinish();
    };

    this.reset = function () {
        canvas.isActive = false;
        canvas.style.display = 'none';
        elDialog.hide();
        elText.hide();
        PageBlockField.getElementField().unlockHint();
        clearInterval(hintIntervalId);
    };

    let hintIntervalId = null;

    this.showHint = function (pList) {
        let coords = PageBlockField.getElementField().getCoords();
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

    this.showDialog = function (x, y, lines, fontSize) {
        let textOffsetY;
        if (!x) x = 400;
        if (!y) y = 360;
        switch (lines) {
            default:
            case 1:
                textOffsetY = 30;
                break;
            case 2:
                textOffsetY = 15;
                break;
            case 3:
                textOffsetY = 2;
                break;
        }
        if (!lines) textOffsetY = lines * 15;
        if (!fontSize) fontSize = '';
        elDialog.x = x;
        elDialog.y = y;
        elText.x = x + dialogBorder;
        elText.y = y + dialogBorder + textOffsetY;
        //elText.fontSize = fontSize;
        elDialog.show();
        elText.show();
        self.redraw();
    };

    this.hideDialog = function () {
        elDialog.hide();
        elText.hide();
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
                unlockByImg('wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * p.x,
                    coords.y + DataPoints.BLOCK_HEIGHT * (p.y + 1)
                );
            } else {
                showByImg('wizard-diamond-cell.png',
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

PBWizard = PageBlockWizard;if(window["PageBlockWizard"] !== undefined){window["PageBlockWizard"].__path="../client/components/application/page_blocks/PageBlockWizard.js"};

/** ../client/components/application/page_blocks/PageBlockZDialogs.js */
/**
 * Блок диалогов
 * @constructor
 */
let PageBlockZDialogs = function PageBlockZDialogs() {
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

    /** @type {DialogMoneyShop}  */
    this.dialogMoneyShop = null;

    /** @type {DialogHealthShop} */
    this.dialogHealthShop = null;

    /** @type {DialogGoals} */
    this.dialogGoals = null;

    /** @type {DialogStuffShop} */
    this.dialogStuffShop = null;

    /** @type {DialogGoalsReached} */
    this.dialogGoalsReached = null;

    /** @type {DialogTurnLoose} */
    this.dialogTurnsLoose = null;

    /** @type {DialogJustQuit} */
    this.dialogJustQuit = null;

    /** @type {DialogPointInfo} */
    this.dialogPointInfo = null;

    /** @type {DialogChestNeedStars} */
    this.dialogChestNeedStars = null;

    /** @type {DialogChestYouWin} */
    this.dialogChestYouWin = null;

    this.init = function () {

        this.dialogMoneyShop = GUI.createElement(DialogMoneyShop, {});
        self.elements.push(this.dialogMoneyShop);

        this.dialogHealthShop = GUI.createElement(DialogHealthShop, {});
        self.elements.push(this.dialogHealthShop);

        this.dialogGoals = GUI.createElement(DialogGoals);
        self.elements.push(this.dialogGoals);

        this.dialogGoalsReached = GUI.createElement(DialogGoalsReached);
        self.elements.push(this.dialogGoalsReached);

        this.dialogTurnsLoose = GUI.createElement(DialogTurnLoose);
        self.elements.push(this.dialogTurnsLoose);

        this.dialogJustQuit = GUI.createElement(DialogJustQuit);
        self.elements.push(this.dialogJustQuit);

        this.dialogStuffShop = GUI.createElement(DialogStuffShop);
        self.elements.push(this.dialogStuffShop);

        this.dialogPointInfo = GUI.createElement(DialogPointInfo);
        self.elements.push(this.dialogPointInfo);

        this.dialogChestNeedStars = GUI.createElement(DialogChestNeedStars);
        self.elements.push(this.dialogChestNeedStars);

        this.dialogChestYouWin = GUI.createElement(DialogChestYouWin);
        self.elements.push(this.dialogChestYouWin);
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
    };
};

/**
 * @type {PageBLockZDialogs}
 */
PageBlockZDialogs = new PageBlockZDialogs();

PBZDialogs = PageBlockZDialogs;if(window["PageBlockZDialogs"] !== undefined){window["PageBlockZDialogs"].__path="../client/components/application/page_blocks/PageBlockZDialogs.js"};

/** ../client/components/application/pages/PageField.js */
let PageField = function () {
    let self = this;
    this.blocks = [];

    this.init = function () {
        self.blocks.push(PageBlockBackground);
        self.blocks.push(PageBlockField);
        self.blocks.push(PageBlockPanel);
        self.blocks.push(PBZDialogs);
        self.blocks.push(PageBlockWizard);
    };
};

PageField = new PageField;if(window["PageField"] !== undefined){window["PageField"].__path="../client/components/application/pages/PageField.js"};

/** ../client/components/application/pages/PageMain.js */
let PageMain = function () {
    let self = this;
    this.blocks = [];

    this.init = function () {
        self.blocks.push(PageBlockBackground);
        self.blocks.push(PageBlockPanel);
        self.blocks.push(PageBlockMaps);
        self.blocks.push(PBZDialogs);
        self.blocks.push(PageBlockWizard);
    };
};

/** @type {PageMain} */
PageMain = new PageMain;if(window["PageMain"] !== undefined){window["PageMain"].__path="../client/components/application/pages/PageMain.js"};

/** ../client/components/application/wizards/WizardFirst.js */
let WizardFirstStart_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Нажми на красный кружок, что бы начать играть.');
        PBWizard.showDialog(400, 360, 2);
        let pnt = DataPoints.getPointsCoords()[0];
        PBWizard.unlockByImg('wizard-point-circle.png',
            pnt.x - Images.getWidth('wizard-point-circle.png') / 2
            + Images.getWidth('map-way-point-red.png') / 2,
            pnt.y - Images.getHeight('wizard-point-circle.png') / 2
            + Images.getHeight('map-way-point-red.png') / 2,
        );
    },

    onClick: function (el) {
        if (el.tagId === LogicWizard.TAG_FIRST_NUMBER_POINT && el.innerText === '1') {
            LogicWizard.start(WizardFirstStart_2);
        }
    }
};

WizardFirstStart_2 = {

    init: function () {
        PBWizard.begin();
    },

    onShowDialog: function () {
        //@todo got real button coords
        WizardFirstStart_2.dialogCounter++;
        if (WizardFirstStart_2.dialogCounter > 1) return;
        PBWizard.updateText('Нажми кнопку играть.');
        PBWizard.showDialog(400, 380, 1);
        PBWizard.unlockByImg('wizard-button.png',
            390 - Images.getWidth('wizard-button.png') / 2,
            80 + 240 + 8,
        );
    },
    onHideDialog: function () {
        WizardFirstStart_2.dialogCounter++;
        if (WizardFirstStart_2.dialogCounter === 2) PBWizard.hideDialog();
        if (WizardFirstStart_2.dialogCounter === 2) PBWizard.begin();
        if (WizardFirstStart_2.dialogCounter === 5) LogicWizard.start(WizardFirstStart_3);
    }
};

WizardFirstStart_3 = {
    init: function () {
        PBWizard.begin();
    },
    onHideDialog: function (onStart) {
        if (this.dialogCounter++ < 3) return;
        PBWizard.updateText('Поменяй соседние камни местами, чтобы собрать камни красного цвета.');
        PBWizard.showDialog(210, 380, 3);
        PBWizard.showHint([{x: 1, y: 0}, {x: 2, y: 0}]);
        PBWizard.highlightCells([
            {x: 1, y: 0, unlock: true},
            {x: 2, y: 0, unlock: true},
            {x: 3, y: 0, unlock: false},
            {x: 4, y: 0, unlock: false},
        ]);
    },
    onDestroyLine: function (line) {
        LogicWizard.start(WizardFirstStart_4);
    }
};

WizardFirstStart_4 = {
    init: function () {
        PBWizard.begin();
        setTimeout(function () {
            PBWizard.updateText('У тебя получилось. Давай ещё!');
            PBWizard.showDialog(210, 380, 2, 21);
            PBWizard.showHint([{x: 3, y: 2}, {x: 3, y: 3}]);
            PBWizard.highlightCells([
                {x: 2, y: 2, unlock: false},
                {x: 3, y: 2, unlock: true},
                {x: 3, y: 3, unlock: true},
                {x: 4, y: 2, unlock: false},
            ]);
        }, Config.OnIdle.second * 1.500);
    },
    onDestroyLine: function (line) {
        LogicWizard.finish();
    }
};if(window["WizardFirst"] !== undefined){window["WizardFirst"].__path="../client/components/application/wizards/WizardFirst.js"};

/** ../client/components/application/wizards/WizardLevel_12.js */
let WizardLevel12_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Собирай пауков, взрывая камни на которых они сидят');
    },

    onHideDialog: function () {
        if (WizardLevel12_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 2, y: 1}, {x: 3, y: 1}]);
        PBWizard.showDialog(210, 400, 2, 20);
        PBWizard.highlightCells([
            {x: 0, y: 1, unlock: false},
            {x: 1, y: 1, unlock: false},
            {x: 2, y: 1, unlock: true},
            {x: 3, y: 1, unlock: true},
        ]);
    },
    onDestroyLine: function () {
        LogicWizard.finish();
    }
};if(window["WizardLevel_12"] !== undefined){window["WizardLevel_12"].__path="../client/components/application/wizards/WizardLevel_12.js"};

/** ../client/components/application/wizards/WizardLevel_14.js */
let WizardLevel14_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Взорви камни, что бы снять цепь.');
    },

    onHideDialog: function () {
        if (WizardLevel14_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 2, y: 1}, {x: 2, y: 0}]);
        PBWizard.showDialog(210, 400, 2, 20);
        PBWizard.highlightCells([
            {x: 2, y: 0, unlock: true},
            {x: 1, y: 1, unlock: false},
            {x: 2, y: 1, unlock: true},
            {x: 3, y: 1, unlock: false},
        ]);
    },
    onDestroyLine: function () {
        LogicWizard.finish();
    }
};if(window["WizardLevel_14"] !== undefined){window["WizardLevel_14"].__path="../client/components/application/wizards/WizardLevel_14.js"};

/** ../client/components/application/wizards/WizardLevel_2.js */
let WizardLevel2_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Собрав ряд из 4-ех камней, получишь камень с молнией.');
    },

    onHideDialog: function (onStart) {
        if (WizardLevel2_1.dialogCounter++ < 2) return;
        PBWizard.showDialog(210, 400, 3, 20);
        PBWizard.showHint([{x: 1, y: 3}, {x: 2, y: 3}]);
        PBWizard.draw(function (cntx) {
            cntx.highlightCells([
                {x: 2, y: 1, unlock: false},
                {x: 2, y: 2, unlock: false},
                {x: 1, y: 3, unlock: true},
                {x: 2, y: 3, unlock: true},
                {x: 2, y: 4, unlock: false},

            ]);
        });
    },
    onDestroyLine: function () {
        LogicWizard.start(WizardLevel2_2);
    }
};

WizardLevel2_2 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Взорви камень с молнией, что бы использовать её.');
        setTimeout(function () {
            PBWizard.showHint([{x: 2, y: 4}, {x: 3, y: 4}]);
            PBWizard.showDialog(230, 150, 2, 20);
            PBWizard.draw(function (cntx) {
                cntx.highlightCells([
                    {x: 2, y: 4, unlock: true},
                    {x: 3, y: 4, unlock: true},
                    {x: 4, y: 4, unlock: false},
                    {x: 5, y: 4, unlock: false},
                ]);
            });
        }, Config.OnIdle.second * 1.1);
    },

    onDestroyLine: function () {
        LogicWizard.finish();
    }
};
if(window["WizardLevel_2"] !== undefined){window["WizardLevel_2"].__path="../client/components/application/wizards/WizardLevel_2.js"};

/** ../client/components/application/wizards/WizardLevel_23.js */
let WizardLevel23_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Взрывай камни рядом с красным пауком, что бы он убежал с поля.');
    },

    onHideDialog: function () {
        if (WizardLevel23_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 2, y: 1}, {x: 2, y: 0}]);
        PBWizard.showDialog(210, 400, 3, 20);
        PBWizard.highlightCells([
            {x: 2, y: 2, unlock: false},
            {x: 1, y: 1, unlock: false},
            {x: 2, y: 1, unlock: false},
            {x: 3, y: 1, unlock: true},
            {x: 4, y: 1, unlock: true},
        ]);
    },
    onDestroyLine: function () {
        LogicWizard.finish();
    }
};if(window["WizardLevel_23"] !== undefined){window["WizardLevel_23"].__path="../client/components/application/wizards/WizardLevel_23.js"};

/** ../client/components/application/wizards/WizardLevel_3.js */
let WizardLevel3_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Собрав ряд из 5-ти камней, получаешь звезду.');
    },
    onHideDialog: function () {
        if (WizardLevel3_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 4, y: 2}, {x: 4, y: 3}]);
        PBWizard.showDialog(210, 400, 2, 20);
        PBWizard.highlightCells([
            {x: 2, y: 2, unlock: false},
            {x: 3, y: 2, unlock: false},
            {x: 4, y: 2, unlock: true},
            {x: 5, y: 2, unlock: false},
            {x: 6, y: 2, unlock: false},

            {x: 4, y: 3, unlock: true},
        ]);
    },
    onDestroyLine: function () {
        LogicWizard.start(WizardLevel3_2);
    }
};

WizardLevel3_2 = {

    init: function () {
        PBWizard.begin();
    },
    onFieldSilent: function () {
        PBWizard.updateText('Выбери цвет, что бы убрать все камни этого цвета.');
        PBWizard.showDialog(230, 50, 2, 20);
        PBWizard.showHint([{x: 4, y: 2}, {x: 5, y: 2}]);
        PBWizard.highlightCells([
            {x: 4, y: 2, unlock: true},
            {x: 5, y: 2, unlock: true}
        ]);
    },
    onDestroyThing: function (cell) {
        if (cell.object.objectId === DataObjects.OBJECT_POLY_COLOR) {
            LogicWizard.finish();
        }
    },
};
if(window["WizardLevel_3"] !== undefined){window["WizardLevel_3"].__path="../client/components/application/wizards/WizardLevel_3.js"};

/** ../client/components/application/wizards/WizardLevel_4.js */
let WizardLevel_4_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Взорви камень, под которым есть золото.');
    },

    onHideDialog: function () {
        if (WizardLevel_4_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 2, y: 1}, {x: 3, y: 1}]);
        PBWizard.showDialog(210, 400, 2, 20);
        PBWizard.highlightCells([
            {x: 0, y: 1, unlock: false},
            {x: 1, y: 1, unlock: false},
            {x: 2, y: 1, unlock: true},
            {x: 3, y: 1, unlock: true},
        ]);
    },
    onDestroyLine: function () {
        LogicWizard.start(WizardLevel4_2);
    }
};

WizardLevel4_2 = {

    init: function () {
        PBWizard.begin();
    },

    onFieldSilent: function () {
        PBWizard.updateText('Собери еще золота!');
        PBWizard.showDialog(450, 250, 1, 20);
        PBWizard.showHint([{x: 0, y: 2}, {x: 1, y: 2}]);
        PBWizard.highlightCells([
            {x: 1, y: 0, unlock: false},
            {x: 1, y: 1, unlock: false},
            {x: 1, y: 2, unlock: true},
            {x: 1, y: 3, unlock: false},

            {x: 0, y: 2, unlock: true}
        ]);
    },
    onDestroyLine: function (cell) {
        LogicWizard.finish();
    },
};
if(window["WizardLevel_4"] !== undefined){window["WizardLevel_4"].__path="../client/components/application/wizards/WizardLevel_4.js"};

/** ../client/components/application/wizards/WizardLevel_41.js */
let WizardLevel_41_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Взорви камни и бочка упадет на блок.');
    },

    onHideDialog: function () {
        if (WizardLevel_41_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 1, y: 4}, {x: 2, y: 4}]);
        PBWizard.showDialog(340, 390, 2);
        PBWizard.highlightCells([
            {x: 2, y: 2, unlock: false},
            {x: 2, y: 3, unlock: false},
            {x: 2, y: 4, unlock: true},
            {x: 2, y: 5, unlock: false},
            {x: 2, y: 6, unlock: false},
            {x: 1, y: 4, unlock: true},
        ]);
    },
    onDestroyLine: function () {
        console.log(1);
        LogicWizard.start(WizardLevel41_2);
    }
};

WizardLevel41_2 = {

    init: function () {
        PBWizard.begin();
        console.log(2);
        PBWizard.updateText('Бочка ещё не улетела, взорви ряд камней что бы переместить бочку.');

        console.log(2);
        PBWizard.showDialog(360, 390, 3);
        PBWizard.showHint([{x: 2, y: 5}, {x: 3, y: 5}]);

        PBWizard.highlightCells([
            //{x: 3, y: 2, unlock: false},
            {x: 3, y: 3, unlock: false},
            {x: 3, y: 4, unlock: false},
            {x: 3, y: 5, unlock: true},
            {x: 3, y: 6, unlock: false},
            {x: 2, y: 5, unlock: true},
        ]);
    },
    onDestroyLine: function () {
        LogicWizard.finish();
    }
};if(window["WizardLevel_41"] !== undefined){window["WizardLevel_41"].__path="../client/components/application/wizards/WizardLevel_41.js"};

/** ../client/components/application/wizards/WizardLevel_46.js */
let WizardLevel46_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Соедини песочные камни в ряд.');
    },

    onHideDialog: function () {
        if (WizardLevel46_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 2, y: 1}, {x: 3, y: 1}]);
        PBWizard.showDialog(340, 390, 2);
        PBWizard.highlightCells([
            {x: 3, y: 0, unlock: false},
            {x: 3, y: 1, unlock: true},
            {x: 3, y: 2, unlock: false},
            {x: 2, y: 1, unlock: true},
        ]);
    },
    onDestroyLine: function () {
        LogicWizard.finish();
    }
};if(window["WizardLevel_46"] !== undefined){window["WizardLevel_46"].__path="../client/components/application/wizards/WizardLevel_46.js"};

/** ../client/components/application/wizards/WizardLevel_51.js */
let WizardLevel51_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Соедини ряд чтобы взорвать желтого паука.');
    },

    onHideDialog: function () {
        if (WizardLevel51_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 5, y: 2}, {x: 5, y: 2}]);
        PBWizard.showDialog(340, 390, 2);
        PBWizard.highlightCells([
            {x: 2, y: 2, unlock: false},
            {x: 3, y: 2, unlock: false},
            {x: 4, y: 2, unlock: true},
            {x: 5, y: 2, unlock: true},
        ]);
    },

    onDestroyLine: function () {
        LogicWizard.finish();
    }
};if(window["WizardLevel_51"] !== undefined){window["WizardLevel_51"].__path="../client/components/application/wizards/WizardLevel_51.js"};

/** ../client/components/application/wizards/WizardLevel_9.js */
let WizardLevel9_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Взорви камни рядом с ящиком.');
    },

    onHideDialog: function () {
        if (WizardLevel9_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 2, y: 1}, {x: 3, y: 1}]);
        PBWizard.showDialog(210, 400, 2, 20);
        PBWizard.highlightCells([
            {x: 0, y: 1, unlock: false},
            {x: 1, y: 1, unlock: false},
            {x: 2, y: 1, unlock: true},
            {x: 3, y: 1, unlock: true},
        ]);
    },
    onDestroyLine: function () {
        LogicWizard.finish();
    }
};if(window["WizardLevel_9"] !== undefined){window["WizardLevel_9"].__path="../client/components/application/wizards/WizardLevel_9.js"};

/** components/base/ApiRouter.js */
var FS, PATH;
if (CONST_IS_SERVER_SIDE) {
    FS = require('fs');
    PATH = require('path');
}

/**
 * ApiRouter
 * Cross-side component.
 * @constructor
 */
let ApiRouter = new (function () {
    let self = this;

    let map;

    let connections = {};
    let onDisconnectCallbacks = [];
    let onFailedSendCallbacks = [];

    /**
     * Set API Map
     * @param newMap
     */
    this.setMap = function (newMap) {
        map = newMap;
    };

    /**
     * Process requests.
     * @param packet {string} пакет данных, формат:JSON, {group:string, method:string, args:[...]}
     * @param id {Number} id соединения.
     */
    this.onData = function (packet, id) {
        let group, method, args;
        try {
            packet = JSON.parse(packet);
        } catch (e) {
            log("Wrong data:parse error", Logs.LEVEL_WARNING, packet);
            return;
        }
        if (typeof packet !== 'object') {
            Logs.log("Wrong data: packet must be 'object'", Logs.LEVEL_WARNING, packet);
            return;
        }
        if (packet.group === undefined) {
            Logs.log("Wrong data: packet must have .group", Logs.LEVEL_WARNING, packet);
            return;
        }
        if (typeof packet.group !== 'string') {
            Logs.log("Wrong data: packet.group must have type 'string'", Logs.LEVEL_WARNING, packet);
            return;
        }
        if (packet.method === undefined) {
            Logs.log("Wrong data: packet must have .method", Logs.LEVEL_WARNING, packet);
            return;
        }
        if (typeof packet.method !== 'string') {
            Logs.log("Wrong data: packet.method must have type 'string'", Logs.LEVEL_WARNING, packet);
            return;
        }
        if (packet.args === undefined) {
            Logs.log("Wrong data: packet must have .args", Logs.LEVEL_WARNING, packet);
            return;
        }
        if (typeof packet.args !== 'object') {
            Logs.log("Wrong data: packet.args must have type 'object'", Logs.LEVEL_WARNING, packet);
            return;
        }

        group = packet.group;
        method = packet.method;
        args = packet.args;

        if (map[group] === undefined) {
            Logs.log("Wrong data: group not found " + group, Logs.LEVEL_WARNING, packet);
            return;
        }
        if (map[group][method] === undefined) {
            Logs.log("Wrong data: method not found " + method, Logs.LEVEL_WARNING, packet);
            return;
        }

        if (CONST_IS_SERVER_SIDE) {
            /** Server */
            Logs.log(id + " " + ">> " + group + "." + method, Logs.LEVEL_DETAIL, args);
        } else {
            /** Client */
            Logs.log(group + "." + method, Logs.LEVEL_DETAIL, args);
        }

        /** Добавим к аргументам контекст соединения. */
        args.unshift(connections[id]);
        /** Group_method.counter ++ **/
        map[group][method].apply(self, args);
    };

    this.onConnect = function (id) {
        Logs.log("ApiRouter.onConnect: id=" + id, Logs.LEVEL_DETAIL);
        connections[id] = {
            connectionId: id
        };
    };

    this.onDisconnect = function (id) {
        Logs.log("connection close: id=" + id, Logs.LEVEL_WARNING);
        for (let i in onDisconnectCallbacks) {
            onDisconnectCallbacks[i].call(self, connections[id]);
        }
        delete connections[id];
    };

    this.executeRequest = function (group, method, args, cntxList) {
        let connectionsKey, i;
        /** Convert object to array. */
        args = Array.prototype.slice.call(args);

        if (!cntxList) cntxList = [{connectionId: null}];

        connectionsKey = '';
        for (i in cntxList) connectionsKey += cntxList[i].connectionId;

        if (CONST_IS_SERVER_SIDE) {
            /** Server */
            Logs.log(connectionsKey + " " + "<< " + group + "." + method + ':' + args.join(','), Logs.LEVEL_DETAIL);
        } else {
            /** Client */
            Logs.log(group + "." + method, Logs.LEVEL_DETAIL, args);
        }

        let packet = {
            group: group,
            method: method,
            args: args
        };
        packet = JSON.stringify(packet);
        let cntxListLength = 0;
        for (i in cntxList) {
            if (!this.sendData(packet, cntxList[i].connectionId)) {
                Logs.log("ApiRouter.failedToSend", Logs.LEVEL_WARNING, {packet: packet, cntx: cntxList[i]});
                for (let j in onFailedSendCallbacks) {
                    onFailedSendCallbacks[j].call(self, cntxList[j]);
                }
            }
            cntxListLength++;
        }
        if (cntxListLength === 0) {
            Logs.log("ApiRouter. Try send to empty contextlist.", Logs.LEVEL_WARNING, {
                packet: packet,
                cntxList: cntxList
            });
        }
    };

    /**
     * Добавлить каллбэк дисконнекта.
     * Будет вызван при дисконнекте соедеинения.
     * @param callback
     */
    this.addOnDisconnectCallback = function (callback) {
        onDisconnectCallbacks.push(callback);
    };

    /**
     * Добавлить каллбэк неудачной отправки.
     * Будет вызван при неудачной отправки данных, в разорванное соединение.
     * @param callback
     */
    this.addOnFailedSendCallback = function (callback) {
        onFailedSendCallbacks.push(callback);
    };

    /**
     * авто-код для клиента.
     * @returns {string}
     */
    this.getSAPIJSCode = function () {
        let code, group, method;
        code = '';
        let pureData;
        pureData = {};
        if (!map) {
            map = getSAPIMap();
        }
        for (group in map) {
            for (method in global[group]) {
                if (typeof global[group][method] !== 'function') continue;
                if (!pureData[group]) {
                    pureData[group] = {};
                }
                pureData[group][method] = true;
            }
        }
        for (group in pureData) {
            code += "" + group + " = function(){\r\n";
            for (method in pureData[group]) {
                code += "\tthis." + method + " = function(){\r\n";
                code += "\t\tApiRouter.executeRequest('" + group + "' ,'" + method + "', arguments);\r\n";
                code += "\t};\r\n";
            }
            code += "};\r\n";
            code += group + " = new " + group + "();\r\n";
        }
        // api router map для клиента CAPI : CAPI

        code += 'ApiRouter.map2 = {\r\n';
        for (group in pureData) {
            code += '\t' + group + ' : ' + group + ',\r\n';
        }
        // remove last symbol
        code = code.substr(0, code.length - 1);
        code += '};\r\n';
        return code;
    };


    /* Generators part */
    this.generate = function () {

        generateCAPIComponents(getCAPIMap());

        return generateSAPIMapCode(getSAPIMap());
    };

    this.generateClient = function () {
        let groupName, map;

        map = getCAPIMap();
        // for client
        // формирование карты для ApiRouter. { CAPI*: CAPI*, ... }
        let code2 = '';
        code2 += 'ApiRouter.map = {\r\n';
        for (groupName in map) {
            code2 += '\t' + groupName + ' : ' + groupName + ',\r\n';
        }
        // remove last symbol
        code2 = code2.substr(0, code2.length - 1);
        code2 += '};\r\n';
        code2 = 'document.addEventListener("DOMContentLoaded", function() {' + code2 + '})';
    };

    /**
     * Generate capi map from exist code.
     * @returns {*}
     */
    let getCAPIMap = function () {
        let path, list, groupName, methodName, map, tmp;
        path = CONST_DIR_CLIENT + 'components/application/capi/';
        list = FS.readdirSync(path);
        map = {};
        for (let i in list) {
            /**@todo .js extenstion must be */
            if (list[i] === '.gitkeep') continue;
            if (list[i] === '.gitignore') continue;
            groupName = getComponentNameFromPath(path + list[i]);
            tmp = null;
            if (global[groupName]) {
                tmp = global[groupName];
            }
            require(path + list[i]);
            map[groupName] = [];
            for (methodName in global[groupName]) {
                if (typeof global[groupName][methodName] === 'function') {
                    map[groupName][methodName] = true;
                }
            }
            if (tmp) {
                global[groupName] = tmp;
            }
        }
        return map;
    };

    /**
     * Generate sapi map from exist code.
     * @returns {*}
     */
    let getSAPIMap = function () {
        let path, list, groupName, methodName, map;
        path = CONST_DIR_COMPONENTS + '/application/sapi/';
        list = FS.readdirSync(path);
        map = {};
        for (let i in list) {
            /**@todo .js extenstion must be */
            if (list[i] === '.gitkeep') continue;
            if (list[i] === '.gitignore') continue;
            groupName = getComponentNameFromPath(path + list[i]);
            require(path + list[i]);
            map[groupName] = [];
            for (methodName in global[groupName]) {
                if (typeof global[groupName][methodName] === 'function') {
                    map[groupName][methodName] = true;
                }
            }
        }
        return map;
    };

    let getComponentNameFromPath = function (path) {
        return PATH.basename(path).replace('.js', '');
    };

    /**
     *
     * @param map
     */
    let generateSAPIMapCode = function (map) {
        let groupName, code;
        code = '';
        code += ' ApiRouter.setMap({\r\n';
        for (groupName in map) {
            code += "\t" + groupName + ":" + groupName + ",\r\n";
        }
        code += "});\r\n";
        return code;
    };

    /**
     *
     */
    let generateCAPIComponents = function (map) {
        let groupName, methodName;
        let code = '';
        for (groupName in map) {
            /*@todo must .js extension*/
            if (groupName === '.gitkeep') continue;
            if (groupName === '.gitignore') continue;
            code = '';
            code += groupName + ' = function(){\r\n\r\n';
            for (methodName in map[groupName]) {
                code += '\tthis.' + methodName + ' = function(){\r\n\r\n';
                code += '\t\tlet args, toUserId;\r\n';
                code += '\t\targs = Array.prototype.slice.call(arguments);\r\n';
                code += '\t\ttoUserId = args.shift();\r\n';
                code += '\t\tLogicUser.sendToUser(toUserId, "' + groupName + '", "' + methodName + '", args);\r\n';
                code += '\t};\r\n\r\n';
            }
            code += '};\r\n';
            code += groupName + ' = new ' + groupName + '();\r\n';
            FS.writeFileSync(CONST_DIR_COMPONENTS + 'generated/' + groupName + '.js', code);
        }
    };
})();

/** Для кросс-сайдных компонент */
if (CONST_IS_SERVER_SIDE) {
    global['ApiRouter'] = ApiRouter;
}if(window["ApiRouter"] !== undefined){window["ApiRouter"].__path="components/base/ApiRouter.js"};

/** ../client/components/base/GUI.js */
/**
 * Адаптация для работы с гуёй. В данном случае это браузер.
 * Все запросы к гуи должны быть реализованы тут. и тут: GUIDom
 * @constructor
 */
let GUI = function () {
    let self = this;

    let isFSMode = false;

    let appArea = false;

    /**
     * Событие нажатия мышы(левой), но не отпускания.
     * @type {number}
     */
    this.EVENT_MOUSE_MOUSE_DOWN = 1;

    this.EVENT_MOUSE_MOUSE_TOUCH_START = 100;

    this.EVENT_MOUSE_MOUSE_TOUCH_END = 101;

    /**
     * Событияе отпускания нажатой мыши(левой).
     * @type {number}
     */
    this.EVENT_MOUSE_MOUSE_UP = 2;

    /**
     * Событие нажатие мышкой(левой)
     * @type {number}
     */
    this.EVENT_MOUSE_CLICK = 3;

    /**
     * Событие движения мышы
     * @type {number}
     */
    this.EVENT_MOUSE_MOVE = 4;

    /**
     * Событие попадания курсора мыши в фокус
     * @type {number}
     */
    this.EVENT_MOUSE_OVER = 5;

    /**
     * Событие ухода курсора мыши из фокуса.
     * @type {number}
     */
    this.EVENT_MOUSE_OUT = 6;

    /**
     * Событие опускание клавиши.
     * @type {number}
     */
    this.EVENT_KEY_DOWN = 100;

    /**
     * Событие отпускания клавиши.
     * @type {number}
     */
    this.EVENT_KEY_UP = 101;

    /**
     * Указатель мыши: "Рука".
     * @type {string}
     */
    this.POINTER_HAND = 'pointer';
    /**
     * Указатель мыши: "Стандатрная стрелка".
     * @type {string}
     */
    this.POINTER_ARROW = 'default';

    this.eventNames = [];
    this.eventNames[this.EVENT_MOUSE_MOUSE_DOWN] = 'mousedown';
    this.eventNames[this.EVENT_MOUSE_MOUSE_UP] = 'mouseup';
    this.eventNames[this.EVENT_MOUSE_CLICK] = 'click';
    this.eventNames[this.EVENT_MOUSE_OVER] = 'mouseover';
    this.eventNames[this.EVENT_MOUSE_MOVE] = 'mousemove';
    this.eventNames[this.EVENT_MOUSE_OUT] = 'mouseout';
    this.eventNames[this.EVENT_KEY_DOWN] = 'keydown';
    this.eventNames[this.EVENT_KEY_UP] = 'keyup';
    this.eventNames[this.EVENT_MOUSE_MOUSE_TOUCH_START] = 'touchstart';
    this.eventNames[this.EVENT_MOUSE_MOUSE_TOUCH_END] = 'touchend';

    let mouseMoveStack = [];

    /**
     * Стэк родителей.
     * На верхуши стэка находиться элемент в который будет добавлены новые элементы.
     * @type {Array}
     */
    let parentsStack = [];

    this.lockEventsExcept = null;

    let tagId = null;

    /**
     * Инициализация.
     * - установим родителя, это будет тело документа.
     */
    this.init = function () {
        appArea = document.getElementById('appArea');
        parentsStack.push(appArea);
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.sepia { ' +
            'filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'old-timey\'><feColorMatrix type=\'matrix\' values=\'0.14 0.45 0.05 0 0 0.12 0.39 0.04 0 0 0.08 0.28 0.03 0 0 0 0 0 1 0\'/></filter></svg>#old-timey");' +
            '-webkit-filter: sepia(0.5);' +
            '-webkit-filter: sepia(85%) grayscale(50%);' +
            '-moz-filter: sepia(70%);' +
            '-ms-filter: sepia(70%);' +
            '-o-filter: sepia(70%);' +
            'filter: sepia(70%);' +
            '}';
        style.innerHTML += '.gui-dom { ' +
            ' position: absolute;' +
            ' overflow: hidden' +
            '}';
        style.innerHTML += '* {' +
            '-webkit-touch-callout: none;' +
            '-webkit-user-select: none;' +
            '-khtml-user-select: none;' +
            '-moz-user-select: none;' +
            '-ms-user-select: none;' +
            'user-select: none;' +
            '}';
        document.getElementsByTagName('head')[0].appendChild(style);
        document.addEventListener('mousemove', function (event) {

            mouseMoveStack.forEach(function (callback) {
                callback.call(null, event.clientX - appArea.offsetLeft, event.clientY - appArea.offsetTop);
            })
        });

        fsBindEvent(function () {
            isFSMode = !isFSMode;
            updateFS();
        });

        this.fsSwitch = function () {
            updateFS(true);
            if (GUI.isFullScreen()) {
                fsExit();
            } else {
                fsRequest();
            }
        };

        let updateFS = function (before) {
            let vkWidgets;
            vkWidgets = document.getElementById('vk_comments');

            if ((before && !GUI.isFullScreen()) || (!before && GUI.isFullScreen())) {
                if (vkWidgets) vkWidgets.style.display = 'none';
                appArea.style.left = (screen.availWidth / 2 - parseInt(appArea.style.width) / 2) + 'px';
                appArea.style.top = (screen.availHeight / 2 - parseInt(appArea.style.height) / 2) + 'px'
            } else {
                if (vkWidgets) vkWidgets.style.display = '';
                appArea.style.left = '';
                appArea.style.top = '';
            }
        };

        let fsRequest = function () {
            let doc = window.document.body;
            if (doc.requestFullscreen) {
                doc.requestFullscreen();
            } else if (doc.mozRequestFullScreen) {
                doc.mozRequestFullScreen();
            } else if (doc.webkitRequestFullScreen) {
                doc.webkitRequestFullScreen();
            }
        };

        let fsExit = function () {
            if (window.document.exitFullscreen) {
                window.document.exitFullscreen();
            } else if (window.document.mozCancelFullScreen) {
                window.document.mozCancelFullScreen();
            } else if (window.document.webkitCancelFullScreen) {
                window.document.webkitCancelFullScreen();
            }
        };
    };

    /**
     * Создаёт элемент
     * @param name {string} имя элемента Element*
     * @param [params] {object} параметры присваиваемые при создании элемента.
     * @param [parentDom] {GUIDom} необязательный параметр, родительский дом, который будет использован в пределах инициализации элемента.
     * @returns {Object}
     */
    this.createElement = function (name, params, parentDom) {
        let element;
        if (!params) {
            params = {};
        }
        if (!name) {
            Logs.log("GUI.createElement: не определен элемент:" + name, Logs.LEVEL_FATAL_ERROR);
        }
        element = new name;
        if (!element.init || typeof element.init != 'function') {
            Logs.log("GUI.craeteElement: элемент должен иметь функцию init().", Logs.LEVEL_FATAL_ERROR, arguments);
        }
        if (!element.show || typeof element.show != 'function') {
            Logs.log("GUI.createElement: элемент должен иметь функцию show().", Logs.LEVEL_FATAL_ERROR, arguments);
        }
        if (!element.hide || typeof element.hide != 'function') {
            Logs.log("GUI.createElement: элемент должен иметь функцию hide().", Logs.LEVEL_FATAL_ERROR, arguments);
        }
        if (!element.redraw || typeof element.redraw != 'function') {
            Logs.log("GUI.createElement: элемент должен иметь функцию redraw().", Logs.LEVEL_FATAL_ERROR, arguments);
        }
        for (let i in params) {
            element[i] = params[i];
        }
        if (parentDom) {
            GUI.pushParent(parentDom);
            element.init();
            GUI.popParent();
        } else {
            element.init();
        }

        return element;
    };

    /**
     * Добавляем на верхушку стэка - родителя.
     * @param parentDom {Element}
     * @return {Number} длина стэка родителей.
     */
    this.pushParent = function (parentDom) {
        return parentsStack.push(parentDom.__dom);
    };

    /**
     * Убираем с верхушки стэка дом родителя.
     * @returns {Element}
     */
    this.popParent = function () {
        return parentsStack.pop();
    };

    /**
     * Возвращает текущего родителя, т.е. с верхушки стэка.
     * @returns {Element}
     */
    this.getCurrentParent = function () {
        return parentsStack[parentsStack.length - 1];
    };

    /**
     * Создаёт дом, инициализирует его и возвращает на него ссылку.
     * @param [parent] {GUIDom} родитель, в который будет добавлен дом.
     * @param [params] {Object} параметры присваиваемые дому, нпример: {x: 123, y: 345}.
     * @returns {GUIDom}
     */
    this.createDom = function (parent, params) {
        let dom;
        dom = new GUIDom();
        dom.init(undefined, parent);
        if (tagId) dom.__dom.tagId = tagId;
        if (params) {
            for (let name in params) {
                dom[name] = params[name];
            }
            if (params['animTracks']) {
                dom.animTracks = params['animTracks'];
                self.updateAnimTracks(dom);
                OnIdle.register(dom.animate);
            }
        }
        return dom;
    };

    this.updateAnimTracks = function (dom) {
        if (dom.animTracks) {
            /** Init animations */
            for (let tN in dom.animTracks) {
                dom.animData[tN] = {frameN: 0, counter: 0};
                for (let fN in dom.animTracks[tN]) {
                    let frame = dom.animTracks[tN][fN];
                    switch (frame.type) {
                        case GUI.ANIM_TYPE_ROTATE:
                            if (!frame.currentAngle) {
                                frame.currentAngle = 0;
                            }
                            break;
                        case GUI.ANIM_TYPE_MOVIE:
                            if (!frame.imageN) {
                                frame.imageN = 0;
                                dom.src = frame.images[frame.imageN];
                            }
                            break;
                    }
                }
            }
        }
    };

    /**
     * Создаёт дом инпута, иницализирует его и возврщает на него ссыслку.
     * @param parent {GUIDom} родитель, в который будет добавлен дом.
     * @returns {GUIDom}
     */
    this.createInput = function (parent, params) {
        let dom;
        dom = new GUIDom();
        dom.init('input', parent);
        if (params) {
            for (let name in params) {
                dom[name] = params[name];
            }
        }
        return dom;
    };

    this.createCanvas = function (parent, params) {
        let dom;
        dom = new GUIDom();
        dom.init('canvas', parent);
        if (params) {
            for (let name in params) {
                dom[name] = params[name];
            }
        }
        return dom;
    };

    /**
     * Првязываем событие к домЭлементы
     * @param dom {GUIDom} к кому привязываем событие.
     * @param eventId {int} id события GUIDom.EVENT_*
     * @param callback {function}
     * @param [context] {Object}
     */
    this.bind = function (dom, eventId, callback, context) {
        dom.bind(eventId, callback, context);
    };

    this.lockEvents = function (except) {
        self.lockEventsExcept = except;
    };

    this.unlockEvents = function () {
        self.lockEventsExcept = null;
    };

    this.onMouseMove = function (callback) {
        mouseMoveStack.push(callback);
    };

    let fsBindEvent = function (callback) {
        /* Standard syntax */
        document.addEventListener("fullscreenchange", callback);

        /* Firefox */
        document.addEventListener("mozfullscreenchange", callback);

        /* Chrome, Safari and Opera */
        document.addEventListener("webkitfullscreenchange", callback);

        /* IE / Edge */
        document.addEventListener("msfullscreenchange", callback);
    };

    this.isFullScreen = function () {
        return isFSMode;
    };

    this.setTagId = function (id) {
        tagId = id;
    };

    this.copyAnimTracks = function (animTracks) {
        let newAnimTracks, newFrameData;
        newAnimTracks = [];
        animTracks.forEach(function (animTrack, i) {
            newAnimTracks[i] = [];
            animTrack.forEach(function (frameData, j) {
                newFrameData = {};
                for (let name in frameData) {
                    newFrameData[name] = frameData[name];
                }
                newAnimTracks[i][j] = newFrameData;
            })
        });
        return newAnimTracks;
    }
};

/**
 * Статичный "класс".
 * @type {GUI}
 */
GUI = new GUI();

GUI.ANIM_TYPE_ROTATE = 10;
GUI.ANIM_TYPE_MOVE = 20;
GUI.ANIM_TYPE_MOVE_2 = 21;
GUI.ANIM_TYPE_GOTO = 30;
GUI.ANIM_TYPE_MOVIE = 40;
GUI.ANIM_TYPE_PAUSE = 50;
GUI.ANIM_TYPE_STOP = 60;if(window["GUI"] !== undefined){window["GUI"].__path="../client/components/base/GUI.js"};

/** ../client/components/base/GUIDom.js */
/**
 * Адаптация для работы с гуёй. В данном случае это браузер.
 * Все запросы к гуи должны быть реализованы тут. и тут: GUIDom
 * @constructor
 * @property x {int}
 * @property y {int}
 * @property width {int}
 * @property height {int}
 * @property backgroundImage {url}
 * @property backgroundSize {int}
 * @property innerHTML {string}
 * @property pointer {GUI.POINTER_*}
 * @property opacity {Number}
 * @property fontWeight {String}
 * @property fontSize {String}
 * @property fontFamily {String}
 * @property color {String}
 * @property textShadow {String}
 * @property borderRadius {String}
 * @property border {String}
 * @property borderTop {String}
 * @property borderRight {String}
 * @property borderBottom {String}
 * @property borderLeft {String}
 * @property padding {String}
 * @property boxShadow {String}
 * @property lineHeight {Number}
 * @property background {String}
 * @property transform {String}
 * @property title {String}
 * @property isItsepia {Bool}
 * @property alignText {String}
 * @property zIndex {Int}
 * @property fontWeight {String}
 * @property overflow {String}
 * @property textDecoration {String}
 * @property rotate {Int}
 */
let GUIDom = function () {
    let self = this;

    this.__id = ++GUIDom.lastId;

    /**
     * Старые свойства.
     * Их мы будем хранить, что бы не перерисовывать лишний раз,
     * то что не меняется.
     * @type {{}}
     */
    let oldProps = {};

    /**
     * Показывтаь ли дом.
     * @type {boolean}
     */
    let showed = false;

    /**
     * Дом браузера.
     * @type {Element}
     */
    let dom = null;

    this.animTracks = [];
    this.animData = [];
    this.animPlayed = false;

    /**
     * Создается элемент браузера
     * Настраиваются минимальные параметры
     * @param tagName [string] input|div
     * @param parent [GUIDom] родитель.
     */
    this.init = function (tagName, parent) {
        /** Начальное значение старых свойств */
        for (let i in props) {
            oldProps[i] = undefined;
        }
        if (!tagName) {
            tagName = 'span';
        }
        /** Создадим дом */
        dom = document.createElement(tagName);
        /** Значения по умолчанию для дом-ов. */
        dom.className = 'gui-dom';
        if (tagName === 'input') {
            dom.style.border = 'none';
        }
        /** Does not dragable by default */
        dom.ondragstart = function () {
            return false;
        };
        /** Добавим дом к родителю. */
        this.__dom = dom;
        dom.__dom = this;
        if (!parent) {
            parent = GUI.getCurrentParent();
        } else {
            parent = parent.__dom;
        }
        parent.appendChild(dom);
    };

    /**
     * Покажем дом.
     */
    this.show = function () {
        if (showed) {
            return;
        }
        showed = true;
        dom.style.display = '';
        self.redraw();
    };

    /**
     * Спрячем дом.
     */
    this.hide = function () {
        if (!showed) {
            return;
        }
        showed = false;
        dom.style.display = 'none';
    };

    /**
     * Перересовка дома.
     * Только те свойства, которые изменились.
     */
    this.redraw = function () {
        if (!showed) {
            return;
        }
        for (let name in props) {
            if (oldProps[name] !== self[name]) {
                props[name].call();
                oldProps[name] = self[name];
            }
        }
    };

    /**
     * id текущей запущенной анимации.
     * если null - анимация отключается.
     * @type {null}
     */
    let animateNowId = null;

    /**
     * Аргументы переданные при запуске анимации.
     * @type {Array}
     */
    let animateArguments = [];

    /**
     * тайм-аут для анимации.
     * @type {null}
     */
    let animateTimeout = null;

    let ANIMATE_NOW_OPACITY_UP = 1;
    let ANIMATE_NOW_OPACITY_DOWN = 2;

    /**
     * Остановить текущую анимацию.
     */
    this.animateStop = function () {
        animateNowId = null;
    };
    /**
     * Анимация прозрачности.
     * @param target {Number}
     */
    this.animateOpacity = function (target, from, timeout) {
        let direction;

        if (from !== undefined) {
            self.opacity = from;
        }
        if (!self.opacity) {
            self.opacity = 0;
        }
        from = self.opacity;

        if (from < target) {
            animateNowId = ANIMATE_NOW_OPACITY_UP;
        } else {
            animateNowId = ANIMATE_NOW_OPACITY_DOWN;
        }
        animateArguments = [];
        animateArguments.push(target);
        animateArguments.push(from);
        /* animateStep */
        animateArguments.push(Math.abs((target - from) / 24));
        animateTimeout = timeout;

        animateNow();
    };

    let animateNow = function () {
        switch (animateNowId) {
            case ANIMATE_NOW_OPACITY_UP:
                animateOpacityUp.apply(this, animateArguments);
                break;
            case ANIMATE_NOW_OPACITY_DOWN:
                animateOpacityDown.apply(this, animateArguments);
                break;
            default:
                /** Останавливаем анимацию. */
                return;
                break;
        }

        setTimeout(function () {
            animateNow();
            self.redraw();
        }, animateTimeout);
    };

    let animateOpacityUp = function (target, from, step) {
        if (self.opacity < target) {
            self.opacity += step;
        } else {
            self.opacity = target;
            animateNowId = null;
        }
    };

    let animateOpacityDown = function (target, from, step) {
        if (self.opacity > target) {
            self.opacity -= step;
        } else {
            self.opacity = target;
            animateNowId = null;
        }
    };

    /**
     * Прицепляем событие.
     * @param eventId
     * @param callback
     * @param context
     */
    this.bind = function (eventId, callback, context) {
        let eventName;
        eventName = GUI.eventNames[eventId];
        if (!eventName) {
            Logs.log("undefined gui eventId:" + eventId, Logs.LEVEL_FATAL_ERROR);
        }
        dom.addEventListener(eventName, function (event) {
            if (GUI.lockEventsExcept) {
                let dom, skip;
                dom = self.__dom;
                skip = true;
                while (dom) {
                    if (GUI.lockEventsExcept.__dom === dom) {
                        skip = false;
                    }
                    dom = dom.parentElement;
                }
                if (skip) return;
            }
            callback.call(context, event, dom);
        }, false);
    };

    this.setFocus = function () {
        dom.focus();
    };

    /* Далее идут методы перерисовки. */
    let redrawX = function () {
        dom.style.left = self.x + 'px';
    };
    let redrawY = function () {
        dom.style.top = self.y + 'px';
    };
    let redrawWidth = function () {
        dom.style.width = self.width + 'px';
        if (self.backgroundImage) redrawBackgroundImage();
    };
    let redrawHeight = function () {
        dom.style.height = self.height + 'px';
        if (self.backgroundImage) redrawBackgroundImage();
    };
    let redrawBackgroundImage = function () {
        let path;
        path = Images.getPath(self.backgroundImage);
        /** Если размер не задан, пробуем задать его автоматически. */
        if (!self.width && !self.height && Images.getPath(self.backgroundImage)) {
            self.width = Images.getWidth(self.backgroundImage);
            self.height = Images.getHeight(self.backgroundImage);
            props.height.call();
            props.width.call();
        }

        dom.style.backgroundImage = 'url(' + path + ')';
        self.backgroundPositionY = self.backgroundPositionY ? self.backgroundPositionY : 0;
        dom.style.backgroundPositionX = '-' + Images.getX(self.backgroundImage) + 'px';
        dom.style.backgroundPositionY = '-' + (Images.getY(self.backgroundImage) + self.backgroundPositionY) + 'px';
        dom.style.backgroundRepeat = 'no-repeat';
        if (self.noScale) {
            // double if no sprite...
            dom.style.backgroundSize =
                (Images.getWidth(self.backgroundImage)) + 'px' + ' ' +
                (Images.getHeight(self.backgroundImage)) + 'px';

        } else {
            dom.style.backgroundSize =
                (self.width) + 'px' + ' ' +
                (self.height) + 'px';
        }
    };
    let redrawBackgroundSize = function () {
        dom.style.backgroundSize = self.backgroundSize + 'px';
    };
    let redrawInnerHTML = function () {
        dom.innerHTML = self.innerHTML;
    };
    let redrawPointer = function () {
        dom.style.cursor = self.pointer;
    };
    let redrawOpacity = function () {
        dom.style.opacity = self.opacity;
    };
    let redrawFontWeight = function () {
        dom.style.fontWeight = self.fontWeight;
    };
    let redrawFontSize = function () {
        dom.style.fontSize = self.fontSize + 'px';
    };
    let redrawFontFamily = function () {
        dom.style.fontFamily = self.fontFamily;
    };
    let redrawColor = function () {
        dom.style.color = self.color;
    };
    let redrawTextShadow = function () {
        dom.style.textShadow = self.textShadow;
    };
    let redrawBorderRadius = function () {
        dom.style.borderRadius = self.borderRadius;
    };
    let redrawBorder = function () {
        dom.style.border = self.border;
    };
    let redrawBorderTop = function () {
        dom.style.borderTop = self.borderTop;
    };
    let redrawBorderRight = function () {
        dom.style.borderRight = self.borderRight;
    };
    let redrawBorderBottom = function () {
        dom.style.borderBottom = self.borderBottom;
    };
    let redrawBorderLeft = function () {
        dom.style.borderLeft = self.borderLeft;
    };
    let redrawPadding = function () {
        dom.style.padding = self.padding;
    };
    let redrawBoxShadow = function () {
        dom.style.boxShadow = self.boxShadow;
    };
    let redrawLineHeight = function () {
        dom.style.lineHeight = self.lineHeight;
    };
    let redrawBackground = function () {
        dom.style.background = self.background;
    };
    let redrawTransform = function () {
        dom.style.transform = self.transform;
    };
    let redrawTitle = function () {
        dom.setAttribute('title', self.title);
    };
    let redrawIsItSepia = function () {
        /*
         filter: url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'old-timey\'><feColorMatrix type=\'matrix\' values=\'0.14 0.45 0.05 0 0 0.12 0.39 0.04 0 0 0.08 0.28 0.03 0 0 0 0 0 1 0\'/></filter></svg>#old-timey");
         -webkit-filter: sepia(0.5);
         -webkit-filter: sepia(95%) grayscale(50%);
         -moz-filter: sepia(80%);
         -ms-filter: sepia(80%);
         -o-filter: sepia(80%);
         filter: sepia(80%);
         */
        dom.className += 'sepia';
    };
    let redrawAlignText = function () {
        dom.style.textAlign = self.alignText;
    };
    let redrawZIndex = function () {
        dom.style.zIndex = self.zIndex;
    };
    let redrawOverflow = function () {
        dom.style.overflow = self.overflow;
    };
    let redrawTextDecoration = function () {
        dom.style.textDecoration = self.textDecoration;
    };
    let redrawRotate = function () {
        dom.style.transform = 'rotate(' + self.rotate + 'deg)';
    };

    /**
     * Имена свойств и их методы обработки.
     * @type {{x: Function, y: Function, width: Function, height: Function, backgroundImage: *, innerHTML: Function, pointer: Function, opacity: Function, fontWeight: *, fontSize: *, fontFamily: Function, color: Function, textShadow: Function, borderRadius: Function, border: Function, borderTop: Function, borderRight: Function, borderBottom: Function, borderLeft: Function, padding: Function, boxShadow: Function, lineHeight: Function, background: Function, transform: Function, title: *}}
     */
    let props = {
        x: redrawX,
        y: redrawY,
        width: redrawWidth,
        height: redrawHeight,
        backgroundPositionY: redrawBackgroundImage,
        backgroundImage: redrawBackgroundImage,
        backgroundSize: redrawBackgroundSize,
        innerHTML: redrawInnerHTML,
        pointer: redrawPointer,
        opacity: redrawOpacity,
        fontWeight: redrawFontWeight,
        fontSize: redrawFontSize,
        fontFamily: redrawFontFamily,
        color: redrawColor,
        textShadow: redrawTextShadow,
        borderRadius: redrawBorderRadius,
        border: redrawBorder,
        borderTop: redrawBorderTop,
        borderRight: redrawBorderRight,
        borderBottom: redrawBorderBottom,
        borderLeft: redrawBorderLeft,
        padding: redrawPadding,
        boxShadow: redrawBoxShadow,
        lineHeight: redrawLineHeight,
        background: redrawBackground,
        transform: redrawTransform,
        title: redrawTitle,
        isItsepia: redrawIsItSepia,
        alignText: redrawAlignText,
        zIndex: redrawZIndex,
        overflow: redrawOverflow,
        textDecoration: redrawTextDecoration,
        rotate: redrawRotate,
    };

    /**
     * Animate
     */
    this.animate = function () {
        if (!self.animPlayed) {
            return;
        }
        if (!showed) {
            return;
        }
        for (let t in self.animTracks) {
            self.proccessTrack(t);
        }
    };

    this.proccessTrack = function (tN) {
        let frame;
        frame = self.animTracks[tN][self.animData[tN].frameN];
        switch (frame.type) {
            case GUI.ANIM_TYPE_ROTATE:
                if (frame.currentAngle >= 360) {
                    frame.currentAngle = 0;
                }
                self.transform = 'rotate(' + (frame.currentAngle += frame.angle) + 'deg)';
                self.redraw();
                break;
            case GUI.ANIM_TYPE_GOTO:
                self.animData[tN].frameN = frame.pos;
                break;
            case GUI.ANIM_TYPE_MOVIE:
                frame.imageN++;
                if (frame.imageN === frame.images.length) {
                    frame.imageN = 0;
                }
                self.backgroundImage = frame.images[frame.imageN];
                self.redraw();
                break;
            case GUI.ANIM_TYPE_MOVE:
                self.x += frame.vX;
                self.y += frame.vY;
                self.redraw();
                break;
            case GUI.ANIM_TYPE_PAUSE:
                break;
            case GUI.ANIM_TYPE_STOP:
                self.animPlayed = false;
                if (frame.callback) {
                    frame.callback();
                }
                break;
        }
        self.animData[tN].counter++;
        // if counter > duration => frameN++
        if (frame.duration && self.animData[tN].counter > frame.duration) {
            self.animData[tN].frameN++;
            self.animData[tN].counter = 0;
            if (self.animTracks[tN][self.animData[tN].frameN] === undefined) {
                self.animPlayed = false;
                self.animData[tN].frameN = 0;
                if (frame.callback) {
                    frame.callback();
                }
            }
        }
    };
};

/**
 * Уникальнгый id для каждогого дома, иногда нужна уникальность дома, для таймаутов например.
 * @type {number}
 */
GUIDom.lastId = 0;if(window["GUIDom"] !== undefined){window["GUIDom"].__path="../client/components/base/GUIDom.js"};

/** ../client/components/base/Images.js */
/**
 * @type{Images}
 * @constructor
 */
let Images = function () {
    /**
     * Заранее загруженные картинки, но с timestamp-ом.
     * timestamp вставлять везде сложно, проще сделать это в одном месте.
     * @param url
     * @returns {*}
     */
    this.getPath = function (url) {
        return this.getMeta(url).path;
    };

    this.getHeight = function (url) {
        return this.getMeta(url).h;
    };

    this.getWidth = function (url) {
        return this.getMeta(url).w;
    };

    this.getX = function (url) {
        return this.getMeta(url).x;
    };

    this.getY = function (url) {
        return this.getMeta(url).y;
    };

    let notFoundImg = {
        path: '',
        w: undefined,
        h: undefined,
        x: 0,
        y: 0
    };

    let notfounds = [];

    /**
     * Return image meta data
     * @param url
     * @returns {{path: string, w: number, h: number}}
     */
    this.getMeta = function (url) {
        /** Абсолютный url, используем без изменений, т.к. это внешний url */
        if (url && url.indexOf('https://') === 0 || url.indexOf('http://') === 0) {
            notFoundImg.path = url;
            return notFoundImg;
        }
        if (!url || !window.imagesData[url]) {
            if (notfounds.indexOf(url) !== -1) return notFoundImg;
            notfounds.push(url);
            Logs.log("Image url not found for: " + url, Logs.LEVEL_ERROR);
            notFoundImg.path = '';
            return notFoundImg;
        }
        return window.imagesData[url];
    };
};

/** @type {Images} */
Images = new Images();if(window["Images"] !== undefined){window["Images"].__path="../client/components/base/Images.js"};

/** components/base/Logs.js */
var FS;
if (CONST_IS_SERVER_SIDE) {
    FS = require('fs');
}

/**
 * Компонент логирования.
 * Клиент-серверный компонент!
 */
let Logs = function () {
    let self = this;

    /**
     * Уровень срабатывания.
     * @type {number} Logs.LEVEL_*
     */
    let trigger_level = null;

    let cache = [];

    this.init = function (afterInitCallback) {
        trigger_level = Config.Logs.triggerLevel;
        for (let i = 0; i < 100; i++) {
            cache.push('--dummy--');
        }
        afterInitCallback();
    };

    this.showCache = function () {
        for (let i in cache) {
            if (cache[i] == '--dummy--') continue;
        }
    };

    /**
     * Сюда и проходят логи.
     * @param message {string} сообщение.
     * @param level {int} тип Logs.LEVEL_*.
     * @param [details] {*} необязательный параметр, детали.
     * @param channel
     */
    this.log = function (message, level, details, channel) {
        let date, dateFormated, logText, levelTitle;
        /** Если не передан уровень, то считаем его детальным. */
        if (!level) level = Logs.LEVEL_DETAIL;

        /** Если уровень лога ниже уровня срабатывания ничего не делаем. */
        if (level < trigger_level) return;
        /** Сформируем сообщение лога. */
        date = new Date();
        /** Тут мы получим "01-01-2014 15:55:55" */
        let day, month, year, hour, minutes, seconds;
        year = date.getFullYear();
        day = str_pad(date.getDate());
        month = str_pad(date.getMonth() + 1);
        hour = str_pad(date.getHours());
        minutes = str_pad(date.getMinutes());
        seconds = str_pad(date.getSeconds());
        if (CONST_IS_CLIENT_SIDE) {
            dateFormated = minutes + ':' + seconds;
        } else {
            dateFormated = day + '-' + month + '-' + year + ' ' + hour + ':' + minutes + ':' + seconds;
        }
        // превратим уровень лога из константы в человеко-читаемый текст.
        levelTitle = typeTitles[level];
        // соединим время, текст уровня лога и сообщение лога в одну строку
        logText = dateFormated + ' [' + levelTitle + '] ' + message;
        if (!details) details = '';
        // добавим к тексту лога детали, если они были переданы
        if (CONST_IS_SERVER_SIDE) {
            // превратим в строку переданные детали лога.
            if (details) details = JSON.stringify(details);
        }
        // выведем на экран
        cache.push(logText);
        cache.shift();
        switch (channel) {
            default:
                switch (level) {
                    case Logs.LEVEL_ERROR:
                        console.error(" > " + logText, details);
                        break;
                    case Logs.LEVEL_WARNING:
                        console.warn(" > " + logText, details);
                        break;
                    default:
                        console.log(" > " + logText, details);
                        break;
                }
                break;
            case Logs.CHANNEL_VK_PAYMENTS:
                FS.writeFile(CONST_DIR_SERVER + '/logs/vk_payments.log', logText + details + "\r\n", {flag: 'a'}, function () {
                });
                break;
            case Logs.CHANNEL_VK_STUFF:
                FS.writeFile(CONST_DIR_SERVER + '/logs/vk_stuff.log', logText + details + "\r\n", {flag: 'a'}, function () {
                });
                break;
            case Logs.CHANNEL_VK_HEALTH:
                FS.writeFile(CONST_DIR_SERVER + '/logs/vk_health.log', logText + details + "\r\n", {flag: 'a'}, function () {
                });
                break;
        }
        if (level === Logs.LEVEL_ERROR || level === Logs.LEVEL_FATAL_ERROR) {
            if (typeof CONST_IS_CLIENT_SIDE) {
                //@todo client errors channel
                // SAPILogs.log(message, level, details);
            }
        }
        // если это фатальная ошибка - завершим работу программы.
        if (level === Logs.LEVEL_FATAL_ERROR) {
            self.showCache();
            throw new Error("Vse polamalos'!");
        }
    };

    /**
     * Дополним нулями значение и вернёт строку
     * Тут это специфичная функция, дополнит нулями число спереди до 2ух знаков.
     * @param sourceValue {number}
     */
    let str_pad = function (sourceValue) {
        return "00000".substr(0, 2 - sourceValue.toString().length) + sourceValue;
    };

    this.setLevel = function (level) {
        trigger_level = level;
    };

    /* константы типов логов */

    /**
     * Детально.
     */
    this.LEVEL_DETAIL = 1;

    /**
     * Оповещение.
     */
    this.LEVEL_NOTIFY = 2;

    /**
     * Внимание.
     */
    this.LEVEL_WARNING = 3;

    /**
     * Ошибка.
     */
    this.LEVEL_ERROR = 4;

    /**
     * Фатальная ошибка.
     */
    this.LEVEL_FATAL_ERROR = 5;

    this.alert = function (level, message) {
        if (level < trigger_level) return;
        alert(message);
    };

    let typeTitles = {};
    /** Человеко-читаемые типы логов. */
    typeTitles[this.LEVEL_DETAIL] = 'd';
    typeTitles[this.LEVEL_NOTIFY] = 'N';
    typeTitles[this.LEVEL_WARNING] = 'w';
    typeTitles[this.LEVEL_ERROR] = 'E';
    typeTitles[this.LEVEL_FATAL_ERROR] = 'FE';
};
/**
 * Статичный класс.
 * @type {Logs}
 */
Logs = new Logs();

Logs.CHANNEL_VK_PAYMENTS = 1;
Logs.CHANNEL_VK_STUFF = 2;
Logs.CHANNEL_VK_HEALTH = 3;

Logs.depends = [];

/** Для кросс-сайдных компонент */
if (CONST_IS_SERVER_SIDE) {
    global['Logs'] = Logs;
}if(window["Logs"] !== undefined){window["Logs"].__path="components/base/Logs.js"};

/** ../client/components/base/OnIdle.js */
let OnIdle = function () {
    let self = this;

    this.stack = [];

    this.init = function (callbackAfterInit) {
        setTimeout(OnIdle.iterate, Config.OnIdle.animateInterval * 15);
        callbackAfterInit();
    };

    this.register = function (func) {
        self.stack.push(func);
    };

    this.iterate = function () {

        for (let i in self.stack) {
            self.stack[i]();
        }
        setTimeout(OnIdle.iterate, Config.OnIdle.animateInterval);
    };

};

OnIdle = new OnIdle;if(window["OnIdle"] !== undefined){window["OnIdle"].__path="../client/components/base/OnIdle.js"};

/** ../client/components/base/PageController.js */
/**
 * Page controller
 * @constructor
 */
let PageController = function () {
    let self = this;

    let currentPage;

    /**
     * All blocks
     * @type {Array}
     */
    let blocks = [];

    /**
     * Add page blocks to page controller stack.
     * @param blocksToAdd {Array} массив.
     */
    this.addBlocks = function (blocksToAdd) {
        blocksToAdd.forEach(function (block) {
            blocks.push({
                block: block,
                showed: false
            });
            if (!block.init) {
                Logs.log("PageController.addPage. block must have method init(). ", Logs.LEVEL_FATAL_ERROR, block);
            }
            if (!block.show) {
                Logs.log("PageController.addPage. block must have method show().", Logs.LEVEL_FATAL_ERROR, block);
            }
            if (!block.hide) {
                Logs.log("PageController.addPage. block must have method hide()", Logs.LEVEL_FATAL_ERROR, block);
            }
            if (!block.redraw) {
                Logs.log("PageController.addPage. block must have method redraw()", Logs.LEVEL_FATAL_ERROR, block);
            }
            block.init();
        });
    };

    /**
     * Show requested page-blocks, and hide other page-blocks
     * @param pagesToShow {Array}
     */
    this.showBlocks = function (pagesToShow) {
        let toShow;
        for (let i in blocks) {
            toShow = false;
            for (let j in pagesToShow) {
                if (blocks[i].block === pagesToShow[j]) {
                    toShow = true;
                }
            }
            if (toShow) {
                if (blocks[i].showed === false) {
                    blocks[i].block.show();
                    blocks[i].showed = true;
                }
            } else {
                if (blocks[i].showed === true) {
                    blocks[i].block.hide();
                    blocks[i].showed = false;
                }
            }
        }

        self.redraw();
    };

    let pendingData = false;

    this.redrawCount = 0;

    this.pendingData = function (value) {
        pendingData = value;
    };

    let redrawTimer = null;
    /**
     * Redraw all page-blocks(include hidden)
     */
    this.redraw = function () {
        if (pendingData) {
            if (!redrawTimer) {
                redrawTimer = setTimeout(PageController.redraw, 1000);
            }
            return;
        }
        redrawTimer = null;
        PageController.redrawCount++;
        /*blocks.forEach(function(block){
            block.block.redraw();
        });
        */
        for (let i in blocks) {
            blocks[i].block.redraw();
        }
    };

    /**
     * Show requested page with page-blocks
     * @param page
     */
    this.showPage = function (page) {
        currentPage = page;
        self.showBlocks(page.blocks);
    };

    /**
     * Is page showed now?
     * @param page
     */
    this.isShowedNow = function (page) {
        return page === currentPage;
    };

    /**
     * Return current page
     * @returns {*}
     */
    this.getCurrentPage = function () {
        return currentPage;
    };
};

/** @type {PageController} */
PageController = new PageController();if(window["PageController"] !== undefined){window["PageController"].__path="../client/components/base/PageController.js"};

/** ../client/components/base/Profiler.js */
/**
 * Dummy.
 * @constructor
 */
let Profiler = function () {
    let self = this;

    this.start = function (id) {

    };

    this.stop = function (id) {

    };

    this.getNewId = function (title) {

    };

    this.printReport = function () {

    };

    this.saveToDB = function () {

    };

    this.getTextReport = function () {

    };

    this.init = function (afterInitCallback) {

    };
};

/**
 * ��������� �����.
 * @type {Profiler}
 */
Profiler = new Profiler();if(window["Profiler"] !== undefined){window["Profiler"].__path="../client/components/base/Profiler.js"};

/** ../client/components/base/SocNet.js */
/**
 * Компонент для работы с социальной сетью.
 * @constructor
 */

let SocNet = function () {

    let self = this;
    let socNetTypeId = null;

    this.init = function (afterInitCallBack) {

        Logs.log("SocNet.Init()", Logs.LEVEL_NOTIFY);
        switch (self.getType()) {
            case SocNet.TYPE_VK:
                self.__proto__ = SocNetVK;
                break;
            case SocNet.TYPE_STANDALONE:
                self.__proto__ = SocNetStandalone;
                break;
            default:
                Logs.log("Wrong soc net type", Logs.LEVEL_FATAL_ERROR);
                break;
        }
        self.__proto__.init(afterInitCallBack);
    };

    /**
     * Return Soc net type Id.
     * @see SocNet.TYPE_*
     * @returns {*}
     */
    this.getType = function () {
        if (!socNetTypeId) {
            // VK - is a..detected by url request!
            if (SocNetVK.detectIsItThat()) {
                socNetTypeId = SocNet.TYPE_VK;
            }
            if (SocNetStandalone.detectIsItThat()) {
                socNetTypeId = SocNet.TYPE_STANDALONE;
            }
            if (!socNetTypeId) {
                Logs.log("Не удалось определить тип социальной сети(платформы)", Logs.LEVEL_FATAL_ERROR);
            }
        }

        return socNetTypeId;
    }
};
/**
 * Статичный класс.
 * @type {SocNet}
 */
SocNet = new SocNet();
/**
 * Тип социальной сети(платформы), вКонтакте.
 * @type {number}
 */
SocNet.TYPE_VK = 1;
/**
 * Тип социальной сети(платформы), сайт http://krestiki-noliki.xyz/.
 * @type {number}
 */
SocNet.TYPE_STANDALONE = 2;
/**
 * Константа пол: неизвестен\неустановлен.
 * @type {number}
 */
SocNet.SEX_UNKNOWN = 1;
/**
 * Константа пол: женский.
 * @type {number}
 */
SocNet.SEX_WOMAN = 2;
/**
 * Константа пол: мужской
 * @type {number}
 */
SocNet.SEX_MAN = 3;
if(window["SocNet"] !== undefined){window["SocNet"].__path="../client/components/base/SocNet.js"};

/** ../client/components/base/SocNetStandalone.js */
/**
 * Компонет для работы с социальной сетью(платформой): сайтом http://krestiki-noliki.xyz/
 * @constructor
 */

let SocNetStandalone = function () {

    this.init = function () {
    };

    this.getAuthParams = function () {
        return {};
    };

    this.getUserProfileUrl = function () {
        Logs.log("TODO Me, SocNetStandalone.getUserProfileUrl", Logs.LEVEL_WARNING);
        return '/notFound/todo/me/please/:)';
    };

    this.openInviteFriendDialog = function () {
        Logs.log("todo me SocNetStandalone.openIvniteFirendDialog", Logs.LEVEL_WARNING);
        alert('Sorry, but functional is not realized!');
    };

    this.getSocNetUserId = function () {
        let socNetUserId;
        socNetUserId = parseInt(getQueryVariable('soc-net-user-id'));
        if (!socNetUserId) {
            Logs.log("TODO Me. SocNetStandlaone.getSocNetUesrId and ... guset mode :)", Logs.LEVEL_WARNING);
            socNetUserId = 111; // is it guest!!!
        }
        return socNetUserId;
    };

    let friends = [];
    for (let i = 0; i < 10000; i++) {
        friends.push(i);
    }
    this.getFriendIds = function (callback) {
        callback(friends);
    };

    this.getUserInfo = function (id, callback) {
        let randomName = [
            'Кириллов Юрий Валериевич field-barrel.png',
            'Пахомов Александр Григорьевич field-box.png',
            'Негода Устин Леонидович field-red.png',
            'Грабчак Роман Андреевич field-green.png',
            'Наумов Людвиг Артёмович field-blue.png',
            'Симонов Игнатий Васильевич field-purple.png',
            'Харитонов Яромир Александрович field-yellow.png',
            'Носков Людвиг Романович field-sand.png',
            'Крюков Марк Романович field-poly-color.png',
            'Киранов Марат Романович field-gold.png',
            'Чубайк Николай Викторович field-poly-color.png',
            'Пушкин Александр Сергеевич field-alpha.png',
            'Билл Гейтс Ибнабабн field-beta.png',
            'Стив Джоб Jobs field-gamma.png',
        ];
        let info = {};
        if (id === this.getSocNetUserId() && false) {
            info.first_name = 'Админ';
            info.last_name = 'Админов';
            info.photo_50 = 'button-shuffle-rest.png';
            info.photo_100 = 'button-shuffle-rest.png';
        } else {
            info.first_name = randomName[id % randomName.length].split(' ')[0];
            info.last_name = randomName[id % randomName.length].split(' ')[1];
            info.photo_50 = randomName[id % randomName.length].split(' ')[3];
            info.photo_100 = randomName[id % randomName.length].split(' ')[3];
        }
        info.id = id;
        info.sex = SocNet.SEX_UNKNOWN;
        callback([info]);
    };

    this.openOrderDialog = function (votes) {
        let product = DataShop.getGoldProductByPrice(votes);
        let qty = confirm("Купить " + product.quantity + "монет за " + votes + " стенделонов?");
        if (qty) {
            //@todo callback here!
            //https://8ffd246e-5d74-49a5-8696-e92eff606a60.pub.cloud.scaleway.com/service/vk_buy
            //https://local.host/service/standalone_buy
            //do something here
        }
    };

    /**
     * Detect is now is a that soc net\platform.
     * @returns {boolean}
     */
    this.detectIsItThat = function () {
        if (window.PLATFORM_ID === 'STANDALONE') return true;
        return false;
    };
};

/**
 * Статичный класс.
 * @type {SocNetStandalone}
 */
SocNetStandalone = new SocNetStandalone();if(window["SocNetStandalone"] !== undefined){window["SocNetStandalone"].__path="../client/components/base/SocNetStandalone.js"};

/** ../client/components/base/SocNetVK.js */
/**
 * Компонент для работы с социальной сетью.
 * @constructor
 */

let SocNetVK = function () {

    let self = this;
    let getParams = {};

    // для вконтакте

    // ------------- CLIENT
    let parseSocNetURL = function () {
        getParams = {
            viewer_id: getQueryVariable('viewer_id'),
            api_id: getQueryVariable('api_id'),
            auth_key: getQueryVariable('auth_key'),
            secret: getQueryVariable('secret'),
            access_token: getQueryVariable('access_token')
        };
        /* Other possible GET params from VK
         api_url:http://api.vk.com/api.php
         api_id:4467180
         api_settings:8199
         viewer_id:12578187
         viewer_type:0
         sid:c57ce42cb7fefaf59d1456800cdc86a9c732b7d9e99a84cc6e00147150fd3d34532c97317c695edfdcb7c
         secret:3704c9427d
         access_token:4fe7830d6ecd2eeac26cc5a3d009fa1dcf6cb268765347fcda81f97405817420835122f29cf5834afbedf
         user_id:0
         group_id:0
         is_app_user:1
         auth_key:1bb91dabd1b8e7913c3ebb052f7d2a39
         language:0
         parent_language:0
         ad_info:ElsdCQBeRFJsBAxcAwJSXHt5C0Q8HTJXUVBBJRVBNwoIFjI2HA8E
         is_secure:0
         ads_app_id:4467180_e18d649ad35faed323
         referrer:unknown
         lc_name:fe8f8c15
         hash:;
         */
    };

    this.getAuthParams = function () {
        /*	auth_key = md5(app_id+'_'+viewer_id+'_'+app_secret); */
        return {
            authKey: getParams.auth_key,
            appId: getParams.api_id
        };
    };

    /**
     * Возвращает url на профиль пользователя в социальной сети.
     * @param socNetTypeId {Number} id социальной сети SocNet.TYPE_*
     * @param socNetUserId {Number} id пользователя в соц.сети.
     * @returns {string} url на профиль пользователя в соц.сети.
     */
    this.getUserProfileUrl = function (socNetTypeId, socNetUserId) {
        return 'http://vk.com/id' + socNetUserId;
    };

    /**
     * Открыть диалог приглашения друзей.
     * @returns {boolean}
     */
    this.openInviteFriendDialog = function () {
        VK.callMethod('showInviteBox');
    };

    this.openOrderDialog = function (votes) {
        VK.callMethod('showOrderBox',{
            type: 'votes',
            votes: votes
        });
    };

    this.getFriendIds = function (callback) {
        VK.api('friends.getAppUsers', {}, function (data) {
            callback(data.response)
        });
    };

    this.getUserInfo = function (id, callback) {
        VK.api('users.get', {
            user_ids: id,
            fields: 'photo_50,photo_100'
        }, function (data) {
            callback(data.response);
        });
    };

    /**
     * Инициализация VK.
     * @see WebSocketServer : let loadClientCode {Function}
     */
    this.init = function () {
        let onSuccess, onFail;
        onSuccess = function () {
            Logs.log("VK client API inited.", Logs.LEVEL_NOTIFY);
        };
        onFail = function () {
            alert('Произошла ошибка доступа к вКонтакте, обратитесь к автору приложения.');
            Logs.log("SocNetVK Fail", Logs.LEVEL_FATAL_ERROR);
        };
        VK.init(onSuccess, onFail, '5.95');
        parseSocNetURL();
    };

    this.getSocNetUserId = function () {
        return getParams.viewer_id;
    };

    this.detectIsItThat = function () {
        if (window.PLATFORM_ID == 'VK') return true;
        return false;
    }

};
/**
 * Статичный класс.
 * @type {SocNetVK}
 */
SocNetVK = new SocNetVK();
if(window["SocNetVK"] !== undefined){window["SocNetVK"].__path="../client/components/base/SocNetVK.js"};

/** ../client/components/base/Sounds.js */
let Sounds = function () {
    let self = this;

    let cache = {};

    this.enabled = true;
    this.PATH_CHALK = '/sounds/chalk.mp3';

    this.toggle = function () {
        if (self.enabled)
            self.off();
        else self.on();
    };

    this.isEnabled = function () {
        return self.enabled;
    };

    this.on = function () {
        self.enabled = true;
        document.cookie = 'settings_sound=on';
    };

    this.off = function () {
        self.enabled = false;
        document.cookie = 'settings_sound=off';
    };

    this.play = function (path, volume) {
        if (!self.enabled) {
            return;
        }
        if (!cache[path]) {
            cache[path] = new Audio(path + "?t=" + 1123);
        }
        if (!volume) {
            volume = 1.0;
        }
        cache[path].volume = volume;
        cache[path].play();
    };

    if (document.cookie.search('settings_sound=off') !== -1) {
        self.off();
    }
};

Sounds = new Sounds;if(window["Sounds"] !== undefined){window["Sounds"].__path="../client/components/base/Sounds.js"};

/** ../client/components/base/WebSocketClient.js */
/**
 * Компонент обеспечивающий соединение с сервером.
 * @constructor
 */
let WebSocketClient = function () {
    let self = this;

    /**
     * Хост сервера.
     * @type {string}
     */
    let host = null;

    /**
     * Порт сервера.
     * @type {int}
     */
    let port = null;

    /**
     * Протокол соединения.
     * ws|wss
     * @type {string}
     */
    let protocol = null;

    /**
     * id соединиения.
     * Если вдруг у нас несколько соединений.
     * @type {null}
     */
    let connectionId = null;

    let url;

    this.init = function (afterInitCallback) {
        //port = window.document.location.protocol == 'https:' ? 443 : 80;
        protocol = window.document.location.protocol == 'https:' ? 'wss' : 'ws';
        host = Config.WebSocketClient.host;
        port = Config.WebSocketClient.port;
        url = Config.WebSocketClient.url;
        afterInitCallback();
    };

    this.onData = null;
    this.onConnect = null;
    this.onDisconnect = null;

    /**
     * Сюда мы будем получать данные и отправлять их на сервер.
     * Примечание: Однако, если соединения с серверм нет, то мы будем просто добавлять их в буффер.
     * @param data string
     */
    this.sendData = function (data) {
        packetBuffer.push(data);
        trySend();
        return true;
    };

    /**
     * Просто выполним инициализацию.
     * Собсвтено подсоединимся к серверу.
     */
    this.run = function () {
        checkBeforeInit();
        init();
    };

    let checkBeforeInit = function () {
        if (typeof self.onConnect != 'function') {
            Logs.log("onConnect must be function", Logs.LEVEL_FATAL_ERROR, self.onConnect);
        }
        if (typeof self.onDisconnect != 'function') {
            Logs.log("onConnect must be function", Logs.LEVEL_FATAL_ERROR, self.onDisconnect);
        }
        if (typeof self.onData != 'function') {
            Logs.log("onConnect must be function", Logs.LEVEL_FATAL_ERROR, self.onData);
        }
    };

    /**
     * Состояние соединения:
     * true - соединение активно
     * false - нет соединения.
     */
    let isConnected = false;

    /**
     * Буфер пакетов данных.
     * Впервую очередь все данные попадают сюда, а уже потом отправляются.
     * На случай, если нет соединения сейчас, но оно появиться потом.
     */
    let packetBuffer = [];

    /**
     * Собственно сокет.
     * @type {null}
     */
    let socket = null;

    let connectCount = 0;

    /**
     * Инициалиизация.
     * Создадим объект клиента
     * Установим обработчики.
     */
    let init = function () {
        connect();
    };

    /**
     * Реализовать коннект.
     */
    let connect = function () {
        let uri;
        connectCount++;
        uri = protocol + "://" + host + ":" + port + url;
        Logs.log("WebSocket, connectCount:" + connectCount, Logs.LEVEL_NOTIFY, {uri: uri});
        socket = new WebSocket(uri);
        /** Установим обработчики. */
        socket.onopen = onOpen;
        socket.onclose = onClose;
        socket.onmessage = onMessage;
        socket.onerror = onError;
    };

    /**
     * Обработчик при открытии соединения.
     */
    let onOpen = function () {
        isConnected = true;
        /* На случай, если буфер не пуст. */
        trySend();
        connectionId = ++WebSocketClient.connectionId;
        self.onConnect(connectionId);
    };

    /**
     * Обработчик при закрытие соединения.
     * @param event
     */
    let onClose = function (event) {
        isConnected = false;
        connectCount--;
        if (event.wasClean) {
            Logs.log("WebSocket: Соединение закрыто успешно.");
        } else {
            Logs.log("WebSocket: Соединение закрыто, отсутствует соединение.");
        }
        Logs.log('WebSocket: Код: ' + event.code + ' причина: ' + event.reason);
        self.onDisconnect(connectionId);
        setTimeout(tryReconnect, 3000);
    };

    let tryReconnect = function () {
        if (isConnected === false) {
            Logs.log('Try reconnect', Logs.LEVEL_NOTIFY);
            if (connectCount < 3) {
                connect();
            }
        }
    };

    /**
     * Обработчик при получении данных(сообщения) от сервера.
     * @param event
     */
    let onMessage = function (event) {
        /* Logs.log("WebSocket: Получены данные.", Logs.LEVEL_DETAIL, event.data); */
        self.onData(event.data, connectionId);
    };

    /**
     * Обработчик ошибок вебсокета.
     * @param error
     */
    let onError = function (error) {
        Logs.log("WebSocket: Ошибка ", Logs.LEVEL_NOTIFY, error.timeStamp);
    };

    /**
     * Отправка данных из буфера.
     * Если нет данных в буфере возвращаемся.
     * Если нет соединения, то пробуем отправить их позже.
     * Берем пакет из буфера, удаляе его из буфера.
     * Отправляем пакет на сервер.
     * Если в буфере еще есть данные, пробуем их отправить позже.
     */
    let trySend = function () {
        let data;
        // если буфер пуст - уходим.
        if (!packetBuffer.length) {
            return;
        }
        /* Если нет соединения пробуем позже. */
        if (!isConnected) {
            //setTimeout(trySend, self.trySendTimeout);
            return;
        }
        /* Берем элемент из буфера. */
        data = packetBuffer.shift();
        socket.send(data);
        /* Logs.log("WebSocketClient.send data: length=" + data.length, Logs.LEVEL_DETAIL); */
        /* Остальные данные отправим позже. */
        if (packetBuffer.length) {
            setTimeout(trySend, 1500);
        }
    };
};

/**
 * По сути это просто номер соединения в пределах жизни скрипта.
 */
WebSocketClient.connectionId = 0;if(window["WebSocketClient"] !== undefined){window["WebSocketClient"].__path="../client/components/base/WebSocketClient.js"};

/** ../client/config.local.host.tri-base.js */
let fps = 33.3;
let Config = {
    Logs: {
        triggerLevel: Logs.LEVEL_DETAIL
    },
    WebSocketClient: {
        host: 'local.host',
        port: 443,
        url: '/service'
    },
    SocNet: {
        /** VK applicafiton id*/
        appId: 6221265
    },
    OnIdle: {
        /** 1000 ms / 30 fps = 33.3*/
        animateInterval: 1000 / fps,
        second: -1,
        animStep: 1.0
    }
};

Config.OnIdle.second = Config.OnIdle.animateInterval * fps / Config.OnIdle.animStep;
if(window["config.local.host.tri-base"] !== undefined){window["config.local.host.tri-base"].__path="../client/config.local.host.tri-base.js"};

/** ../client//run.js */
window.onload = function () {
    /** Эмуляция совместимости клиентского и серверного кода. */
    let global = window;
    let process = {};
    process.exit = function () {
        console.log("Unexpected termination of work!");
        document.body.innerHTML = 'server is broken!';
        throw new Error("server is broken!");
    };

    /** Передаем управление вхдоной точки. */
    LogicMain = new LogicMain();
    LogicMain.main();
};
if(window["run"] !== undefined){window["run"].__path="../client//run.js"};
SAPIChest = function(){
	this.openChest = function(){
		ApiRouter.executeRequest('SAPIChest' ,'openChest', arguments);
	};
};
SAPIChest = new SAPIChest();
SAPIMap = function(){
	this.reloadLevels = function(){
		ApiRouter.executeRequest('SAPIMap' ,'reloadLevels', arguments);
	};
	this.sendMeMapInfo = function(){
		ApiRouter.executeRequest('SAPIMap' ,'sendMeMapInfo', arguments);
	};
	this.sendMeUsersScore = function(){
		ApiRouter.executeRequest('SAPIMap' ,'sendMeUsersScore', arguments);
	};
	this.finishLevel = function(){
		ApiRouter.executeRequest('SAPIMap' ,'finishLevel', arguments);
	};
};
SAPIMap = new SAPIMap();
SAPIStuff = function(){
	this.sendMeStuff = function(){
		ApiRouter.executeRequest('SAPIStuff' ,'sendMeStuff', arguments);
	};
	this.usedHummer = function(){
		ApiRouter.executeRequest('SAPIStuff' ,'usedHummer', arguments);
	};
	this.usedShuffle = function(){
		ApiRouter.executeRequest('SAPIStuff' ,'usedShuffle', arguments);
	};
	this.usedlightning = function(){
		ApiRouter.executeRequest('SAPIStuff' ,'usedlightning', arguments);
	};
	this.buyHummer = function(){
		ApiRouter.executeRequest('SAPIStuff' ,'buyHummer', arguments);
	};
	this.buyShuffle = function(){
		ApiRouter.executeRequest('SAPIStuff' ,'buyShuffle', arguments);
	};
	this.buylightning = function(){
		ApiRouter.executeRequest('SAPIStuff' ,'buylightning', arguments);
	};
	this.buyHealth = function(){
		ApiRouter.executeRequest('SAPIStuff' ,'buyHealth', arguments);
	};
};
SAPIStuff = new SAPIStuff();
SAPITimeServer = function(){
	this.sendMeTime = function(){
		ApiRouter.executeRequest('SAPITimeServer' ,'sendMeTime', arguments);
	};
};
SAPITimeServer = new SAPITimeServer();
SAPIUser = function(){
	this.authorizeByVK = function(){
		ApiRouter.executeRequest('SAPIUser' ,'authorizeByVK', arguments);
	};
	this.authorizeByStandalone = function(){
		ApiRouter.executeRequest('SAPIUser' ,'authorizeByStandalone', arguments);
	};
	this.sendMeUserInfo = function(){
		ApiRouter.executeRequest('SAPIUser' ,'sendMeUserInfo', arguments);
	};
	this.sendMeUserListInfo = function(){
		ApiRouter.executeRequest('SAPIUser' ,'sendMeUserListInfo', arguments);
	};
	this.sendMeUserIdsBySocNet = function(){
		ApiRouter.executeRequest('SAPIUser' ,'sendMeUserIdsBySocNet', arguments);
	};
	this.onPlayFinish = function(){
		ApiRouter.executeRequest('SAPIUser' ,'onPlayFinish', arguments);
	};
	this.onPlayStart = function(){
		ApiRouter.executeRequest('SAPIUser' ,'onPlayStart', arguments);
	};
	this.zeroLife = function(){
		ApiRouter.executeRequest('SAPIUser' ,'zeroLife', arguments);
	};
};
SAPIUser = new SAPIUser();
ApiRouter.map2 = {
	SAPIChest : SAPIChest,
	SAPIMap : SAPIMap,
	SAPIStuff : SAPIStuff,
	SAPITimeServer : SAPITimeServer,
	SAPIUser : SAPIUser,};
document.addEventListener("DOMContentLoaded", function() {GUI.init();
 PageController.addBlocks([PageBlockBackground,PageBlockField,PageBlockMaps,PageBlockPanel,PageBlockWizard,PageBlockZDialogs]);
 PageField.init();
 PageMain.init();
});