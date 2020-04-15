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
    let velocity = 0.5;

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

    this.iterate = function (position) {
        dom.backgroundImage = Animate.getUrl('/images/anim-light-', position * velocity, 5);
        dom.redraw();
        if (position < 15) return true;
    };

    this.finish = function () {
        dom.hide();
        this.animDoms.push(dom);
    }
};

let animHummerDestroy = function () {
    let dom, imageUrl = '/images/anim-hd-1.png';

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
        dom.backgroundImage = Animate.getUrl('/images/anim-hd-', position * velocity, 15);
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

let animGemEmitFader = function () {
    let dom;
    let velocity = 8;

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
    let velocity = 8;

    this.init = function (list) {
        doms = [];
        list.forEach(function (data) {
            dom = self.gemDoms[data.from.x][data.from.y];
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
        dom.x = x - Images.getWidth('/images/anim-shuffle-1.png') / 2;
        dom.y = y - Images.getHeight('/images/anim-shuffle-1.png') / 2;
        dom.width = Images.getWidth('/images/anim-shuffle-1.png');
        dom.height = Images.getHeight('/images/anim-shuffle-1.png');
        dom.backgroundImage = '/images/anim-shuffle-1.png';
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
