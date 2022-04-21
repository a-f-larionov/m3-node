"use strict";

/** ../client//run.js */
let global = {};
window.onload = function () {
    /** Передаем управление вхдоной точки. */
    LogicMain.main();
};

/** ../client/core/constants.js */
const CONST_IS_SERVER_SIDE = false;
const CONST_IS_CLIENT_SIDE = true;


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
    throw new Error(message);
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
}

/**
 * declination() склоняет числительные по разряду единиц указанного числа
 * 'штука','штуки','штук'
 */
function declination(number, titles) {
    let cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

let clientCrypt = function (str) {
    return str.split('')
        .map(function (s, i) {
            return String.fromCharCode(s.charCodeAt() ^ DataCross.clientCryptKey + i)
        })
        .join('');
};

let clientDecrypt = function (str) {
    return str.split('')
        .map(function (s, i) {
            return String.fromCharCode(s.charCodeAt() ^ DataCross.serverCryptKey + i)
        })
        .join('');
};

function chunkIt(arr) {
    let i, j, temparray, chunk = 1000, out = [];
    for (i = 0, j = arr.length; i < j; i += chunk) {
        temparray = arr.slice(i, i + chunk);
        if (i + chunk > j) temparray.isLast = true;
        out.push(temparray);
    }
    return out;
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}


function tlock(key, seconds) {
    if (!seconds) seconds = 1;
    if (tlock.locks[key]) return true;
    tlock.locks[key] = true;
    setTimeout(function () {
        tlock.locks[key] = false;
    }, seconds);
};

tlock.locks = [];
tlock.STUFF_BUTTON = 1;
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
};
/** ../client/components/application/anims/Animate.js */
let Animate = {
    anim: function (animClass, context) {
        let args, animObj, t, requestId;
        t = 0;
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
            t += Config.OnIdle.animStep;
            if (animObj.iterate(t)) {
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
};
/** ../client/components/application/anims/common.js */
let animClouds = function () {

    let startP;
    let clouds;

    this.init = function (source) {
        this.skipAnimLock = true;
        clouds = source;
        startP = [];
        clouds.forEach(function (cloud, i) {
            cloud.vx = 0;
            cloud.vy = 0;
            startP[i] = {x: cloud.x, y: cloud.y};
        });
    };

    this.cycleIt = function (t) {

        let rV;
        rV = {
            x:  Math.random() - 0.5,
            y:  Math.random() - 0.5
        };

        clouds.forEach(function (cloud, i) {
            let sx, sy, s;
            sx = sy = s = 0;

            clouds.forEach(function (cloudfrom) {
                sx = cloudfrom.x - cloud.x;
                sy = cloudfrom.y - cloud.y;
                if (Math.abs(sx) < 10 || Math.abs(sy) < 10) return;
                s = Math.sqrt(Math.pow(sx, 2) + Math.pow(sy, 2));
                //cloud.vx += 1 / s / sx;
                //cloud.vy += 1 / s / sy;
            });


            //if (cloud.x + 200 > DataCross.app.width - 50) cloud.vx -= 3;
            //if (cloud.x < 50) cloud.vx += 3;
            //if (cloud.y + 100 > DataCross.app.height - 50) cloud.vy -= 3;
            //if (cloud.y < 50) cloud.vy += 3;            cloud.vx += Math.random() - 0.5;
            //             cloud.vy += Math.random() - 0.5;

            if (t % 1000 === 1) {
                cloud.vx += rV.x;
                cloud.vy += rV.y;
            }
            cloud.vx += (Math.random() - 0.5) * 0.01;
            cloud.vy += (Math.random() - 0.5) * 0.01;

            let cR = 30;
            sx = cloud.x - startP[i].x;
            sy = cloud.y - startP[i].y;
            if (sx > cR) cloud.vx -= 1;
            if (sy > cR) cloud.vy -= 1;
            if (sx < -cR) cloud.vx += 1;
            if (sy < -cR) cloud.vy += 1;

            cloud.vx *= 0.9999;
            cloud.vy *= 0.95;
            cloud.x += cloud.vx / 10;
            cloud.y += cloud.vy / 10;
        });
    };


    this.iterate = function (t) {
        for (let i = 0; i < 1; i++)
            this.cycleIt(t);
        clouds.forEach(function (cloud) {
            cloud.redraw();
                    });

        return true;
    };

    this.onFinish = function () {

    }
};

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
};
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
        if (dom.bindedDoms.length) {
            dom.bindedDoms.forEach(function (bindedDom) {
                bindedDom.x = dom.x;
                bindedDom.y = dom.y;
                bindedDom.redraw();
            });
        }
        return t + 1 < tFinish;
    };
};

let animLightning = function () {
    let dom;
    let velocity = 0.4;

    this.init = function (p, orientationId) {
        Sounds.play(Sounds.TYPE_LIGHTNING);
        dom = this.animDoms.pop();
        let lineData = Field.getVisibleLength(p, orientationId);
        dom.width = lineData.length * DataPoints.BLOCK_WIDTH;
        dom.height = Images.getHeight('anim-light-1.png');
        if (orientationId === DataObjects.WITH_LIGHTNING_VERTICAL) {
            dom.rotate = 90;
            dom.x = (p.x) * DataPoints.BLOCK_WIDTH;
            dom.y = (lineData.lower) * DataPoints.BLOCK_HEIGHT
                - (Images.getHeight('anim-light-1.png') - DataPoints.BLOCK_HEIGHT) / 2;
            /** Rotate from center like a cos&sin*/
            dom.x -= (dom.width - DataPoints.BLOCK_WIDTH) / 2;
            dom.y += (dom.width - DataPoints.BLOCK_WIDTH) / 2;
        }
        if (orientationId === DataObjects.WITH_LIGHTNING_HORIZONTAL) {
            dom.rotate = 0;
            dom.x = lineData.lower * DataPoints.BLOCK_WIDTH;
            dom.y = p.y * DataPoints.BLOCK_HEIGHT
                - (Images.getHeight('anim-light-1.png') - DataPoints.BLOCK_HEIGHT) / 2;
        }
        dom.show();
        dom.redraw();
    };

    this.iterate = function (t) {
        dom.backgroundImage = Animate.getFrameUrl('anim-light-', t * velocity, 5);
        dom.redraw();
        if (t * velocity < 10) return true;
    };

    this.finish = function () {
        dom.hide();
        this.animDoms.push(dom);
    }
};

let animGemLightning = function () {
    let frames = 5, velocity = 0.5;

    this.skipAnimLock = true;

    this.init = function () {
        // get
        switch (this.objectId) {
            case DataObjects.WITH_LIGHTNING_VERTICAL:
                this.dom.rotate = 90;
                break;
            case DataObjects.WITH_LIGHTNING_HORIZONTAL:
                this.dom.rotate = 0;
                break;
        }
    };

    this.iterate = function (t) {
        this.dom.backgroundImage = Animate.getFrameUrl('a-gem-light-', t * velocity, frames);
        this.dom.redraw();
        return true;
    };

    this.finish = function () {
        this.dom.rotate = 0;
    };
};

let animHummerDestroy = function () {
    let dom, imageUrl = 'anim-hd-1.png';

    let velocity = 0.6;
    let frames = 12;

    this.init = function (p) {
        setTimeout(function () {
            Sounds.play(Sounds.TYPE_GEM_DESTROY);
        }, 150);
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

    this.iterate = function (t) {
        dom.backgroundImage = Animate.getFrameUrl('anim-hd-', t * velocity, frames);
        dom.redraw();
        return t * velocity < frames;
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
        if (dom.bindedDoms.length) {
            dom.bindedDoms.forEach(function (bindedDom) {
                bindedDom.x = dom.x;
                bindedDom.y = dom.y;
                bindedDom.redraw();
            });
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
        dom.backgroundImage = DataObjects.images[Field.getGemId(p)];
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

            dom.backgroundImage = DataObjects.images[Field.getGemId({x: data.to.x, y: data.to.y})];
            dom.x = data.to.x * DataPoints.BLOCK_WIDTH;
            dom.y = data.to.y * DataPoints.BLOCK_HEIGHT;
            dom.show();


            //@todo who to-hide on from point, if to.y == from.y+2
            if (Field.isVisible({x: data.from.x, y: data.from.y}) &&
                !Field.isVisible({x: data.from.x, y: data.from.y + 1})
            ) dom.fallMode = 'to-hide';

            if (!Field.isVisible({x: data.to.x, y: data.to.y - 1}) &&
                Field.isVisible({x: data.to.x, y: data.to.y})
            ) dom.fallMode = 'to-show';

            if (dom.fallMode === 'to-show') {
                /** Спускаем его заранее  */
                dom.y = (data.to.y) * DataPoints.BLOCK_HEIGHT;
                dom.height = DataPoints.BLOCK_HEIGHT;
                dom.width = DataPoints.BLOCK_WIDTH;
                dom.visibleHeight = 0;
                //dom.backgroundImage = DataObjects.objectImages[Field.getGemId({x: dom.from.x, y: dom.p.y + 1})];
                /** Перерисовка backgroundPositionY это хитрый хак и костыль :) */
                dom.backgroundPositionY = DataPoints.BLOCK_HEIGHT;
            }
            dom.redraw();
        });
    };

    this.iterate = function (t) {
        //if (Config.Project.develop) position = position / 5;
        let go;
        go = false;
        doms.forEach(function (dom) {
            switch (dom.fallMode) {
                case 'to-hide':
                    dom.y = dom.startY + velocity * t;
                    dom.height = DataPoints.BLOCK_HEIGHT;
                    dom.visibleHeight = DataPoints.BLOCK_HEIGHT;
                    go |= (dom.y < dom.startY + DataPoints.BLOCK_HEIGHT);
                    break;
                case 'to-show':
                    dom.visibleHeight = velocity * t;
                    dom.backgroundPositionY = DataPoints.BLOCK_HEIGHT - velocity * t;
                    go |= (dom.height < DataPoints.BLOCK_HEIGHT);
                    break;

                case 'just':
                    dom.y = dom.startY + velocity * t;
                    go |= (dom.y < dom.startY + DataPoints.BLOCK_HEIGHT);
                    break;
            }
            if (dom.bindedDoms.length) {
                dom.bindedDoms.forEach(function (bindedDom) {
                    bindedDom.x = dom.x;
                    bindedDom.y = dom.y;
                    bindedDom.redraw();
                });
            }
            dom.redraw();
        });
        return go;
    };

    this.finish = function () {
        doms.forEach(function (dom) {
            dom.backgroundPositionY = 0;
            dom.height = DataPoints.BLOCK_HEIGHT;
            dom.visibleHeight = undefined;
            dom.fallMode = undefined;
            dom.redraw();
        });
    }
};

let animShuffle = function () {
    let dom;
    let velocity = 20;

    this.init = function (x, y) {
        Sounds.play(Sounds.TYPE_SHUFFLE);
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

    this.iterate = function (t) {
        dom.rotate = t * velocity;
        dom.redraw();
        return t < 360 / velocity;
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
            if (this.gemDoms[p.x][p.y].bindedDoms.length) {
                this.gemDoms[p.x][p.y].bindedDoms.forEach(function (bindedDom) {
                    list.push({
                        startY: bindedDom.y,
                        dom: bindedDom
                    });
                });
            }
        }, this);
    };

    this.iterate = function (position) {
        list.forEach(function (el) {
            el.dom.y = el.startY + Math.cos(Math.PI * position / 15) * 3;
            if (el.dom.bindedDoms)
                el.dom.bindedDoms.forEach(function (bindedDom) {
                    bindedDom.y = el.dom.y;
                });
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

    this.iterate = function (t) {
        offset = Math.cos(Math.PI / 15 * t) * 4;
        imgs.forEach(function (img) {
            img.x = img.p.x + offset / 2;
            img.y = img.p.y + offset / 2;
            img.width = 50 - offset;
            img.height = 50 - offset;
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


let animBlump = function () {
    let elImg;
    let width = 50,
        height = 50,
        offset,
        radius = 16,
        rounds = 1,
        velocity = 2.5,
        skipBecauseAlreadyAnimate = false;
    ;

    this.skipAnimLock = true;

    this.init = function (img) {
        elImg = img;
        if (elImg.animBlump) skipBecauseAlreadyAnimate = true;
        elImg.animBlump = true;
    };

    this.iterate = function (t) {
        if (skipBecauseAlreadyAnimate) return false;
        offset = radius + Math.cos((2 * Math.PI * t / 60 * velocity) - Math.PI) * radius;
        elImg.x = elImg.sX - offset / 2;
        elImg.y = elImg.sY - offset / 2;
        elImg.width = width + offset;
        elImg.height = height + offset;
        elImg.redraw();

        return (t < 60 * rounds / velocity);
    };

    this.finish = function () {
        elImg.x = elImg.sX;
        elImg.y = elImg.sY;
        elImg.width = width;
        elImg.height = height;
        elImg.redraw();
        elImg.animBlump = false;
    }
};

/** ../client/components/application/capi/CAPILog.js */
/**
 * @type {CAPILog}
 * @constructor
 */
let CAPILog = function () {

    this.log = function (ctnx, message, data) {
        console.log(message, data);
    };
};

/** @type {CAPILog} */
CAPILog = new CAPILog();
/** ../client/components/application/capi/CAPIMap.js */
/**
 * @type {CAPIMap}
 * @constructor
 */
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
     */
    this.gotMapsInfo = function (ctnx, mapId, map, points, userPoints) {
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
            'α': DataObjects.OBJECT_ALPHA,
            '‖': DataObjects.OBJECT_BLOCK,


            'β': DataObjects.OBJECT_BETA,
            'γ': DataObjects.OBJECT_GAMMA,

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
            DataPoints.setPointUserScore(info.pointId, info.userId, info.score);
        });
        PageController.redraw();
    };

    this.gotPointTopScore = function (cntx, pointId, topScore) {
        LogicUser.loadPointTopScore(pointId, topScore);
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
};

/** @type {CAPIMap} */
CAPIMap = new CAPIMap();

/** ../client/components/application/capi/CAPIStuff.js */
/**
 * @type {CAPIStuff}
 * @constructor
 */
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

CAPIStuff = new CAPIStuff();
/** ../client/components/application/capi/CAPITimeServer.js */
/**
 * @type {CAPITimeServer}
 * @constructor
 */
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
CAPITimeServer = new CAPITimeServer();
/** ../client/components/application/capi/CAPIUser.js */
/**
 * @type {CAPIUser}
 * @constructor
 */
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
        // user.create_tm = LogicTimeClient.convertToClient(user.create_tm);
        // user.login_tm = LogicTimeClient.convertToClient(user.login_tm);
        // user.logout_tm = LogicTimeClient.convertToClient(user.logout_tm);
        user.fullRecoveryTime = LogicTimeClient.convertToClient(user.fullRecoveryTime);
        LogicUser.updateUserInfo(user);
    };

    this.updateUserListInfo = function (cntx, userList) {
        userList = userList.map(function (user) {
            return {
                id: user[0],
                nextPointId: user[1],
                socNetUserId: user[2],
                fullRecoveryTime: user[3]
            };
        });
        PageController.pendingData(true);
        userList.forEach(function (user) {
            CAPIUser.updateUserInfo(cntx, user);
        });
        PageController.pendingData(false);
    };

    this.gotFriendsIds = function (cntx, ids) {
        //@todo got userIds for that map
        LogicUser.loadFriendIds(ids);
    };

    this.gotMapFriendIds = function (cntx, mapId, fids) {
        LogicUser.setMapFriendIds(mapId, fids);
    };

    this.gotTopUsers = function (cntx, users) {
        LogicUser.loadTopUsers(users);
    };

    this.gotScores = function (cntx, rows) {
        rows.forEach(function (row) {
            DataPoints.setPointUserScore(row.pointId, row.userId, row.score);
        });
        PageController.redraw();
    };

    /**
     * @param cntx {Object}
     * @param value {boolean}
     */
    this.setOneHealthHide = function (cntx, value, fullRecoveryTime) {
        PageBlockPanel.oneHealthHide = value;
        let user = LogicUser.getCurrent();
        user.fullRecoveryTime = fullRecoveryTime;
        user.fullRecoveryTime = LogicTimeClient.convertToClient(user.fullRecoveryTime);
        LogicUser.updateUserInfo(user);
    }
};

/**
 * Константный класс.
 * @type {CAPIUser}
 */
CAPIUser = new CAPIUser();
/** components/application/data/DataChests.js */
/**
 * @type {DataChests}
 * @constructor
 */
let DataChests = function () {

    let chests = {};

    this.init = function (finished) {
        /** Map-001 */
        chests[1] = {
            id: 1, prizes: [
                {id: DataObjects.STUFF_HUMMER, count: 3},
                {id: DataObjects.STUFF_LIGHTNING, count: 1},
                {id: DataObjects.STUFF_SHUFFLE, count: 1},
            ],
        };
        chests[2] = {
            id: 1, prizes: [
                {id: DataObjects.STUFF_GOLD, count: 500},
                {id: DataObjects.STUFF_HUMMER, count: 2},
            ],
        };
        chests[3] = {
            id: 1, prizes: [
                {id: DataObjects.STUFF_GOLD, count: 500},
                {id: DataObjects.STUFF_LIGHTNING, count: 3},
            ],
        };

        /** Map-002 */
        chests[4] = {
            id: 1, prizes: [
                {id: DataObjects.STUFF_HUMMER, count: 3},
                {id: DataObjects.STUFF_LIGHTNING, count: 2},
                {id: DataObjects.STUFF_SHUFFLE, count: 1},
            ],
        };
        chests[5] = {
            id: 1, prizes: [
                {id: DataObjects.STUFF_GOLD, count: 500},
                {id: DataObjects.STUFF_HUMMER, count: 3},
            ],
        };
        chests[6] = {
            id: 1, prizes: [
                {id: DataObjects.STUFF_GOLD, count: 500},
                {id: DataObjects.STUFF_LIGHTNING, count: 3},
                {id: DataObjects.STUFF_SHUFFLE, count: 1},
            ],
        };

        /** Map-003 */
        chests[7] = {
            id: 1, prizes: [
                {id: DataObjects.STUFF_HUMMER, count: 3},
                {id: DataObjects.STUFF_LIGHTNING, count: 2},
                {id: DataObjects.STUFF_SHUFFLE, count: 1},
            ],
        };
        chests[8] = {
            id: 1, prizes: [
                {id: DataObjects.STUFF_GOLD, count: 1500},
                {id: DataObjects.STUFF_SHUFFLE, count: 2},
            ],
        };
        chests[9] = {
            id: 1, prizes: [
                {id: DataObjects.STUFF_GOLD, count: 1500},
                {id: DataObjects.STUFF_HUMMER, count: 3},
            ],
        };
        if (finished) finished();
    };

    this.getById = function (id) {
        return chests[id];
    };
};

DataChests = new DataChests();

DataChests.depends = ['Logs'];

/** Для кросс-сайдных компонент */
if (CONST_IS_SERVER_SIDE) {
    global['DataChests'] = DataChests;
}
/** components/application/data/DataCross.js */
/**
 *
 * @type {{app: {width: number, id: number, height: number}, topUsersLimit: number, user: {healthRecoveryTime: number, maxHealth: number}, clientCryptKey: number, serverCryptKey: number}}
 */
let DataCross = {
    user: {
        maxHealth: 5,
        healthRecoveryTime: 60 * 30,
    },
    app: {
        width: 778,
        height: 500,
    },
    clientCryptKey: 3705,
    serverCryptKey: 987,

    topUsersLimit: 6
};

/** Для кросс-сайдных компонент */
if (CONST_IS_SERVER_SIDE) {
    global['DataCross'] = DataCross;
}
/** ../client/components/application/data/DataMap.js */
/**
 * @type {DataMap}
 * @constructor
 */
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
            DataPoints.loadScores(DataMap.getMapPointIds(mapId));
            SAPIMap.sendMeMapInfo(mapId);
        }
    };

    this.setMapById = function (mapId, mapData) {
        maps[mapId] = mapData;
        PageController.redraw();
    };

    this.getCurrent = function () {
        if (!maps[currentMapId]) {
            loadMap();
        }
        return maps[currentMapId];
    };

    this.setCurrentMapId = function (id) {
        if (!id) id = Math.min(DataMap.MAP_ID_MAX, LogicUser.getUserLastMapId());
        if (!id) return;

        if (id > DataMap.MAP_ID_MAX) {
            return;
        }
        if (id <= DataMap.MAP_ID_MIN) {
            return;
        }
        currentMapId = id;
    };

    this.setNextMap = function () {
        /**
         * 1 - При более чем текущая юзера +2 - писать Пройди уровни
         * 2 - Прим максимум - писать
         */
        if (currentMapId >= LogicUser.getUserLastMapId() + 1) {
            PBZDialogs.dialogMessage.showDialog(
                'НЕДОСТУПНО',
                ' ДОСТУП ПОЯВИТСЯ ПОСЛЕ \r\n \r\n ПРОХОЖДЕНИЯ УРОВНЕЙ \r\n\r\n ПРЕДЫДУЩЕЙ КАРТЫ. ',
                5
            );
            return;
        }
        if (currentMapId === DataMap.MAP_ID_MAX) {
            PBZDialogs.dialogMessage.showDialog(
                'СТРОИМ',
                ' УРОВНИ СОЗДАЮТСЯ \r\n\r\n СЛЕДИ ЗА НОВОСТЯМИ В ГРУППЕ! \r\n\r\n И ВОЗВРАЩАЙСЯ В ИГРУ! ',
                5
            );
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

    this.getMapIdFromPointId = function () {
        return Math.ceil(LogicUser.getCurrent().nextPointId / DataMap.POINTS_PER_MAP);
    };

    this.getFirstPointId = function () {
        return DataMap.POINTS_PER_MAP * (currentMapId - 1) + 1;
    };

    this.getLastPointId = function () {
        return this.getFirstPointId() + DataMap.POINTS_PER_MAP - 1;
    };

    this.getMapPointIds = function (mapId) {
        let firstPointId, lastPointId, pointIds;
        firstPointId = DataMap.getFirstPointId(mapId);
        lastPointId = DataMap.getLastPointId(mapId);
        pointIds = [];
        for (let i = firstPointId; i <= lastPointId; i++) pointIds.push(i);
        return pointIds;
    };

    this.getPointIdFromPointNumber = function (number) {
        return this.getFirstPointId() + (number - 1);
    };

    this.getNumberFromPointId = function (pointId) {
        return pointId - this.getFirstPointId() + 1;
    };

    this.countStarsByMapId = function (mapId) {
        let mapStars, user, pointUsersInfo, pid, point, stars;
        if (!mapId) mapId = currentMapId;

        mapStars = 0;
        user = LogicUser.getCurrent();
        if (!user) return 0;
        //for currentUser all scores here
        pointUsersInfo = DataPoints.getPointUserScore(mapId, [user.id]);

        if (!pointUsersInfo) return 0;
        for (let number = 1; number <= DataMap.POINTS_PER_MAP; number++) {
            pid = DataMap.getPointIdFromPointNumber(number);
            point = DataPoints.getById(pid);
            if (!point) continue;

            stars = 0;
            if (!pointUsersInfo[pid]) continue;
            if (!pointUsersInfo[pid][user.id]) continue;

            if (pointUsersInfo[pid][user.id] >= point.score1) stars = 1;
            if (pointUsersInfo[pid][user.id] >= point.score2) stars = 2;
            if (pointUsersInfo[pid][user.id] >= point.score3) stars = 3;
            mapStars += stars;
        }
        return mapStars;
    }
};

/** @Todo super mega crunch */
//@Todonow
/** @type {DataMap} */
DataMap = new DataMap();

/** Server see */
DataMap.MAP_ID_MIN = 1;
DataMap.MAP_ID_MAX = 3;
DataMap.POINTS_PER_MAP = 18;
/** components/application/data/DataObjects.js */
/**
 * @type {DataObjects}
 * @constructor
 */
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
    this.OBJECT_ALPHA = 150;
    /**
     * Монстр-2
     * @type {number}
     */
    this.OBJECT_BETA = 160;
    /**
     * Монстр-3
     * @type {number}
     */
    this.OBJECT_GAMMA = 161;
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

    this.STUFF_HUMMER = 2010;
    this.STUFF_LIGHTNING = 2011;
    this.STUFF_SHUFFLE = 2012;
    this.STUFF_GOLD = 2013;


    this.images = {};
    /** Cell images */
    this.images[this.CELL_INVISIBLE] = 'field-none.png';
    this.images[this.CELL_VISIBLE] = 'field-cell.png';

    /** Gem images */
    this.images[this.OBJECT_HOLE] = 'field-none.png';
    this.images[this.OBJECT_RANDOM] = 'field-none.png';

    this.images[this.OBJECT_RED] = 'field-red.png';
    this.images[this.OBJECT_GREEN] = 'field-green.png';
    this.images[this.OBJECT_BLUE] = 'field-blue.png';
    this.images[this.OBJECT_YELLOW] = 'field-yellow.png';
    this.images[this.OBJECT_PURPLE] = 'field-purple.png';
    this.images[this.OBJECT_SAND] = 'field-sand.png';

    this.images[this.OBJECT_BARREL] = 'field-barrel.png';
    this.images[this.OBJECT_BLOCK] = 'field-block.png';
    this.images[this.OBJECT_POLY_COLOR] = 'field-poly-color.png';
    this.images[this.OBJECT_GOLD] = 'field-gold.png';
    this.images[this.OBJECT_TILE] = 'field-tile.png';

    this.images[this.OBJECT_ALPHA] = 'field-alpha.png';
    this.images[this.OBJECT_BETA] = 'field-beta.png';
    this.images[this.OBJECT_GAMMA] = 'field-gamma.png';

    this.images[this.OBJECT_BOX] = 'field-box.png';
    this.images[this.OBJECT_CHAIN_A] = 'field-chain-a.png';
    this.images[this.OBJECT_CHAIN_B] = 'field-chain-b.png';

    /** Gem-lightning images */
    this.images[this.WITH_LIGHTNING_VERTICAL] = 'a-gem-light-1.png';
    this.images[this.WITH_LIGHTNING_HORIZONTAL] = 'a-gem-light-1.png';
    this.images[this.WITH_LIGHTNING_CROSS] = 'a-gem-light-1.png';

    this.images[this.STUFF_HUMMER] = 'button-hummer-rest.png';
    this.images[this.STUFF_LIGHTNING] = 'button-lightning-rest.png';
    this.images[this.STUFF_SHUFFLE] = 'button-shuffle-rest.png';
    this.images[this.STUFF_GOLD] = 'coin.png';

};

