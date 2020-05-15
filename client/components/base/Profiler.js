/**
 * Dummy.
 * @type {ProfilerDummy}
 * @constructor
 */
let ProfilerDummy = function () {

    let emptyFunc = function () {
    };

    this.start = emptyFunc;

    this.stop = emptyFunc;
};

/**
 * @type {ProfilerDummy}
 */
let Profiler = new ProfilerDummy();