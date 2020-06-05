let WizardLevel23_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Собирай камни в ряд, рядом с совой, что бы она улетела.');
    },

    onHideDialog: function () {
        if (WizardLevel23_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 3, y: 1}, {x: 4, y: 1}]);
        PBWizard.showDialog(210, 400, 2, 20);
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