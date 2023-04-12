const LogicTimeServer = require("../../application/logic/LogicTimeServer.js").LogicTimeServer
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