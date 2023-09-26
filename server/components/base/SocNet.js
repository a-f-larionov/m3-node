/**
 * Компонент для работы с социальной сетью.
 */

SocNet = function (socNetTypeId) {

    switch (socNetTypeId) {
        case SocNet.TYPE_VK:
            return SocNetVK;
            break;
        case SocNet.TYPE_STANDALONE:
            return SocNetStandalone;
            break;
        default:
            Logs.log("Wrong soc net type", Logs.LEVEL_ERROR);
            break;
    }
};

SocNet.init = function (afterInitCallBack) {

    Logs.log("SocNet inited", Logs.LEVEL_DEBUG);

    SocNetVK.init(function () {

        SocNetStandalone.init(function () {

            afterInitCallBack();
        });
    });
};

/**
 * Тип социальной сети(платформы), вКонтакте.
 * @type {number}
 */
SocNet.TYPE_VK = 1;
/**
 * Тип социальной сети(платформы), сайт http://no-site.xyz/.
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

SocNet.depends = ['Logs', 'Profiler', 'DB', 'Statistic'];