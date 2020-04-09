LogicWizard = function LogicWizard() {
    let self = this;

    let dymmyFunc = function () {
    };

    this.TAG_FIRST_NUMBER_POINT = 1;
    this.TAG_PLAY_BUTTON = 2;

    this.onClick = dymmyFunc;

    this.onDestroyLine = dymmyFunc;

    this.onAuthorizeSuccess = function () {
        if (LogicUser.getCurrentUser().nextPointId === 1) {
            self.start(WizardFirstStart_1);
        }
    };

    this.onFieldFirstShow = function () {
        if (LogicUser.getCurrentUser().nextPointId === 2 && DataPoints.getPlayedId() === 2) {
            self.start(WizardLevel2_1);
        }
    };

    this.start = function (wizard) {
        PBWizard.finish();
        self.onClick = wizard.onClick ? wizard.onClick : dymmyFunc;
        self.onDestroyLine = wizard.onDestroyLine ? wizard.onDestroyLine : dymmyFunc;
        wizard.init();
    };
};

/** @type {LogicWizard} */
LogicWizard = new LogicWizard();


//3 level
// Собери 5 камней в ряд, что бы получить звезду

// Выбери цвет, что бы убрать все камни этого цвета на поле.


// 4 level...


