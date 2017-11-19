"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const util_1 = require("../io/util");
const logger_1 = require("../util/logger");
const path = require("path");
const COMPANY_DIR = '.sysdoc';
const defaultConfig = {
    spHost: 'http://tenant.sharepoint.com/',
    name: 'test-project',
    url: 'test-site',
    assetsDir: './assets',
    libDir: './libDir',
    configDir: './config',
    srcDir: './src',
    sassDir: './sass',
    distDir: './dist',
    deploymentDir: 'Sysdoc',
    useSharePoint: true,
    sharePointVersion: 'online',
    distCssDir: './dist/css',
    distJsDir: './dist/js',
    provisioningDir: './deploy',
    templatesDir: './templates',
    version: '1.0.0',
    masterPageTemplatesDir: './templates/masterpage',
    pageLayoutTemplatesDir: './templates/pagelayouts',
    templatesExtraConfig: {},
    cdn: [],
    env: 'dev',
    masterpageCatalogDrive: null,
    siteAssetsDrive: null,
    styleLibraryDrive: null,
};
async function createConfigFile(config) {
    const cfg = Object.assign({}, defaultConfig, config);
    const companyName = COMPANY_DIR;
    const projectName = cfg.name;
    let filePath = `${process.cwd()}`;
    logger_1.log('Creating Default Config File', `creating base config file in current folder: ${filePath}`);
    fs_1.writeFileSync(path.resolve(filePath, './config.json'), JSON.stringify(config, null, '    '));
    filePath = path.resolve(process.env.HOME, `.${companyName}`);
    logger_1.log('Creating Default Config File', `attempting to create user config file at: ${filePath}`);
    try {
        logger_1.log('Creating Default Config File', `Attemting to create company directory at user home: ${filePath}`);
        await util_1.createDirectoryIfNotExist(filePath);
        logger_1.log('Creating Default Config File', `Attempting to create user config file at: ${path.resolve(filePath, `${projectName}.json`)}`);
        fs_1.writeFileSync(path.resolve(filePath, `${projectName}.json`), JSON.stringify(config, null, '    '));
        logger_1.log('Creating Default Config File', `Created user config file at: ${filePath}`);
    }
    catch (err) {
        logger_1.logError('Creating Default Config File', `Could not create user config folder at path: ${err.message}`);
    }
}
exports.createConfigFile = createConfigFile;
async function createDefaultConfigFile() {
    var projectName = 'test-project';
    var companyName = COMPANY_DIR;
    logger_1.log('Creating Default Config File', `creating default config file`);
    if (fs_1.existsSync(path.resolve(process.cwd(), 'package.json'))) {
        logger_1.log('Creating Default Config File', `Found package.json in current folder going to use 'name' as project name`);
        projectName = require(path.resolve(process.cwd(), 'package.json')).name;
    }
    const config = Object.assign({}, defaultConfig, { name: projectName });
    createConfigFile(config);
}
exports.createDefaultConfigFile = createDefaultConfigFile;
function createProject(name, config) {
    if (!config) {
        createDefaultConfigFile();
    }
    else {
        createConfigFile(config);
    }
}
exports.createProject = createProject;
