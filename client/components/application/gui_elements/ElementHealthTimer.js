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
    let self = this;

    /**
     * Показывать ли элемент.
     * @type {boolean}
     */
    let showed = false;

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

    /**
     *
     * @type {ElementHealthIndicator}
     */
    this.healthIndicator = null;

    let elText;
    /**
     * Создадим дом и настроим его.
     */
    this.init = function () {

        elText = GUI.createElement(ElementText, {
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
        elText.show();
        self.redraw();
    };

    /**
     * Спрячем текст.
     */
    this.hide = function () {
        if (!showed) return;
        elText.hide();
        showed = false;
    };

    /**
     * Перерисуем.
     */
    this.redraw = function () {
        if (!showed) return;
        elText.setText('00:00:00');

        self.updateTimer();

        elText.redraw();
    };

    this.updateTimer = function () {
        let user;
        if (!showed) return;

        user = LogicUser.getCurrentUser();
        if (PageBlockPanel.oneHealthHide) user.fullRecoveryTime -= LogicHealth.getHealthRecoveryTime();

        if (LogicHealth.isMaxHealths(user)) {
            if (PageBlockPanel.oneHealthHide) user.fullRecoveryTime += LogicHealth.getHealthRecoveryTime();
            self.healthIndicator.redraw();
            elText.hide();

        } else {
            if (PageBlockPanel.oneHealthHide) user.fullRecoveryTime += LogicHealth.getHealthRecoveryTime();

            elText.setText(toHHMMSS(LogicHealth.getTimeLeft(user)));
            elText.show();
            elText.redraw();
            self.healthIndicator.redraw();
        }
    };

    let toHHMMSS = function (val) {
        let sec_num = parseInt(val, 10);
        /** Don't forget the second param */
        let hours = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        let seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        /** hours+':'+*/
        return minutes + ':' + seconds;
    };
};
