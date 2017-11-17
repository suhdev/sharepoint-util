"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors = require("colors/safe");
function log(operation, msg) {
    console.log(`[${colors.gray((new Date()).toISOString().substr(11, 8))}]: ${colors.magenta(operation)} - ${colors.cyan(msg)}`);
    return '';
}
exports.log = log;
function logError(operation, msg) {
    console.log(`[${colors.gray((new Date()).toISOString().substr(11, 8))}]: ${colors.red(operation)} - ${colors.red(msg)}`);
    return '';
}
exports.logError = logError;