/** @type {DataObjects} */
DataObjects = new DataObjects();


/** Для кросс-сайдных компонент */
if (CONST_IS_SERVER_SIDE) {
    global['DataObjects'] = DataObjects;
}
/** ../client/components/application/data/DataPoints.js */
/**
 * @type {DataPoints}
 * @constructor
 */
let DataPoints = function () {

    this.FIELD_MAX_WIDTH = 10;
    this.FIELD_MAX_HEIGHT = 11;

    this.BLOCK_WIDTH = 50;
    this.BLOCK_HEIGHT = 50;

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
                out[pId][uid] = this.getScore(pId, uid);
            }
        }
        return out;
    };

    this.setPointUserScore = function (pid, uid, score) {
        if (!pointUserScore[pid]) pointUserScore[pid] = {};
        if (!pointUserScore[pid][uid]) pointUserScore[pid][uid] = {};
        pointUserScore[pid][uid].score = score;
        LogicUser.flushPointTopScore(pid, uid);
    };

    this.loadScores = function (pids, uids) {
        if (!uids && !(uids = LogicUser.getCurrent().id)) return null;
        if (!(uids instanceof Array)) uids = [uids];

        let toLoadPids = [], toLoadUids = [];
        pids.forEach(function (pid) {
            uids.forEach(function (uid) {
                if (!pointUserScore[pid]) pointUserScore[pid] = {};
                if (!pointUserScore[pid][uid]) pointUserScore[pid][uid] = {};
                if (!pointUserScore[pid][uid].loading && (pointUserScore[pid][uid].loading = true)) {
                    toLoadPids.push(pid);
                    toLoadUids.push(uids);
                }
            });
        });
        toLoadPids = toLoadPids.filter(onlyUnique);
        toLoadUids = toLoadUids.filter(onlyUnique);
        if (toLoadUids.length && toLoadPids.length)
            SAPIUser.sendMeScores(toLoadPids, toLoadUids);
    };

    this.getScore = function (pid, uid) {
        if (!uid && !(uid = LogicUser.getCurrent().id)) return null;

        if (!pointUserScore[pid]) pointUserScore[pid] = {};
        if (!pointUserScore[pid][uid]) pointUserScore[pid][uid] = {};

        if (!pointUserScore[pid][uid].loading && (pointUserScore[pid][uid].loading = true)) {
            SAPIUser.sendMeScores(pid, uid);
        }

        return pointUserScore[pid][uid].score;
    };

    this.countStars = function (pointId, userId, userScore) {
        let point;
        if (!pointId) pointId = DataPoints.getPlayedId();
        if (!userId) userId = LogicUser.getCurrent().id;
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

        this.objectAnims[DataObjects.WITH_LIGHTNING_VERTICAL] = animGemLightning;
        this.objectAnims[DataObjects.WITH_LIGHTNING_HORIZONTAL] = animGemLightning;
        this.objectAnims[DataObjects.WITH_LIGHTNING_CROSS] = animGemLightning;
    };
};

DataPoints = new DataPoints;

/** components/application/data/DataShop.js */
/**
 * @type {DataShop}
 * @constructor
 */
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
/** @see LogicPayments.doOrderChange */
DataShop.healthGoldPrice = 200;
DataShop.looseTurnsPrice = 200;
DataShop.looseTurnsQuantity = 10;
DataShop.gold = [
    {votes: 1, quantity: 500},
    {votes: 2, quantity: 1100},
    {votes: 3, quantity: 1500}
];
DataShop.hummers = [
    {gold: 500, quantity: 3, imageSrc: 'hummer-big.png',},
    {gold: 1000, quantity: 6, imageSrc: 'hummer-big.png',},
    {gold: 1500, quantity: 9, imageSrc: 'hummer-big.png',}
];
DataShop.shuffle = [
    {gold: 500, quantity: 3, imageSrc: 'shuffle-big.png',},
    {gold: 1000, quantity: 6, imageSrc: 'shuffle-big.png',},
    {gold: 1500, quantity: 9, imageSrc: 'shuffle-big.png',}
];
DataShop.lightning = [
    {gold: 500, quantity: 3, imageSrc: 'lightning-big.png',},
    {gold: 1000, quantity: 6, imageSrc: 'lightning-big.png',},
    {gold: 1500, quantity: 9, imageSrc: 'lightning-big.png',}
];

/** Для кросс-сайдных компонент */
if (CONST_IS_SERVER_SIDE) {
    global['DataShop'] = DataShop;
}
/** ../client/components/application/gui_elements/Dialog.js */
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
/** ../client/components/application/gui_elements/DialogChestYouWin.js */
let DialogChestYouWin = function () {
    let self = this;
    this.__proto__ = new Dialog();

    let elText;

    let imagesEls = {};
    let countersEls = {};

    let chestId = null;

    this.init = function () {
        this.__proto__.init.call(this);
        GUI.pushParent(self.dom);

        this.elHeader.setText('Ты нашёл!');

        elText = GUI.createElement(ElementText, {x: 10, y: 80, width: 480, height: 50});
        elText.setText('Собраны все звезды! \r\nТы открыл сундук и нашел там:');
        elText.show();

        for (let i = 0; i < 8; i++) {
            imagesEls[i] = GUI.createElement(ElementImage, {y: 155, width: 50, height: 50});

            countersEls[i] = GUI.createElement(ElementText, {y: 220, width: 50});
        }
        GUI.popParent();
    };

    this.redraw = function () {
        let chest;
        this.__proto__.redraw.call(this);
        if (!this.dialogShowed) return;
        chest = DataChests.getById(chestId);

        let sX;
        sX = Images.getWidth('window-2.png') / 2
            - ((chest.prizes.length) * 50) / 2
            - (chest.prizes.length - 1) * 25 / 2;

        chest.prizes.forEach(function (prize, i) {
            let img = imagesEls[i];
            let cnt = countersEls[i];
            img.src = DataObjects.images[prize.id];
            cnt.setText('x' + prize.count);


            img.x = sX + (i * 50) + (i) * 5 + 5;

            cnt.x = img.x + 5;

            img.show();
            cnt.show();

            cnt.redraw();
            img.redraw();
        });

        elText.redraw();
    };

    this.showDialog = function (newChestId) {
        chestId = newChestId;
        this.__proto__.showDialog.call(this);
        self.redraw();
    }
};





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
        this.__proto__.elButtonClose.hide();
        this.__proto__.onShowComplete = this.onShowComplete;

        GUI.pushParent(self.dom);

        /** Список целей */
        for (let i in DataObjects.images) {
            /** Список целей - картинки */
            goalsImagesEls[i] = GUI.createElement(ElementImage, {
                x: 200 + i * (DataPoints.BLOCK_WIDTH + 5),
                y: 30,
                src: DataObjects.images[i]
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
};
/** ../client/components/application/gui_elements/DialogGoalsReached.js */
/**
 * @type {DialogGoalsReached}
 * @constructor
 */
let DialogGoalsReached = function () {
    let self = this;
    this.__proto__ = new Dialog();

    let elStarOne = null;
    let elStarTwo = null;
    let elStarThree = null;

    let panel = [];
    let elUserPhotoScore = null;

    let elButtonPlay = null;

    /**
     * Точка с которой нажали.
     * @type {null}
     */
    let pointId = null;
    let friends;



    let elShare = null;


    let share = true;
    let score = null;

    this.init = function () {
        this.__proto__.init.call(this);
        GUI.pushParent(self.dom);

        /** Кол-во звёзд */
        elStarOne = GUI.createElement(ElementImage, {x: 100, y: 40, src: 'star-off-big.png'});
        elStarOne.show();
        elStarTwo = GUI.createElement(ElementImage, {x: 200, y: 40, src: 'star-off-big.png'});
        elStarTwo.show();
        elStarThree = GUI.createElement(ElementImage, {x: 300, y: 40, src: 'star-off-big.png'});
        elStarThree.show();

        [0, 1, 2].forEach(function (i) {
            panel[i] = {
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
                PageController.showPage(PageMain);
            },
            title: 'НА КАРТУ'
        });
        elButtonPlay.show();

        /** Кнопка закрыть */
        GUI.createElement(ElementButton, {
            x: 452, y: 3,
            srcRest: 'button-close-rest.png',
            onClick: function () {
                self.closeDialog();
                PageController.showPage(PageMain);
            }
        }).show();

        GUI.createElement(ElementText, {x: 335, y: 254, text: 'ПОДЕЛИТЬСЯ', fontSize: 11}).show();

        elShare = GUI.createElement(ElementButton, {
            x: 418, y: 242,
            srcRest: 'check-set.png',
            srcHover: 'check-clear.png',
            srcActive: 'check-clear.png',
        });
        elShare.onClick = function () {
            share = !share;
            PageController.redraw();
        };
        elShare.show();

        GUI.popParent();
    };

    this.redraw = function () {
        let user, point, friend, score;
        this.__proto__.redraw.call(this);

        if (!this.dialogShowed) return;

        let topScore = LogicUser.getPointTopScore(pointId);
        let user1, user2, user3;
        friends = [];
        if (topScore) {
            if (topScore.place1Uid) user1 = (LU.getById(topScore.place1Uid));
            if (topScore.place2Uid) user2 = (LU.getById(topScore.place2Uid));
            if (topScore.place3Uid) user3 = (LU.getById(topScore.place3Uid));

            if (user1) friends.push(user1);
            if (user2) friends.push(user2);
            if (user3) friends.push(user3);
        }

        point = DataPoints.getById(pointId);
        this.setTitle('ПРОЙДЕН  ' + pointId);

        user = LogicUser.getCurrent();

        /** @todo copy to DialogGoalds Reacehed*/
        for (let i = 0; i < 3; i++) {
            if ((friend = friends[i]) && friend.id) {
                score = DataPoints.getScore(point.id, friend.id);
                panel[i].elPhotoScore.user = friend;
                panel[i].elPhotoScore.score = score;
            } else {
                panel[i].elPhotoScore.score = 0;
                panel[i].elPhotoScore.user = null;
            }
            panel[i].elPhotoScore.show();
            panel[i].elPhotoScore.redraw();
        }

        elUserPhotoScore.user = LogicUser.getCurrent();
        elUserPhotoScore.score = 0 + DataPoints.getScore(point.id);

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
        //elTitle.redraw();

        if (LogicHealth.getHealths(user) === 0) {
            elButtonPlay.hide();
        } else {
            elButtonPlay.show();
        }

        elShare.srcRest = share ? 'check-set.png' : 'check-clear.png';
        elShare.srcHover = share ? 'check-clear.png' : 'check-set.png';
        elShare.srcActive = elShare.srcHover;
        elShare.redraw();
    };

    this.showDialog = function (pId, fieldScore) {
        LogicWizard.finish(false);
        share = true;
        pointId = pId;
        /** @todo mapId from pointId */
        //mapId = DataMap.getCurrent().id;
        //friends = LogicUser.getFriendIdsByMapIdAndPointIdWithScore(mapId, pId);
        this.__proto__.showDialog.call(this);
        score = fieldScore;
        self.redraw();
    };

    /**
     * @todo
     * - Пост: Я набрал 82100 очков на 11 уровне. А сколько сможешь набрать ты?
     - Пост: Мой результат - 30500 очков на 13 уровне. Сможешь побить мой рекорд?
     * @type {string[]}
     */
    /*let phrases = [
        'Ты сможешь обогнать меня?',
        'Заходи в игру!',
        'Ты сможешь обогнать меня?',
    ];*/

    this.closeDialog = function () {
        if (share) {
            SocNet.post({
                //@todo url app move to config
                userId: LogicUser.getCurrent().socNetUserId,
                message: 'Я набрал ' + score + " " +
                    declination(score, ['очко', 'очка', 'очков'])
                    + '! Ты сможешь обогнать меня? ' +
                    'https://vk.com/app' + Config.SocNet.VK.appId
            });
        }
        this.__proto__.closeDialog();
    };
};
/** ../client/components/application/gui_elements/DialogHealthShop.js */
let DialogHealthShop = function () {
    let self = this;
    this.__proto__ = new Dialog();

    let elHealth5 = null;

    let elButton = null;

    let locked = false;

    /**
     * Чтобы пользователь на купил 2ыйнм кликом
     * @returns {boolean}
     * @todo to tlock
     */
    let lock = function () {
        if (locked) return true;
        locked = true;
        setTimeout(function () {
            locked = false;
        }, 1000);
    };

    this.init = function () {
        let el, offsetX, stepX, offsetY, user;
        this.__proto__.init.call(this);

        offsetX = 30;
        offsetY = 80;
        stepX = 145;

        GUI.pushParent(self.dom);

        this.setTitle('МАГАЗИН');

        let onClick = function () {
            if (lock()) return;
            self.buyHealth5();
        };

        elHealth5 = GUI.createElement(ElementMoneyCount, {
            x: offsetX + stepX - 60, y: offsetY + 10,
            productImg: 'hearth-big.png',
            productCount: LogicHealth.getMaxHealth(), goldCount: DataShop.healthGoldPrice,
            type: 'B',
            onClick: onClick
        });
        self.elements.push(elHealth5);

        elButton = GUI.createElement(ElementButton, {
            x: 185, y: 215,
            srcRest: 'button-red-rest.png',
            srcHover: 'button-red-hover.png',
            srcActive: 'button-red-active.png',
            title: 'КУПИТЬ',
            onClick: onClick
        });
        self.elements.push(elButton);

        user = LogicUser.getCurrent();

        if (SocNet.getType() === SocNet.TYPE_STANDALONE &&
            (user && user.id > 1000)
        ) {

            el = GUI.createElement(ElementButton, {
                x: offsetX + stepX * 2, y: offsetY,
                srcRest: 'shop-health-2.png',
                onClick: function () {
                    if (lock()) return;
                    SAPIUser.zeroLife();
                }
            });
            self.elements.push(el);
        }

        GUI.popParent();
    };

    this.redraw = function () {
        let user;
        user = LogicUser.getCurrent();
        elHealth5.enabled = LogicHealth.getHealths(user) === 0;
        elButton.enabled = LogicHealth.getHealths(user) === 0;
        this.__proto__.redraw.call(this);
    };

    this.buyHealth5 = function () {
        let gold, user;
        gold = LogicStuff.getStuff('goldQty');
        user = LogicUser.getCurrent();

        if (LogicHealth.getHealths(user) > 0) return;

        if (gold < DataShop.healthGoldPrice) {
            PBZDialogs.dialogMoneyShop.showDialog(this, 'не хватило на жизни');
            self.closeDialog();
        } else {
            SAPIStuff.buyHealth();
            LogicStuff.giveAHealth(LogicHealth.getMaxHealth());
            LogicStuff.usedGold(DataShop.healthGoldPrice);
            self.closeDialog();
        }
        PageController.redraw();
    };
};
/** ../client/components/application/gui_elements/DialogJustQuit.js */
let DialogJustQuit = function () {
    let self = this;
    this.__proto__ = new Dialog();

    this.init = function () {
        this.__proto__.init.call(this);
        let element;

        this.setTitle("ВЫЙТИ?");

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
                    SAPIUser.exitGame(DataPoints.getPlayedId());
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
    };
};
/** ../client/components/application/gui_elements/DialogMessage.js */
/**
 * @type {DialogMessage}
 * @constructor
 */
let DialogMessage = function () {
    let self = this;
    this.__proto__ = new Dialog();

    let elMessage = null;

    this.init = function () {
        this.__proto__.init.call(this);

        GUI.pushParent(self.dom);

        elMessage = GUI.createElement(ElementText,
            {x: 45, y: 50, width: 410, height: 200}
        );

        self.elements.push(elMessage);

        GUI.popParent();
    };

    let linesY = {
        undefined: 150,
        1: 150,
        2: 140,
        3: 130,
        4: 120,
        5: 110,
    };
    this.showDialog = function (header, message, lines) {
        this.__proto__.showDialog.call(this);

        this.elHeader.setText(header);
        elMessage.y = linesY[lines];
        elMessage.setText(message);
        self.redraw();
    };
};





/** ../client/components/application/gui_elements/DialogMoneyShop.js */
let DialogMoneyShop = function () {
    let self = this;
    this.__proto__ = new Dialog();

    this.init = function () {
        let el, offsetX, stepX, offsetY;
        this.__proto__.init.call(this);

        offsetX = 20;
        offsetY = 60;
        stepX = 150;

        GUI.pushParent(self.dom);
        this.setTitle("ГОЛОСА");

        for (let i = 0; i < 3; i++) {

            el = GUI.createElement(ElementText, {
                x: offsetX + stepX * i, y: offsetY + 15,
                text: (DataShop.gold[i].votes * 7).toString() + ' \r\n' + declination(
                    DataShop.gold[i].votes * 7,
                    //  ['ГОЛОС', 'ГОЛОСА', 'ГОЛОСОВ']
                    ['РУБЛЬ', 'РУБЛЯ', 'РУБЛЕЙ']
                ),
                color: '#4680C2',
                fontSize: 20, width: Images.getWidth('money_1.png')
            }).show();

            el = GUI.createElement(ElementMoneyCount, {
                x: offsetX + stepX * i, y: offsetY,
                productImg: 'money_' + (i + 1) + '.png',
                productCount: 0, goldCount: DataShop.gold[i].quantity,
                onClick: function () {
                    if (GUI.isFullScreen()) {
                        GUI.fsSwitch();
                    }
                    SocNet.openOrderDialog(DataShop.gold[i].votes);
                    self.closeDialog();
                }
            });

            self.elements.push(el);
        }

        GUI.popParent();
    };

    this.showDialog = function (afterDialog, from) {
        self.__proto__.showDialog(afterDialog);
        SAPILogs.showMoneyDialog(from);
    };

    this.closeDialog = function () {
        self.__proto__.closeDialog();
        SAPILogs.closeMoneyDialog();
    }
};





/** ../client/components/application/gui_elements/DialogPointInfo.js */
/**
 * @type {DialogPointInfo}
 * @constructor
 */
let DialogPointInfo = function () {
    let self = this;
    this.__proto__ = new Dialog();

    let elStarOne = null;
    let elStarTwo = null;
    let elStarThree = null;

    let panel = [];
    let elUserPhotoScore = null;

    let elGeneralButton = null;

    /**
     * Точка с которой нажали.
     * @type {null}
     */
    let pointId = null;
    let friends;

    let isGoalsReached = false;

    let elShare = null;
    let elButtonShare = null;

    let share = true;
    let score = null;

    this.init = function () {
        this.__proto__.init.call(this);
        GUI.pushParent(self.dom);

        /** Кол-во звёзд */
        elStarOne = GUI.createElement(ElementImage, {x: 100, y: 40, src: 'star-off-big.png'});
        elStarOne.show();
        elStarTwo = GUI.createElement(ElementImage, {x: 200, y: 40, src: 'star-off-big.png'});
        elStarTwo.show();
        elStarThree = GUI.createElement(ElementImage, {x: 300, y: 40, src: 'star-off-big.png'});
        elStarThree.show();

        [0, 1, 2].forEach(function (i) {
            panel[i] = {
                elPhotoScore: GUI.createElement(ElementUserScorePhoto, {x: 75 + 75 * i + 15, y: 155})
            }
        });

        elUserPhotoScore = GUI.createElement(ElementUserScorePhoto, {x: 75 + 75 * 3 + 55, y: 155});
        elUserPhotoScore.show();

        /** Кнопка играть */
        elGeneralButton = GUI.createElement(ElementButton, {
            x: 178, y: 240,
            srcRest: 'button-red-rest.png',
            srcHover: 'button-red-hover.png',
            srcActive: 'button-red-active.png',
            title: true,
            onClick: function () {
                self.closeDialog();

                if (isGoalsReached) {
                    PageController.showPage(PageMain);
                } else {
                    /** Предложить купить жизни */
                    if (LogicHealth.getHealths(LogicUser.getCurrent()) === 0) {
                        PBZDialogs.dialogHealthShop.showDialog();
                        self.showDialog(pointId);
                    } else {
                        /** Начать игру */
                        //@todo ищи код ljklkjlkjkljkjlkjljlkjlk
                        SAPIUser.healthDown(pointId);
                        PageBlockPanel.oneHealthHide = true;
                        DataPoints.setPlayedId(pointId);

                        PageController.showPage(PageField);
                    }
                }
            }
        });
        elGeneralButton.show();

        /** Кнопка закрыть */
        GUI.createElement(ElementButton, {
            x: 452, y: 3,
            srcRest: 'button-close-rest.png',
            onClick: function () {
                self.closeDialog();
                if (isGoalsReached) {
                    PageController.showPage(PageMain);
                }
            }
        }).show();


        elButtonShare = GUI.createElement(ElementText, {x: 335, y: 254, text: 'ПОДЕЛИТЬСЯ', fontSize: 11});

        elShare = GUI.createElement(ElementButton, {
            x: 418, y: 242,
            srcRest: 'check-set.png',
            srcHover: 'check-clear.png',
            srcActive: 'check-clear.png',
        });
        elShare.onClick = function () {
            share = !share;
            PageController.redraw();
        };
        elShare.show();

        GUI.popParent();
    };

    this.redraw = function () {
        let point, friend, score;
        this.__proto__.redraw.call(this);

        if (!this.dialogShowed) return;

        let topScore = LogicUser.getPointTopScore(pointId);
        let user1, user2, user3;
        friends = [];
        if (topScore) {
            if (topScore.place1Uid) user1 = (LU.getById(topScore.place1Uid));
            if (topScore.place2Uid) user2 = (LU.getById(topScore.place2Uid));
            if (topScore.place3Uid) user3 = (LU.getById(topScore.place3Uid));

            if (user1) friends.push(user1);
            if (user2) friends.push(user2);
            if (user3) friends.push(user3);
        }

        point = DataPoints.getById(pointId);
        if (isGoalsReached) {
            this.setTitle('ПРОЙДЕН  ' + pointId);
        } else {
            this.setTitle('УРОВЕНЬ  ' + pointId);
        }

        /** @todo copy to DialogGoalds Reacehed*/
        for (let i = 0; i < 3; i++) {
            if ((friend = friends[i]) && friend.id) {
                score = DataPoints.getScore(point.id, friend.id);
                panel[i].elPhotoScore.user = friend;
                panel[i].elPhotoScore.score = score;
            } else {
                panel[i].elPhotoScore.score = 0;
                panel[i].elPhotoScore.user = null;
            }
            panel[i].elPhotoScore.show();
            panel[i].elPhotoScore.redraw();
        }

        elUserPhotoScore.user = LogicUser.getCurrent();
        elUserPhotoScore.score = 0 + DataPoints.getScore(point.id);

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
        elGeneralButton.redraw();

        if (isGoalsReached) {
            let user;
            user = LogicUser.getCurrent();
            if (LogicHealth.getHealths(user) === 0) {
                elGeneralButton.hide();
            } else {
                elGeneralButton.show();
            }

            elShare.srcRest = share ? 'check-set.png' : 'check-clear.png';
            elShare.srcHover = share ? 'check-clear.png' : 'check-set.png';
            elShare.srcActive = elShare.srcHover;
            elShare.redraw();
        }
    };

    this.showDialog = function (pId, scoreNew, isGoalsReachedValue) {
        pointId = pId;
        isGoalsReached = isGoalsReachedValue;
        LogicWizard.finish(false);
        this.__proto__.showDialog.call(this);

        if (isGoalsReachedValue) {
            share = true;
            score = scoreNew;
            elButtonShare.show();
            elShare.show();
            elGeneralButton.title = 'НА КАРТУ';
        } else {
            share = false;
            elButtonShare.hide();
            elShare.hide();
            elGeneralButton.title = 'ИГРАТЬ';
        }
        self.redraw();
    };

    this.closeDialog = function () {
        if (share) {
            SocNet.post({
                //@todo url app move to config
                userId: LogicUser.getCurrent().socNetUserId,
                message: 'Я набрал ' + score + " " +
                    declination(score, ['очко', 'очка', 'очков'])
                    + '! Ты сможешь обогнать меня? ' +
                    'https://vk.com/app' + Config.SocNet.VK.appId
            });
        }
        this.__proto__.closeDialog();
    };
};
/** ../client/components/application/gui_elements/DialogStuffShop.js */
let DialogStuffShop = function () {
    let self = this;
    this.__proto__ = new Dialog();

    let stuffId = null;

    let items = [];

    let locked = false;

    /**
     * Чтобы пользователь на купил 2ыйнм кликом
     * @returns {boolean}
     */
    let lock = function () {
        if (locked) return true;
        locked = true;
        setTimeout(function () {
            locked = false;
        }, 1000);
    };

    this.init = function () {
        let el, offsetX, stepX, offsetY;
        this.__proto__.init.call(this);

        offsetX = 30;
        offsetY = 80;
        stepX = 145;

        GUI.pushParent(self.dom);

        this.setTitle('МАГАЗИН');

        for (let i = 0; i < 3; i++) {
            el = GUI.createElement(ElementMoneyCount, {
                x: offsetX + stepX * i, y: offsetY,
                productImg: '', productCount: 0, goldCount: 0,
                imageOffsetX: 20,
                counterOffsetY: 20,
                onClick: function () {
                    self.buyStuff(i);
                }
            });
            items.push(el);
            self.elements.push(el);
        }

        GUI.popParent();
    };

    this.showDialog = function (newStuffId) {
        this.__proto__.showDialog.call(this);
        stuffId = newStuffId;
        self.redraw();
        SAPILogs.showStuffShopDialog(newStuffId);
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
                items[i].productImg = data[i].imageSrc;
                items[i].goldCount = data[i].gold;
                items[i].productCount = data[i].quantity;
                items[i].redraw();
            }
        }
        this.__proto__.redraw.call(this);
    };

    this.buyStuff = function (itemIndex) {

        if (lock()) return;

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
                buyFunc = SAPIStuff.buyLightning;
                giveFunc = LogicStuff.giveALighnting;
                shopItem = DataShop.lightning[itemIndex];
                break;
        }

        if (userGold < shopItem.gold) {
            PBZDialogs.dialogMoneyShop.showDialog(undefined, 'не хватило на магию, ' + stuffId);
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





/** ../client/components/application/gui_elements/DialogTurnLoose.js */
let DialogTurnLoose = function DialogTurnLoose() {
    let self = this;
    this.__proto__ = new Dialog();

    let pointId;

    this.init = function () {
        this.__proto__.init.call(this);
        GUI.pushParent(self.dom);
        let el;

        el = GUI.createElement(ElementButton, {
                x: 452, y: 3,
                srcRest: 'button-close-rest.png',
                onClick: function () {
                    self.closeDialog();
                    PageBlockPanel.oneHealthHide = false;
                    PageController.showPage(PageMain);
                }
            }
        );

        this.elButtonClose.hide();

        self.elements.push(el);

        el = GUI.createElement(ElementText, {x: 50, y: 135, fontSize: 24, bold: true, alignCenter: true, width: 400});
        el.setText("Больше ходов нет! :(");

        self.elements.push(el);


        /** Кнопка играть */
        el = GUI.createElement(ElementButton, {
            x: 178 - 80, y: 240,
            srcRest: 'button-red-rest.png',
            srcHover: 'button-red-hover.png',
            srcActive: 'button-red-active.png',
            onClick: function () {
                self.closeDialog();
                /** Предложить купить жизни */
                if (LogicHealth.getHealths(LogicUser.getCurrent()) === 0) {
                    PBZDialogs.dialogHealthShop.showDialog();
                    self.showDialog(pointId);
                } else {
                    /** Начать игру */
                    PageController.showPage(PageMain);

                    //@todo ищи код ljklkjlkjkljkjlkjljlkjlk
                    SAPIUser.healthDown(pointId);
                    PageBlockPanel.oneHealthHide = true;
                    DataPoints.setPlayedId(DataPoints.getPlayedId());

                    PageController.showPage(PageField);
                    SAPIUser.looseGame(DataPoints.getPlayedId());
                }
            },
            title: 'ПОВТОРИТЬ'
        });
        el.show();

        /** Кнопка купить ходов */
        el = GUI.createElement(ElementButton, {
            x: 178 + 80, y: 240,
            srcRest: 'button-red-rest.png',
            srcHover: 'button-red-hover.png',
            srcActive: 'button-red-active.png',
            fontSize: 13,
            onClick: function () {
                self.closeDialog();

                if (LogicStuff.getStuff('goldQty') < DataShop.looseTurnsPrice) {
                    PBZDialogs.dialogMoneyShop.showDialog(undefined, 'не хватило на ходы');
                    self.showDialog(pointId);
                } else {
                    SAPIUser.spendTurnsMoney();
                    PageBlockField.increaseTurns(DataShop.looseTurnsQuantity);
                    LogicStuff.usedGold(DataShop.looseTurnsPrice);
                    PageBlockField.unlockField();
                }
                PageController.showPage(PageField);
            },
            title: '+10 ЗА 200 МОНЕТ'
        });
        el.show();

        GUI.popParent();
    };

    this.showDialog = function (pId) {
        LogicWizard.finish(false);
        pointId = pId;
        //this.setTitle('УРОВЕНЬ  ' + pointId);
        this.setTitle('НЕТ ХОДОВ!');
        this.__proto__.showDialog.call(this);
    }
};
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
 * @type {ElementButton}
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
    this.width = undefined;

    /**
     * Высота кноки.
     * @type {number}
     */
    this.height = undefined;

    /**
     * Ссылка на картинку при наведении фокуса(мыши).
     * @type {string}
     */
    this.srcHover = '';

    /**
     * Ссылка на картинку при активации кнопки(клике).
     * @type {string}
     */
    this.srcActive = '';

    /**
     * Ссылка на картинку в покое(ожидании/бездействии).
     * @type {string}
     */
    this.srcRest = '';

    /**
     * Будет вызываться при нажатии на кнопку.
     * @type {function}
     */
    this.onClick = null;

    /**
     * Подсказка кнопки.
     * @type {String}
     */
    this.title = '';

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
                x: 0, y: 10 + (self.fontSize ? (18 - self.fontSize) / 2 : 0),
                height: 25,
                alignCenter: true,
                fontSize: self.fontSize,
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
        let src, mode, w, h;
        if (!showed) return;
        src = self.srcRest;

        if (mouseStateFocused) mode = 'hover';
        if (mouseStateFocused && mouseStateDown) mode = 'active';
        if (!mouseStateFocused && mouseStateDown) mode = 'rest';

        dom.x = self.x;
        dom.y = self.y;

        w = self.width ? self.width : Images.getWidth(self.srcRest);
        h = self.height ? self.height : Images.getHeight(self.srcRest);

        dom.width = w;
        dom.height = h;
        src = self.srcRest;

        switch (mode) {
            case 'rest':
                break;
            case 'hover':
                if (self.srcHover) src = self.srcHover; else {
                    dom.width = w * 1.05;
                    dom.height = h * 1.05;
                    dom.x = self.x - w * 0.025;
                    dom.y = self.y - h * 0.025;
                }
                break;
            case 'active':
                if (self.srcHover) src = self.srcActive; else {
                    dom.width = Images.getWidth(self.srcRest) * 1.1;
                    dom.height = Images.getHeight(self.srcRest) * 1.1;
                    dom.x = self.x - w * 0.05;
                    dom.y = self.y - h * 0.05;
                }
                break;
        }

        dom.backgroundImage = src;
        if (self.title) {
            dom.title = self.title;
            elText.width = Images.getWidth(src);
            elText.text = self.title;
            elText.redraw();
        }
        if (self.enabled) {
            dom.pointer = GUI.POINTER_HAND;
            dom.opacity = 1.0;
        } else {
            dom.pointer = GUI.POINTER_ARROW;
            dom.opacity = 0.5;
        }

        if (self.fontSize) elText.fontSize = self.fontSize;

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
        /** Да, тут мы останавливаем дальнейшие течение клика. */
        mouseEvent.stopPropagation();
        if (!self.enabled) return;
        mouseStateDown = false;
        mouseStateFocused = false;
        Sounds.play(Sounds.TYPE_BUTTON);
        self.redraw();
        return self.onClick.call(null, mouseEvent, dom);
    };
};
/** ../client/components/application/gui_elements/ElementChest.js */
/**
 * Элемент сундука.
 * @constructor
 * @property x
 * @property y
 * @type {ElementChest}
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

    this.number = -1;

    /**
     * Высота кноки.
     * @type {number}
     */
    this.height = 0;


    let elPit = null;

    let elStar = null;
    let elTxt = null;

    this.chestId = null;

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {

        elPit = GUI.createDom(undefined, {width: self.width, height: self.height});

        elStar = GUI.createElement(ElementImage, {src: 'star-on.png'});
        elTxt = GUI.createElement(ElementText, {width: 100, height: 14, fontSize: 14, bold: true});
    };

    /**
     * Покажем кнопку.
     */
    this.show = function () {
        if (showed) return;
        showed = true;

        elPit.show();
        elStar.show();
        elTxt.show();

        self.redraw();
    };

    /**
     * Спрячем.
     */
    this.hide = function () {
        if (!showed) return;
        showed = false;

        elPit.hide();
        elStar.hide();
        elTxt.hide();
    };

    /**
     * Перерисуем кнопку.
     */
    this.redraw = function () {
        let stars, starMax;
        if (!showed) return;

        elPit.x = self.x;
        elPit.y = self.y;

        elTxt.x = self.x + 10;
        elTxt.y = self.y + 10;

        stars = DataMap.countStarsByMapId();
        starMax = LogicChests.getStarsByNumber(self.number);

        stars = Math.min(stars, starMax);

        elTxt.text = stars.toString() + '/' + starMax;

        if (starMax === stars) {
            elPit.backgroundImage = 'pit-open.png';
        } else {
            elPit.backgroundImage = 'pit-close.png';
        }

        elStar.x = elTxt.x + 10;
        elStar.y = elTxt.y - 5;

        elPit.redraw();
        elStar.redraw();
        elTxt.redraw();
    };
};

