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
                this.dom.rotate = 0;
                break;
            case DataObjects.WITH_LIGHTNING_HORIZONTAL:
                this.dom.rotate = 90;
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
            if (!Field.isVisible({x: data.to.x, y: data.to.y - 1}) && Field.isVisible(data.to))
                dom.fallMode = 'to-show';
            if (Field.isVisible({x: data.to.x, y: data.to.y - 1}) && !Field.isVisible(data.to))
                dom.fallMode = 'to-hide';

            if (dom.fallMode === 'to-show') {
                /** Спускаем его заранее  */
                dom.y = (data.to.y) * DataPoints.BLOCK_HEIGHT;
                dom.height = 25;
                dom.width = DataPoints.BLOCK_WIDTH;
                //dom.backgroundImage = DataObjects.objectImages[Field.getGemId({x: dom.from.x, y: dom.p.y + 1})];
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
            el.dom.redraw();
            if (el.dom.bindedDoms) {
                el.dom.bindedDoms.forEach(function (bindedDom) {
                    bindedDom.x = el.x;
                    bindedDom.y = el.y;
                    bindedDom.redraw();
                });
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
