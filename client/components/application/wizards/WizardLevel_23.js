WizardLevel23_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Взрывай камни рядом с красным пауком, что бы он убежал с поля.');
    },

    onHideDialog: function () {
        if (WizardLevel23_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 2, y: 1}, {x: 2, y: 0}]);
        PBWizard.showDialog(210, 400, 3, 20);
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