/** ../client/components/application/gui_elements/ElementField.js */
/**
 * Элемент игрового поля.
 * @constructor
 */
let ElementField = function () {
    let self = this;

    let showAllGems = false;

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
            overflow: 'visible',
            isFieldContainer: true
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
            specDoms1.push(dom);
        }

        Field.eachCell(function (x, y) {
            if (!gemDoms[x]) gemDoms[x] = [];
            dom = GUI.createDom(undefined, {
                p: {x: x, y: y},
                height: DataPoints.BLOCK_HEIGHT,
                width: DataPoints.BLOCK_WIDTH,
                backgroundImage: 'field-none.png'
            });
            gemDoms[x][y] = dom;
        });
        for (let i = 0; i < specDomsLimit; i++) {
            dom = GUI.createDom(undefined, {width: DataPoints.BLOCK_WIDTH, height: DataPoints.BLOCK_HEIGHT});
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

    //let gemTouched = null;

    // let onGemTouchStart = function (event) {
    //     Sounds.play(Sounds.PATH_CHALK);
    //     gemTouched = pointFromEvent(event);
    // };

    // let onGemTouchEnd = function (event) {
    //     try {
    //         event.stopPropagation();
    //         let changedTouch = event.changedTouches[0];
    //         let elem = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
    //         if (gemTouched) {
    //             //fieldAct(gemTouched);
    //             //fieldAct(pointFromEvent(event.changedTouches[0]));
    //             gemTouched = null;
    //         }
    //     } catch (e) {
    //         gemTouched = null;
    //     }
    // };

    let pointFromEvent = function (event) {
        return {
            x: Math.floor((event.clientX - self.x - GUI.appArea.offsetLeft) / DataPoints.BLOCK_WIDTH),
            y: Math.floor((event.clientY - self.y - GUI.appArea.offsetTop) / DataPoints.BLOCK_HEIGHT)
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
        Sounds.play(Sounds.TYPE_GEM_TOUCH);
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
            ///maskDoms[x][y].hide();
            //gemDoms[x][y].hide();
        });
        domFrame.hide();
        if (stopHint) stopHint();
    };

    let specDomClear = function (dom, animId) {
        if (dom.stopAnim) dom.stopAnim();
        dom.animId = animId;
        dom.hide();
    };

    let drawDom = function (p, dom, objectId, opacity) {
        dom.x = p.x * DataPoints.BLOCK_WIDTH;
        dom.y = p.y * DataPoints.BLOCK_HEIGHT;
        let borderRadius = '';
        let nV = function (p) {
            return !Field.isVisible(p);
        };
        borderRadius += (nV({x: p.x - 1, y: p.y}) && nV({x: p.x, y: p.y - 1})) ? '8px ' : '0px ';
        borderRadius += (nV({x: p.x, y: p.y - 1}) && nV({x: p.x + 1, y: p.y})) ? '8px ' : '0px ';
        borderRadius += (nV({x: p.x + 1, y: p.y}) && nV({x: p.x, y: p.y + 1})) ? '8px ' : '0px ';
        borderRadius += (nV({x: p.x, y: p.y + 1}) && nV({x: p.x - 1, y: p.y})) ? '8px ' : '0px ';
        dom.borderRadius = borderRadius;
        if (DataObjects.images[objectId]) dom.backgroundImage = DataObjects.images[objectId];
        if (DataPoints.objectAnims[objectId]) {
            if (dom.animId !== objectId) {
                specDomClear(dom, objectId);
                dom.stopAnim = Animate.anim(DataPoints.objectAnims[objectId], {dom: dom, objectId: objectId});
            }
        } else {
            specDomClear(dom);
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

            gemDom.bindedDoms = [];
            if (showAllGems && Config.Project.develop) gemDom.border = null;
            /** Layer.mask redraw */
            cell.isVisible ?
                drawDom({x: x, y: y}, maskDom, DataObjects.CELL_VISIBLE) :
                maskDom.hide();
            /**
             * Draw any
             */
            if (cell.isVisible && (object.isGem || object.isAlpha || object.isBarrel || object.isPolyColor || object.isBlock)) {
                drawDom({x: x, y: y}, gemDom, object.objectId, '');
            } else {
                if (showAllGems && Config.Project.develop) {
                    gemDom.opacity = 0.5;
                    gemDom.borderWidth = 1;
                    gemDom.borderColor = 'red';
                    gemDom.show();
                    gemDom.redraw();
                } else {
                    gemDom.hide();
                }
            }

            /** Gems lighting */
            if (cell.isVisible && object.isGem) {
                /** Lightning */
                if (object.lightningId) {
                    if (object.lightningId === DataObjects.WITH_LIGHTNING_CROSS) {

                        specDom = specDoms2[spec2Index++];
                        drawDom({x: x, y: y}, specDom, DataObjects.WITH_LIGHTNING_VERTICAL, 1);
                        gemDom.bindedDoms.push(specDom);

                        specDom = specDoms2[spec2Index++];
                        drawDom({x: x, y: y}, specDom, DataObjects.WITH_LIGHTNING_HORIZONTAL, 1);
                        gemDom.bindedDoms.push(specDom);

                    } else {

                        specDom = specDoms2[spec2Index++];
                        drawDom({x: x, y: y}, specDom, object.lightningId, 1);
                        gemDom.bindedDoms.push(specDom);

                    }
                }
            }

            /** Alpha health */
            if (cell.isVisible && object.isAlpha) {
                specDom = specDoms2[spec2Index++];
                specDom.backgroundImage = DataPoints.healthImages[object.health];
                drawDom({x: x, y: y}, specDom, '', 0.9);
                gemDom.bindedDoms.push(specDom);
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
            if (cell.isVisible && object.withBeta) {
                specDom = specDoms2[spec2Index++];
                drawDom({x: x, y: y}, specDom, DataObjects.OBJECT_BETA, '');
                gemDom.bindedDoms.push(specDom);
            }

            /** Creature gamma */
            if (cell.isVisible && object.withGamma) {
                specDom = specDoms2[spec2Index++];
                drawDom({x: x, y: y}, specDom, DataObjects.OBJECT_GAMMA, '');
                gemDom.bindedDoms.push(specDom);
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
        });

        /** Спрячем не используемые  специальные домы */
        for (let i = spec1Index; i < specDomsLimit; i++) {
            specDomClear(specDoms1[i]);
        }
        for (let i = spec2Index; i < specDomsLimit; i++) {
            specDomClear(specDoms2[i]);
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
        }, Config.OnIdle.second * 5.5);
        // в пиратах 4 секунды.
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
            if (gemDoms[x][y].bindedDoms.length) {
                if (gemDoms[holeToFall.x][holeToFall.y]) {
                    gemDoms[holeToFall.x][holeToFall.y].bindedDoms = gemDoms[x][y].bindedDoms;
                }
                gemDoms[x][y].bindedDoms = [];
            }

            if (Field.isVisible({x: x, y: y}) ||
                Field.isVisible({x: x, y: y - 1}) ||
                Field.isVisible({x: x, y: y + 1})
            ) fallDoms.push({from: {x: x, y: y}, to: holeToFall});
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
            } else {
                actGem = (line.coords[0]);
                actObjectId = Field.getCell(actGem).object.objectId;
            }

            line.coords.forEach(function (p) {
                self.cellAttack(p);
            });

            if (line.coords.length > 3) {
                if (actGem && line.coords.length === 4) {
                    Sounds.play(Sounds.TYPE_CREATE_LIGHTNING);
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

        if (cell.object.isAlpha) {
            cell.object.health--;
            if (cell.object.health) {
                animate(animHummerDestroy, p);
            } else {
                /** Destoy red spider */
                self.onDestroyThing(DataObjects.OBJECT_ALPHA, cell);
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

            if (cell.object.withBeta) {
                /** Destroy beta */
                self.onDestroyThing(DataObjects.OBJECT_BETA, cell);
                cell.object.withBeta = false;
                animate(animHummerDestroy, p);
            }

            if (cell.object.withGamma) {
                /** Destroy gamma */
                self.onDestroyThing(DataObjects.OBJECT_GAMMA, cell);
                cell.object.withGamma = false;
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
};
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

    this.cardsCount = DataCross.topUsersLimit;

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
                borderWidth: 2,
                borderColor: '#715f4b',
                borderRadius: 8,
                background: '#aaa'
            });
            GUI.bind(dom, GUI.EVENT_MOUSE_CLICK, function () {
                if (!friends[i]) SocNet.openInviteFriendDialog();
            });
            cardsDom.push(dom);
            cardsText.push(GUI.createElement(ElementText,
                {
                    x: self.x + i * (self.cardWidth + self.cardSpace) + 2,
                    y: self.y + 50 - 17,
                    width: self.cardWidth - 4, height: 30 / (100 / self.cardWidth), alignCenter: true,
                    background: '#eee',
                    opacity: 0.5,
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
};
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

        user = LogicUser.getCurrent();
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
        let dom, width = 50;
        doms = [];
        let step = width - 15;

        for (let i = 0; i < 5; i++) {
            dom = GUI.createDom(null, {
                x: this.x + i * step, y: this.y - 2,
                backgroundImage: 'health-heart.png'
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
        user = LogicUser.getCurrent();
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
};
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
    this.x = undefined;

    /**
     * Координата Y картинки.
     * @type {number}
     */
    this.y = undefined;

    /**
     * Ширина картинки.
     * @type {number}
     */
    this.width = undefined;

    /**
     * Высота картинки.
     * @type {number}
     */
    this.height = undefined;

    /**
     * Ссылка на картинку.
     * @type {string}
     */
    this.src;

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
        self.dom = dom;
        dom.backgroundImage = self.src;
        if (this.photoBorder) {
            dom.borderWidth = 2;
            dom.borderColor = 'rgba(68, 62, 0, 0.7)';
            dom.borderRadius = 8;
        }
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
        dom.width = self.width;
        dom.height = self.height;
        dom.title = self.title;
        dom.pointer = self.pointer;
        dom.redraw();
    };
};
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

    /**
     *
     * @type {ElementImage}
     */
    let imagesEls = {};

    /**
     * @param id
     * @returns ElementImage
     */
    this.getItemDom = function (id) {
        return imagesEls[id];
    };

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
        elTitle = GUI.createElement(ElementText, {x: self.x + 15, y: self.y + 9, width: 80, text: self.title, fontSize: self.fontSize});

        for (let id in DataObjects.images) {
            el = GUI.createElement(ElementImage, {width: 50, height: 50, src: DataObjects.images[id]});
            imagesEls[id] = el;
            el = GUI.createElement(ElementText, {width: 33, alignRight: true});
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
            //**/
            imagesEls[item.id].sX = self.x + 15;
            imagesEls[item.id].x = self.x + 15;
            imagesEls[item.id].sY = self.y + 46 + offsetY;
            imagesEls[item.id].y = self.y + 46 + offsetY;
            imagesEls[item.id].show();

            countersEls[item.id].x = self.x - 7 + DataPoints.BLOCK_WIDTH;
            countersEls[item.id].y = self.y + 46 + DataPoints.BLOCK_HEIGHT / 2 - 10 + offsetY;
            countersEls[item.id].setText(item.count);
            countersEls[item.id].show();

            offsetY += DataPoints.BLOCK_HEIGHT + 5;
        });
    };
};
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
            width: 34, height: 20,
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
            borderWidth: 1,
            borderColor: '#715f4b',
            borderRadius: 2,
            zIndex: 100
        });
        dPhoto2 = GUI.createDom(null, {
            height: photoSize, width: photoSize,
            borderWidth: 1,
            borderColor: '#715f4b',
            borderRadius: 2, zIndex: 100
        });
        dPhoto3 = GUI.createDom(null, {
            height: photoSize, width: photoSize,
            borderWidth: 1,
            borderColor: '#715f4b',
            borderRadius: 2, zIndex: 100
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

        elText.x = 8;
        elText.y = 16.5;
        elText.text = self.pointId ? self.pointId.toString() : '-';

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
        let offsetY, offsetCenterY
            , index = 0;
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

        index = 0;
        gamers.forEach(function (user) {

            if (!user) doms[index].hide();
            else {
                if (user && user.photo50
                    && user.nextPointId === self.pointId
                ) {
                    doms[index].backgroundImage = user.photo50;
                    doms[index].title = user.firstName;
                    doms[index].show();
                    doms[index].redraw();
                } else {
                    doms[index].hide();
                }
            }
            index++;
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
     * @param users
     */
    this.setGamers = function (users) {
        /*@todo брать сначало из топа, а потом уже друзей любых*/
        if (self.pointId === LogicUser.getCurrent().nextPointId) {
            users.push(LogicUser.getCurrent());
        }
        gamers = users.slice(0, 3);
        /** Центрируем если игрок только один */
        if (gamers.length === 1) gamers.unshift(null);
        while (gamers.length < 3) gamers.push(null);
    }
};

ElementPoint.STATE_CLOSE = 1;
ElementPoint.STATE_CURRENT = 2;
ElementPoint.STATE_FINISHED = 3;

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
    this.srcHover = null;

    /**
     * Ссылка на картинку при активации кнопки(клике).
     * @type {string}
     */
    this.srcActive = null;

    /**
     * Ссылка на картинку в покое(ожидании/бездействии).
     * @type {string}
     */
    this.srcRest = null;

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

    let plusButton = null;

    let point = null;

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
        dom.isStuffButton = true;
        GUI.bind(dom, GUI.EVENT_MOUSE_MOUSE_DOWN, onMouseDown, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_CLICK, onMouseClick, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_OVER, onMouseOver, self);
        GUI.bind(dom, GUI.EVENT_MOUSE_OUT, onMouseOut, self);

        point = GUI.createDom(null, {backgroundImage: 'map-way-point-grey.png'});
        counter = GUI.createElement(ElementText, {width: 20, height: 26});
        plusButton = GUI.createElement(ElementButton, {
            srcRest: 'button-add-rest.png', width: 25, height: 25,
            onClick: onPlusButtonClick
        });
        plusButton.pointer = GUI.POINTER_HAND;
        //GUI.bind(plusButton, GUI.EVENT_MOUSE_CLICK, onPlusButtonClick, self);
    };

    /**
     * Покажем кнопку.
     */
    this.show = function () {
        if (showed === true) return;
        showed = true;
        dom.show();
        counter.show();
        plusButton.show();
        point.show();
        self.redraw();
    };

    /**
     * Спрячем кнопку.
     */
    this.hide = function () {
        if (showed === false) return;
        showed = false;
        dom.hide();
        counter.hide();
        plusButton.hide();
        point.hide();
    };

    /**
     * Перерисуем кнопку.
     */
    this.redraw = function () {
        let src, w, h;
        if (!showed) return;

        dom.x = self.x;
        dom.y = self.y;

        src = self.srcRest;
        w = self.width ? self.width : Images.getWidth(self.srcRest);
        h = self.height ? self.height : Images.getHeight(self.srcRest);

        dom.width = w;
        dom.height = h;

        if (mouseStateFocused) {
            if (self.srcHover) src = self.srcHover; else {
                dom.width = w * 1.1;
                dom.height = h * 1.1;
                dom.x = self.x - w * 0.05;
                dom.y = self.y - h * 0.05;
            }
        }
        if (mouseStateFocused && mouseStateDown) {
            if (self.srcHover) src = self.srcActive; else {
                dom.width = Images.getWidth(self.srcRest) * 1.2;
                dom.height = Images.getHeight(self.srcRest) * 1.2;
                dom.x = self.x - w * 0.1;
                dom.y = self.y - h * 0.1;
            }
        }
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
        counter.x = self.x + 65 - 5;
        counter.y = self.y + 22;
        plusButton.x = self.x;
        plusButton.y = self.y + 35;
        point.x = self.x + 65 - 20;
        point.y = self.y + 22 - 15;
        counter.setText(LogicStuff.getStuff(self.fieldName));
        dom.redraw();
        counter.redraw();
        plusButton.redraw();
        point.redraw();
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
        if (!self.enabled) return;
        mouseStateDown = false;
        mouseStateFocused = false;
        self.redraw();
        return self.onClick.call(null, mouseEvent, dom);
    };

    let onPlusButtonClick = function () {
        PageBlockZDialogs.dialogStuffShop.showDialog(self.fieldName);
    }
};
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
        dom = GUI.createDom(undefined, {
            height: this.height,
            color: this.color ? this.color : "rgba(103, 77, 56, 1.0)",
            background: this.background,
            fontFamily: 'arial,sans-serif,"Marvin",Tahoma,"Geneva CY",sans-serif',
        });
        dom.zIndex = this.zIndex;
        if (self.onClick) GUI.bind(dom, GUI.EVENT_MOUSE_CLICK, onMouseClick, self);
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
        dom.fontSize = self.fontSize ? self.fontSize : 18;
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

        dom.text = self.text;
    };

    /**
     * Обработка события на клик.
     * @param mouseEvent {MouseEvent}
     * @param dom {Element}
     */
    let onMouseClick = function (dom) {
        if (!self.onClick) {
            return;
        }
        /** Да, тут мы останавливаем дальнейшие течение клика. */
        //mouseEvent.stopPropagation();
        return self.onClick.call(this, dom);
    };
};

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
            x: self.x - 25, y: self.y - 22, width: 100, height: 15,
            fontSize: 12, alignCenter: true
        });
        elPhoto = GUI.createElement(ElementImage, {
            x: self.x, y: self.y, width: 50, height: 50,
            photoBorder: true
        });
        elPhoto.dom.pointer = GUI.POINTER_HAND;
        GUI.bind(elPhoto.dom, GUI.EVENT_MOUSE_CLICK, self.onClick, self);
        elTextScore = GUI.createElement(ElementText, {
            x: self.x - 25, y: self.y + 61, width: 100, height: 15,
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

        if (!this.user || !this.user.id) {
            elTextScore.hide();
            elTextName.hide();
            elPhoto.src = 'button-add-rest.png';
        } else {
            elTextName.text = this.user.firstName;
            elPhoto.src = this.user.photo50;
            elTextScore.text = this.score ? this.score.toString() : 0;
            elTextScore.show();
            elTextName.show();
        }

        elTextName.redraw();
        elPhoto.redraw();
        elTextScore.redraw();
    };

    this.onClick = function () {
        if (self.user) {
            window.open(SocNet.getUserProfileUrl(self.user.socNetUserId));
        } else {
            SocNet.openInviteFriendDialog();
        }
    }
};
/** ../client/components/application/gui_elements/ElemenеMoneyCount.js */
/**
 * @constructor
 */
