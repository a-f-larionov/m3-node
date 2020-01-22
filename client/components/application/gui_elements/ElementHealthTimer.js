/**
 * Элемент: таймер.
 * @constructor
 * Инициирующие параметры:
 * x : number координата X
 * y : number координата Y
 * width : number ширина поля
 * height : number высота поля
 */
ElementHealthTimer = function () {
    var self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    var showed = false;

    /**
     * Координата X текста.
     * @type {number}
     */
    this.x = undefined;

    /**
     * Координата Y текста.
     * @type {number}
     */
    this.y = undefined;

    let elTimer;
    /**
     * Создадим дом и настроем его.
     */
    this.init = function () {

        elTimer = GUI.createElement(ElementText, {
            x: this.x, y: this.y,
            width: 100, height: 30,
            alignCenter: true, bold: true
        });
        OnIdle.register(self.updateTimer);
    };

    /**
     * Покажем текст.
     */
    this.show = function () {
        if (showed) return;
        showed = true;
        elTimer.show();
        self.redraw();
    };

    /**
     * Спрячем текст.
     */
    this.hide = function () {
        if (!showed) return;
        elTimer.hide();
        showed = false;
    };

    /**
     * Перерисуем.
     */
    this.redraw = function () {
        let user;
        if (!showed) return;
        elTimer.setText('00:00:00');

        self.updateTimer();

        elTimer.redraw();
    };

    this.updateTimer = function () {
        let recoveryTime, healthStartTime, now, left, user;
        if (!showed) return;
        user = LogicUser.getCurrentUser();

        if (user.health === LogicUser.getMaxHealth()) {
            elTimer.hide();
        } else {
            recoveryTime = LogicUser.getHealthRecoveryTime();
            healthStartTime = LogicUser.getCurrentUser().healthStartTime / 1000;
            now = LogicTimeClient.getTime();
            left = recoveryTime - (now - healthStartTime);

            let toHHMMSS = function (val) {
                var sec_num = parseInt(val, 10); // don't forget the second param
                var hours = Math.floor(sec_num / 3600);
                var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                var seconds = sec_num - (hours * 3600) - (minutes * 60);

                if (hours < 10) hours = "0" + hours;
                if (minutes < 10) minutes = "0" + minutes;
                if (seconds < 10) seconds = "0" + seconds;
                /*hours+':'+*/
                return minutes + ':' + seconds;
            };
            elTimer.setText(toHHMMSS(left));
            elTimer.show();
            elTimer.redraw();
            if (left <= 0) {
                LogicUser.checkHealth();
            }
        }
    }
};
