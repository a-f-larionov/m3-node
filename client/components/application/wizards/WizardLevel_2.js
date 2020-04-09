WizardLevel2_1 = {
    init: function () {
        PBWizard.begin();
        PBWizard.updateText(
            'Собрав ряд из 4ёх камней, получишь камень с молнией'
        );
        setTimeout(function () {
            PBWizard.showDialog(210, 380, 15, 21);
            PBWizard.draw(function (drawImage) {
            });
        });
    },
    onDestroyLine: function () {
        LogicWizard.start(WizardLevel2_2);
    }
};
//2 level
// Собрав ряд из 4ёх камней, полушь камень с молнией.

// Взорви камень с молнией, что бы использовать её.