let ElementMoneyCount = function () {
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

    this.productImg = null;
    this.productCount = null;
    this.goldCount = null;

    this.onClick = function () {
    };

    this.counterOffsetY = 0;
    this.imageOffsetX = 0;
    this.enabled = true;

    let domProduct = null;
    let textProductCount = null;

    let domMoneyImage = null;
    let textCounter = null;

    let els = [];

    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {
        domMoneyImage = GUI.createDom(null, {backgroundImage: 'coin.png', pointer: GUI.POINTER_HAND});
        textCounter = GUI.createElement(ElementText, {onClick: self.onClick, width: 80, alignCenter: false, pointer: GUI.POINTER_HAND});

        domProduct = GUI.createDom(null, {pointer: GUI.POINTER_HAND});
        textProductCount = GUI.createElement(ElementText, {onClick: self.onClick, pointer: GUI.POINTER_HAND});

        GUI.bind(domMoneyImage, GUI.EVENT_MOUSE_CLICK, self.onClick, self);
        GUI.bind(domProduct, GUI.EVENT_MOUSE_CLICK, self.onClick, self);

        els.push(domMoneyImage);
        els.push(textCounter);
        els.push(domProduct);
        els.push(textProductCount);
    };

    /**
     * Покажем картинку.
     */
    this.show = function () {
        if (showed === true) return;
        showed = true;
        els.forEach(function (el) {
            el.show();
        });
        self.redraw();
    };

    /**
     * Спрячем картинку.
     */
    this.hide = function () {
        if (showed === false) return;
        showed = false;
        els.forEach(function (el) {
            el.hide();
        });
    };

    /**
     * Перерисуем картинку.
     */
    this.redraw = function () {
        if (!showed) return;

        if (self.type === 'B') {
            redrawB();
        } else {
            redrawA();
        }
        els.forEach(function (el) {
            el.opacity = self.enabled ? 1.0 : 0.5;
            el.redraw();
        });
    };


    let redrawA = function () {

        domProduct.x = self.x + self.imageOffsetX;
        domProduct.y = self.y;
        domProduct.backgroundImage = self.productImg;

        if (self.productCount) {
            textProductCount.show();
            textProductCount.x = self.x + 100;
            textProductCount.y = self.y + 20;
            textProductCount.fontSize = 41;
            textProductCount.text = "x" + self.productCount.toString();
        } else {
            textProductCount.hide();
        }

        let offsetX = 0;
        if (self.goldCount > 9) offsetX = -0;
        if (self.goldCount > 99) offsetX = -10;
        if (self.goldCount > 999) offsetX = -20;

        domMoneyImage.x = self.x + 30 + offsetX;
        domMoneyImage.y = self.y + Images.getHeight(self.productImg) + self.counterOffsetY;

        textCounter.x = self.x + 95 + offsetX * 2;
        textCounter.y = self.y + Images.getHeight(self.productImg) + self.counterOffsetY;
        textCounter.fontSize = 36;
        textCounter.text = self.goldCount.toString();
    };

    let redrawB = function () {

        let offsetX = 0;
        if (self.goldCount > 9) offsetX = -0;
        if (self.goldCount > 99) offsetX = -10;
        if (self.goldCount > 999) offsetX = -15;

        domProduct.x = self.x;
        domProduct.y = self.y;
        domProduct.backgroundImage = self.productImg;

        if (self.productCount) {
            textProductCount.show();
            textProductCount.x = self.x + 100;
            textProductCount.y = self.y + 20;
            textProductCount.fontSize = 41;
            textProductCount.text = "x" + self.productCount.toString();
        } else {
            textProductCount.hide();
        }

        domMoneyImage.x = self.x + 50 + 30 + offsetX + Images.getWidth(self.productImg);
        domMoneyImage.y = self.y + self.counterOffsetY + 20;

        textCounter.x = self.x + 50 + 95 + offsetX * 2 + Images.getWidth(self.productImg);
        textCounter.y = self.y + self.counterOffsetY + 25;
        textCounter.fontSize = 36;
        textCounter.text = self.goldCount.toString();
    }
};
/** ../client/components/application/logic/LogicChests.js */
/**
 * @type {LogicChests}
 * @constructor
 */
let LogicChests = function () {

    let numberToStars = {1: 6 * 3, 2: 12 * 3, 3: 18 * 3};

    this.getStarsByNumber = function (number) {
        return numberToStars[number];
    };

    this.getNumberFromPointId = function (pointId) {
        return 3 % pointId;
    };

    this.onFinish = function (pointId, lastScore, newScore, forceChest) {
        let oldPointStars, newPointStars,
            oldMapStars, newMapStars,
            chestA, chestB, chestC,
            number, chestId;

        oldPointStars = DataPoints.countStars(null, null, lastScore);
        newPointStars = DataPoints.countStars(null, null, newScore);

        oldMapStars = DataMap.countStarsByMapId();
        newMapStars = oldMapStars + (newPointStars - oldPointStars);

        chestA = LogicChests.getStarsByNumber(1);
        chestB = LogicChests.getStarsByNumber(2);
        chestC = LogicChests.getStarsByNumber(3);

        number = 0;
        if ((oldMapStars < chestA && chestA <= newMapStars) || forceChest === 1) {
            number = 1;
        }
        if ((oldMapStars < chestB && chestB <= newMapStars) || forceChest === 2) {
            number = 2;
        }
        if ((oldMapStars < chestC && chestC <= newMapStars) || forceChest === 3) {
            number = 3;
        }

        if (number) {
            chestId = LogicChests.getChestId(number);
            LogicChests.open(chestId);
            return chestId;
        }
        return 0;
    };

    this.open = function (chestId) {
        PBZDialogs.dialogChestYouWin.showDialog(chestId);
    };

    this.getChestId = function (number) {
        return (DataMap.getCurrent().id - 1) * 3 + number;
    };
};

