/**
 * Кэш url-ов.
 * @constructor
 */
UrlCache = function () {

    /**
     * Храним промежуточный кэш тут.
     * в будущем надо сделать сбрасываемо-загружаемый кэш в\из БД.
     * с отложенной догрузкой.
     * @type {Array}
     */
    let cache = [];

    /**
     * Вернуть кэшированные данные по ключу.
     * @param key {String}
     * @return {String|null}
     */
    this.get = function (key) {
        if (cache[key]) {
            if (cache[key].timestamp < (Date.now())) {
                let tmp = cache[key].data;
                delete cache[key];
                return tmp;
            }
            return cache[key].data;
        }
        return null;
    };

    /**
     * Сохранить кэшированные данные по ключу.
     * @param key {String}
     * @param data {String}
     */
    this.set = function (key, data) {
        cache[key] = {
            data: data,
            timestamp: Date.now() + Config.UrlCache.lifeTime
        };
    };
};

/**
 * Константный класс.
 * @type {UrlCache}
 */
UrlCache = new UrlCache();