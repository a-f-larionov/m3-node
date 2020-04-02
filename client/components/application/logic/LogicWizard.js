LogicWizard = function LogicWizard() {
    let self = this;

    this.WIZARD_FIRST_START_STEP_1 = 1;
    this.WIZARD_FIRST_START_STEP_2 = 2;
    this.WIZARD_FIRST_START_STEP_3 = 3;
    this.WIZARD_FIRST_START_STEP_4 = 4;

    this.TAG_FIRST_NUMBER_POINT = 1;
    this.TAG_PLAY_BUTTON = 2;

    this.onClick = function () {
    };

    this.onDestroyLine = function () {
    };

    this.onAuthorizeSuccess = function () {
        if (LogicUser.getCurrentUser().nextPointId === 1) {
            self.start(self.WIZARD_FIRST_START_STEP_1);
        }
    };

    this.start = function (wizardId) {
        let wizard;
        PageBlockWizard.finish();
        switch (wizardId) {
            case self.WIZARD_FIRST_START_STEP_1:
                wizard = WizardFirstStart_1;
                break;
            case self.WIZARD_FIRST_START_STEP_2:
                wizard = WizardFirstStart_2;
                break;
            case self.WIZARD_FIRST_START_STEP_3:
                wizard = WizardFirstStart_3;
                break;
            case self.WIZARD_FIRST_START_STEP_4:
                wizard = WizardFirstStart_4;
                break;
        }
        self.onClick = function () {
        };
        self.onDestroyLine = function () {
        };
        if (wizard.onClick) self.onClick = wizard.onClick;
        if (wizard.onDestroyLine) self.onDestroyLine = wizard.onDestroyLine;
        wizard.init();
    };
};

/** @type {LogicWizard} */
LogicWizard = new LogicWizard();

WizardFirstStart_1 = {
    init: function () {
        PageBlockWizard.begin();
        PageBlockWizard.updateText('НАЖМИ НА КРАСНЫЙ КРУЖОК ЧТО БЫ НАЧАТЬ ИГРАТЬ');
        PageBlockWizard.showDialog(400, 360, 4);
        PageBlockWizard.draw(function (cntx, drawImage) {
            let pnt = DataPoints.getPointsCoords()[0];
            drawImage(cntx, '/images/wizard-point-circle.png',
                pnt.x - GUI.getImageWidth('/images/wizard-point-circle.png') / 2
                + GUI.getImageWidth('/images/map-way-point-red.png') / 2,
                pnt.y - GUI.getImageHeight('/images/wizard-point-circle.png') / 2
                + GUI.getImageHeight('/images/map-way-point-red.png') / 2,
            );
        });
    },

    onClick: function (el) {
        if (el.tagId === LogicWizard.TAG_FIRST_NUMBER_POINT && el.innerText === '1') {
            LogicWizard.start(LogicWizard.WIZARD_FIRST_START_STEP_2);
        }
    }
};

WizardFirstStart_2 = {
    init: function () {
        PageBlockWizard.begin();
        PageBlockWizard.updateText('НАЖМИ КНОПКУ ИГРАТЬ');
        PageBlockWizard.showDialog(400, 380, 30);
        PageBlockWizard.draw(function (cntx, drawImage) {
            drawImage(cntx, '/images/wizard-button.png',
                390 - GUI.getImageWidth('/images/wizard-button.png') / 2,
                280 + 42
            );
        });
    },
    onClick: function (el) {
        if (el.tagId === LogicWizard.TAG_PLAY_BUTTON) {
            LogicWizard.start(LogicWizard.WIZARD_FIRST_START_STEP_3);
        }
    }
};

WizardFirstStart_3 = {
    init: function () {
        PageBlockWizard.begin();
        PageBlockWizard.updateText(
            'ПОМЕНЯЙ СОСЕДНИЕ КАМНИ МЕСТАМИ, ЧТОБЫ СОБРАТЬ КАМНИ КРАСНОГО ЦВЕТА');
        setTimeout(function () {
            PageBlockWizard.showDialog(210, 380, 5, 20);
            PageBlockWizard.draw(function (cntx, drawImage) {
                let coords = PageBlockField.getFieldCoords();
                drawImage(cntx, '/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH,
                    coords.y + DataPoints.BLOCK_HEIGHT);
                drawImage(cntx, '/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * 2,
                    coords.y + DataPoints.BLOCK_HEIGHT);
                drawImage(cntx, '/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * 3,
                    coords.y + DataPoints.BLOCK_HEIGHT);
                drawImage(cntx, '/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * 4,
                    coords.y + DataPoints.BLOCK_HEIGHT);
            });
        }, 3500);
    },
    onClick: function (el) {
        console.log(el);
    },
    onDestroyLine: function (line) {
        LogicWizard.start(LogicWizard.WIZARD_FIRST_START_STEP_4);
    }
};

WizardFirstStart_4 = {
    init: function () {
        PageBlockWizard.begin();
        PageBlockWizard.updateText(
            'ТЫ СПРАВИЛСЯ. ПРОДОЛЖИМ?'
        );
        setTimeout(function () {
            PageBlockWizard.showDialog(210, 380, 15, 21);
            PageBlockWizard.draw(function (cntx, drawImage) {
                let coords = PageBlockField.getFieldCoords();
                drawImage(cntx, '/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * 2,
                    coords.y + DataPoints.BLOCK_HEIGHT * 3);
                drawImage(cntx, '/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * 3,
                    coords.y + DataPoints.BLOCK_HEIGHT * 3);
                drawImage(cntx, '/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * 4,
                    coords.y + DataPoints.BLOCK_HEIGHT * 3);
                drawImage(cntx, '/images/wizard-diamond-cell.png',
                    coords.x + DataPoints.BLOCK_WIDTH * 3,
                    coords.y + DataPoints.BLOCK_HEIGHT * 4);
            });
        }, 1);
    },
    onDestroyLine: function (line) {
        PageBlockWizard.finish();
    }
};