/** @type {LogicChests} */
LogicChests = new LogicChests;
/** ../client/components/application/logic/LogicField.js */
/**
 * @type {LogicField}
 * @constructor
 */
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
        DataObjects.OBJECT_ALPHA,
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
        for (let y = 0, cell, fromCell, object; y < DataPoints.FIELD_MAX_HEIGHT; y++) {
            fromCell = self.getCell(p);
            p.y++;
            cell = self.getCell(p);
            object = cell && cell.object;
            if (cell && cell.isVisible && !object.isHole && !object.withBox && !object.withChain) {
                break;
            }
            if (cell && (cell.isVisible || !fromCell.isVisible) && object.isHole) {
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
                    self.exchangeObjects(a, b, null);
                    /** 2 - Считаем линии */
                    lines = self.findLines();
                    if (lines.length) allLines.push({a: a, b: b, lines: lines});
                    /** 3 - Возвращаем a ⇔ b */
                    self.exchangeObjects(a, b, null);
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
        let line, vlines, hlines;
        vlines = [];
        hlines = [];
        this.eachCell(function (x, y) {

            if (!self.lineCrossing(vlines, x, y)) {
                line = self.findLine(x, y, DataObjects.WITH_LIGHTNING_VERTICAL);
                if (line) vlines.push(line);
            }

            if (!self.lineCrossing(hlines, x, y)) {
                line = self.findLine(x, y, DataObjects.WITH_LIGHTNING_HORIZONTAL);
                if (line) hlines.push(line);
            }
        });

        return vlines.concat(hlines);
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
        let result = false;

        lines.forEach(function (line) {
            line.coords.forEach(function (p) {
                if (x === p.x && y === p.y) result = true;
            });
        });

        return result
    };

    /**
     * x, y, cell, object
     * @param callback(x, y, cell, object)
     */
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
        object.isAlpha = (id === DataObjects.OBJECT_ALPHA);

        self.updateSomeFlags(object);
    };

    this.updateSomeFlags = function (object) {
        object.withChain = object.withChainA || object.withChainB;
        object.isCanMoved = (object.isGem || object.isBarrel || object.isPolyColor || object.isAlpha)
            && !object.withBox && !object.withChain;
        object.isLineForming = (object.isGem) && !object.withBox;
    };

    this.getGemId = function (p) {
        return cells[p.x] && cells[p.x][p.y].object.objectId;
    };

    this.setLayers = function (mask, objects, specials) {
        let specIds, lightningId, objectId;
        cells = [];
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
                if (specIds.indexOf(DataObjects.OBJECT_ALPHA) !== -1) objectId = DataObjects.OBJECT_ALPHA;
                if (specIds.indexOf(DataObjects.OBJECT_SAND) !== -1) objectId = DataObjects.OBJECT_SAND;
                if (specIds.indexOf(DataObjects.OBJECT_BLOCK) !== -1) objectId = DataObjects.OBJECT_BLOCK;
                gems.forEach(function (gemId) {
                    if (specIds.indexOf(gemId) !== -1) {
                        objectId = gemId;
                    }
                });
                if (!objectId) objectId = Field.getRandomGemId();

                let cell, object;
                object = {};
                cell = {object: object, x: x, y: y};
                cells[x][y] = cell;
                cell.isVisible = mask[x] && mask[x][y] && mask[x][y] === DataObjects.CELL_VISIBLE;
                cell.isEmitter = specIds.indexOf(DataObjects.IS_EMITTER) !== -1;

                if (objectId === DataObjects.OBJECT_ALPHA) object.health = 3;

                cell.withGold = specIds.indexOf(DataObjects.OBJECT_GOLD) !== -1;
                cell.withTile = specIds.indexOf(DataObjects.OBJECT_TILE) !== -1;

                object.withBox = specIds.indexOf(DataObjects.OBJECT_BOX) !== -1;
                object.withChainA = specIds.indexOf(DataObjects.OBJECT_CHAIN_A) !== -1;
                object.withChainB = specIds.indexOf(DataObjects.OBJECT_CHAIN_B) !== -1;
                object.withBeta = specIds.indexOf(DataObjects.OBJECT_BETA) !== -1;
                object.withGamma = specIds.indexOf(DataObjects.OBJECT_GAMMA) !== -1;

                self.setObject({x: x, y: y}, objectId, lightningId)
            }
        }
        if (Field.findLines().length) {
            let n;
            n = [];
            Field.eachCell(function (x, y, cell, object) {
                if (!n[y]) n[y] = [];
                n[y].push(cell.withGold ? 'G' : ' ');
            });
            Field.shuffle(true);
            n = [];
            Field.eachCell(function (x, y, cell, object) {
                if (!n[y]) n[y] = [];
                n[y].push(cell.withGold ? 'G' : ' ');
            });
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
        LogicField.exchangeObjects(pA, pB, null);
        lines = LogicField.findLines();
        mayLineDestroy = LogicField.lineCrossing(lines, pA.x, pA.y) | LogicField.lineCrossing(lines, pB.x, pB.y);
        LogicField.exchangeObjects(pA, pB, null);
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
            let p1, p2, c2;
            Field.eachCell(function (x1, y1, c1) {
                p1 = {x: x1, y: y1};
                p2 = {
                    x: Math.floor(Math.random() * DataPoints.FIELD_MAX_WIDTH),
                    y: Math.floor(Math.random() * DataPoints.FIELD_MAX_HEIGHT)
                };
                c2 = Field.getCell(p2);
                let o1, o2;
                o1 = c1.object;
                o2 = c2.object;
                if (c1.isVisible && o1.isCanMoved && !o1.isBarrel && o1.objectId !== DataObjects.OBJECT_SAND && o1.objectId !== DataObjects.OBJECT_ALPHA
                    &&
                    c2.isVisible && o2.isCanMoved && !o2.isBarrel && o2.objectId !== DataObjects.OBJECT_SAND && o2.objectId !== DataObjects.OBJECT_ALPHA
                ) {
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
let Field = LogicField;
/** components/application/logic/LogicHealth.js */
/**
 * @type {LogicHealth}
 * @constructor
 */
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
        //@todo log warning if go down then zero
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
}
/** ../client/components/application/logic/LogicMain.js */
/**
 * @type {LogicMain}
 * @return {LogicMain}
 * @constructor
 */
let LogicMain = (function () {

    let firstAuth = true;

    function LogicMain() {
    }

    /**
     * After connect
     * @param connectionId
     */
    LogicMain.prototype.onConnect = function (connectionId) {
        ApiRouter.onConnect(connectionId);
        SAPITimeServer.sendMeTime();
        LogicUser.authorize();
    };

    LogicMain.prototype.onAuthorizeSuccess = function () {
        LogicStuff.loadStuff();
        /** Установить текущую карту игрока */
        DataMap.setCurrentMapId();

        /** Первый показ игры: Главная страница */
        if (firstAuth) {
            PageController.showPage(PageMain);

            /** Проверка визарада начала игры */
            let timerId = setInterval(function () {
                if (PageBlockZPreloader.isLoaded()) {
                    clearInterval(timerId);
                    LogicWizard.onLoaded();
                    PageBlockZPreloader.onLoaded();
                }
            }, 10);
        }

        /** Разная полезная информация */
        if (prid) {
            setTimeout(function () {
                Sounds.loadSounds();
            }, 3000);
            SAPILogs.clientLoaded(prid);
            SAPILogs.sendUserAgent(window.navigator.userAgent);
            prid = null;
        }
        firstAuth = false;
    };

    LogicMain.prototype.main = function () {
        let webSocketClient;

        /**@todo show preloader */
        Logs.init(function () {
        });

        /** Init some components */
        SocNet.init();
        DataPoints.init();
        DataChests.init();

        /** WebSocket Client */
        webSocketClient = new WebSocketClient();
        webSocketClient.init();

        //@todo need be automate...
        /** ApiRouter */

        ApiRouter.setMap({
            CAPIUser: CAPIUser,
            CAPITimeServer: CAPITimeServer,
            CAPIMap: CAPIMap,
            CAPIStuff: CAPIStuff,
            CAPILog: CAPILog,
        });

        /** Link ApiRouter and WebSocketClient */
        ApiRouter.sendData = webSocketClient.sendData;
        webSocketClient.onData = ApiRouter.onData;
        webSocketClient.onConnect = this.onConnect;
        webSocketClient.onDisconnect = ApiRouter.onDisconnect;
        ApiRouter.addOnDisconnectCallback(function () {
            LogicWizard.finish(false);
        });

        /** Running */
        webSocketClient.run();

        //@todo remove it
        window.wsc = webSocketClient;

        OnIdle.init();
    };

    /**
     * @type {LogicMain}
     */
    return new LogicMain();
})();
/** ../client/components/application/logic/LogicMap.js */
/**
 * @type {LogicMap}
 * @constructor
 */
let LogicMap = function () {

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

/** ../client/components/application/logic/LogicStuff.js */
/**
 * @type {LogicStuff}
 * @constructor
 */
let LogicStuff = function () {
    let stuff = {};

    this.STUFF_HUMMER = 'hummerQty';
    this.STUFF_LIGHTNING = 'lightningQty';
    this.STUFF_SHUFFLE = 'shuffleQty';

    this.loadStuff = function () {
        SAPIStuff.sendMeStuff();
    };

    this.updateStuff = function (data) {
        stuff = data;
        PageController.redraw();
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

    this.usedLightning = function () {
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
        user = LogicUser.getCurrent();
        LogicHealth.decrementHealth(user, -quantity);
    };
};

/**
 * Статичный класс.
 * @type {LogicStuff}
 */
LogicStuff = new LogicStuff();

/** ../client/components/application/logic/LogicTimeClient.js */
/**
 * @type {LogicTimeClient}
 * @constructor
 */
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
        gotTime = Date.now();
        timeDiff = serverTime - gotTime;
        Logs.log("Time sync:" +
            //            timestamp +
            //          ' gotTime:' + gotTime +
            ' timeDiff:' + timeDiff
            , Logs.LEVEL_DETAIL);
    };

    this.getTime = function () {
        return Math.floor(this.getMTime() / 1000);
    };

    this.getMTime = function () {
        return Date.now();
    };

    this.convertToClient = function (timestamp) {
        let newTimestamp;
        newTimestamp = timestamp * 1000 - timeDiff;
        return newTimestamp / 1000;
    };
};

LogicTimeClient = new LogicTimeClient();
/** ../client/components/application/logic/LogicUser.js */
/**
 * @type {LogicUser}
 * @constructor
 */
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

    let friendIds = [];

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
     * @param userId
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
    this.getCurrent = function () {
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
     * Запомним, чьи загрузки мы уже ждём, чтобы не повторять лишних запросов.
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

    let mapFriendIds = {};
    this.mapFriendIds = mapFriendIds;

    this.getMapFriendIds = function (mapId) {
        let chunks;
        if (!getFriendIds()) return null;
        if (!mapId) return null;
        if (!mapFriendIds[mapId]) mapFriendIds[mapId] = {ids: []};
        if (!mapFriendIds[mapId].loading && (mapFriendIds[mapId].loading = true)) {
            chunks = chunkIt(getFriendIds());
            mapFriendIds[mapId].chunksCount = chunks.length;
            if (chunks.length === 0) {
                mapFriendIds[mapId].ids = [];
                mapFriendIds[mapId].complete = true;
            }
            chunks.forEach(function (chunk) {
                SAPIUser.sendMeMapFriends(mapId, chunk);
            });
        }
        if (!mapFriendIds[mapId].complete) return null;
        return mapFriendIds[mapId].ids;
    };

    this.setMapFriendIds = function (mapId, fids) {
        if (!mapFriendIds[mapId] || mapFriendIds[mapId].complete) return Logs.log("hm", Logs.LEVEL_WARNING, arguments);
        let toLoadIds = [];
        fids.forEach(function (id) {
            if (!pendingIds[id]) {
                pendingIds[id] = true;
                toLoadIds.push(id);
            }
        });
        chunkIt(toLoadIds).forEach(function (chunk) {
            SAPIUser.sendMeUserListInfo(chunk);
        });
        mapFriendIds[mapId].chunksCount--;
        mapFriendIds[mapId].ids = mapFriendIds[mapId].ids.concat(fids);
        if (mapFriendIds[mapId].chunksCount === 0) {
            mapFriendIds[mapId].complete = true;
            PageController.redraw();
        }
    };

    let topUsers = [];

    this.getTopUsers = function () {
        let chunks;
        if (!getFriendIds()) return null;
        //@todo only panel, sorted by score
        if (!this.getTopUsers.loading && (this.getTopUsers.loading = true)) {
            chunks = chunkIt(getFriendIds());
            if (chunks.length === 0) {
                topUsers = [];
                this.getTopUsers.complete = true;
            }
            this.getTopUsers.chunksCount = chunks.length;
            chunks.forEach(function (chunk) {
                SAPIUser.sendMeTopUsers(chunk);
            });
        }
        if (!this.getTopUsers.complete) return null;
        return topUsers;
    };

    this.loadTopUsers = function (users) {
        this.getTopUsers.chunksCount--;
        users.forEach(function (user) {
            topUsers.push(user);
        });
        if (this.getTopUsers.chunksCount === 0) {

            topUsers.sort(function (a, b) {
                if (a.nextPointId === b.nextPointId) return 0;
                return a.nextPointId < b.nextPointId ? 1 : -1;
            });
            if (topUsers.length > DataCross.topUsersLimit) topUsers = topUsers.slice(0, DataCross.topUsersLimit);
            self.getTopUsers.socInfoCount = topUsers.length;
            //@todo for fast - got users by one request.
            topUsers.forEach(function (user) {
                SocNet.getUserInfo(user.socNetUserId, function (socInfo) {
                    user.photo50 = socInfo[0].photo_50;
                    self.getTopUsers.socInfoCount--;
                    if (self.getTopUsers.socInfoCount === 0) {
                        self.getTopUsers.complete = true;
                        PageController.redraw();
                    }
                });
            });
        }
    };

    let getFriendIds = function () {
        let chunks;
        //@todo only panel, sorted by score
        if (!getFriendIds.loading && (getFriendIds.loading = true)) {
            SocNet.getFriendIds(function (ids) {
                chunks = chunkIt(ids);
                getFriendIds.chunksCount = chunks.length;
                /** И такое может быть. (это друзья играющие в тоже приложение) */
                if (chunks.length === 0) {
                    getFriendIds.chunksCount = 1;
                    CAPIUser.gotFriendsIds({}, []);
                }
                chunks.forEach(function (chunk) {
                    SAPIUser.sendMeFriendIdsBySocNet(chunk);
                });
            });
        }
        if (!getFriendIds.complete) return null;
        return friendIds;
    };

    this.getFriendIds = getFriendIds;

    this.loadFriendIds = function (chunkIds) {
        getFriendIds.chunksCount--;
        friendIds = friendIds.concat(chunkIds);
        /** Удаяем самих себя из друзей */
        if (friendIds.indexOf(authorizedUserId) !== -1) {
            friendIds.splice(friendIds.indexOf(authorizedUserId), 1);
        }
        if (getFriendIds.chunksCount === 0) {
            getFriendIds.complete = true;
            PageController.redraw();
        }
    };

    let pointTopScore = {};

    this.getPointTopScore = function (pointId) {
        let fids, chunks;
        if (!(fids = getFriendIds())) return undefined;

        if (!pointTopScore[pointId]) pointTopScore[pointId] = {top: {pos: -Infinity}};
        if (!pointTopScore[pointId].loading && (pointTopScore[pointId].loading = true)) {
            chunks = chunkIt(fids);
            pointTopScore[pointId].chunksCount = chunks.length;
            chunks.forEach(function (chunkFids) {
                SAPIMap.sendMePointTopScore(0, pointId, chunkFids, chunks.length);
            });
        }
        if (!pointTopScore[pointId].complete) return undefined;
        return pointTopScore[pointId].top;
    };

    this.loadPointTopScore = function (pid, top) {
        // предзакгрузка
        let uids;
        uids = [top.place1Uid, top.place2Uid, top.place3Uid].filter(v => !!v);
        if (uids.length) {
            DataPoints.loadScores([pid], uids);
            LogicUser.getList(uids);
        }
        if (!pointTopScore[pid]) pointTopScore[pid] = {top: {}};
        if (pointTopScore[pid].top.pos < top.pos) {
            pointTopScore[pid].top = top;
        }
        pointTopScore[pid].chunksCount--;
        if (pointTopScore[pid].chunksCount === 0) {
            pointTopScore[pid].complete = true;
            PageController.redraw();
            //@todo load more here,but only this socNetTypeId
            // if 1,2,3 empty -> SendMeMore
            // on SendMe More

        }
    };

    this.flushPointTopScore = function (pid, uid) {
        if (pointTopScore[pid]) pointTopScore[pid][uid] = undefined;
    };

    this.getUserLastMapId = function () {
        return DataMap.getMapIdFromPointId(
            LogicUser.getCurrent().nextPointId
        );
    };
};

/**
 * Статичный класс.
 * @type {LogicUser}
 */
LogicUser = new LogicUser();

/** Alias **/
let LU = LogicUser;
/** ../client/components/application/logic/LogicWizard.js */
/**
 * @type {LogicWizard}
 * @constructor
 */
let LogicWizard = function LogicWizard() {
    let self = this;

    let dymmyFunc = function () {
    };

    this.onClick = dymmyFunc;
    this.onDestroyThing = dymmyFunc;
    this.onDestroyLine = dymmyFunc;
    this.onShowDialog = dymmyFunc;
    this.onHideDialog = dymmyFunc;
    this.onFieldSilent = dymmyFunc;

    this.onLoaded = function () {
        if (LogicUser.getCurrent().nextPointId === 1) {
            self.start(WizardFirstStart_1);
        }
    };

    this.onFieldFirstShow = function () {
        let any = Config.Project.wizardAny,
            nextPointId = LogicUser.getCurrent().nextPointId,
            playedId = DataPoints.getPlayedId();
        if ((nextPointId === 2 || any) && playedId === 2) self.start(WizardLevel2_1);
        if ((nextPointId === 3 || any) && playedId === 3) self.start(WizardLevel3_1);
        if ((nextPointId === 4 || any) && playedId === 4) self.start(WizardLevel_4_1);
        if ((nextPointId === 9 || any) && playedId === 9) self.start(WizardLevel9_1);
        if ((nextPointId === 12 || any) && playedId === 12) self.start(WizardLevel12_1);
        if ((nextPointId === 15 || any) && playedId === 15) self.start(WizardLevel15_1);
        if ((nextPointId === 23 || any) && playedId === 23) self.start(WizardLevel23_1);
        if ((nextPointId === 30 || any) && playedId === 30) self.start(WizardLevel_30_1);
        if ((nextPointId === 41 || any) && playedId === 41) self.start(WizardLevel_41_1);
        if ((nextPointId === 46 || any) && playedId === 46) self.start(WizardLevel46_1);
        if ((nextPointId === 51 || any) && playedId === 51) self.start(WizardLevel51_1);
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

    this.finish = function (showText) {
        PBWizard.finish(showText);
        self.onClick = dymmyFunc;
        self.onDestroyThing = dymmyFunc;
        self.onDestroyLine = dymmyFunc;
        self.onShowDialog = dymmyFunc;
        self.onHideDialog = dymmyFunc;
        self.onFieldSilent = dymmyFunc;
    }
};

/** @type {LogicWizard} */
LogicWizard = new LogicWizard();
/** ../client/components/application/page_blocks/PageBlockBackground.js */
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
        /*el = GUI.createElement(ElementImage, {x: -15, y: -15, src: 'fs-frame.png'});
        self.elements.push(el);*/

        /** Задний фон */
        el = GUI.createElement(ElementImage, {x: 0, y: 0, src: 'old-paper.png'});
        self.elements.push(el);

        this.fpsText = GUI.createElement(ElementText, {
            x: 50, y: 10, width: 30, height: 50, text: ''
        });
        if (SocNet.getType() === SocNet.TYPE_STANDALONE
            || LogicUser.getCurrent().id === 1
            || LogicUser.getCurrent().socNetUserId === 1
        ) {
            if (LogicUser.getCurrent().id !== 4) {
                this.fpsText.show();
            }
        }

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
        let elBody;
        elBody = document.getElementsByTagName('body')[0];
        GUI.setImageToElement(elBody, 'old-paper.png', screen.width, screen.height);
    };
};

/**
 *
 * @type {PageBlockBackground}
 */
PageBlockBackground = new PageBlockBackground();
/** ../client/components/application/page_blocks/PageBlockField.js */
/**
 * Страница с игровым полем
 * @type {PageBlockField}
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

    let elProgressBar = null;

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
        let el, oX, oY, panelTextOffsetY;
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
            x: 730, y: 10, srcRest: 'button-quit-rest.png',
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
            el = GUI.createElement(ElementText, {x: oX, y: oY + 8, width: 112, text: 'УРОВЕНЬ', alignCenter: true, fontSize: 14});
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
            el = GUI.createElement(ElementText, {x: oX, y: oY + 8, width: 112, text: 'ОЧКИ', alignCenter: true, fontSize: 14});
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
            elProgressBar = GUI.createDom(null, {
                x: oX + 21, y: oY + 59,
                width: 71, height: 4,
                borderRadius: 2,
                borderWidth: 2,
                borderColor: 'rgba(68, 68, 0, 0.7)',
                background: 'rgba(68, 68, 0, 0.7)',
            });
            self.elements.push(elProgressBar);
        }

        /**
         * ПАНЕЛЬ ХОДОВ
         */
        {
            oX = 15;
            oY = 65 + 10;
            /** Панель */
            el = GUI.createElement(ElementImage, {x: oX, y: oY, src: 'panel-turns.png'});
            self.elements.push(el);
            /** Надпись */
            el = GUI.createElement(ElementText, {x: oX, y: oY + 8, width: 112, text: 'ХОДЫ', alignCenter: true, fontSize: 14});
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
            elPanelGoals = GUI.createElement(ElementPanelItems, {x: oX, y: oY, title: 'ЦЕЛИ', fontSize: 14});
            self.elements.push(elPanelGoals);
        }

        oY = 200;
        /** Stuff hummer */
        el = GUI.createElement(ElementStuffButton, {
            x: 650, y: oY, fieldName: 'hummerQty',
            srcRest: 'button-hummer-rest.png',
            onClick: function () {
                if (tlock(tlock.STUFF_BUTTON)) return;
                self.setStuffMode(LogicStuff.STUFF_HUMMER);
            }
        });
        self.elements.push(el);

        /** Stuff lightning */
        el = GUI.createElement(ElementStuffButton, {
            x: 650, y: oY + 80, fieldName: 'lightningQty',
            srcRest: 'button-lightning-rest.png',
            onClick: function () {
                if (tlock(tlock.STUFF_BUTTON)) return;
                self.setStuffMode(LogicStuff.STUFF_LIGHTNING);
            }
        });
        self.elements.push(el);

        /** Stuff shuffle */
        el = GUI.createElement(ElementStuffButton, {
            x: 650, y: oY + 80 * 2, fieldName: 'shuffleQty',
            srcRest: 'button-shuffle-rest.png',
            onClick: function () {
                if (tlock(tlock.STUFF_BUTTON)) return;
                self.setStuffMode(LogicStuff.STUFF_SHUFFLE);
            }
        });
        self.elements.push(el);

        /** Кнопка обновить поле, для админов\adminov */
        buttonReloadField = GUI.createElement(ElementButton, {
            x: 312, y: 5, width: 25, height: 25,
            srcRest: 'button-close-rest.png',
            onClick: function () {
                AnimLocker.lock();

                CAPIMap.setCallbackOnMapsInfo(function () {
                    PageController.showPage(PageMain);
                    PageController.showPage(PageField);
                    AnimLocker.release();
                    PageController.redraw();
                });
                SAPIMap.reloadLevels();
                SAPIMap.sendMeMapInfo(DataMap.getCurrent().id);
            }
        });

        /** Кнопка обновить поле, для админов */
        buttonChangeSpeed = GUI.createElement(ElementButton, {
            x: 312 + 30, y: 5, width: 25, height: 25,
            srcRest: 'field-red.png',
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
        domStuff = GUI.createDom(null, {x: 190, y: 10, pointer: GUI.POINTER_NONE, zIndex: 10000});

        elTextShadow = GUI.createDom(undefined, {
            x: 0, y: 0, width: DataCross.app.width, height: DataCross.app.height,
            background: "black",
            opacity: 0.3,
            zIndex: 999
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
            /** Передаем только на поле */
            if (
                (el.parentElement.__dom && el.parentElement.__dom.isFieldContainer) ||
                el.isStuffButton) {
                el.dispatchEvent(new MouseEvent(event.type, event));
            }
            if (stuffMode) domStuff.show();
            return true;
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
        if (SocNet.getType() === SocNet.TYPE_STANDALONE
            || LogicUser.getCurrent().id === 1
            || LogicUser.getCurrent().socNetUserId === 1
        ) {
            if (LogicUser.getCurrent().id !== 4) {
                buttonReloadField.show();
                buttonChangeSpeed.show();
            }
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

    this.unlockField = function () {
        elementField.unlock();
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

        elProgressBar.width = Math.min(71,
            71 / 100 *
            (100 / (DataPoints.getById(DataPoints.getPlayedId()).score3) * score)
        );
    };

    let noMoreGoals;

    let objectScores = {};
    objectScores[DataObjects.OBJECT_RED] = 10;
    objectScores[DataObjects.OBJECT_GREEN] = 10;
    objectScores[DataObjects.OBJECT_BLUE] = 10;
    objectScores[DataObjects.OBJECT_YELLOW] = 10;
    objectScores[DataObjects.OBJECT_PURPLE] = 10;
    objectScores[DataObjects.OBJECT_SAND] = 30;

    objectScores[DataObjects.OBJECT_ALPHA] = 100;
    objectScores[DataObjects.OBJECT_BETA] = 100;
    objectScores[DataObjects.OBJECT_GAMMA] = 100;
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
                Animate.anim(animBlump, {}, elPanelGoals.getItemDom(goal.id));
                goal.count -= qty;
            }
            if (goal.count > 0) noMoreGoals = false;
            if (goal.count < 0) goal.count = 0;
        });
        /** @todo act goals */

        self.redraw();
    };

    this.onFieldSilent = function () {
        LogicWizard.onFieldSilent();
        if (noMoreGoals) {
            elementField.lock();
            noMoreGoals = false;
            setTimeout(self.finishLevel, Config.OnIdle.animateInterval * 1);
        } else if (turns === 0) {
            PBZDialogs.dialogTurnsLoose.showDialog(DataPoints.getPlayedId());
        }
    };

    this.finishLevel = function () {
        let pointId, user, lastScore, chestId;
        LogicWizard.finish(false);
        stuffMode = null;
        elementField.setStuffMode(stuffMode);

        user = LogicUser.getCurrent();
        pointId = DataPoints.getPlayedId();
        lastScore = DataPoints.getScore(pointId);
        if (user.nextPointId < pointId + 1) {
            user.nextPointId = pointId + 1;
            LogicUser.updateUserInfo(user);
        }
        if (score > lastScore || lastScore === undefined) {
            chestId = LogicChests.onFinish(pointId, lastScore, score);
            DataPoints.setPointUserScore(pointId, user.id, score);
            SAPIMap.onFinish(pointId, score, chestId);
        }
        SAPIUser.healthBack();
        PBZDialogs.dialogPointInfo.showDialog(pointId, score, true);
        PageController.redraw();
    };

    this.beforeTurnUse = function () {
        turns--;
        if (turns === 0 && !noMoreGoals) elementField.lock();
        if (turns === 5 && !noMoreGoals) showText('Осталось 5 ходов!');
        self.redraw();
    };

    this.beforeStuffUse = function () {
        switch (stuffMode) {
            case LogicStuff.STUFF_HUMMER:
                Sounds.play(Sounds.TYPE_HUMMER_HIT);
                SAPIStuff.usedHummer();
                LogicStuff.usedHummer();
                break;
            case LogicStuff.STUFF_LIGHTNING:
                SAPIStuff.usedLightning();
                LogicStuff.usedLightning();
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
        /** Если уже выбран этот - отменяем его */
        if (mode === stuffMode) mode = null;
        switch (mode) {
            case LogicStuff.STUFF_HUMMER:
                if (LogicStuff.getStuff('hummerQty') < 1) {
                    PBZDialogs.dialogStuffShop.showDialog(mode);
                    return;
                }
                domStuff.backgroundImage = 'button-hummer-rest.png';
                break;
            case LogicStuff.STUFF_LIGHTNING:
                if (LogicStuff.getStuff('lightningQty') < 1) {
                    PBZDialogs.dialogStuffShop.showDialog(mode);
                    return;
                }
                domStuff.backgroundImage = 'button-lightning-rest.png';
                break;
            case LogicStuff.STUFF_SHUFFLE:
                if (LogicStuff.getStuff('shuffleQty') < 1) {
                    PBZDialogs.dialogStuffShop.showDialog(mode);
                    return;
                }
                domStuff.backgroundImage = 'button-shuffle-rest.png';
                break;
        }
        stuffMode = mode;
        elementField.setStuffMode(mode);
        self.redraw();
    };

    this.getElementField = function () {
        return elementField;
    };

    this.onWizardFinish = function (showTextDalcheSami) {
        //@Todo get sex and : Дальше ты сам(а)!
        //@todo show from Wizard by code, but not automaticaly
        if (showTextDalcheSami) {
            showText('Дальше сам!');
        }
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
    };

    this.increaseTurns = function (diff) {
        turns += diff;
    };
};

/** @type {PageBlockField} */
PageBlockField = new PageBlockField;
/** ../client/components/application/page_blocks/PageBlockMaps.js */
/**
 * Основной блок страницы игры.
 * @type {PageBlockMaps}
 * @constructor
 */
let PageBlockMaps = function PageBlockMaps() {
    let self = this;

    /**
     * Показывать ли страницу.
     * @type {boolean}
     */
    let showed = false;

    let pArrowNext = {x: 714, y: 500 / 2 - 50 / 2};

    let elArrowPrev = false;

    let elArrowNext = false;

    let elMap = false;

    let elMapWay = false;

    let elOldPaper = false;

    /**
     * @type {ElementFriendsPanel}
     */
    let elFriendsPanel;

    let domLoader = null;

    /**
     * @type ElementPoint[]
     */
    let pointsEls = [];

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

        elMapWay = GUI.createElement(ElementImage, {x: 0, y: 0, width: 778, height: 500, src: 'way-line.png'});
        self.elements.push(elMapWay);

        elMap = GUI.createElement(ElementImage, {x: 0, y: 0, width: 778, height: 500, src: 'map-001.png'});
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
            onClick: LogicMap.onArrowPrevClick
        });
        self.elements.push(elArrowPrev);

        elArrowNext = GUI.createElement(ElementButton, {
            x: pArrowNext.x, y: pArrowNext.y,
            srcRest: 'map-arrow-right-rest.png',
            onClick: LogicMap.onArrowNextClick
        });
        self.elements.push(elArrowNext);

        /** Points */
        DataPoints.getPointsCoords().forEach(function (coords) {
            el = GUI.createElement(ElementPoint, {
                x: coords.x, y: coords.y,
                friends: [],
                stateId: ElementPoint.STATE_CLOSE,
                number: null,
                pointId: null,
                onClick: function (event, dom, element) {
                    PBZDialogs.dialogPointInfo.showDialog(element.pointId, null, false);
                }
            });
            self.elements.push(el);
            pointsEls[coords.number] = el;
        });


        el = GUI.createElement(ElementChest, {x: 162, y: 304, number: 1});
        self.elements.push(el);
        el = GUI.createElement(ElementChest, {x: 309, y: 78, number: 2});
        self.elements.push(el);
        el = GUI.createElement(ElementChest, {x: 495, y: 304, number: 3});
        self.elements.push(el);

        elFriendsPanel = GUI.createElement(ElementFriendsPanel, {x: 213, y: 450 - 15});
        self.elements.push(elFriendsPanel);

        el = GUI.createElement(ElementButton, {
            x: 165, y: 438, srcRest: 'button-add-rest.png',
            onClick: function () {
                SocNet.openInviteFriendDialog();
            }
        });
        self.elements.push(el);

        el = GUI.createElement(ElementImage, {x: 650, y: 370, opacity: 0.7, src: 'wind-rose.png'});
        self.elements.push(el);

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
        elArrowPrev.hide();
    };

    /**
     * Настройка перед отрисовкой.
     */
    this.preset = function (data) {
        let nextPointId, firstPointId, lastPointId;
        this.presetPoints(data);
        /** Set hint arrow */
        nextPointId = LogicUser.getCurrent().nextPointId;
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
        let data;
        if (!showed) return;
        data = fetchData();
        if (!data) return;


        elMap.src = data.map.src;
        self.preset(data);
        //@todo got friends top + users top for panel
        /**
         * взять
         * SAPIUser.sendMeTopUsers(fids);
         * CAPIUser.updateTopUsers(info);
         * LogicUser.getTopUsers();
         *  select * FROM users
         */
        elFriendsPanel.setFriends(data.tUsers);
        elFriendsPanel.redraw();

        self.elements.forEach(function (element) {
            element.redraw();
        });

        elArrowPrev.redraw();
    };

    /**
     * Обновление данных перед отрисовкой точек
     */
    this.presetPoints = function (data) {
        let user, pointId, point, elPoint, userPUS, map;
        user = LogicUser.getCurrent();
        map = DataMap.getCurrent();
        if (!map) return;
        //???@todo
        // for current all scores on this map
        userPUS = DataPoints.getPointUserScore(map.id, [user.id]);

        let ids = LogicUser.getMapFriendIds(map.id);
        let mapFriends = ids ? LogicUser.getList(ids) : [];

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

            if (userPUS[pointId])
                elPoint.userScore = userPUS[pointId][user.id] ? userPUS[pointId][user.id] : 0;
            else
                elPoint.userScore = 0;

            elPoint.setGamers(
                mapFriends.filter(function (user) {
                    return user.photo50 && user.nextPointId === pointId
                })
            );
        }
    };

    let fetchData = function () {
        let out;
        out = {};
        out.map = DataMap.getCurrent();
        out.tUsers = LogicUser.getTopUsers();

        if (!out.tUsers) out.tUsers = [];
        if (!(out.map)) out = null;

        return out;
    }
};

/**
 *
 * @type {PageBlockMaps}
 */
