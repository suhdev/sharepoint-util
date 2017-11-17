import * as mkdir from 'mkdirp'; 
import * as fs from 'fs'; 
import { logError, log } from '../util/logger';
export async function mkdirp(path:string){
    return new Promise((res,rej)=>{
        mkdir(path,(err)=>{
            if (err){
                rej(err); 
                return; 
            }
            res(true); 
        })
    });
}

export async function createDirectoryIfNotExist(path:string,operation?:string){
    if (!fs.existsSync(path)) {
        try {
            log(operation, `Creating directory on: ${path}`);
            await mkdirp(path);
            log(operation, 'Created successfully');
        } catch (err) {
            logError(operation, `Failed creating directory because: ${err.message}`);
        }
    }
}