let animChangeAndBack = function () {
    let dom, v, velocity, counterHalf, counterStop;
    velocity = 5;
    counterStop = Math.floor(100 / velocity);
    counterHalf = Math.floor(counterStop / 2);

    this.init = function (a, b) {
        v = {x: (b.x - a.x) * velocity, y: (b.y - a.y) * velocity};
        dom = this.gemDoms[a.x][a.y];
    };

    this.iterate = function (counter) {
        if (counter === counterHalf) {
            v.x = -v.x;
            v.y = -v.y;
        }
        dom.x += v.x;
        dom.y += v.y;
        dom.redraw();
        if (dom.bindedDoms) {
            dom.bindedDoms.x = dom.x;
            dom.bindedDoms.y = dom.y;
            dom.bindedDoms.redraw();
        }
        return counter + 1 < counterStop;
    };
};

let animLightning = function () {
    let dom;
    this.init = function (p, specId) {
        dom = this.animDoms.pop();
        let lineData = Field.getVisibleLength(p, specId);
        dom.width = lineData.length * DataPoints.BLOCK_WIDTH;
        dom.height = Images.getHeight('/images/anim-light-1.png');
        if (specId === DataObjects.WITH_LIGHTNING_VERTICAL) {
            dom.rotate = 90;
            dom.x = (p.x) * DataPoints.BLOCK_WIDTH;
            dom.y = (lineData.lower) * DataPoints.BLOCK_HEIGHT
                - (Images.getHeight('/images/anim-light-1.png') - DataPoints.BLOCK_HEIGHT) / 2;
            /** Rotate from center like a cos&sin*/
            dom.x -= (dom.width - DataPoints.BLOCK_WIDTH) / 2;
            dom.y += (dom.width - DataPoints.BLOCK_WIDTH) / 2;
        }
        if (specId === DataObjects.WITH_LIGHTNING_HORIZONTAL) {
            dom.rotate = 0;
            dom.x = lineData.lower * DataPoints.BLOCK_WIDTH;
            dom.y = p.y * DataPoints.BLOCK_HEIGHT
                - (Images.getHeight('/images/anim-light-1.png') - DataPoints.BLOCK_HEIGHT) / 2;
        }
        dom.show();
        dom.redraw();
    };

    this.iterate = function (counter) {
        dom.backgroundImage =
            '/images/anim-light-' + ((counter - Math.floor(counter / 5) * 5) + 1) + '.png';
        dom.redraw();
        if (counter < 15) return true;
    };

    this.finish = function () {
        dom.hide();
        this.animDoms.push(dom);
    }
};

let animHummerDestroy = function () {
    let dom, imageUrl = '/images/anim-hd-1.png';

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

    this.iterate = function (counter) {
        dom.backgroundImage = '/images/anim-hd-' + (counter + 1) + '.png';
        dom.redraw();
        return counter < 15 - 1;
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

    this.init = function (a, b) {
        v = {x: (b.x - a.x) * velocity, y: (b.y - a.y) * velocity};
        dom = this.gemDoms[a.x][a.y];
    };

    this.iterate = function (counter) {
        dom.x += v.x;
        dom.y += v.y;
        dom.redraw();
        if (dom.bindedDoms) {
            dom.bindedDoms.x = dom.x;
            dom.bindedDoms.y = dom.y;
            dom.bindedDoms.redraw();
        }
        return counter < counterStop;
    };
};

let animGemFader = function () {
    let dom;
    this.init = function (p) {
        dom = this.gemDoms[p.x][p.y];
        dom.x = p.x * DataPoints.BLOCK_WIDTH;
        dom.y = p.y * DataPoints.BLOCK_HEIGHT;
        dom.backgroundImage = DataPoints.objectImages[Field.getGemId(p)];
        dom.width = null;//DataPoints.BLOCK_WIDTH;
        dom.height = null;//DataPoints.BLOCK_HEIGHT;
        dom.redraw();
        dom.show();
    };
    this.iterate = function (counter) {
        dom.opacity = (counter / 10);
        dom.redraw();
        return counter < 10;
    };
};

let animFallGems = function () {
    let fallDoms;
    let velocity = 10;

    this.init = function (doms) {
        fallDoms = doms;
        fallDoms.forEach(function (dom) {
            dom.fallMode = 'just';

            if (Field.isVisible({x: dom.p.x, y: dom.p.y + 1}) &&
                !Field.isVisible(dom.p)) dom.fallMode = 'to-show';
            if (!Field.isVisible({x: dom.p.x, y: dom.p.y + 1}) &&
                Field.isVisible(dom.p)) dom.fallMode = 'to-hide';

            if (dom.fallMode === 'to-show') {
                /** Его уже ранее спустили  */
                dom.x = dom.p.x * DataPoints.BLOCK_WIDTH;
                dom.y = (dom.p.y + 1) * DataPoints.BLOCK_HEIGHT;
                dom.height = 0;
                dom.width = DataPoints.BLOCK_WIDTH;
                dom.backgroundImage = DataPoints.objectImages[Field.getGemId({x: dom.p.x, y: dom.p.y + 1})];
                /** Перерисовка backgroundPositionY это хитрый хак и костыль :) */
                dom.backgroundPositionY = DataPoints.BLOCK_HEIGHT;
                dom.show();
            }
        });
    };

    this.iterate = function (counter) {
        fallDoms.forEach(function (dom) {
            switch (dom.fallMode) {
                case 'to-hide':
                    dom.y += velocity;
                    dom.height -= velocity;
                    break;
                case 'to-show':
                    dom.height += velocity;
                    dom.backgroundPositionY -= velocity;
                    break;
                case 'just':
                    dom.y += velocity;
                    break;
            }
            if (dom.bindedDoms) {
                dom.bindedDoms.x = dom.x;
                dom.bindedDoms.y = dom.y;
                dom.bindedDoms.redraw();
            }
            dom.redraw();
        });
        return counter + 1 < DataPoints.BLOCK_HEIGHT / velocity;
    };

    this.finish = function () {
        fallDoms.forEach(function (dom) {
            dom.backgroundPositionY = 0;
            dom.height = DataPoints.BLOCK_WIDTH;
            dom.redraw();
        });
    }
};

let animShuffle = function () {
    let dom;

    this.init = function (x, y) {
        dom = this.animDoms.pop();
        dom.x = x - Images.getWidth('/images/anim-shuffle-1.png') / 2;
        dom.y = y + DataPoints.BLOCK_HEIGHT / 2 - Images.getHeight('/images/anim-shuffle-1.png') / 2;
        dom.width = Images.getWidth('/images/anim-shuffle-1.png');
        dom.height = Images.getHeight('/images/anim-shuffle-1.png');
        dom.backgroundImage = '/images/anim-shuffle-1.png';
        dom.opacity = 0.7;
        dom.rotate = 0;
        dom.show();
    };

    this.iterate = function (counter) {
        dom.rotate += 10 * 2;
        dom.redraw();
        return counter < 36 / 2;
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