PageBlockMaps = new PageBlockMaps;
/** ../client/components/application/page_blocks/PageBlockPanel.js */
/**
 * Блок общих.
 * @type {PageBlockPanel}
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
        pMX = 110;/** 110 идеальный центр */
        el = GUI.createElement(ElementImage, {x: pMX, y: 0, src: 'panel-money.png'});

        self.elements.push(el);

        /** Деньги - монета */
        el = GUI.createElement(ElementButton, {
            x: pMX + 5, y: -3, srcRest: 'coin.png',
            onClick: function () {
                PBZDialogs.dialogMoneyShop.showDialog(undefined, 'монета на панели');
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
            x: pMX + 122, y: -3, srcRest: 'button-add-rest.png',
            onClick: function () {
                PBZDialogs.dialogMoneyShop.showDialog(undefined, 'кнопка плюс на панели');
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
            x: pHX + 190, y: -4, srcRest: 'button-add-rest.png',
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
            x: 690, y: 10, srcRest: 'button-fs-on-rest.png',
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
PageBlockPanel = new PageBlockPanel();
/** ../client/components/application/page_blocks/PageBlockWizard.js */
/**
 * Блок Визарда
 * @type {PageBlockWizard}
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

    let wizardArea = null;
    /** @type {CanvasRenderingContext2D} */
    let cntx = null;

    let elDialog = null;
    let elText = null;
    let elWCat = null;

    let dialogBorder = 16;

    this.init = function () {

        /** Canvas */
        wizardArea = GUI.wizardArea;

        wizardArea.width = DataCross.app.width;
        wizardArea.height = DataCross.app.height;

        wizardArea.style.display = 'none';
        cntx = wizardArea.getContext('2d');

        //cntx.showByImg = showByImg;
        cntx.unlockByImg = unlockByImg;
        cntx.highlightCells = highlightCells;

        let proccesEvent = function (event, callback) {
            let pixelData, el, x, y;
            x = event.offsetX;
            y = event.offsetY;
            pixelData = cntx.getImageData(x, y, 1, 1).data;
            if (pixelData[3] === 0) {
                wizardArea.style.display = 'none';
                el = document.elementFromPoint(event.clientX, event.clientY);
                if (el) el.dispatchEvent(new MouseEvent(event.type, event));
                if (wizardArea.isActive) wizardArea.style.display = '';

                if (callback) callback(el);
            } else {
                if (callback) callback(false);
            }
        };

        /** On Click */
        wizardArea.onclick = function (event) {
            proccesEvent(event, LogicWizard.onClick)
        };
        /** On Click */
        wizardArea.onmousedown = function (event) {
            proccesEvent(event, LogicWizard.onMouseDown)
        };
        wizardArea.onmouseup = function (event) {
            proccesEvent(event, LogicWizard.onMouseUp)
        };
        /** On Mouse Move */
        wizardArea.onmousemove = function (event) {
            proccesEvent(event, function (el) {
                if (el) {
                    wizardArea.style.cursor = el.style.cursor;
                } else {
                    wizardArea.style.cursor = '';
                }
            });
        };
        //canvas.onmouseout = proccesEvent;
        //canvas.onmouseover = proccesEvent;
        //canvas.onmousemove = proccesEvent;

        elDialog = GUI.createElement(ElementImage, {src: 'w-dialog.png'});
        elDialog.dom.zIndex = 50000;
        elDialog.dom.borderWidth = 5;
        elDialog.dom.borderColor = 'red';
        console.log('jjjjjjjjjjj', elDialog, elDialog.dom);

        //elDialog.hide();

        elText = GUI.createElement(ElementText, {
            x: 400 + dialogBorder, y: 360 + dialogBorder,
            width: Images.getWidth('w-dialog.png') - dialogBorder * 2,
            height: Images.getHeight('w-dialog.png'),
            alignCenter: true, zIndex: 50001,
            text: 'text'
        });
        //elText.hide();

        elWCat = GUI.createElement(ElementImage, {src: 'w-cat.png'});
        elWCat.dom.zIndex = 50002;
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
        elWCat.redraw();
        elText.redraw();
    };

    this.begin = function () {
        PageBlockField.getElementField().lockHint();
        wizardArea.style.display = '';
        wizardArea.isActive = true;
        drawBackground();
    };

    this.finish = function (showText) {
        self.reset();
        PageBlockField.onWizardFinish(showText);
    };

    this.reset = function () {
        wizardArea.isActive = false;
        wizardArea.style.display = 'none';
        elDialog.hide();
        elWCat.hide();
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

    let wCatX = 0;
    this.updateText = function (text, wCatXNew) {
        elText.text = text;
        wCatX = wCatXNew;
        self.redraw();
    };

    this.showDialog = function (x, y, lines, fontSize, wCatX, wCatY) {
        let textOffsetY;
        if (!x) x = 400;
        if (!y) y = 360;
        switch (lines) {
            default:
            case 1:
                textOffsetY = 30;
                break;
            case 2:
                textOffsetY = 15 + 3;
                break;
            case 3:
                textOffsetY = 2 + 6;
                break;
        }
        if (!lines) textOffsetY = lines * 15;
        if (!fontSize) fontSize = '';
        elDialog.x = x;
        elDialog.y = y;
        elWCat.x = x + 210;
        elWCat.y = y - 232;
        elWCat.x = 568;
        elWCat.y = 257;
        if (wCatX) elWCat.x = wCatX;
        if (wCatY) elWCat.y = wCatY;
        elText.x = x + dialogBorder;
        elText.y = y + dialogBorder + textOffsetY;
        //elText.fontSize = fontSize;
        elDialog.show();
        elWCat.show();
        elText.show();
        self.redraw();
    };

    this.hideDialog = function () {
        elDialog.hide();
        elText.hide();
        elWCat.hide();
    };

    this.draw = function (callback) {
        callback(cntx);
    };

    let drawSome = function (url, x, y, unlock, skipload) {
        //@todo some strange
        if (!skipload || !images[url]) {
            images[url] = new Image();
            images[url].onload = function () {
                drawSome(url, x, y, unlock, true);
            };
            images[url].src = Images.getRealPath(url);
            return;
        }
        cntx.globalAlpha = unlock ? 1 : 0.99;
        cntx.globalCompositeOperation = 'destination-out';
        cntx.drawImage(images[url], x, y, Images.getWidth(url), Images.getHeight(url));
    };

    let unlockByImg = function (url, x, y) {
        drawSome(url, x, y, true);
    };

    let showByImg = function (url, x, y) {
        drawSome(url, x, y, false);
    };

    let highlightCells = function (pList) {
        let f = PageBlockField.getElementField().getCoords();

        pList.forEach(function (p) {
            if (p.unlock) {
                unlockByImg('w-cell.png',
                    f.x + DataPoints.BLOCK_WIDTH * p.x,
                    f.y + DataPoints.BLOCK_HEIGHT * (p.y + 1)
                );
            } else {
                showByImg('w-cell.png',
                    f.x + DataPoints.BLOCK_WIDTH * p.x,
                    f.y + DataPoints.BLOCK_HEIGHT * (p.y + 1)
                );
            }
        });
    };

    //this.showByImg = showByImg;
    this.unlockByImg = unlockByImg;
    this.highlightCells = highlightCells;
};

/** @type {PageBlockWizard} */
PageBlockWizard = new PageBlockWizard();

let PBWizard = PageBlockWizard;
/** ../client/components/application/page_blocks/PageBlockZClouds.js */
/**
 * Блок общих.
 * @type {PageBlockZClouds}
 * @constructor
 */
let PageBlockZClouds = function PageBlockZClouds() {
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
        let el, grid;
        grid = [
            {x: 30, y: 50},
            {x: 30, y: 150},
            {x: 30, y: 300},
            {x: 30, y: 350},

            {x: 100, y: 50},
            {x: 110, y: 100},
            {x: 100, y: 200},
            {x: 100, y: 350},

            {x: 250, y: 20},
            {x: 250, y: 100},
            {x: 250, y: 200},
            {x: 250, y: 300},
            {x: 250, y: 400},

            {x: 400, y: 80},
            {x: 400, y: 110},
            {x: 400, y: 200},
            {x: 400, y: 250},
            {x: 400, y: 350},
            {x: 510, y: 50},
            {x: 510, y: 300},
            {x: 510, y: 200},
            {x: 510, y: 400},
        ];

        grid.forEach(function (p) {
            el = GUI.createElement(ElementImage, {x: p.x, y: p.y, src: 'clouds-1.png', opacity: 0.9});
            self.elements.push(el);
        });

        Animate.anim(animClouds, {}, self.elements);
    };

    /**
     * Покажем все элементы на странице.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        for (let i in self.elements) {
            self.elements[i].show();
        }
        self.redraw();
    };

    /**
     * Спрячем все элементы на странице.
     */
    this.hide = function () {
        if (!showed) return;
        showed = false;
        for (let i in self.elements) {
            self.elements[i].hide();
        }
    };

    /**
     * Обновляем онлайн индикатор и индикатор очков.
     */
    this.redraw = function () {
        if (!showed) return;
        if (DataMap.getCurrent() &&
            DataMap.getCurrent().id > LogicUser.getUserLastMapId()
        ) {
            self.elements.forEach(function (el) {
                el.show();
            });
        } else {
            self.elements.forEach(function (el) {
                el.hide();
            });
        }
        self.elements.forEach(function (el) {
            el.redraw();
        });
    };
};

/** @type {PageBlockZClouds} */
PageBlockZClouds = new PageBlockZClouds();
/** ../client/components/application/page_blocks/PageBlockZDialogs.js */
/**
 * Блок диалогов
 * @type {PageBlockZDialogs}
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

    /** @type {DialogTurnLoose} */
    this.dialogTurnsLoose = null;

    /** @type {DialogJustQuit} */
    this.dialogJustQuit = null;

    /** @type {DialogPointInfo} */
    this.dialogPointInfo = null;

    /** @type {DialogChestYouWin} */
    this.dialogChestYouWin = null;

    /** @type {DialogMessage} */
    this.dialogMessage = null;

    this.init = function () {

        this.dialogMoneyShop = GUI.createElement(DialogMoneyShop, {});
        self.elements.push(this.dialogMoneyShop);

        this.dialogHealthShop = GUI.createElement(DialogHealthShop, {});
        self.elements.push(this.dialogHealthShop);

        this.dialogGoals = GUI.createElement(DialogGoals);
        self.elements.push(this.dialogGoals);

        this.dialogTurnsLoose = GUI.createElement(DialogTurnLoose);
        self.elements.push(this.dialogTurnsLoose);

        this.dialogJustQuit = GUI.createElement(DialogJustQuit);
        self.elements.push(this.dialogJustQuit);

        this.dialogStuffShop = GUI.createElement(DialogStuffShop);
        self.elements.push(this.dialogStuffShop);

        this.dialogPointInfo = GUI.createElement(DialogPointInfo);
        self.elements.push(this.dialogPointInfo);

        this.dialogChestYouWin = GUI.createElement(DialogChestYouWin);
        self.elements.push(this.dialogChestYouWin);

        this.dialogMessage = GUI.createElement(DialogMessage);
        self.elements.push(this.dialogMessage);
    };

    /**
     * Покажем все элементы на странице.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
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
     * Обновляем онлайн индикатор и индикатор очков.
     */
    this.redraw = function () {
        if (!showed) return;
        self.elements.forEach(function (el) {
            el.redraw();
        });
    };
};

/**
 * @type {PageBLockZDialogs}
 */
PageBlockZDialogs = new PageBlockZDialogs();

/**
 * @type {PageBlockZDialogs}
 */
let PBZDialogs = PageBlockZDialogs;
/** ../client/components/application/page_blocks/PageBlockZPreloader.js */
/**
 * Основной блок страницы игры.
 * @type {PageBlockZPreloader}
 * @constructor
 */
let PageBlockZPreloader = function PageBlockZPreloader() {
    let self = this;

    let elPreloader = false;

    let showed = true;

    this.init = function () {

    };

    this.show = function () {
        if (showed === true) return;
        showed = true;
        self.redraw();
    };

    /**
     * Спрачем все элементы на странице.
     */
    this.hide = function () {
        if (showed === false) return;
        showed = false;
    };

    this.isLoaded = function () {
        let isLoaded;

        isLoaded = true;
        isLoaded &= !!LogicUser.getCurrent();
        isLoaded &= !!DataPoints.getById(DataMap.getFirstPointId());
        isLoaded &= !!DataMap.getCurrent();
        isLoaded &= !!LogicUser.getTopUsers();
        isLoaded &= !!(DataMap.getCurrent() &&
            LogicUser.getMapFriendIds(DataMap.getCurrent().id)
        );
        return isLoaded;
    };

    this.redraw = function () {
    };

    this.onLoaded = function () {
        if (GUI.canvasArea) GUI.canvasArea.style.display = 'block';
        let el = document.getElementById('oblojka');
        if (el) el.remove();
        console.log('loaded----------------------');
    };
};

PageBlockZPreloader = new PageBlockZPreloader();
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

PageField = new PageField;
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
        self.blocks.push(PageBlockZClouds);
        self.blocks.push(PageBlockZPreloader);
    };
};

/** @type {PageMain} */
PageMain = new PageMain;
/** ../client/components/application/wizards/WizardFirst.js */
let WizardFirstStart_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Нажми на красный кружок,\r\n чтобы начать играть.');
        PBWizard.showDialog(400, 360, 2, null, 618, 123);
        let pnt = DataPoints.getPointsCoords()[0];
        PBWizard.unlockByImg('w-circle.png',
            pnt.x - Images.getWidth('w-circle.png') / 2
            + Images.getWidth('map-way-point-red.png') / 2,
            pnt.y - Images.getHeight('w-circle.png') / 2
            + Images.getHeight('map-way-point-red.png') / 2,
        );
    },

    onClick: function (el) {
        LogicWizard.start(WizardFirstStart_2);
    }
};

let WizardFirstStart_2 = {

    init: function () {
        PBWizard.begin();
    },

    onShowDialog: function () {
        //@todo got real button coords
        WizardFirstStart_2.dialogCounter++;
        if (WizardFirstStart_2.dialogCounter > 1) return;
        PBWizard.updateText('Нажми кнопку играть.');
        PBWizard.showDialog(400, 380, 1, null, 618, 143);
        PBWizard.unlockByImg('w-button.png',
            390 - Images.getWidth('w-button.png') / 2,
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

let WizardFirstStart_3 = {
    init: function () {
        PBWizard.begin();
    },
    onHideDialog: function (onStart) {
        if (this.dialogCounter++ < 3) return;
        PBWizard.updateText('Поменяй соседние кристаллы местами,\r\n чтобы собрать кристаллы красного цвета.');
        PBWizard.showDialog(210, 380, 3, null, 497);
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

let WizardFirstStart_4 = {
    init: function () {
        PBWizard.begin();
        setTimeout(function () {
            PBWizard.updateText('У тебя получилось. Давай ещё!');
            PBWizard.showDialog(210, 380, 1, 21, 486 + 15);
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
        LogicWizard.finish(true);
    }
};
/** ../client/components/application/wizards/WizardLevel_12.js */
let WizardLevel12_1 = {

    init: function () {
        PBWizard.begin();
        //PBWizard.updateText('Собирай кристаллы, на которых сидят ежи, освободи их!');
        PBWizard.updateText('Собирай кристаллы, освободи ежей.');
    },

    onHideDialog: function () {
        if (WizardLevel12_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 2, y: 1}, {x: 3, y: 1}]);
        PBWizard.showDialog(210, 400, 2, 20, 452, 163);
        PBWizard.highlightCells([
            {x: 0, y: 1, unlock: false},
            {x: 1, y: 1, unlock: false},
            {x: 2, y: 1, unlock: true},
            {x: 3, y: 1, unlock: true},
        ]);
    },
    onDestroyLine: function () {
        LogicWizard.finish(true);
    }
};
/** ../client/components/application/wizards/WizardLevel_15.js */
let WizardLevel15_1 = {

    init: function () {
        PBWizard.begin();
    },

    onHideDialog: function () {
        if (WizardLevel15_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 4, y: 5}, {x: 4, y: 4}]);
        PBWizard.updateText('Собирай кристаллы, чтобы снять цепь.');
        PBWizard.showDialog(210, 150, 2, 20);
        PBWizard.highlightCells([
            {x: 4, y: 4, unlock: true},
            {x: 3, y: 5, unlock: false},
            {x: 4, y: 5, unlock: true},
            {x: 5, y: 5, unlock: false},
        ]);
    },
    onDestroyLine: function () {
        LogicWizard.finish(true);
    }
};
/** ../client/components/application/wizards/WizardLevel_2.js */
let WizardLevel2_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Собрав ряд из 4-ех кристаллов, получишь кристалл с молнией.');
    },

    onHideDialog: function () {
        if (WizardLevel2_1.dialogCounter++ < 2) return;
        PBWizard.showDialog(360, 380, 2, 20, 350, 144);
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

let WizardLevel2_2 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Собери ряд кристаллов - молния активируется.');
        setTimeout(function () {
            PBWizard.showHint([{x: 2, y: 4}, {x: 3, y: 4}]);
            PBWizard.showDialog(230, 150, 2, 20, 556, 110);
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
        LogicWizard.finish(true);
    }
};

/** ../client/components/application/wizards/WizardLevel_23.js */
let WizardLevel23_1 = {

    init: function () {
        PBWizard.begin();
        //PBWizard.updateText('Собирай кристаллы, рядом с совой, чтобы она улетела.');
        PBWizard.updateText('Собирай кристаллы, чтобы сова улетела.');
    },

    onHideDialog: function () {
        if (WizardLevel23_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 3, y: 1}, {x: 4, y: 1}]);
        PBWizard.showDialog(210, 400 - 16, 2, 20, 425, 147);
        PBWizard.highlightCells([
            {x: 2, y: 2, unlock: false},
            {x: 1, y: 1, unlock: false},
            {x: 2, y: 1, unlock: false},
            {x: 3, y: 1, unlock: true},
            {x: 4, y: 1, unlock: true},
        ]);
    },
    onDestroyLine: function () {
        LogicWizard.finish(true);
    }
};
/** ../client/components/application/wizards/WizardLevel_3.js */
let WizardLevel3_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Собрав ряд из 5-ти кристаллов, получаешь звезду.');
    },
    onHideDialog: function () {
        if (WizardLevel3_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 4, y: 2}, {x: 4, y: 3}]);
        PBWizard.showDialog(210, 380, 2, 20, 508);
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

let WizardLevel3_2 = {

    init: function () {
        PBWizard.begin();
    },
    onFieldSilent: function () {
        PBWizard.updateText('Выбери звезду и потом цвет, чтобы убрать все кристаллы этого цвета.');
        PBWizard.showDialog(230, 50, 3, 20, 458, 160);
        PBWizard.showHint([{x: 4, y: 2}, {x: 5, y: 2}]);
        PBWizard.highlightCells([
            {x: 4, y: 2, unlock: true},
            {x: 5, y: 2, unlock: true}
        ]);
    },
    onDestroyThing: function (cell) {
        if (cell.object.objectId === DataObjects.OBJECT_POLY_COLOR) {
            LogicWizard.finish(true);
        }
    },
};

/** ../client/components/application/wizards/WizardLevel_30.js */
let WizardLevel_30_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Собирай кристаллы, камень опустится на дно.');
    },

    onHideDialog: function () {
        if (WizardLevel_30_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 1, y: 2}, {x: 2, y: 2}]);
        PBWizard.showDialog(340, 390 - 6, 2,
            null, 568, 153 - 6);
        PBWizard.highlightCells([
            {x: 1, y: 2, unlock: true},
            {x: 2, y: 2, unlock: true},
            {x: 2, y: 3, unlock: false},
            {x: 2, y: 4, unlock: false},
            //{x: 2, y: 5, unlock: false},
            //{x: 2, y: 6, unlock: false},
        ]);
    },
    onDestroyLine: function () {
        LogicWizard.finish(true);
    }
};

/** ../client/components/application/wizards/WizardLevel_4.js */
let WizardLevel_4_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Собери кристаллы, под которыми есть сокровища.');
    },

    onHideDialog: function () {
        if (WizardLevel_4_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 2, y: 1}, {x: 3, y: 1}]);
        PBWizard.showDialog(210, 380, 2, 20, 420, 148);
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

let WizardLevel4_2 = {

    init: function () {
        PBWizard.begin();
    },

    onFieldSilent: function () {
        PBWizard.updateText('Собери еще сокровищ!');
        PBWizard.showDialog(427, 250, 1, 20, 630, 14);
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
        LogicWizard.finish(true);
    },
};

/** ../client/components/application/wizards/WizardLevel_41.js */
let WizardLevel_41_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Собери кристаллы и камень упадет на дно.');
    },

    onHideDialog: function () {
        if (WizardLevel_41_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 1, y: 4}, {x: 2, y: 4}]);
        PBWizard.showDialog(340, 390 - 6, 2, null, 328, 148);
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
        LogicWizard.start(WizardLevel41_2);
    }
};

let WizardLevel41_2 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Камень ещё не достиг дна, ' +
            'собери ряд кристаллов чтобы переместить камень.');

        PBWizard.showDialog(365, 390 - 6, 3, null, 348, 148);
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
        LogicWizard.finish(true);
    }
};
/** ../client/components/application/wizards/WizardLevel_46.js */
let WizardLevel46_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Соедини коричневые кристаллы в ряд.');
    },

    onHideDialog: function () {
        if (WizardLevel46_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 2, y: 1}, {x: 3, y: 1}]);
        PBWizard.showDialog(340, 390 - 12, 2, null, 450, 146);
        PBWizard.highlightCells([
            {x: 3, y: 0, unlock: false},
            {x: 3, y: 1, unlock: true},
            {x: 3, y: 2, unlock: false},
            {x: 2, y: 1, unlock: true},
        ]);
    },
    onDestroyLine: function () {
        LogicWizard.finish(true);
    }
};
/** ../client/components/application/wizards/WizardLevel_51.js */
let WizardLevel51_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Собери ряд кристаллов, чтобы собрать монетки.');
    },

    onHideDialog: function () {
        if (WizardLevel51_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 5, y: 2}, {x: 5, y: 2}]);
        PBWizard.showDialog(340, 390 - 6, 2, null, 558, 154);
        PBWizard.highlightCells([
            {x: 2, y: 2, unlock: false},
            {x: 3, y: 2, unlock: false},
            {x: 4, y: 2, unlock: true},
            {x: 5, y: 2, unlock: true},
        ]);
    },

    onDestroyLine: function () {
        LogicWizard.finish(true);
    }
};
/** ../client/components/application/wizards/WizardLevel_9.js */
let WizardLevel9_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Собери кристаллы рядом с ящиками.');
    },

    onHideDialog: function () {
        if (WizardLevel9_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 2, y: 1}, {x: 3, y: 1}]);
        PBWizard.showDialog(210, 380, 2, 20);
        PBWizard.highlightCells([
            {x: 0, y: 1, unlock: false},
            {x: 1, y: 1, unlock: false},
            {x: 2, y: 1, unlock: true},
            {x: 3, y: 1, unlock: true},
        ]);
    },
    onDestroyLine: function () {
        LogicWizard.finish(true);
    }
};
/** components/base/ApiRouter.js */
/**
 * ApiRouter
 * Cross-side component.
 * @constructor
 */
