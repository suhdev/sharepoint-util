import {writeFileSync,existsSync} from 'fs'; 
import {createDirectoryIfNotExist} from '../io/util'; 
import { logError, log } from '../util/logger';
import * as path from 'path'; 
import { Dictionary } from 'lodash';
export interface ProjectConfig{
    spHost:string; 
    url:string; 
    name:string;
    version:string; 
    assetsDir:string; 
    libDir:string; 
    configDir:string; 
    env:string;
    srcDir:string;  
    sassDir:string;
    useSharePoint:boolean; 
    sharePointVersion:'online'|'2013'|'2016'; 
    distDir:string; 
    distCssDir:string; 
    distJsDir:string; 
    provisioningDir:string; 
    templatesDir: string;
    masterPageTemplatesDir: string; 
    pageLayoutTemplatesDir: string; 
    templatesExtraConfig:Dictionary<any>;
    deploymentDir:string; 
    masterpageCatalogDrive?:string; 
    siteAssetsDrive?:string; 
    styleLibraryDrive?:string;
    cdn:string[];
}

const COMPANY_DIR = '.sysdoc';

const defaultConfig:ProjectConfig = {
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
    useSharePoint:true, 
    sharePointVersion:'online',
    distCssDir: './dist/css',
    distJsDir: './dist/js',
    provisioningDir: './deploy',
    templatesDir: './templates',
    version:'1.0.0',
    masterPageTemplatesDir: './templates/masterpage',
    pageLayoutTemplatesDir: './templates/pagelayouts',
    templatesExtraConfig: {},
    cdn: [],
    env:'dev',
    masterpageCatalogDrive: null,
    siteAssetsDrive: null,
    styleLibraryDrive: null,
};

export async function createConfigFile(config:ProjectConfig){
    const cfg = {...defaultConfig,...config}; 
    const companyName = COMPANY_DIR; 
    const projectName = cfg.name; 
    let filePath = `${process.cwd()}`;
    log('Creating Default Config File',
        `creating base config file in current folder: ${filePath}`);
    writeFileSync(path.resolve(filePath, './config.json'), JSON.stringify(config, null, '    '));
    filePath = path.resolve(process.env.HOME, `.${companyName}`);
    log('Creating Default Config File',
        `attempting to create user config file at: ${filePath}`);
    try {
        log('Creating Default Config File',
            `Attemting to create company directory at user home: ${filePath}`);
        await createDirectoryIfNotExist(filePath);
        log('Creating Default Config File',
            `Attempting to create user config file at: ${path.resolve(filePath, `${projectName}.json`)}`);
        writeFileSync(path.resolve(filePath, `${projectName}.json`), JSON.stringify(config, null, '    '));
        log('Creating Default Config File',
            `Created user config file at: ${filePath}`);
    } catch (err) {
        logError('Creating Default Config File', `Could not create user config folder at path: ${err.message}`)
    }
}

export async function createDefaultConfigFile(){
    var projectName = 'test-project';
    var companyName = COMPANY_DIR; 
    log('Creating Default Config File', `creating default config file`);
    if (existsSync(path.resolve(process.cwd(),'package.json'))){
        log('Creating Default Config File', 
            `Found package.json in current folder going to use 'name' as project name`);
        projectName = require(path.resolve(process.cwd(), 'package.json')).name; 
    }
    const config = {...defaultConfig,name:projectName};
    createConfigFile(config); 
}

export function createProject(name:string, config?: ProjectConfig){
    if (!config){
        createDefaultConfigFile(); 
    }else {
        createConfigFile(config); 
    }
}