LogicHealth = function () {

    this.getMaxHealth = function () {
        return DataCross.user.maxHealth;
    };

    this.getHealthRecoveryTime = function () {
        return DataCross.user.healthRecoveryTime * 1000;
    };

    this.clearHealthCheckFlag = function () {
        checkHealthFlag = false;
    };

    let checkHealthFlag = false;

    this.checkHealth = function () {
        let recoveryTime, healthStartTime, now, left, healthToUp, maxHealth, user;
        user = LogicUser.getCurrentUser();
        maxHealth = LogicHealth.getMaxHealth();
        if (user.health < maxHealth) {
            recoveryTime = LogicHealth.getHealthRecoveryTime();
            healthStartTime = user.healthStartTime / 1000;
            now = LogicTimeClient.getTime();
            left = recoveryTime - (now - healthStartTime);
            if (left > 0) return;

            healthToUp = Math.min(
                Math.floor(Math.abs((now - healthStartTime) / recoveryTime)),
                (maxHealth - user.health)
            );
            user.health += healthToUp;

            if (user.health < maxHealth) {
                user.healthStartTime += (recoveryTime * healthToUp) * 1000;
            }

            PageController.redraw();

            if (left <= 0 && !checkHealthFlag) {
                checkHealthFlag = true;
                SAPIUser.checkHealth();
            }
        }
    };
};

/** @type {LogicHealth} */
LogicHealth = new LogicHealth();