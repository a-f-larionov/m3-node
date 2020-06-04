/**
 * @type {Sounds}
 * @constructor
 */
let Sounds = function () {
    let self = this;

    let cache = {};

    let timeStamp = 5;

    this.enabled = true;
    this.PATH_CHALK = '/sounds/chalk.mp3';
    this.PATH_CHALK_2 = '/sounds/chalk-2.mp3';
    this.PATH_BUTTON = '/sounds/button.wav';
    this.PATH_CLICK = '/sounds/click-1.wav';
    this.PATH_CLICK_2 = '/sounds/click-2.wav';
    this.PATH_CHPOK = '/sounds/chpok.wav';
    this.PATH_GEM_TOUCH = '/sounds/gem-touch.wav';
    this.PATH_CRYSTAL_1 = '/sounds/crystal.wav';
    this.PATH_MAGIC_SHUFFLE_1 = '/sounds/magic-shuffle-1.wav';
    this.PATH_MAGIC_SHUFFLE_2 = '/sounds/magic-shuffle-2.wav';
    this.PATH_MAGIC_SHUFFLE_3 = '/sounds/magic-shuffle-3.mp3';
    this.PATH_MAGIC_SHUFFLE_4 = '/sounds/magic-shuffle-4.wav';
    this.PATH_MAGIC_SHUFFLE_5 = '/sounds/magic-shuffle-5.mp3';
    this.PATH_MAGIC_HUMMER_HIT_1 = '/sounds/hummer-hit-1.wav';
    this.PATH_MAGIC_HUMMER_HIT_2 = '/sounds/hummer-hit-2.wav';
    this.PATH_MAGIC_HUMMER_HIT_3 = '/sounds/hummer-hit-3.wav';
    this.PATH_MAGIC_HUMMER_HIT_4 = '/sounds/hummer-hit-4.wav';
    this.PATH_MAGIC_LIGHTNING_1 = '/sounds/woosh.wav';
    this.PATH_MAGIC_LIGHTNING_2 = '/sounds/dicharge-1.wav';
    this.PATH_MAGIC_LIGHTNING_3 = '/sounds/dicharge-2.wav';
    this.PATH_MAGIC_LIGHTNING_4 = '/sounds/l-3.mp3';
    this.PATH_MAGIC_LIGHTNING_5 = '/sounds/l-4.mp3';
    this.PATH_COLLECT_ITEM = '/sounds/collect-item.mp3';
    this.PATH_SUCCESS_1 = '/sounds/success.wav';
    this.PATH_SUCCESS_3 = '/sounds/success-3.wav';
    this.PATH_SUCCESS_4 = '/sounds/success-4.mp3';
    this.PATH_SPELL_FIREBALL = '/sounds/spell-fireball.wav';


    this.TYPE_GEM_DESTROY = this.PATH_SUCCESS_4;
    this.TYPE_HUMMER_HIT = this.PATH_MAGIC_HUMMER_HIT_1;
    this.TYPE_SHUFFLE = this.PATH_MAGIC_SHUFFLE_4;
    this.TYPE_LIGHTNING = this.PATH_MAGIC_LIGHTNING_5;
    this.TYPE_GEM_TOUCH = this.PATH_CHALK_2;
    this.TYPE_BUTTON = this.PATH_BUTTON;

    this.toggle = function () {
        if (self.enabled)
            self.off();
        else self.on();
    };

    this.isEnabled = function () {
        return self.enabled;
    };

    this.on = function () {
        self.enabled = true;
        document.cookie = 'settings_sound=on';
    };

    this.off = function () {
        self.enabled = false;
        document.cookie = 'settings_sound=off';
    };

    this.play = function (path, volume, currentTime) {
        let audio;
        if (!self.enabled) return;
        if (path === Sounds.PATH_MAGIC_HUMMER_HIT_1) currentTime = 0.012;
        if (path === Sounds.PATH_MAGIC_SHUFFLE_3) currentTime = 0.35;
        if (path === Sounds.PATH_SUCCESS_1) {
            volume = 0.3;
            currentTime = 0.04;
        }
        if (path === Sounds.PATH_SUCCESS_4) volume = 0.3;
        if (path === Sounds.PATH_MAGIC_LIGHTNING_4) volume = 0.3;

        audio = new Audio(path + "?t=" + timeStamp);

        if (currentTime) audio.currentTime = currentTime;
        audio.volume = volume ? volume : 1.0;
        audio.play();
    };

    if (document.cookie.search('settings_sound=off') !== -1) {
        self.off();
    }
    this.loadSounds = function () {
        [
            this.TYPE_LIGHTNING,
            this.TYPE_SHUFFLE,
            this.TYPE_HUMMER_HIT,
            this.TYPE_GEM_DESTROY,
            this.TYPE_BUTTON
        ].forEach(function (path) {
            new Audio(path + '?t=' + timeStamp);
        });
    }
};

Sounds = new Sounds;