let ApiRouter = new (function ApiRouter() {
    let self = this;

    let map;

    let stats = {};
    this.stats = stats;

    let connectionCount = 0;

    let connections = {};
    let onDisconnectCallbacks = [];
    let onFailedSendCallbacks = [];

    /**
     * Set API Map
     * @param newMap
     */
    this.setMap = function (newMap) {
        map = newMap;
        for (let group in map) {
            stats[group] = {};
            for (let method in map[group]) {
                stats[group][method] = 0;
            }
        }
    };

    /**
     * Process requests.
     * @param packet {string} пакет данных, формат:JSON, {group:string, method:string, args:[...]}
     * @param id {Number} id соединения.
     */
    this.onData = function (packet, id) {
        let group, method, args, l;
        l = packet.length;
        try {
            packet = JSON.parse(packet);
        } catch (e) {
            log("Wrong data:parse error", Logs.LEVEL_WARNING, packet);
            return;
        }
        if (typeof packet !== 'object') return Logs.log("Wrong data: packet must be 'object'", Logs.LEVEL_WARNING, packet);

        if (packet.group === undefined) return Logs.log("Wrong data: packet must have .group", Logs.LEVEL_WARNING, packet);

        if (typeof packet.group !== 'string') return Logs.log("Wrong data: packet.group must have type 'string'", Logs.LEVEL_WARNING, packet);

        if (packet.method === undefined) return Logs.log("Wrong data: packet must have .method", Logs.LEVEL_WARNING, packet);

        if (typeof packet.method !== 'string') return Logs.log("Wrong data: packet.method must have type 'string'", Logs.LEVEL_WARNING, packet);

        if (packet.args === undefined) return Logs.log("Wrong data: packet must have .args", Logs.LEVEL_WARNING, packet);

        if (typeof packet.args !== 'object') return Logs.log("Wrong data: packet.args must have type 'object'", Logs.LEVEL_WARNING, packet);

        group = packet.group;
        method = packet.method;
        args = packet.args;

        if (map[group] === undefined) return Logs.log("Wrong data: group not found " + group, Logs.LEVEL_WARNING, packet);

        if (map[group][method] === undefined) return Logs.log("Wrong data: method not found " + method, Logs.LEVEL_WARNING, packet);


        Logs.log((CONST_IS_SERVER_SIDE ? id + " " + ">> " : '') +
            group + "." + method + (l > 500 ? "(" + l + ")" : ""),
            Logs.LEVEL_DETAIL, args);

        /** Добавим к аргументам контекст соединения. */
        args.unshift(connections[id]);
        /** Group_method.counter ++ **/

        stats[group][method]++;

        map[group][method].apply(self, args);
    };

    this.onConnect = function (id) {
        Logs.log("ApiRouter.onConnect: id=" + id, Logs.LEVEL_DETAIL);
        connections[id] = {cid: id};
    };

    this.onDisconnect = function (id) {
        let userId, count;
        for (let i in onDisconnectCallbacks) {
            onDisconnectCallbacks[i].call(self, connections[id]);
        }
        if (connections[id]) userId = connections[id].userId;
        delete connections[id];
        count = 0;
        for (let i in connections) count++;
        Logs.log("Connection close: id=" + id + " count:" + count + " userId:" + userId, Logs.LEVEL_DETAIL);

        if (CONST_IS_CLIENT_SIDE) {
            //@todo не очень это выглядиты(да  и на сервере такой штуки нет)
            // @prid это глобальная переменная на клиенте
            prid = null;
        }

        if (CONST_IS_SERVER_SIDE && count === 0 && Config.Project.zeroOnlineDowntimeout) {
            setTimeout(function () {
                let count = 0;
                for (let i in connections) count++;
                if (count === 0) {
                    Logs.log("Zero clients - got down.", Logs.LEVEL_ALERT);
                    LogicSystemRequests.shutdown(function () {
                    });
                }
            }, Config.Project.zeroOnlineDowntimeout);
        }
    };

    this.executeRequest = function (group, method, args, cntxList) {
        let connectionsKey, i;
        /** Convert object to array. */
        args = Array.prototype.slice.call(args);

        if (!cntxList) cntxList = [{cid: null}];

        connectionsKey = '';
        for (i in cntxList) connectionsKey += cntxList[i].cid;

        let packet = {
            group: group,
            method: method,
            args: args
        };
        packet = JSON.stringify(packet);

        if (CONST_IS_SERVER_SIDE) {
            /** Server */
            Logs.log(connectionsKey + " " + "<< " + group + "." + method + ':' + args.join(','), Logs.LEVEL_DETAIL);
        } else {
            /** Client */
            Logs.log(group + "." + method +
                (packet.length > 500 ? "(" + packet.length + ")" : ""), Logs.LEVEL_DETAIL, args);
        }

        let cntxListLength = 0;
        for (i in cntxList) {
            if (!this.sendData(packet, cntxList[i].cid)) {
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
     * @todo move out
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

})
();

global['ApiRouter'] = ApiRouter;

/** ../client/components/base/GUI.js */
/**
 * Адаптация для работы с гуёй. В данном случае это браузер.
 * Все запросы к гуи должны быть реализованы тут. и тут: GUIDom
 * @constructor
 * @type {GUI}
 */
let GUI = function () {
    let self = this;

    let isFSMode = false;

    this.appArea = false;
    this.wizardArea = false;
    this.canvasArea = false;
    this.fsFrame = false;

    /** @type {CanvasRenderingContext2D} */
    this.canvasCntx = null;

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

    this.POINTER_NONE = 'none';

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

    let canvasParent = {
        x: 0, y: 0,
        childs: [],
        appendChild: function (gdom) {
            this.childs.push(gdom);
            gdom.__parent = this;
        }, isShowed: function () {
            return true;
        }, calcX: function () {
            return this.x;
        }, calcY: function () {
            return this.y;
        }, calcOpacity: function () {
            return 1.0;
        }
    };

    this.initCanvas = function () {

        parentsStack.push(canvasParent);
        GUI.canvasArea = document.getElementById('canvasArea');
        GUI.canvasArea.width = DataCross.app.width * window.devicePixelRatio;
        GUI.canvasArea.height = DataCross.app.height * window.devicePixelRatio;

        GUI.canvasCntx = GUI.canvasArea.getContext('2d');

        GUI.canvasArea.addEventListener('mousemove', function (e) {
            self.canvasEvents(e, GUI.EVENT_MOUSE_MOVE)
        });
        GUI.canvasArea.addEventListener('click', function (e) {
            self.canvasEvents(e, GUI.EVENT_MOUSE_CLICK)
        });

        setTimeout(GUI.redrawFrame, 3000);
    };

    this.canvasPointerDoms = [];

    this.canvasEvents = function (e, eventId) {
        /**
         * mouse out/over
         * if( intersect && !el.mouseIn){
         *
         * }
         * if( !intersect && el.mouseIN
         */
        let intersect;

        let els = [];

        eventBinds[eventId].forEach(function (el) {
            intersect = eventIntersectEl(e, el);

            if (intersect && GUI.lockEventsExcept) {
                let dom, skip;
                dom = el.dom;
                skip = true;
                while (dom) {
                    if (GUI.lockEventsExcept === dom) {
                        skip = false;
                    }
                    dom = dom.__parent;
                }
                if (skip) return;
            }

            if (intersect) els.push(el);
        });

        if (els.length > 1) {
            els.sort(function (l, r) {
                return l.dom.__id < r.dom.__id ? -1 : 1;
            });
            els.sort(function (l, r) {
                return l.dom.zIndex < r.dom.zIndex ? -1 : 1;
            });
            els.reverse();
        }
        let doEvent = function (index) {
            let res;
            res = false;
            if (els[index]) res = els[index].callback.call(els[index].context, e, els[index].dom);
            if (res) doEvent(++index);
        };
        doEvent(0);

        if (eventId === GUI.EVENT_MOUSE_MOVE) {

            let pointer = GUI.POINTER_ARROW;
            self.canvasPointerDoms.forEach(function (dom) {
                if (eventIntersectEl(e, {dom: dom})) {
                    pointer = dom.pointer;
                }
            });


            GUI.canvasArea.style.cursor = pointer;

            eventBinds[GUI.EVENT_MOUSE_OUT].forEach(function (el) {
                intersect = eventIntersectEl(e, el);

                if (!intersect && el.dom.__mouseIn) {
                    el.dom.__mouseIn = false;
                    el.callback.call(el.context, e, el.dom);
                    //GUI.canvasArea.style.cursor = 'none';
                }
            });

            eventBinds[GUI.EVENT_MOUSE_OVER].forEach(function (el) {
                intersect = eventIntersectEl(e, el);

                if (intersect && !el.dom.__mouseIn) {
                    el.dom.__mouseIn = true;
                    el.callback.call(el.context, e, el.dom);
                }
            });

        }
    };

    let eventIntersectEl = function (e, el) {
        return el.dom.isShowed() &&
            el.dom.calcX() < e.layerX * GUI.dpr &&
            el.dom.calcX() + el.dom.calcWidth() > e.layerX * GUI.dpr &&

            el.dom.calcY() < e.layerY * GUI.dpr &&
            el.dom.calcY() + el.dom.calcHeight() > e.layerY * GUI.dpr;
    };

    let eventBinds = {};

    this.canvasBind = function (eventId, callback, context, dom) {
        if (!eventBinds[eventId]) eventBinds[eventId] = [];
        eventBinds[eventId].push({dom: dom, callback: callback, context: context});
    };

    /**
     * Инициализация.
     * - установим родителя, это будет тело документа.
     */
    this.init = function () {
        GUI.appArea = document.getElementById('appArea');
        GUI.wizardArea = document.getElementById('wizardArea');
        GUI.fsFrame = document.createElement('div');
        window.document.body.appendChild(GUI.fsFrame);
        {
            GUI.fsFrame.style.position = 'absolute';
            GUI.fsFrame.style.zIndex = -1000;
            GUI.fsFrame.style.left = '-15px';
            GUI.fsFrame.style.top = '-15px';
            GUI.fsFrame.style.width = (Images.getMeta('fs-frame.png').w) + 'px';
            GUI.fsFrame.style.height = (Images.getMeta('fs-frame.png').h) + 'px';
            GUI.setImageToElement(GUI.fsFrame, 'fs-frame.png');
        }

        parentsStack.push(GUI.appArea);
        //@todo canvas
        if (Config.Project.canvas) {
            GUI.initCanvas();
        } else {
            parentsStack.push(GUI.appArea);
        }

        let style = document.createElement('style');
        style.type = 'text/css';
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
                callback.call(null, event.clientX - GUI.appArea.offsetLeft, event.clientY - GUI.appArea.offsetTop);
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
                GUI.appArea.style.left = (screen.availWidth / 2 - parseInt(GUI.appArea.style.width) / 2) + 'px';
                GUI.appArea.style.top = (screen.availHeight / 2 - parseInt(GUI.appArea.style.height) / 2) + 'px';
                GUI.wizardArea.style.left = (screen.availWidth / 2 - parseInt(GUI.appArea.style.width) / 2) + 'px';
                GUI.wizardArea.style.top = (screen.availHeight / 2 - parseInt(GUI.appArea.style.height) / 2) + 'px';
                if (GUI.canvasArea) {
                    GUI.canvasArea.style.left = (screen.availWidth / 2 - parseInt(GUI.appArea.style.width) / 2) + 'px';
                    GUI.canvasArea.style.top = (screen.availHeight / 2 - parseInt(GUI.appArea.style.height) / 2) + 'px';
                }
                GUI.fsFrame.style.left = ((screen.availWidth / 2 - parseInt(GUI.appArea.style.width) / 2) - 15) + 'px';
                GUI.fsFrame.style.top = ((screen.availHeight / 2 - parseInt(GUI.appArea.style.height) / 2) - 15) + 'px';

            } else {
                if (vkWidgets) vkWidgets.style.display = '';
                GUI.appArea.style.left = '';
                GUI.appArea.style.top = '';
                GUI.wizardArea.style.left = '';
                GUI.wizardArea.style.top = '';
                if (GUI.canvasArea) {
                    GUI.canvasArea.style.left = '';
                    GUI.canvasArea.style.top = '';
                }
                GUI.fsFrame.style.left = '-15px';
                GUI.fsFrame.style.top = '-15px';
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
        updateFS();
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
        return parentsStack.push(parentDom);
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

        if (Config.Project.canvas) {
            dom = new GUIDomCanvas();
        } else {
            dom = new GUIDom();
        }
        if (params) {
            for (let name in params) {
                dom[name] = params[name];
            }
        }
        dom.init(parent);
        return dom;
    };

    let lastFrameTime = null;

    this.redrawFrame = function () {
        GUI.dpr = window.devicePixelRatio;
        /*
        GUI.canvasCntx.clearRect(0, 0,
            DataCross.app.width * GUI.dpr,
            DataCross.app.height * GUI.dpr
        );
        */

        canvasParent.childs.sort(function (l, r) {
            return l.__id < r.__id ? -1 : 1;
        });
        canvasParent.childs.sort(function (l, r) {
            return l.zIndex < r.zIndex ? -1 : 1;
        });
        let drawLayers = function (layerDom) {
            layerDom.childs.forEach(function (dom) {
                dom.draw();
                if (dom.childs.length) {
                    drawLayers(dom);
                }
            });
        };

        drawLayers(canvasParent);
        // сколько млсек уходит на отрисовку
        if (lastFrameTime) {
            let t = (Date.now() - lastFrameTime);
            window.timer.push(t);
        }


        let currentFrameTime = Date.now();
        window.fpsList.push(1000 / (currentFrameTime - lastFrameTime));
        lastFrameTime = currentFrameTime;

        setTimeout(GUI.redrawFrame, 1);

        let text = null, sum;

        if (window.fpsList.length % 10 === 0) {
            sum = 0;
            for (let i = 0; i < window.fpsList.length; i++) sum += window.fpsList[i];
            text = Math.round(sum / window.fpsList.length * 10) / 10;

            if (window.fpsList.length > 300) window.fpsList = [];

            PageBlockBackground.fpsText.setText(text);
            PageBlockBackground.fpsText.redraw();
        }

    };
    window.timer = [];
    window.fpsList = [];

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

    this.setImageToElement = function (el, url, toWidth, toHeight) {
        let meta, backgroundImage;

        meta = Images.getMeta(url);

        backgroundImage = "url('" + meta.path + "')";

        if (window.useSprite) {
            let koefW, koefH;
            koefW = (toWidth ? toWidth : parseInt(el.style.width)) / meta.w;
            koefH = (toHeight ? toHeight : parseInt(el.style.height)) / meta.h;
            el.style.backgroundPositionX = '-' + meta.x * koefW + 'px';
            el.style.backgroundPositionY = '-' + meta.y * koefH + 'px';
            el.style.backgroundSize =
                (
                    window.spriteSize.width * koefW + 'px' +
                    ' ' +
                    window.spriteSize.height * koefH + 'px'
                );
        }
        el.style.backgroundImage = backgroundImage;
    }
};

/**
 * Статичный "класс".
 * @type {GUI}
 */
GUI = new GUI();

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
     * Их мы будем хранить, чтобы не перерисовывать лишний раз,
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

    /**
     * Создается элемент браузера
     * Настраиваются минимальные параметры
     * @param parent [GUIDom] родитель.
     */
    this.init = function (parent) {
        /** Начальное значение старых свойств */
        for (let i in props) {
            oldProps[i] = undefined;
        }
        /** Создадим дом */
        dom = document.createElement('div');
        /** Значения по умолчанию для дом-ов. */
        dom.className = 'gui-dom';
        /** Does not dragable by default */
        dom.ondragstart = function () {
            return false;
        };
        /** Добавим дом к родителю. */
        this.__dom = dom;
        dom.__dom = this;
        if (!parent) parent = GUI.getCurrentParent();
        parent.appendChild(dom);
    };

    this.appendChild = function (dom) {
        this.__dom.appendChild(dom);
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

    /** Далее идут методы перерисовки. */
    let redrawX = function () {
        dom.style.left = (self.x - (self.borderWidth ? self.borderWidth / 2 : 0)) + 'px';
    };
    let redrawY = function () {
        dom.style.top = (self.y - (self.borderWidth ? self.borderWidth / 2 : 0)) + 'px';
    };
    let redrawWidth = function () {
        dom.style.width = (self.width - (self.borderWidth ? self.borderWidth / 2 : 0)) + 'px';
        if (self.backgroundImage) redrawBackgroundImage();
    };
    let redrawHeight = function () {
        dom.style.height =
            (
                (!isNaN(self.visibleHeight) ? self.visibleHeight : self.height) -
                (self.borderWidth ? self.borderWidth / 2 : 0)
            ) +
            'px';


        if (self.backgroundImage) redrawBackgroundImage();
    };
    let redrawBackgroundImage = function () {
        let meta, kW, kH, s;
        meta = Images.getMeta(self.backgroundImage);
        /** Если размер не задан, пробуем задать его автоматически. */
        if (!self.width && !self.height && meta.path && meta.w && meta.h) {
            self.width = meta.w;
            self.height = meta.h;
            props.height.call();
            props.width.call();
        }
        s = dom.style;
        s.backgroundImage = 'url(' + meta.path + ')';
        s.backgroundRepeat = 'no-repeat';

        s.backgroundPositionX = '-' + meta.x + 'px';
        self.backgroundPositionY = self.backgroundPositionY ? self.backgroundPositionY : 0;
        s.backgroundPositionY = '-' + (meta.y + self.backgroundPositionY) + 'px';


        if ((window.useSprite && !meta.absolute) && self.width && self.height) {

            kW = self.width / meta.w;
            kH = self.height / meta.h;

            s.backgroundPositionX =
                parseInt(dom.style.backgroundPositionX) * kW + 'px';
            s.backgroundPositionY =
                parseInt(dom.style.backgroundPositionY) * kH + 'px';
            s.backgroundSize =
                (window.spriteSize.width * kW) + 'px ' +
                (window.spriteSize.height * kH) + 'px ';
        } else {
            s.backgroundSize =
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
        dom.style.borderRadius = self.borderRadius + 'px';
    };
    let redrawBorder = function () {
        dom.style.border =
            (self.borderWidth ? self.borderWidth + 'px solid' : ' ') +
            (self.borderColor ? self.borderColor : ' ');
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
        visibleHeight: redrawHeight,
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
        borderColor: redrawBorder,
        borderWidth: redrawBorder,
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
        alignText: redrawAlignText,
        zIndex: redrawZIndex,
        overflow: redrawOverflow,
        textDecoration: redrawTextDecoration,
        rotate: redrawRotate,
    };
};

/**
 * Уникальнгый id для каждогого дома, иногда нужна уникальность дома, для таймаутов например.
 * @type {number}
 */
GUIDom.lastId = 0;
/** ../client/components/base/GUIDomCanvas.js */
/**
 * Адаптация для работы с гуёй. В данном случае это canvas.
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
 * @property alignText {String}
 * @property zIndex {Int}
 * @property fontWeight {String}
 * @property overflow {String}
 * @property textDecoration {String}
 * @property rotate {Int}
 */
let GUIDomCanvas = function () {
        let self = this;

        this.__id = ++GUIDom.lastId;

        this.isNeedRedraw = false;

        /**
         * Старые свойства.
         * Их мы будем хранить, чтобы не перерисовывать лишний раз,
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

        /**
         * Создается элемент браузера
         * Настраиваются минимальные параметры
         * @param parent [GUIDom] родитель.
         */
        this.init = function (parent) {

            if (!parent) parent = GUI.getCurrentParent();
            parent.appendChild(this);

            /** Начальное значение старых свойств */
            for (let i in props) {
                oldProps[i] = undefined;
            }

            this.fontSize = 24;

            /** Создадим дом */
            /** Значения по умолчанию для дом-ов. */
            //dom.className = 'gui-dom';
            /** Does not dragable by default */
            /*dom.ondragstart = function () {
                return false;
            };*/
        };

        this.childs = [];

        this.appendChild = function (gdom) {
            this.childs.push(gdom);
            gdom.__parent = this;
        };

        /**
         * Покажем дом.
         */
        this.show = function () {
            if (showed) return;
            showed = true;
            self.redraw();
        };

        /**
         * Спрячем дом.
         */
        this.hide = function () {
            if (!showed) return;
            showed = false;
        };

        /**
         * Перересовка дома.
         * Только те свойства, которые изменились.
         */
        this.redraw = function () {
            if (!showed) return;

            if (!self.isNeedRedraw) self.isNeedRedraw = false;
            for (let name in props) {
                if (oldProps[name] !== self[name]) {
                    props[name].call();
                    self.isNeedRedraw = true;
                    oldProps[name] = self[name];
                }
            }
        };

        this.isShowed = function () {
            return showed && self.__parent.isShowed();
        };

        this.draw = function () {
            let oldX, oldY;
            let dpr = GUI.dpr;
            let cntx = GUI.canvasCntx;

            if (!self.isShowed()) return;

            cntx.globalAlpha = self.calcOpacity();

            if (self.rotate) {
                // move canvas to self.x, self.y
                //https://stackoverflow.com/questions/3793397/html5-canvas-drawimage-with-at-an-angle
                // cntx.translate(GUI.canvasArea.width / 2, GUI.canvasArea.height / 2);
                //cntx.rotate(self.rotate);
                cntx.translate(
                    self.calcX() + self.calcWidth() / 2,
                    self.calcY() + self.calcHeight() / 2
                );
                self.rotateFlag = true;
                cntx.rotate(self.rotate * Math.PI / 180);
            }

            let drawBorders = function (fill) {
                cntx.lineWidth = self.borderWidth * dpr;
                cntx.strokeStyle = self.borderColor;
                if (self.borderRadius) {
                    roundRect(cntx,
                        self.calcX() - self.borderWidth,
                        self.calcY() - self.borderWidth,
                        self.calcWidth() + self.borderWidth * 2,
                        self.calcHeight() + self.borderWidth * 2,
                        self.borderRadius * dpr, fill ? self.background : undefined
                    )
                } else {
                    cntx.fillRect(
                        self.calcY(), self.calcY(),
                        self.width * dpr, self.height * dpr
                    );
                }
            };
            // 6.5 (1.0)
            if (self.borderWidth && self.background) {
                drawBorders(true)
            }

            // 6.5 (1.0)
            if (self.background) {
                cntx.fillStyle = self.background;
                cntx.fillRect(
                    self.calcX(), self.calcY(),
                    self.calcWidth(), self.calcHeight()
                );
            }

            if (self.backgroundImage) {

                self.meta = Images.getMeta(self.backgroundImage);
                if (!self.meta.absolute)
                    Images.getImage(self.backgroundImage, function (img, meta, instant) {
                        if (instant)
                            if (meta.w && meta.h) {
                                cntx.drawImage(img,
                                    self.meta.x * dpr,
                                    (self.meta.y
                                        + (self.backgroundPositionY ? self.backgroundPositionY : 0)
                                    ) * dpr,
                                    (self.meta.w) * dpr,
                                    (self.visibleHeight ? self.visibleHeight : self.meta.h) * dpr,
                                    self.calcX(), self.calcY(),
                                    self.calcWidth(), self.calcHeight()
                                )
                                ;
                            } else {
                                cntx.drawImage(img,
                                    self.calcX(), self.calcY(),
                                    self.width * dpr, self.height * dpr);
                            }
                    });
            }

            // 6.5(1.0)
            if (self.borderWidth) {
                drawBorders(false)
            }

            // 7.5(2.0)
            if (self.text && typeof self.text === 'string') {

                //dom.textDecoration = self.textDecoration;

                cntx.fillStyle = self.color;
                if (self.alignText) cntx.textAlign = self.alignText;

                cntx.font =
                    (self.fontWeight ? (self.fontWeight + ' ') : '') +
                    (self.fontSize * GUI.dpr) + 'px ' +
                    self.fontFamily;

                let lineY = 0;
                self.text.split('\r\n').forEach(function (text) {

                    cntx.fillText(text,
                        self.calcX() + self.calcWidth() / 2
                        + (self.alignText === 'right' ? self.calcWidth() : 0),

                        self.calcY() + lineY
                        + ( self.fontSize * GUI.dpr                        )-2
                    );
                    lineY += self.fontSize * GUI.dpr
                });

            }

            if (self.rotate) {
                cntx.rotate(-self.rotate * Math.PI / 180);
                self.rotateFlag = false;
                cntx.translate(
                    -(self.calcX() + self.calcWidth() / 2),
                    -(self.calcY() + self.calcHeight() / 2)
                );
            }

            /** Контуры */
            if (false) {
                GUI.canvasCntx.globalAlpha = 0.9;
                cntx.lineWidth = 1;
                cntx.strokeStyle = 'red';
                cntx.strokeRect(
                    self.calcX(), self.calcY(),
                    self.calcWidth(), self.calcHeight()
                );
            }

        };

        this.calcX = function () {
            if (self.rotate && self.rotateFlag) return -self.calcWidth() / 2;
            return self.x * GUI.dpr + self.__parent.calcX();
        };

        this.calcY = function () {
            if (self.rotate && self.rotateFlag) return -self.calcHeight() / 2;
            return self.y * GUI.dpr + self.__parent.calcY();
        };

        this.calcWidth = function () {
            return (self.width ? self.width : (self.meta ? self.meta.w : undefined)) * GUI.dpr;
        };

        this.calcHeight = function () {
            let h;
            h = self.height;
            if (!h) h = self.meta ? self.meta.h : undefined;
            if (self.visibleHeight) h = self.visibleHeight;
            if (!h) h = undefined;
            return h * GUI.dpr;
        };

        this.calcOpacity = function () {
            return (self.opacity ? self.opacity : 1.0) * self.__parent.calcOpacity();
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
            //@todo

            GUI.canvasBind(eventId, callback, context, this);
            return;
            /**
             * HOW TO?
             * ADD CALLBACK ON EVENT
             * GUIEvents.addEventListener(eventName,
             *
             */
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

        let f = function () {
        };

        /** Далее идут методы перерисовки. */
        let redrawWidth = function () {
            //dom.style.width = self.width + 'px';
            // if (self.backgroundImage) redrawBackgroundImage();
        };
        let redrawHeight = function () {
            // dom.style.height = (!isNaN(self.visibleHeight) ? self.visibleHeight : self.height) + 'px';

            // if (self.backgroundImage) redrawBackgroundImage();
        };
        let redrawBackgroundImage = function () {
            self.meta = Images.getMeta(self.backgroundImage);
            return;
            let meta, kW, kH, s;
            meta = Images.getMeta(self.backgroundImage);
            /** Если размер не задан, пробуем задать его автоматически. */
            if (!self.width && !self.height && meta.path && meta.w && meta.h) {
                self.width = meta.w;
                self.height = meta.h;
                props.height.call();
                props.width.call();
            }
            s = dom.style;
            s.backgroundImage = 'url(' + meta.path + ')';
            s.backgroundRepeat = 'no-repeat';

            s.backgroundPositionX = '-' + meta.x + 'px';
            self.backgroundPositionY = self.backgroundPositionY ? self.backgroundPositionY : 0;
            s.backgroundPositionY = '-' + (meta.y + self.backgroundPositionY) + 'px';


            if ((window.useSprite && !meta.absolute) && self.width && self.height) {

                kW = self.width / meta.w;
                kH = self.height / meta.h;

                s.backgroundPositionX =
                    parseInt(dom.style.backgroundPositionX) * kW + 'px';
                s.backgroundPositionY =
                    parseInt(dom.style.backgroundPositionY) * kH + 'px';
                s.backgroundSize =
                    (window.spriteSize.width * kW) + 'px ' +
                    (window.spriteSize.height * kH) + 'px ';
            } else {
                s.backgroundSize =
                    (self.width) + 'px' + ' ' +
                    (self.height) + 'px';
            }

        };
        let redrawBackgroundSize = function () {
            //dom.style.backgroundSize = self.backgroundSize + 'px';
        };
        let redrawPointer = function () {
            GUI.canvasPointerDoms[self.__id] = self;
        };
        let redrawColor = function () {
            //dom.style.color = self.color;
        };
        let redrawTextShadow = function () {
            //dom.style.textShadow = self.textShadow;
        };
        let redrawBorderRadius = function () {
            //dom.style.borderRadius = self.borderRadius;
        };
        let redrawBorder = function () {
            //dom.style.border = self.border;
        };
        let redrawBorderTop = function () {
            //dom.style.borderTop = self.borderTop;
        };
        let redrawBorderRight = function () {
            //dom.style.borderRight = self.borderRight;
        };
        let redrawBorderBottom = function () {
            //dom.style.borderBottom = self.borderBottom;
        };
        let redrawBorderLeft = function () {
            //dom.style.borderLeft = self.borderLeft;
        };
        let redrawPadding = function () {
            //dom.style.padding = self.padding;
        };
        let redrawBoxShadow = function () {
            //dom.style.boxShadow = self.boxShadow;
        };
        let redrawLineHeight = function () {
            //dom.style.lineHeight = self.lineHeight;
        };
        let redrawBackground = function () {
            //dom.style.background = self.background;
        };
        let redrawTransform = function () {
            //dom.style.transform = self.transform;
        };
        let redrawTitle = function () {
            //dom.setAttribute('title', self.title);
        };
        let redrawZIndex = function () {
            //dom.style.zIndex = self.zIndex;
        };
        let redrawOverflow = function () {
            //dom.style.overflow = self.overflow;
        };
        let redrawTextDecoration = function () {
            //dom.style.textDecoration = self.textDecoration;
        };
        let redrawRotate = function () {
            //dom.style.transform = 'rotate(' + self.rotate + 'deg)';
        };

        /**
         * Имена свойств и их методы обработки.
         * @type {{x: Function, y: Function, width: Function, height: Function, backgroundImage: *, innerHTML: Function, pointer: Function, opacity: Function, fontWeight: *, fontSize: *, fontFamily: Function, color: Function, textShadow: Function, borderRadius: Function, border: Function, borderTop: Function, borderRight: Function, borderBottom: Function, borderLeft: Function, padding: Function, boxShadow: Function, lineHeight: Function, background: Function, transform: Function, title: *}}
         */
        let props = {
            x: f,
            y: f,
            width: redrawWidth,
            height: redrawHeight,
            visibleHeight: redrawHeight,
            backgroundPositionY: redrawBackgroundImage,
            backgroundImage: redrawBackgroundImage,
            backgroundSize: redrawBackgroundSize,
            innerHTML: f,
            pointer: redrawPointer,
            opacity: f,
            fontWeight: f,
            fontSize: f,
            fontFamily: f,
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
            alignText: f,
            zIndex: redrawZIndex,
            overflow: redrawOverflow,
            textDecoration: redrawTextDecoration,
            rotate: redrawRotate,
        };

        let roundRect = function (ctx, x, y, width, height, radius, fill, stroke) {
            if (typeof stroke === 'undefined') {
                stroke = true;
            }
            if (typeof radius === 'undefined') {
                radius = 5;
            }
            if (typeof radius === 'number') {
                radius = {tl: radius, tr: radius, br: radius, bl: radius};
            } else {
                var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
                for (var side in defaultRadius) {
                    radius[side] = radius[side] || defaultRadius[side];
                }
            }
            ctx.beginPath();
            ctx.moveTo(x + radius.tl, y);
            ctx.lineTo(x + width - radius.tr, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
            ctx.lineTo(x + width, y + height - radius.br);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
            ctx.lineTo(x + radius.bl, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
            ctx.lineTo(x, y + radius.tl);
            ctx.quadraticCurveTo(x, y, x + radius.tl, y);
            ctx.closePath();
            if (fill) {
                ctx.fill();
            }
            if (stroke) {
                ctx.stroke();
            }
        };

    }
;

/**
 * Уникальнгый id для каждогого дома, иногда нужна уникальность дома, для таймаутов например.
 * @type {number}
 */
GUIDom.lastId = 0;
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

    this.getRealPath = function (url) {
        return '/images/' + url;
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
            notFoundImg.absolute = true;
            //@todo crunch fo soc net photos
            notFoundImg.x = 0;
            notFoundImg.y = 0;
            notFoundImg.w = 50;
            notFoundImg.h = 50;
            return notFoundImg;
        }
        if (!url || !window.i_d[url]) {
            if (notfounds.indexOf(url) !== -1) return notFoundImg;
            notfounds.push(url);
            Logs.log("Image url not found for: " + url, Logs.LEVEL_WARNING);
            notFoundImg.path = '';
            return notFoundImg;
        }
        return window.i_d[url];
    };

    let worker = window.Worker;
    //if (window.localStorage && !window.localStorage.images) window.localStorage.images = {};
    if (window.Worker) {
        worker = new Worker('/js/w-images.js');
        worker.onmessage = function (e) {
            let imgBtmp, path, url;
            imgBtmp = e.data[0];
            path = e.data[1];
            url = e.data[2];
            images[url] = imgBtmp;
            Images.getMeta(url).x = 0;
            Images.getMeta(url).y = 0;
            //window.s = imgBtmp;
            //if (window.localStorage) window.localStorage.images[url] = imgBtmp;
            //console.log('loaded:' + url);

        }
    }

    let images = {};

    /**
     *
     * @param url
     * @param callback
     */
    this.getImage = function (url, callback) {
        let image, meta, path;
        path = Images.getPath(url);
        meta = Images.getMeta(url);

        if (!images[url]) {
            if (images[url] === false) return;
            images[url] = false;

            image = new Image();
            image.onload = function () {
                images[url] = image;
                callback(images[url], meta, false);

                if (worker && worker.postMessage) {
                    worker.postMessage([Images.getRealPath(url), meta, url]);
                }
            };
            image.src = path;
        } else {
            callback(images[url], Images.getMeta(url), true);
        }
    };
};

/** @type {Images} */
Images = new Images();

let allImageUrls = [];
for (let url in window.i_d) allImageUrls.push(url);

[
    'star-on.png',
    'map-way-point-grey.png',
    'map-way-point-yellow.png',
    'old-paper.png',
    'way-line.png',
    'map-001.png',
    'button-add-rest.png',

    'panel-money.png',
    'panel-hearth.png',

    'pit-close.png',

    'field-cell.png',
    'field-blue.png',
    'field-red.png',
    'field-yellow.png',
    'field-purple.png',
    'field-green.png',

    'coin.png',

    'map-arrow-left-rest.png',
    'map-arrow-right-rest.png',
].concat(allImageUrls).forEach(function (url) {
    Images.getImage(url, function () {

    });
});

/** components/base/Logs.js */
var FS;
if (CONST_IS_SERVER_SIDE) {
    FS = require('fs');
}

/**
 * Компонент логирования.
 * Клиент-серверный компонент!
 * @type {Logs}
 */
let Logs = function () {
    let self = this;

    /**
     * Уровень срабатывания.
     * @type {number} Logs.LEVEL_*
     */
    let trigger_level = null;

    this.init = function (afterInitCallback) {
        trigger_level = Config.Logs.triggerLevel;
        afterInitCallback();
    };

    /**
     * Сюда и проходят логи.
     * @param message {string} сообщение.
     * @param level {int} тип Logs.LEVEL_*.
     * @param [details] {*} необязательный параметр, детали.
     * @param channel
     */
    this.log = function (message, level, details, channel, telega) {
        let date, dateFormated, logText, levelTitle;
        /** Если не передан уровень, то считаем его детальным. */
        if (!level) level = Logs.LEVEL_DETAIL;

        /** Если уровень лога ниже уровня срабатывания ничего не делаем. */
        if (!channel && level < trigger_level) return;
        /** Сформируем сообщение лога. */
        date = new Date();
        /** Тут мы получим "01-01-2014 15:55:55" */
        let day, month, year, hour, minutes, seconds;
        //year = date.getFullYear().toString().substr(2, 2);
        day = str_pad(date.getDate());
        month = str_pad(date.getMonth() + 1);
        hour = str_pad(date.getHours());
        minutes = str_pad(date.getMinutes());
        seconds = str_pad(date.getSeconds());
        if (CONST_IS_CLIENT_SIDE) {
            dateFormated = minutes + ':' + seconds;
        } else {
            dateFormated = day + '.' + month + ' ' + hour + ':' + minutes + ':' + seconds;
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
                telega = true;
                break;
            case Logs.CHANNEL_VK_STUFF:
                FS.writeFile(CONST_DIR_SERVER + '/logs/vk_stuff.log', logText + details + "\r\n", {flag: 'a'}, function () {
                });
                break;
            case Logs.CHANNEL_VK_HEALTH:
                FS.writeFile(CONST_DIR_SERVER + '/logs/vk_health.log', logText + details + "\r\n", {flag: 'a'}, function () {
                });
                break;
            case Logs.CHANNEL_CLIENT:
                FS.writeFile(CONST_DIR_SERVER + '/logs/client.log', logText + details + "\r\n", {flag: 'a'}, function () {
                });
                telega = true;
                break;
            case Logs.CHANNEL_TELEGRAM:
                telega = true;
                break;
        }
        if (level >= Logs.LEVEL_ALERT) telega = true;
        if (level === Logs.LEVEL_ERROR || level === Logs.LEVEL_FATAL_ERROR) {
            if (CONST_IS_CLIENT_SIDE) {
                //@todo client errors channel
                SAPILogs.log(message, level, details);
            }
        }
        // если это фатальная ошибка - завершим работу программы.

        if (CONST_IS_SERVER_SIDE && telega) {
            telegramSent(message + details);
        }
        if (level === Logs.LEVEL_FATAL_ERROR) {
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
     * Оповещение.
     */
    this.LEVEL_ALERT = 3;

    /**
     * Внимание.
     */
    this.LEVEL_WARNING = 4;

    /**
     * Ошибка.
     */
    this.LEVEL_ERROR = 5;

    /**
     * Фатальная ошибка.
     */
    this.LEVEL_FATAL_ERROR = 6;

    this.alert = function (level, message) {
        if (level < trigger_level) return;
        alert(message);
    };

    let typeTitles = {};
    /** Человеко-читаемые типы логов. */
    typeTitles[this.LEVEL_DETAIL] = 'd';
    typeTitles[this.LEVEL_NOTIFY] = 'N';
    typeTitles[this.LEVEL_ALERT] = '!';
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
Logs.CHANNEL_CLIENT = 4;
Logs.CHANNEL_TELEGRAM = 5;

Logs.depends = [];

/** Для кросс-сайдных компонент */
if (CONST_IS_SERVER_SIDE) {
    global['Logs'] = Logs;
}
/** ../client/components/base/OnIdle.js */
/**
 * @type {OnIdle}
 * @constructor
 */
let OnIdle = function () {
    let self = this;

    this.stack = [];

    this.init = function () {
        setTimeout(OnIdle.iterate, Config.OnIdle.animateInterval);
    };

    this.register = function (func) {
        self.stack.push(func);
    };

    this.iterate = function () {
        self.stack.forEach(function (f) {
            f();
        });
        setTimeout(OnIdle.iterate, Config.OnIdle.animateInterval);
    };

};

OnIdle = new OnIdle;
/** ../client/components/base/PageController.js */
/**
 * Page controller
 * @type {PageController}
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
PageController = new PageController();
/** ../client/components/base/Profiler.js */
/**
 * Dummy.
 * @type {ProfilerDummy}
 * @constructor
 */
let ProfilerDummy = function () {

    let emptyFunc = function () {
    };

    this.start = emptyFunc;

    this.stop = emptyFunc;
};

/**
 * @type {ProfilerDummy}
 */
let Profiler = new ProfilerDummy();
/** ../client/components/base/SocNet.js */
/**
 * Компонент для работы с социальной сетью.
 * @type {SocNet|SocNetVK|SocNetStandalone}
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

/** ../client/components/base/SocNetStandalone.js */
/**
 * Компонет для работы с социальной сетью(платформой): сайтом http://krestiki-noliki.xyz/
 * @constructor
 */
/**
 * @type {SocNetStandalone}
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
        return '';
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
    for (let i = 1; i < 100; i++) {
        friends.push(444400000 + i);
        friends.push(i);
    }

    this.getFriendIds = function (callback) {
        if (false) {
            callback([]);
        } else {
            callback(friends);
        }
    };

    this.getUserInfo = function (id, callback) {
        let randomName = [
            'Кириллов Юрий Валериевич https://sun9-66.userapi.com/c850720/v850720693/aa731/OfJz30MgPwk.jpg?ava=1',
            'Пахомов Александр Григорьевич https://sun9-14.userapi.com/c638221/v638221218/2ef4b/_aHYzcPLBCg.jpg?ava=1',
            'Негода Устин Леонидович https://sun1-22.userapi.com/RmZXykSdi9zj13kzngIYEqOfID_hx6orUlfJlA/MMMD8qmZ_Xw.jpg?ava=1',
            'Грабчак Роман Андреевич https://sun1-21.userapi.com/y5VqHemrzxItmMMqaFLOgs8zICBGDnLsQSgAxQ/vCEOyLcrgd0.jpg?ava=1',
            'Наумов Людвиг Артёмович https://sun1-17.userapi.com/dqr7J__INZrCV_sz-q_FjD3QZZ2teSTYvc1tnQ/jnfGgShVuX8.jpg?ava=1',
            'Симонов Игнатий Васильевич https://sun1-89.userapi.com/XbvESSpRKkZTVrKVoPaLsvxi8VeAt2F3bnBSjw/CXlmEGL1hLA.jpg?ava=1',
            'Харитонов Яромир Александрович https://sun9-23.userapi.com/c852020/v852020728/2517a/KgfXYhVKZqc.jpg?ava=1',
            'Носков Людвиг Романович https://sun9-46.userapi.com/c856128/v856128757/17a84c/jVZi7Qhn8J0.jpg?ava=1',
            'Крюков Марк Романович https://sun9-25.userapi.com/c129/u3798851/d_c8272907.jpg?ava=1',
            'Киранов Марат Романович https://sun9-21.userapi.com/c856128/v856128316/2231ac/YlxmsBfJmRo.jpg?ava=1',
            'Чубайк Николай Викторович https://sun9-24.userapi.com/c855236/v855236720/1fc41b/30CK4PHZdbA.jpg?ava=1',
            'Пушкин Александр Сергеевич https://sun9-71.userapi.com/c857324/v857324568/1766c5/-0YaEO72vRE.jpg?ava=1',
            'Билл Гейтс Ибнабабн https://sun9-9.userapi.com/c857324/v857324365/129750/UE54E0SgDaU.jpg?ava=1',
            'Стив Джоб Jobs https://sun9-45.userapi.com/c845420/v845420707/eff82/P3Mvr9Zp4qI.jpg?ava=1',
        ];
        let info = {};
        if (id === this.getSocNetUserId()) {
            //info.first_name = 'Админ';
            info.last_name = 'Админов';
            info.photo_50 = 'button-shuffle-rest.png';
            info.photo_100 = 'button-shuffle-rest.png';
        } else {
            info.first_name = randomName[id % randomName.length].split(' ')[0] + id;
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
        let url;
        let qty = confirm("Купить " + product.quantity + "монет за " + votes + " стенделонов?");
        if (qty) {
            url = this.getBuyOrderUrl(product.votes);
            window.open(url);
        }
    };

    this.getBuyOrderUrl = function (votes) {
        return "https://local.host/service/standalone_buy?" +
            "receiver_id=" + LogicUser.getCurrent().socNetUserId + "&" +
            "order_id=" + ((LogicTimeClient.getMTime()) + (Math.floor(Math.random() * 123))) % 400000 + "&" +
            "item_price=" + votes;
    };

    this.post = function () {
        console.log(arguments);
        alert('Возможно не сейчас!');
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
SocNetStandalone = new SocNetStandalone();
/** ../client/components/base/SocNetVK.js */
/**
 * Компонент для работы с социальной сетью.
 * @type {SocNetVK}
 * @constructor
 */
let SocNetVK = function () {

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
     * @param socNetUserId {Number} id пользователя в соц.сети.
     * @returns {string} url на профиль пользователя в соц.сети.
     */
    this.getUserProfileUrl = function (socNetUserId) {
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
        VK.callMethod('showOrderBox', {
            type: 'votes',
            votes: votes
        });
    };

    this.getFriendIds = function (callback) {
        VK.api('friends.getAppUsers', {}, function (data) {
            callback(data.response)
        });
    };

    /**
     *
     * @param id
     * @param callback
     * @see https://vk.com/dev/objects/user
     * @see https://vk.com/dev/objects/user_2
     */
    this.getUserInfo = function (id, callback) {
        VK.api('users.get', {
            user_ids: id,
            fields: 'photo_50,photo_100'
        }, function (data) {
            if (!window.jjj) window.jjj = [];
            window.jjj.push({id: id, data: data});
            callback(data.response);
        });
    };

    /**
     * Права доступа: wall
     * @see wall.post
     */
    this.post = function (params) {
        VK.api('wall.post',
            {
                owner_id: params.userId,
                message: params.message,
                attachments: Config.SocNet.VK.postAttachments

            }, function () {
                console.log(arguments);
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

/** ../client/components/base/Sounds.js */
/**
 * @type {Sounds}
 * @constructor
 */
let Sounds = function () {
    let self = this;

    let cache = {};

    let timeStamp = 5;

    this.enabled = true;
    this.PATH_CHALK = '/sounds/chalk.mp3';
    this.PATH_CHALK_2 = '/sounds/chalk-2.mp3';
    this.PATH_BUTTON = '/sounds/button.wav';
    this.PATH_CLICK = '/sounds/click-1.wav';
    this.PATH_CLICK_2 = '/sounds/click-2.wav';
    this.PATH_CHPOK = '/sounds/chpok.wav';
    this.PATH_GEM_TOUCH = '/sounds/gem-touch.wav';
    this.PATH_CRYSTAL_1 = '/sounds/crystal.wav';
    this.PATH_MAGIC_SHUFFLE_1 = '/sounds/magic-shuffle-1.wav';
    this.PATH_MAGIC_SHUFFLE_2 = '/sounds/magic-shuffle-2.wav';
    this.PATH_MAGIC_SHUFFLE_3 = '/sounds/magic-shuffle-3.mp3';
    this.PATH_MAGIC_SHUFFLE_4 = '/sounds/magic-shuffle-4.wav';
    this.PATH_MAGIC_SHUFFLE_5 = '/sounds/magic-shuffle-5.mp3';
    this.PATH_MAGIC_HUMMER_HIT_1 = '/sounds/hummer-hit-1.wav';
    this.PATH_MAGIC_HUMMER_HIT_2 = '/sounds/hummer-hit-2.wav';
    this.PATH_MAGIC_HUMMER_HIT_3 = '/sounds/hummer-hit-3.wav';
    this.PATH_MAGIC_HUMMER_HIT_4 = '/sounds/hummer-hit-4.wav';
    this.PATH_MAGIC_LIGHTNING_1 = '/sounds/woosh.wav';
    //https://freesound.org/people/Sergenious/sounds/55823/
    this.PATH_MAGIC_LIGHTNING_2 = '/sounds/dicharge-1.wav';
    this.PATH_MAGIC_LIGHTNING_3 = '/sounds/dicharge-2.wav';
    this.PATH_MAGIC_LIGHTNING_4 = '/sounds/l-3.mp3';
    this.PATH_MAGIC_LIGHTNING_5 = '/sounds/l-4.mp3';
    this.PATH_MAGIC_LIGHTNING_8 = '/sounds/dicharge-8.mp3';
    this.PATH_COLLECT_ITEM = '/sounds/collect-item.mp3';
    this.PATH_SUCCESS_1 = '/sounds/success.wav';
    this.PATH_SUCCESS_3 = '/sounds/success-3.wav';
    //https://freesound.org/people/renatalmar/sounds/264981/
    this.PATH_SUCCESS_4 = '/sounds/success-4.mp3';
    this.PATH_SPELL_FIREBALL = '/sounds/spell-fireball.wav';


    this.TYPE_GEM_DESTROY = this.PATH_SUCCESS_4;
    this.TYPE_HUMMER_HIT = this.PATH_MAGIC_HUMMER_HIT_1;
    this.TYPE_SHUFFLE = this.PATH_MAGIC_SHUFFLE_4;
    this.TYPE_LIGHTNING = this.PATH_MAGIC_LIGHTNING_5;
    this.TYPE_GEM_TOUCH = this.PATH_CHALK_2;
    this.TYPE_BUTTON = this.PATH_BUTTON;
    this.TYPE_CREATE_LIGHTNING = this.PATH_MAGIC_LIGHTNING_8;

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

    this.play = function (path, volume, currentTime) {
        let audio;
        if (!self.enabled) return;
        if (path === Sounds.PATH_MAGIC_HUMMER_HIT_1) currentTime = 0.012;
        if (path === Sounds.PATH_MAGIC_SHUFFLE_3) currentTime = 0.35;
        if (path === Sounds.PATH_SUCCESS_1) {
            volume = 0.3;
            currentTime = 0.04;
        }
        if (path === Sounds.PATH_SUCCESS_4) volume = 0.3;
        if (path === Sounds.PATH_MAGIC_LIGHTNING_4) volume = 0.3;

        audio = new Audio(path + "?t=" + timeStamp);

        if (currentTime) audio.currentTime = currentTime;
        audio.volume = volume ? volume : 1.0;
        audio.play();
    };

    if (document.cookie.search('settings_sound=off') !== -1) {
        self.off();
    }
    this.loadSounds = function () {
        [
            this.TYPE_LIGHTNING,
            this.TYPE_SHUFFLE,
            this.TYPE_HUMMER_HIT,
            this.TYPE_GEM_DESTROY,
            this.TYPE_BUTTON
        ].forEach(function (path) {
            new Audio(path + '?t=' + timeStamp);
        });
    }
};

Sounds = new Sounds;
/** ../client/components/base/WebSocketClient.js */
/**
 * Компонент обеспечивающий соединение с сервером.
 * @type {WebSocketClient}
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

    this.init = function () {
        return new Promise(function (resolve, reject) {
            //port = window.document.location.protocol == 'https:' ? 443 : 80;
            protocol = window.document.location.protocol == 'https:' ? 'wss' : 'ws';
            host = Config.WebSocketClient.host;
            port = Config.WebSocketClient.port;
            url = Config.WebSocketClient.url;
            resolve();
        });
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
        self.onData(clientDecrypt(event.data), connectionId);
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

        socket.send(clientCrypt(data));
        /* Logs.log("WebSocketClient.send data: length=" + data.length, Logs.LEVEL_DETAIL); */
        /* Остальные данные отправим позже. */
        if (packetBuffer.length) {
            setTimeout(trySend, 1500);
        }
    };

    this.getSocket = function () {
        return socket;
    }
};

/**
 * По сути это просто номер соединения в пределах жизни скрипта.
 */
WebSocketClient.connectionId = 0;
/** ../client/config.local1.tri-base.js */
let Config = {
    OnIdle: {
        animStep: 1,
        second: 1000,
        animateInterval: 1000
    },
    SocNet: {
        VK: {
            appId: null,
            postAttachments: ""
        }
    },
    Project: {
        develop: true,
        wizardAny: false,
        canvas: false
    },
    WebSocketClient: {
        host: "localhost",
        port: "80",
        url: "/service"
    },
    Logs:{
        triggerLevel: 1
    }
};let SAPILogs = function(){
	this.log = function(){
		ApiRouter.executeRequest('SAPILogs' ,'log', arguments);
	};
	this.clientLoaded = function(){
		ApiRouter.executeRequest('SAPILogs' ,'clientLoaded', arguments);
	};
	this.sendUserAgent = function(){
		ApiRouter.executeRequest('SAPILogs' ,'sendUserAgent', arguments);
	};
	this.showMoneyDialog = function(){
		ApiRouter.executeRequest('SAPILogs' ,'showMoneyDialog', arguments);
	};
	this.closeMoneyDialog = function(){
		ApiRouter.executeRequest('SAPILogs' ,'closeMoneyDialog', arguments);
	};
	this.showStuffShopDialog = function(){
		ApiRouter.executeRequest('SAPILogs' ,'showStuffShopDialog', arguments);
	};
};
SAPILogs = new SAPILogs();
let SAPIMap = function(){
	this.sendMeMapInfo = function(){
		ApiRouter.executeRequest('SAPIMap' ,'sendMeMapInfo', arguments);
	};
	this.sendMePointTopScore = function(){
		ApiRouter.executeRequest('SAPIMap' ,'sendMePointTopScore', arguments);
	};
	this.onFinish = function(){
		ApiRouter.executeRequest('SAPIMap' ,'onFinish', arguments);
	};
	this.reloadLevels = function(){
		ApiRouter.executeRequest('SAPIMap' ,'reloadLevels', arguments);
	};
};
SAPIMap = new SAPIMap();
let SAPIStream = function(){
	this.send = function(){
		ApiRouter.executeRequest('SAPIStream' ,'send', arguments);
	};
};
SAPIStream = new SAPIStream();
let SAPIStuff = function(){
	this.sendMeStuff = function(){
		ApiRouter.executeRequest('SAPIStuff' ,'sendMeStuff', arguments);
	};
	this.usedHummer = function(){
		ApiRouter.executeRequest('SAPIStuff' ,'usedHummer', arguments);
	};
	this.usedLightning = function(){
		ApiRouter.executeRequest('SAPIStuff' ,'usedLightning', arguments);
	};
	this.usedShuffle = function(){
		ApiRouter.executeRequest('SAPIStuff' ,'usedShuffle', arguments);
	};
	this.buyHummer = function(){
		ApiRouter.executeRequest('SAPIStuff' ,'buyHummer', arguments);
	};
	this.buyLightning = function(){
		ApiRouter.executeRequest('SAPIStuff' ,'buyLightning', arguments);
	};
	this.buyShuffle = function(){
		ApiRouter.executeRequest('SAPIStuff' ,'buyShuffle', arguments);
	};
	this.buyHealth = function(){
		ApiRouter.executeRequest('SAPIStuff' ,'buyHealth', arguments);
	};
};
SAPIStuff = new SAPIStuff();
let SAPITimeServer = function(){
	this.sendMeTime = function(){
		ApiRouter.executeRequest('SAPITimeServer' ,'sendMeTime', arguments);
	};
};
SAPITimeServer = new SAPITimeServer();
let SAPIUser = function(){
	this.authorizeByVK = function(){
		ApiRouter.executeRequest('SAPIUser' ,'authorizeByVK', arguments);
	};
	this.authorizeByStandalone = function(){
		ApiRouter.executeRequest('SAPIUser' ,'authorizeByStandalone', arguments);
	};
	this.logout = function(){
		ApiRouter.executeRequest('SAPIUser' ,'logout', arguments);
	};
	this.sendMeUserInfo = function(){
		ApiRouter.executeRequest('SAPIUser' ,'sendMeUserInfo', arguments);
	};
	this.sendMeUserListInfo = function(){
		ApiRouter.executeRequest('SAPIUser' ,'sendMeUserListInfo', arguments);
	};
	this.sendMeMapFriends = function(){
		ApiRouter.executeRequest('SAPIUser' ,'sendMeMapFriends', arguments);
	};
	this.sendMeFriendIdsBySocNet = function(){
		ApiRouter.executeRequest('SAPIUser' ,'sendMeFriendIdsBySocNet', arguments);
	};
	this.sendMeTopUsers = function(){
		ApiRouter.executeRequest('SAPIUser' ,'sendMeTopUsers', arguments);
	};
	this.sendMeScores = function(){
		ApiRouter.executeRequest('SAPIUser' ,'sendMeScores', arguments);
	};
	this.healthBack = function(){
		ApiRouter.executeRequest('SAPIUser' ,'healthBack', arguments);
	};
	this.healthDown = function(){
		ApiRouter.executeRequest('SAPIUser' ,'healthDown', arguments);
	};
	this.spendTurnsMoney = function(){
		ApiRouter.executeRequest('SAPIUser' ,'spendTurnsMoney', arguments);
	};
	this.exitGame = function(){
		ApiRouter.executeRequest('SAPIUser' ,'exitGame', arguments);
	};
	this.looseGame = function(){
		ApiRouter.executeRequest('SAPIUser' ,'looseGame', arguments);
	};
	this.zeroLife = function(){
		ApiRouter.executeRequest('SAPIUser' ,'zeroLife', arguments);
	};
};
SAPIUser = new SAPIUser();
document.addEventListener("DOMContentLoaded", function() {GUI.init();
 PageController.addBlocks([PageBlockBackground,PageBlockField,PageBlockMaps,PageBlockPanel,PageBlockWizard,PageBlockZClouds,PageBlockZDialogs,PageBlockZPreloader]);
 PageField.init();
 PageMain.init();
});