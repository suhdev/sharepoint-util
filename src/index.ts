import * as nunjucks from 'nunjucks';
import * as fs from 'fs';
import * as path from 'path';
import { createTransformer } from './provisioning/provisioning';
import { SharePointSite } from './provisioning/sharepointsite';
import {mkdirp} from './io/util'; 
import { log } from './util/logger';
var env = nunjucks.configure(path.resolve(__dirname, '../templates/'), {

});

export interface ProvisionOptions {
    copyInterfaces?:boolean; 
}
export interface ProvisionConfig{
    site?:SharePointSite; 
    spHost?:string; 
    url?:string; 
    outputDir?:string; 
    rootDir?:string;
    srcDir?:string; 
    interfacesDir?:string; 
    templatesPath?:string;
    options?:ProvisionOptions; 
}


module.exports = async function ({site, spHost, url, outputDir, srcDir, interfacesDir,rootDir,templatesPath}:ProvisionConfig) {
    
    // createTransformer(p).transform(site, {
    //     outputDir: outputdir,
    //     url: url || site.url,
    //     spHost,
    //     rootDir: rootdir,
    //     srcDir,
    //     interfacesDir:interfacesdir,
    // });
}