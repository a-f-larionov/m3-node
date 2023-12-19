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
        return '/images/v1/' + url;
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
            Logs.log("Image url not found for: `" + url + "`", Logs.LEVEL_WARN);
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
            let imgBtmp;
            let path;
            let url;
            imgBtmp = e.data[0];
            //path = e.data[1];
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
