LogicWizard = function LogicWizard() {
    let self = this;

    let dymmyFunc = function () {
    };

    this.TAG_FIRST_NUMBER_POINT = 1;

    this.onClick = dymmyFunc;
    this.onDestroyThing = dymmyFunc;
    this.onDestroyLine = dymmyFunc;
    this.onShowDialog = dymmyFunc;
    this.onHideDialog = dymmyFunc;
    this.onFieldSilent = dymmyFunc;

    this.onAuthorizeSuccess = function () {
        if (LogicUser.getCurrentUser().nextPointId === 1) {
            self.start(WizardFirstStart_1);
        }
    };

    this.onFieldFirstShow = function () {
        if (LogicUser.getCurrentUser().nextPointId === 2 && DataPoints.getPlayedId() === 2) {
            self.start(WizardLevel2_1);
        }
        if (LogicUser.getCurrentUser().nextPointId === 3 && DataPoints.getPlayedId() === 3) {
            self.start(WizardLevel3_1);
        }
    };

    this.start = function (wizard) {
        PBWizard.finish();
        self.onClick = wizard.onClick ? wizard.onClick : dymmyFunc;
        self.onDestroyThing = wizard.onDestroyThing ? wizard.onDestroyThing : dymmyFunc;
        self.onDestroyLine = wizard.onDestroyLine ? wizard.onDestroyLine : dymmyFunc;
        self.onShowDialog = wizard.onShowDialog ? wizard.onShowDialog : dymmyFunc;
        self.onHideDialog = wizard.onHideDialog ? wizard.onHideDialog : dymmyFunc;
        self.onFieldSilent = wizard.onFieldSilent ? wizard.onFieldSilent : dymmyFunc;
        wizard.init();
    };

    this.finish = function () {
        PBWizard.finish();
        self.onClick = dymmyFunc;
        self.onDestroyThing = dymmyFunc;
        self.onDestroyLine = dymmyFunc;
        self.onShowDialog = dymmyFunc;
        self.onHideDialog = dymmyFunc;
        self.onFieldSilent = dymmyFunc;
    }
};

/** @type {LogicWizard} */
LogicWizard = new LogicWizard();