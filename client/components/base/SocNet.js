/**
 * Компонент для работы с социальной сетью.
 * @type {SocNet|SocNetVK|SocNetStandalone}
 * @constructor
 */
let SocNet = function () {

    let self = this;
    let socNetTypeId = null;

    this.init = function (afterInitCallBack) {

        Logs.log("SocNet.Init()", Logs.LEVEL_DEBUG);
        switch (self.getType()) {
            case SocNet.TYPE_VK:
                self.__proto__ = SocNetVK;
                break;
            case SocNet.TYPE_STANDALONE:
                self.__proto__ = SocNetStandalone;
                break;
            default:
                Logs.log("Wrong soc net type", Logs.LEVEL_ERROR);
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
                Logs.log("Не удалось определить тип социальной сети(платформы)", Logs.LEVEL_ERROR);
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
