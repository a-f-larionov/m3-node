WizardFirstStart_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Нажми на красный кружок, что бы начать играть.');
        PBWizard.showDialog(400, 360, 2);
        let pnt = DataPoints.getPointsCoords()[0];
        PBWizard.unlockByImg('/images/wizard-point-circle.png',
            pnt.x - Images.getWidth('/images/wizard-point-circle.png') / 2
            + Images.getWidth('/images/map-way-point-red.png') / 2,
            pnt.y - Images.getHeight('/images/wizard-point-circle.png') / 2
            + Images.getHeight('/images/map-way-point-red.png') / 2,
        );
    },

    onClick: function (el) {
        if (el.tagId === LogicWizard.TAG_FIRST_NUMBER_POINT && el.innerText === '1') {
            LogicWizard.start(WizardFirstStart_2);
        }
    }
};

WizardFirstStart_2 = {

    init: function () {
        PBWizard.begin();
    },

    onShowDialog: function () {
        //@todo got real button coords
        WizardFirstStart_2.dialogCounter++;
        if (WizardFirstStart_2.dialogCounter > 1) return;
        PBWizard.updateText('Нажми кнопку играть.');
        PBWizard.showDialog(400, 380, 1);
        PBWizard.unlockByImg('/images/wizard-button.png',
            390 - Images.getWidth('/images/wizard-button.png') / 2,
            80 + 240 + 8,
        );
    },
    onHideDialog: function () {
        WizardFirstStart_2.dialogCounter++;
        if (WizardFirstStart_2.dialogCounter === 2) PBWizard.hideDialog();
        if (WizardFirstStart_2.dialogCounter === 2) PBWizard.begin();
        if (WizardFirstStart_2.dialogCounter === 5) LogicWizard.start(WizardFirstStart_3);
    }
};

WizardFirstStart_3 = {
    init: function () {
        PBWizard.begin();
    },
    onHideDialog: function (onStart) {
        if (this.dialogCounter++ < 3) return;
        PBWizard.updateText('Поменяй соседние камни местами, чтобы собрать камни красного цвета.');
        PBWizard.showDialog(210, 380, 3);
        PBWizard.showHint([{x: 1, y: 0}, {x: 2, y: 0}]);
        PBWizard.highlightCells([
            {x: 1, y: 0, unlock: true},
            {x: 2, y: 0, unlock: true},
            {x: 3, y: 0, unlock: false},
            {x: 4, y: 0, unlock: false},
        ]);
    },
    onDestroyLine: function (line) {
        LogicWizard.start(WizardFirstStart_4);
    }
};

WizardFirstStart_4 = {
    init: function () {
        PBWizard.begin();
        setTimeout(function () {
            PBWizard.updateText('У тебя получилось. Давай ещё!');
            PBWizard.showDialog(210, 380, 2, 21);
            PBWizard.showHint([{x: 3, y: 2}, {x: 3, y: 3}]);
            PBWizard.highlightCells([
                {x: 2, y: 2, unlock: false},
                {x: 3, y: 2, unlock: true},
                {x: 3, y: 3, unlock: true},
                {x: 4, y: 2, unlock: false},
            ]);
        }, Config.OnIdle.second * 1.500);
    },
    onDestroyLine: function (line) {
        LogicWizard.finish();
    }
};