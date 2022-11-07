/* Init constants */

let FS = require('fs');
let PATH = require('path');

CONST_DIR_ROOT = FS.realpathSync('./..') + PATH.sep;
CONST_DIR_SERVER = CONST_DIR_ROOT + 'server' + PATH.sep;
CONST_DIR_COMPONENTS = CONST_DIR_SERVER + 'components' + PATH.sep;
CONST_DIR_CLIENT = CONST_DIR_ROOT + 'client' + PATH.sep;
CONST_IS_SERVER_SIDE = true;
CONST_IS_CLIENT_SIDE = false;