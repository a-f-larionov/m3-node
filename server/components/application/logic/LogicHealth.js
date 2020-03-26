LogicHealth = function () {

    this.getMaxHealth = function () {
        return DataCross.user.maxHealth;
    };

    this.getHealthRecoveryTime = function () {
        return DataCross.user.healthRecoveryTime * 1000;
    };

    this.checkHealth = function (userId) {
        let recoveryTime, healthStartTime, now, left, healthToUp, maxHealth;
        maxHealth = LogicHealth.getMaxHealth();
        DataUser.getById(userId, function (user) {
            if (user.health < maxHealth) {
                recoveryTime = LogicHealth.getHealthRecoveryTime();
                healthStartTime = user.healthStartTime;
                now = LogicTimeServer.getCurrentTime();
                left = recoveryTime - (now - healthStartTime);
                if (left > 0) {
                    // повторим позже, если необходимо
                    CAPIUser.healthChecked(user.id);
                    Logs.log("healthCheck time bug:", Logs.LEVEL_WARNING, {user: user, now: now, left: left});
                    setTimeout(function () {
                        LogicHealth.checkHealth(userId);
                    }, left);
                    return;
                }

                healthToUp = Math.min(
                    Math.floor(Math.abs((now - healthStartTime) / recoveryTime)),
                    (maxHealth - user.health)
                );
                user.health += healthToUp;
                CAPIMap.log(userId, {
                    health: user.health,
                    recoveryTime: recoveryTime,
                    healthStartTime: healthStartTime,
                    now: now,
                    left: left,
                    healthToUp: healthToUp
                });
                if (user.health < maxHealth) {
                    user.healthStartTime += recoveryTime * healthToUp;
                }
                DataUser.updateHealthAndStartTime(user.id, user.health, user.healthStartTime, function () {
                    CAPIMap.log(userId, 'update health');
                    CAPIUser.updateUserInfo(user.id, user);
                    CAPIUser.healthChecked(user.id);
                });
            }
        });
    }
};

/** @type {LogicHealth} */
LogicHealth = new LogicHealth();