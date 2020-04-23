let Sounds = function () {
    let self = this;

    let cache = {};

    this.enabled = true;
    this.PATH_CHALK = '/sounds/chalk.mp3';

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

    this.play = function (path, volume) {
        if (!self.enabled) {
            return;
        }
        if (!cache[path]) {
            cache[path] = new Audio(path + "?t=" + 1123);
        }
        if (!volume) {
            volume = 1.0;
        }
        cache[path].volume = volume;
        cache[path].play();
    };

    if (document.cookie.search('settings_sound=off') !== -1) {
        self.off();
    }
};

Sounds = new Sounds;