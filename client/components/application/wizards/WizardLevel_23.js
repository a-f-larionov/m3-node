let WizardLevel23_1 = {

    init: function () {
        PBWizard.begin();
        //PBWizard.updateText('Собирай кристаллы, рядом с совой, чтобы она улетела.');
        PBWizard.updateText('Собирай кристаллы, чтобы сова улетела.');
    },

    onHideDialog: function () {
        if (WizardLevel23_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 3, y: 1}, {x: 4, y: 1}]);
        PBWizard.showDialog(210, 400 - 16, 2, 20, 425, 147);
        PBWizard.highlightCells([
            {x: 2, y: 2, unlock: false},
            {x: 1, y: 1, unlock: false},
            {x: 2, y: 1, unlock: false},
            {x: 3, y: 1, unlock: true},
            {x: 4, y: 1, unlock: true},
        ]);
    },
    onDestroyLine: function () {
        LogicWizard.finish();
    }
};