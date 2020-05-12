let WizardLevel_41_1 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Взорви камни и бочка упадет на блок.');
    },

    onHideDialog: function () {
        if (WizardLevel_41_1.dialogCounter++ < 2) return;
        PBWizard.showHint([{x: 1, y: 4}, {x: 2, y: 4}]);
        PBWizard.showDialog(340, 390, 2);
        PBWizard.highlightCells([
            {x: 2, y: 2, unlock: false},
            {x: 2, y: 3, unlock: false},
            {x: 2, y: 4, unlock: true},
            {x: 2, y: 5, unlock: false},
            {x: 2, y: 6, unlock: false},
            {x: 1, y: 4, unlock: true},
        ]);
    },
    onDestroyLine: function () {
        LogicWizard.start(WizardLevel41_2);
    }
};

let WizardLevel41_2 = {

    init: function () {
        PBWizard.begin();
        PBWizard.updateText('Бочка ещё не улетела, взорви ряд камней что бы переместить бочку.');

        PBWizard.showDialog(360, 390, 3);
        PBWizard.showHint([{x: 2, y: 5}, {x: 3, y: 5}]);

        PBWizard.highlightCells([
            //{x: 3, y: 2, unlock: false},
            {x: 3, y: 3, unlock: false},
            {x: 3, y: 4, unlock: false},
            {x: 3, y: 5, unlock: true},
            {x: 3, y: 6, unlock: false},
            {x: 2, y: 5, unlock: true},
        ]);
    },
    onDestroyLine: function () {
        LogicWizard.finish();
    }
};