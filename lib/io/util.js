"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mkdir = require("mkdirp");
const fs = require("fs");
const logger_1 = require("../util/logger");
async function mkdirp(path) {
    return new Promise((res, rej) => {
        mkdir(path, (err) => {
            if (err) {
                rej(err);
                return;
            }
            res(true);
        });
    });
}
exports.mkdirp = mkdirp;
async function createDirectoryIfNotExist(path, operation) {
    if (!fs.existsSync(path)) {
        try {
            logger_1.log(operation, `Creating directory on: ${path}`);
            await mkdirp(path);
            logger_1.log(operation, 'Created successfully');
        }
        catch (err) {
            logger_1.logError(operation, `Failed creating directory because: ${err.message}`);
        }
    }
}
exports.createDirectoryIfNotExist = createDirectoryIfNotExist;
