LogicWizard = function LogicWizard() {
    let self = this;

    this.WIZARD_FIRST_START_STEP_1 = 1;
    this.WIZARD_FIRST_START_STEP_2 = 2;
    this.WIZARD_FIRST_START_STEP_3 = 3;

    this.TAG_FIRST_NUMBER_POINT = 1;
    this.TAG_PLAY_BUTTON = 2;

    this.onClick = function () {
    };

    this.onAuthorizeSuccess = function () {
        if (LogicUser.getCurrentUser().nextPointId === 1) {
            self.start(self.WIZARD_FIRST_START_STEP_1);
        }
    };

    this.start = function (wizardId) {
        PageBlockWizard.finish();
        switch (wizardId) {
            case self.WIZARD_FIRST_START_STEP_1:
                self.onClick = self.wizardFirstStart_1_OnClick;
                self.wizardFirstStart_1_Init();
                break;
            case self.WIZARD_FIRST_START_STEP_2:
                self.onClick = self.wizardFirstStart_2_OnClick;
                self.wizardFirstStart_2_Init();
                break;
            case self.WIZARD_FIRST_START_STEP_3:
                self.onClick = self.wizardFirstStart_3_OnClick;
                self.wizardFirstStart_3_Init();
                break;
        }
    };

    this.wizardFirstStart_1_Init = function () {
        PageBlockWizard.begin();
        PageBlockWizard.updateText('НАЖМИ НА КРАСНЫЙ КРУЖОК ЧТО БЫ НАЧАТЬ ИГРАТЬ');
        PageBlockWizard.showDialog();
        PageBlockWizard.draw(function (cntx) {
            let pnt = DataPoints.getPointsCoords()[0];
            drawImage(cntx, '/images/wizard-point-circle.png',
                pnt.x - GUI.getImageWidth('/images/wizard-point-circle.png') / 2
                + GUI.getImageWidth('/images/map-way-point-red.png') / 2,
                pnt.y - GUI.getImageHeight('/images/wizard-point-circle.png') / 2
                + GUI.getImageHeight('/images/map-way-point-red.png') / 2,
            );
        });
    };

    this.wizardFirstStart_1_OnClick = function (el) {
        if (el.tagId === self.TAG_FIRST_NUMBER_POINT && el.innerText === '1') {
            self.start(self.WIZARD_FIRST_START_STEP_2);
        }
    };

    this.wizardFirstStart_2_Init = function () {
        PageBlockWizard.begin();
        PageBlockWizard.updateText('НАЖМИ КНОПКУ ИГРАТЬ');
        PageBlockWizard.showDialog(400, 380, 30);
        PageBlockWizard.draw(function (cntx) {
            drawImage(cntx, '/images/wizard-button.png',
                390 - GUI.getImageWidth('/images/wizard-button.png') / 2,
                280 + 42
            );
        });
    };

    this.wizardFirstStart_2_OnClick = function (el) {
        if (el.tagId === self.TAG_PLAY_BUTTON) {
            PageBlockWizard.finish();
            //self.start(self.WIZARD_FIRST_START_STEP_3);
        }
    };

    this.wizardFirstStart_3_Init = function () {
        PageBlockWizard.begin();
        PageBlockWizard.updateText('НАЖМИ НА КРАСНЫЙ И ЗАТЕМ НА СИНИЙ КАМЕНЬ', 30);
        PageBlockWizard.showDialog(400, 380);
        PageBlockWizard.draw(function (cntx) {
            drawImage(cntx, '/images/wizard-diamond-cell.png',100,100);
        });
    };

    this.wizardFirstStart_3_OnClick = function (el) {

    };

    let drawImage = function (cntx, url, x, y) {
        let image;
        image = new Image();
        image.onload = function () {
            cntx.drawImage(image, x * window.devicePixelRatio, y * window.devicePixelRatio);
        };
        image.src = url;
    }
};

/** @type {LogicWizard} */
LogicWizard = new LogicWizard();