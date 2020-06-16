/**
 * @type {LogicWizard}
 * @constructor
 */
let LogicWizard = function LogicWizard() {
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

    this.onLoaded = function () {
        if (LogicUser.getCurrent().nextPointId === 1) {
            self.start(WizardFirstStart_1);
        }
    };

    this.onFieldFirstShow = function () {
        let nextPointId = LogicUser.getCurrent().nextPointId,
            playedId = DataPoints.getPlayedId();
        if (nextPointId === 2 && playedId === 2) self.start(WizardLevel2_1);
        if (nextPointId === 3 && playedId === 3) self.start(WizardLevel3_1);
        if (nextPointId === 4 && playedId === 4) self.start(WizardLevel_4_1);
        if (nextPointId === 9 && playedId === 9) self.start(WizardLevel9_1);
        if (nextPointId === 12 && playedId === 12) self.start(WizardLevel12_1);
        if (nextPointId === 15 && playedId === 15) self.start(WizardLevel15_1);
        if (nextPointId === 23 && playedId === 23) self.start(WizardLevel23_1);
        if (nextPointId === 30 && playedId === 30) self.start(WizardLevel_30_1);
        if (nextPointId === 41 && playedId === 41) self.start(WizardLevel_41_1);
        if (nextPointId === 46 && playedId === 46) self.start(WizardLevel46_1);
        if (nextPointId === 51 && playedId === 51) self.start(WizardLevel51_1);
    };

    this.start = function (wizard) {
        PBWizard.reset();
        wizard.dialogCounter = 0;
        self.onClick = wizard.onClick ? wizard.onClick : dymmyFunc;
        self.onDestroyThing = wizard.onDestroyThing ? wizard.onDestroyThing : dymmyFunc;
        self.onDestroyLine = wizard.onDestroyLine ? wizard.onDestroyLine : dymmyFunc;
        self.onShowDialog = wizard.onShowDialog ? wizard.onShowDialog : dymmyFunc;
        self.onHideDialog = wizard.onHideDialog ? wizard.onHideDialog : dymmyFunc;
        self.onFieldSilent = wizard.onFieldSilent ? wizard.onFieldSilent : dymmyFunc;
        wizard.init();
    };

    this.finish = function (showText) {
        PBWizard.finish(showText);
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