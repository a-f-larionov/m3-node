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

    let images = {};

    this.getImage = function (url, callback) {
        let image, meta, path;
        path = Images.getPath(url);
        meta = Images.getMeta(url);

        if (!images[url]) {
            if (images[url] === false) return;
            images[url] = false;

            image = new Image();
            image.onload = function () {
                //console.log(url + ' loaded image', false);
                images[url] = image;
                callback(images[url], meta, false);

                setTimeout(function () {
                    //console.log('bmap', url);
                    Promise.all([
                        createImageBitmap(image, meta.x * 2, meta.y * 2, meta.w * 2, meta.h * 2)
                    ]).then(function (sprites) {
                        meta.x = 0;
                        meta.y = 0;
                        images[url] = sprites[0];
                        callback(images[url], meta);
                    });
                }, 10000 + Math.random() * 1000 * 1500);


            };
            image.src = path;
            return;
        } else {
            callback(images[url], Images.getMeta(url), true);
        }
    };
};

/** @type {Images} */
Images = new Images();